/** Rotate only hashes matching confirmed source-exposed defaults; no email-domain deletion. */
import 'dotenv/config';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import argon2 from 'argon2';
import {readFileSync,writeFileSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
const candidates=JSON.parse(readFileSync(process.argv[2],'utf8'));const apply=process.argv.includes('--apply');
const c=await mysql.createConnection({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||3306),user:process.env.DB_USER,password:process.env.DB_PASSWORD,database:process.env.DB_NAME});
const [rows]=await c.query('SELECT id,email,password_hash FROM users');const matched=[];
for(const u of rows){for(const candidate of candidates){let match=false;try{match=u.password_hash.startsWith('$2')?await bcrypt.compare(candidate,u.password_hash):await argon2.verify(u.password_hash,candidate);}catch{}if(match){matched.push(u);break;}}}
const rotated=[];
if(apply){await c.beginTransaction();try{for(const u of matched){const password=randomUUID()+randomUUID();const hash=await argon2.hash(password);await c.query('UPDATE users SET password_hash=?,auth_version=auth_version+1,reset_token=NULL,reset_token_expires=NULL WHERE id=?',[hash,u.id]);await c.query('UPDATE refresh_tokens SET revoked_at=CURRENT_TIMESTAMP(3) WHERE user_id=?',[u.id]);rotated.push({email:u.email,password});}writeFileSync('/var/backups/paketjet/renewal-20260909/rotated-account-access.json',JSON.stringify(rotated),{mode:0o600});await c.commit();}catch(e){await c.rollback();throw e;}}
console.log(JSON.stringify({at:new Date().toISOString(),checked:rows.length,matched:matched.length,rotated:rotated.length,apply}));await c.end();
