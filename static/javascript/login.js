// ========== PWA
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/static/pwa/sw.js");
}
document.querySelectorAll("#btnSubmit").forEach((btn) => {
  btn.addEventListener("click", function() {
    const btn_value_old = this.value;
    const form = this.closest("form");
    console.log(this, form, btn_value_old);
    if (form && form.checkValidity()) {
      let dots = 0;
      setInterval(() => {
        dots = (dots + 1) % 4;
        this.value = "Cargando" + ".".repeat(dots);
      }, 400);
    } else {
      this.value = btn_value_old;
    }
  })
});
