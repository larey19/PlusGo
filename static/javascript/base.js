AOS.init();

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.08,
});


window.addEventListener("DOMContentLoaded", () => {
  NProgress.start();
});

window.addEventListener("load", () => {
  NProgress.done();
});

// logica de mostrar password
function password(inputid, icon) {
  const content = icon.closest(".position-relative");
  const input = content.querySelector(`#${inputid}`);

  // console.log(input, icon);
  if (input.type === "password") {
    input.type = "text";
    icon.classList.replace("ti-eye", "ti-eye-closed");
  } else {
    input.type = "password";
    icon.classList.replace("ti-eye-closed", "ti-eye");
  }
}
// document.querySelectorAll("#btnSubmit").forEach((btn) => {
//   btn.addEventListener("click", function() {
//     const btn_value_old = this.value;
//     const form = this.closest("form");
//     console.log(this, form, btn_value_old);
//     if (form && form.checkValidity()) {
//       let dots = 0;
//       setInterval(() => {
//         dots = (dots + 1) % 4;
//         this.value = "Cargando" + ".".repeat(dots);
//       }, 400);
//     } else {
//       this.value = btn_value_old;
//     }
//   })
// });
