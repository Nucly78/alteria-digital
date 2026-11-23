import {expiredCookie,json} from "../../_lib/admin-auth.js";
export async function onRequestPost(){return json({ok:true},200,{"Set-Cookie":expiredCookie()})}