// ========== ANIMACION CARGA DE PAGINA
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/static/pwa/sw.js");
}

document.querySelectorAll(".formlogin").forEach((form) => {
  form.addEventListener("input", function (x) {
    if (form && form.checkValidity()) {
      document.querySelectorAll(".btnsubmit").forEach((btn) => {
        btn.classList.remove("disabled");
      });
    } else {
      document.querySelectorAll(".btnsubmit").forEach((btn) => {
        btn.classList.add("disabled");
      });
    }
  });
});
