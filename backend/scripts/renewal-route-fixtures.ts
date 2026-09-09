import mysql from 'mysql2/promise';import {writeFileSync} from 'node:fs';
if(!process.env.DB_NAME?.startsWith('paketjet_test_'))throw new Error('test_database_required');
const c=await mysql.createConnection({host:process.env.DB_HOST,port:Number(process.env.DB_PORT),user:process.env.DB_USER,password:process.env.DB_PASSWORD,database:process.env.DB_NAME});const result:Record<string,string>={};
for(const [path,table]of Object.entries({'categories':'categories','email-templates':'email_templates','storage':'storage_assets','sayfalar':'custom_pages','destek':'support_tickets'})){try{const [rows]=await c.query(`SELECT id FROM ${table} LIMIT 1`);const row=(rows as {id:string}[])[0];if(row)result[path]=row.id}catch{}}
const [settings]=await c.query('SELECT `key` FROM site_settings LIMIT 1');result['site-settings']=(settings as {key:string}[])[0]?.key||'site_title';writeFileSync('/tmp/paketjet-renewal-20260909/route-fixtures.json',JSON.stringify(result),{mode:0o600});await c.end();
