// Contact details used across the site
var WA_NUMBER = "5521988387088";

// Free form service: create a key at https://web3forms.com with wallacejoacir@adv.oabrj.org.br
// and paste it here. While it is empty, the form sends the request through WhatsApp instead.
var WEB3FORMS_KEY = "c02e3504-79f5-4870-a761-deb788c4cde1";

document.querySelectorAll("[data-year]").forEach(function (el) {
  el.textContent = new Date().getFullYear();
});

// Visitors who arrive from a Google Ads click (gclid / utm_source=google & paid medium)
// are remembered for 30 days, so WhatsApp messages and form emails show where they came from.
var ADS_DAYS = 30;
var adsOrigin = (function () {
  var q = new URLSearchParams(location.search);
  var paid = q.get("gclid") || q.get("gbraid") || q.get("wbraid") ||
    (/^google$/i.test(q.get("utm_source") || "") && /^(cpc|ppc|paid)/i.test(q.get("utm_medium") || ""));
  var stored = null;
  try { stored = JSON.parse(localStorage.getItem("wj_origem") || "null"); } catch (e) {}
  if (paid) {
    var tema = (q.get("utm_content") || "").toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 20);
    stored = { tema: tema, t: Date.now() };
    try { localStorage.setItem("wj_origem", JSON.stringify(stored)); } catch (e) {}
  }
  if (stored && Date.now() - stored.t > ADS_DAYS * 864e5) stored = null;
  return stored;
})();

if (adsOrigin) {
  // A short, discreet code at the end of the WhatsApp message, e.g. "(ref. GA-contratos)"
  var ref = "(ref. GA" + (adsOrigin.tema ? "-" + adsOrigin.tema : "") + ")";
  document.querySelectorAll('a[href*="wa.me/"]').forEach(function (a) {
    var url = new URL(a.href);
    var text = url.searchParams.get("text") || "Olá, vim pelo site.";
    // encodeURIComponent (not searchParams.set) so spaces become %20, which WhatsApp reads reliably
    a.href = url.origin + url.pathname + "?text=" + encodeURIComponent(text + "\n\n" + ref);
  });
}

var form = document.querySelector("form.book");
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var status = form.querySelector(".form-status");
    var data = new FormData(form);
    if (data.get("botcheck")) return;

    if (!WEB3FORMS_KEY) {
      var msg =
        "Olá, Dr. Wallace. Gostaria de agendar uma consulta.\n\n" +
        "Nome: " + data.get("nome") + "\n" +
        "Telefone: " + data.get("telefone") + "\n" +
        "E-mail: " + data.get("email") + "\n" +
        "Assunto: " + data.get("assunto") + "\n" +
        (data.get("mensagem") ? "Mensagem: " + data.get("mensagem") : "") +
        (adsOrigin ? "\n\n" + ref : "");
      window.open("https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg), "_blank");
      status.className = "form-status ok";
      status.textContent = "Abrimos o WhatsApp com sua mensagem pronta. É só enviar.";
      return;
    }

    data.append("access_key", WEB3FORMS_KEY);
    data.append("subject", (adsOrigin ? "[Google Ads] " : "") + "Novo pedido de consulta pelo site: " + data.get("assunto"));
    data.append("origem", adsOrigin ? "Google Ads" + (adsOrigin.tema ? " (" + adsOrigin.tema + ")" : "") : "Site (sem anúncio)");
    data.append("from_name", "Site wjoliveira.com.br");
    var btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    status.className = "form-status";
    status.textContent = "Enviando...";
    fetch("https://api.web3forms.com/submit", { method: "POST", body: data })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (!res.success) throw new Error(res.message);
        form.reset();
        status.className = "form-status ok";
        status.textContent = "Recebido. Wallace retorna o contato pessoalmente pelo telefone ou e-mail informado.";
      })
      .catch(function () {
        status.className = "form-status err";
        status.innerHTML = 'Não foi possível enviar agora. Fale direto pelo <a href="https://wa.me/' + WA_NUMBER + '">WhatsApp</a>.';
      })
      .finally(function () { btn.disabled = false; });
  });
}

// When the site is opened straight from disk (double-clicking index.html),
// folder links need "index.html" added so they open the page instead of the folder.
if (location.protocol === "file:") {
  document.querySelectorAll("a[href]").forEach(function (a) {
    var h = a.getAttribute("href");
    if (/^(https?:|mailto:|tel:|#)/.test(h)) return;
    var parts = h.split("#");
    if (parts[0] === "" || parts[0].slice(-1) === "/") {
      a.setAttribute("href", (parts[0] || "./") + "index.html" + (parts[1] !== undefined ? "#" + parts[1] : ""));
    }
  });
}
