/** Server backup; credentials never enter argv or logs. */
import 'dotenv/config';
import {mkdtempSync,writeFileSync,createWriteStream,chmodSync,readdirSync,statSync,unlinkSync,rmSync,mkdirSync} from 'node:fs';
import {tmpdir} from 'node:os';import {join} from 'node:path';import {spawn} from 'node:child_process';import {pipeline} from 'node:stream/promises';import {createGzip} from 'node:zlib';
const root=process.env.PAKETJET_BACKUP_DIR||'/var/backups/paketjet/scheduled';mkdirSync(root,{recursive:true,mode:0o700});
const stamp=new Date().toISOString().replaceAll(':','-'),dir=mkdtempSync(join(tmpdir(),'paketjet-db-'));chmodSync(dir,0o700);
const quote=v=>'"'+String(v??'').replaceAll('\\','\\\\').replaceAll('"','\\"').replaceAll('\n','\\n')+'"';
const config=join(dir,'mysql.cnf');writeFileSync(config,`[client]\nhost=${quote(process.env.DB_HOST)}\nport=${Number(process.env.DB_PORT||3306)}\nuser=${quote(process.env.DB_USER)}\npassword=${quote(process.env.DB_PASSWORD)}\n`,{mode:0o600});
const dump=join(root,`database-${stamp}.sql.gz`);
try{const proc=spawn('mysqldump',[`--defaults-extra-file=${config}`,'--single-transaction','--routines','--triggers','--no-tablespaces',process.env.DB_NAME],{stdio:['ignore','pipe','pipe']});proc.stderr.resume();const complete=new Promise((resolve,reject)=>{proc.on('error',reject);proc.on('exit',code=>code===0?resolve():reject(new Error('database_backup_failed')))});await Promise.all([pipeline(proc.stdout,createGzip(),createWriteStream(dump,{mode:0o600})),complete]);
 if(process.argv.includes('--weekly')){for(const [name,args]of [['uploads',['-C',process.env.LOCAL_STORAGE_ROOT||join(process.cwd(),'uploads'),'.']],['source',['--exclude=node_modules','--exclude=.next*','--exclude=uploads','--exclude=.git','--exclude=output','-C',join(process.cwd(),'..'),'.']]]){const target=join(root,`${name}-${stamp}.tar.gz`),p=spawn('tar',['-czf',target,...args],{stdio:'ignore'});await new Promise((resolve,reject)=>{p.on('error',reject);p.on('exit',c=>c===0?resolve():reject(new Error('archive_backup_failed')))});chmodSync(target,0o600)}}
 for(const file of readdirSync(root)){const days=file.startsWith('database-')?14:56;if(!/^(database|uploads|source)-\d{4}-\d{2}-\d{2}T/.test(file))continue;const path=join(root,file);if(statSync(path).mtimeMs<Date.now()-days*86400000)unlinkSync(path)}
 console.log(JSON.stringify({at:new Date().toISOString(),backup:'ok',weekly:process.argv.includes('--weekly')}));
}catch(e){try{unlinkSync(dump)}catch{}throw e}finally{rmSync(dir,{recursive:true})}
