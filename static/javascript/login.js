AOS.init();
// ========== ANIMACION CARGA DE PAGINA

window.addEventListener("load", () => {
  NProgress.start();
  NProgress.done();
});

document.addEventListener("submit", () => {
  NProgress.start();
  const interval = setInterval(() => {
    NProgress.inc();
  }, 600);
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
