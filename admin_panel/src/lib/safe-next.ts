export function safeAdminNext(value:string|null|undefined,fallback='/admin'){
 if(!value||!value.startsWith('/')||value.startsWith('//')||/[\\\r\n]/.test(value))return fallback;
 try{const url=new URL(value,'https://panel.paketjet.com');return url.origin==='https://panel.paketjet.com'?url.pathname+url.search+url.hash:fallback;}catch{return fallback;}
}
