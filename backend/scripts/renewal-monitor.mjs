import {statfsSync} from 'node:fs';
const hosts=['https://paketjet.com','https://panel.paketjet.com'];const checks=[];
for(const [url,expected] of [[hosts[0],200],[`${hosts[0]}/api/health`,200],[`${hosts[0]}/blog/renewal-missing-check`,404],[`${hosts[1]}/auth/login`,200]]){
 try{const begin=Date.now();const r=await fetch(url,{signal:AbortSignal.timeout(15000)});let bodyOK=true;if(url.endsWith('/health')){const data=await r.json();bodyOK=data.status==='ok'||data.ok===true;}checks.push({url,status:r.status,expected,bodyOK,ms:Date.now()-begin,ok:r.status===expected&&bodyOK});}
 catch{checks.push({url,ok:false,error:'request_failed'});}
}
const disk=statfsSync(process.cwd());const diskUsedPercent=Math.round((1-disk.bavail/disk.blocks)*100);checks.push({name:'disk',diskUsedPercent,ok:diskUsedPercent<85});
const report={at:new Date().toISOString(),checks};console.log(JSON.stringify(report));
if(checks.some(c=>!c.ok))process.exitCode=1;
