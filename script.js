const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.textContent = open ? "×" : "☰";
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.textContent = "☰";
  }));
}
document.getElementById("year").textContent = new Date().getFullYear();

const form = document.getElementById("contact-form");
const statusBox = document.getElementById("form-status");
if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    statusBox.textContent = "Envoi en cours…";
    const button = form.querySelector("button[type=submit]");
    button.disabled = true;
    try {
      const payload = Object.fromEntries(new FormData(form).entries());
      payload.consent = form.elements.consent.checked;
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Impossible d'envoyer le message.");
      statusBox.textContent = "Merci ! Votre demande a bien été envoyée. Nous reviendrons vers vous.";
      form.reset();
    } catch (error) {
      statusBox.textContent = error.message || "Une erreur est survenue. Réessayez ou contactez-nous par email.";
    } finally {
      button.disabled = false;
    }
  });
}
