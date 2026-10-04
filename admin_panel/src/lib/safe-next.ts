// Yalniz goreli yol cozumlemesi icin sahte koken; gercek alan adina bagli degildir.
const BASE='https://local.invalid';
export function safeAdminNext(value:string|null|undefined,fallback='/admin'){
 if(!value||!value.startsWith('/')||value.startsWith('//')||/[\\\r\n]/.test(value))return fallback;
 try{const url=new URL(value,BASE);return url.origin===BASE?url.pathname+url.search+url.hash:fallback;}catch{return fallback;}
}
