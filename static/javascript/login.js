AOS.init();
// ========== ANIMACION CARGA DE PAGINA
window.addEventListener("submit", () => {
  NProgress.start();
  setInterval(() => {
    NProgress.inc();
  }, 600);
});

window.addEventListener("callback", () => NProgress.done());
NProgress.start();
window.addEventListener("load", () => {
  NProgress.done();
});
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/static/pwa/sw.js");
}
// ============= OJO PARA INPUT PASSWORD
function password() {
  const input = document.querySelectorAll("#password");
  const icon = document.querySelectorAll("#eyeIcon");
  input.forEach((psw) => {
    if (psw.type === "password") {
      psw.type = "text";
      icon.forEach((icn) => {
        icn.classList.remove("bi-eye");
        icn.classList.add("bi-eye-slash");
      });
    } else {
      psw.type = "password";
      icon.forEach((icn) => {
        icn.classList.remove("bi-eye-slash");
        icn.classList.add("bi-eye");
      });
    }
  });
}
