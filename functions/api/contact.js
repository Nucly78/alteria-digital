export async function onRequestPost({ request, env }) {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store"
  };

  if (!env.RESEND_API_KEY || !env.CONTACT_EMAIL || !env.FROM_EMAIL) {
    return new Response(JSON.stringify({
      error: "Le formulaire n'est pas encore configuré. Merci de réessayer plus tard."
    }), { status: 503, headers });
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Requête invalide." }), { status: 400, headers });
  }

  const clean = (value, max) => typeof value === "string" ? value.trim().slice(0, max) : "";
  const name = clean(data.name, 100);
  const company = clean(data.company, 120);
  const email = clean(data.email, 180);
  const phone = clean(data.phone, 30);
  const activity = clean(data.activity, 100);
  const message = clean(data.message, 3000);
  const consent = data.consent === true || data.consent === "on";

  if (!name || !message || !consent || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: "Vérifiez les champs obligatoires et votre consentement." }), { status: 400, headers });
  }

  const body = [
    "Nouvelle demande depuis le site ALTÉRIA DIGITAL",
    "",
    `Nom : ${name}`,
    `Entreprise : ${company || "Non renseignée"}`,
    `Email : ${email}`,
    `Téléphone : ${phone || "Non renseigné"}`,
    `Activité : ${activity || "Non renseignée"}`,
    "",
    "Message :",
    message
  ].join("\n");

  const result = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: env.FROM_EMAIL,
      to: [env.CONTACT_EMAIL],
      reply_to: email,
      subject: `Nouvelle demande — ${name}`,
      text: body
    })
  });

  if (!result.ok) {
    return new Response(JSON.stringify({ error: "L'envoi a échoué. Réessayez ultérieurement." }), { status: 502, headers });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
}
