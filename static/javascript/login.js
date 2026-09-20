// ========== PWA
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/static/pwa/sw.js");
}
document.querySelectorAll("#btnSubmit").forEach((btn) => {
  btn.onclick = () => {
    const form = btn.closest("form");
    if (form && form.checkValidity()) {
      btn.classList.add("disabled");
      btn.closest(".content-btn-submit").classList.add("loading");
    }
  };
});
