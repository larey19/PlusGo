AOS.init();

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.08,
});

window.addEventListener("beforeunload", () => {
  NProgress.start();
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
