// Contact details used across the site
var WA_NUMBER = "5521988387088";

// Free form service: create a key at https://web3forms.com with wallacejoacir@adv.oabrj.org.br
// and paste it here. While it is empty, the form sends the request through WhatsApp instead.
var WEB3FORMS_KEY = "";

document.querySelectorAll("[data-year]").forEach(function (el) {
  el.textContent = new Date().getFullYear();
});

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
        (data.get("mensagem") ? "Mensagem: " + data.get("mensagem") : "");
      window.open("https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg), "_blank");
      status.className = "form-status ok";
      status.textContent = "Abrimos o WhatsApp com sua mensagem pronta. É só enviar.";
      return;
    }

    data.append("access_key", WEB3FORMS_KEY);
    data.append("subject", "Novo pedido de consulta pelo site: " + data.get("assunto"));
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
