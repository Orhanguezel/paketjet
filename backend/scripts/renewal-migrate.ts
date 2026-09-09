/** Apply only additive renewal migrations, never a seed or DROP. */
import mysql from 'mysql2/promise';
import {readFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
const database=process.env.DB_NAME??'';
const apply=process.argv.includes('--apply');
if(!database)throw new Error('DB_NAME_required');
if(!database.startsWith('paketjet_test_')&&!process.argv.includes('--production'))throw new Error('explicit_production_scope_required');
const files=readdirSync('src/db/seed/sql').filter(f=>/^(05[3-9]|06[0-2])_/.test(f)).sort();
const conn=await mysql.createConnection({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||3306),user:process.env.DB_USER,password:process.env.DB_PASSWORD,database,multipleStatements:true});
try {
 if(apply)await conn.query('CREATE TABLE IF NOT EXISTS renewal_migrations (name VARCHAR(100) PRIMARY KEY, checksum CHAR(64) NOT NULL, applied_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3))');
 for(const file of files){const content=readFileSync(`src/db/seed/sql/${file}`,'utf8');if(/\bDROP\s+(TABLE|DATABASE)|TRUNCATE\s/i.test(content))throw new Error('destructive_migration_rejected');if(apply){const [previous]=await conn.query('SELECT checksum FROM renewal_migrations WHERE name=?',[file]);const row=(previous as {checksum:string}[])[0];const hash=createHash('sha256').update(content).digest('hex');if(row){if(row.checksum!==hash)throw new Error(`migration_checksum_changed_${file}`);console.log(`ALREADY_APPLIED ${file}`);continue;}await conn.query(content);await conn.query('INSERT INTO renewal_migrations(name,checksum) VALUES (?,?)',[file,hash]);}console.log(`${apply?'APPLIED':'PLAN'} ${file} ${createHash('sha256').update(content).digest('hex')}`);}
}finally{await conn.end();}
