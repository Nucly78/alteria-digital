export async function onRequestPost({request,env}){
const headers={"Content-Type":"application/json","Cache-Control":"no-store"};
if(!env.RESEND_API_KEY||!env.CONTACT_EMAIL||!env.FROM_EMAIL)return new Response(JSON.stringify({error:"Le formulaire n'est pas encore configuré."}),{status:503,headers});
let d;try{d=await request.json()}catch{return new Response(JSON.stringify({error:"Requête invalide."}),{status:400,headers})}
const clean=(v,n)=>typeof v==="string"?v.trim().slice(0,n):"",name=clean(d.name,100),company=clean(d.company,120),email=clean(d.email,180),phone=clean(d.phone,30),activity=clean(d.activity,100),message=clean(d.message,3000),consent=d.consent===true||d.consent==="on";
if(!name||!message||!consent||!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email))return new Response(JSON.stringify({error:"Vérifiez les champs obligatoires et votre consentement."}),{status:400,headers});
const body=["Nouvelle demande depuis ALTÉRIA DIGITAL","","Nom : "+name,"Entreprise : "+company,"Email : "+email,"Téléphone : "+phone,"Activité : "+activity,"","Message :",message].join("\\n");
const sent=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:"Bearer "+env.RESEND_API_KEY,"Content-Type":"application/json"},body:JSON.stringify({from:env.FROM_EMAIL,to:[env.CONTACT_EMAIL],reply_to:email,subject:"Nouvelle demande — "+name,text:body})});
if(!sent.ok)return new Response(JSON.stringify({error:"L'envoi a échoué. Réessayez ultérieurement."}),{status:502,headers});
if(env.DB){try{await env.DB.prepare("INSERT INTO leads (id,name,company,email,phone,activity,message,status) VALUES (?,?,?,?,?,?,?,'nouveau')").bind(crypto.randomUUID(),name,company,email,phone,activity,message).run()}catch(e){console.error("CRM insert failed",String(e))}}
return new Response(JSON.stringify({ok:true}),{status:200,headers});
}