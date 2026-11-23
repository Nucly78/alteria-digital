const enc=new TextEncoder(),COOKIE="alteria_admin";
function b64(bytes){let s="";for(const b of new Uint8Array(bytes))s+=String.fromCharCode(b);return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/g,"")}
async function sign(v,secret){const k=await crypto.subtle.importKey("raw",enc.encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);return b64(await crypto.subtle.sign("HMAC",k,enc.encode(v)))}
export async function createSession(secret){const exp=String(Math.floor(Date.now()/1000)+28800);return exp+"."+await sign(exp,secret)}
export async function hasAdminSession(req,secret){if(!secret)return false;const c=req.headers.get("Cookie")||"",e=c.split(";").map(x=>x.trim()).find(x=>x.startsWith(COOKIE+"="));if(!e)return false;const [exp,sig]=e.slice(COOKIE.length+1).split(".");if(!exp||!sig||!/^\d+$/.test(exp)||Number(exp)<Math.floor(Date.now()/1000))return false;return sig===await sign(exp,secret)}
export const sessionCookie=t=>COOKIE+"="+t+"; Path=/api/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=28800";
export const expiredCookie=()=>COOKIE+"=; Path=/api/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=0";
export function json(data,status=200,extra={}){return new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store",...extra}})}