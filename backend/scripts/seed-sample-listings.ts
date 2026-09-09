/** Scoped seed: no reset, no edits to existing listings, no payment/credit writes. */
import mysql from 'mysql2/promise';
import {readFileSync} from 'node:fs';
const database=process.env.DB_NAME??'';
if(!database)throw new Error('DB_NAME_required');
if(!database.startsWith('paketjet_test_')&&!process.argv.includes('--production'))throw new Error('explicit_production_scope_required');
const conn=await mysql.createConnection({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||3306),user:process.env.DB_USER,password:process.env.DB_PASSWORD,database,multipleStatements:true});
try {
 const [columns]=await conn.query("SHOW COLUMNS FROM ilanlar LIKE 'is_sample'");
 if(!(columns as unknown[]).length)throw new Error('apply_migration_063_first');
 const content=readFileSync(new URL('../src/db/seed/sql/064_sample_listings.sql',import.meta.url),'utf8');
 if(process.argv.includes('--apply')){
  await conn.beginTransaction();
  try{await conn.query(content);await conn.commit();}catch(error){await conn.rollback();throw error;}
 }
 const [rows]=await conn.query("SELECT COUNT(*) AS examples, SUM(status='active' AND departure_date>UTC_TIMESTAMP()) AS active_examples FROM ilanlar WHERE is_sample=1 AND user_id='e09a0000-0000-4000-8000-000000000000'");
 console.log(JSON.stringify({mode:process.argv.includes('--apply')?'applied':'plan',intended:30,counts:rows}));
}finally{await conn.end();}
