
export async function onRequestPost({ request, env }) {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store"
  };

  if (!env.RESEND_API_KEY || !env.CONTACT_EMAIL || !env.FROM_EMAIL) {
    return new Response(JSON.stringify({
      error: "Configuration email incomplète."
    }), { status: 503, headers });
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return new Response(JSON.stringify({
      error: "Requête invalide."
    }), { status: 400, headers });
  }

  const clean = (v, max) =>
    typeof v === "string" ? v.trim().slice(0, max) : "";

  const name = clean(data.name, 100);
  const company = clean(data.company, 120);
  const email = clean(data.email, 180);
  const phone = clean(data.phone, 30);
  const activity = clean(data.activity, 100);
  const message = clean(data.message, 3000);

  if (
    !name ||
    !message ||
    data.consent !== true &&
    data.consent !== "on" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return new Response(JSON.stringify({
      error: "Vérifiez les champs obligatoires."
    }), { status: 400, headers });
  }

  const body = [
    "Nouvelle demande ALTÉRIA DIGITAL",
    "",
    `Nom : ${name}`,
    `Entreprise : ${company}`,
    `Email : ${email}`,
    `Téléphone : ${phone}`,
    `Activité : ${activity}`,
    "",
    message
  ].join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
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

  if (!response.ok) {
    return new Response(JSON.stringify({
      error: "Échec de l'envoi email."
    }), { status: 502, headers });
  }

  return new Response(JSON.stringify({
    ok: true
  }), { status: 200, headers });
}
