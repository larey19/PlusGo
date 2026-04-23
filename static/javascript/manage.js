AOS.init();
// CARGA DE DATOS PARA MODAL DINAMICA EDICION
document.querySelectorAll(".dataManage").forEach((button) => {
  button.addEventListener("click", function (e) {
    const mng_id = this.getAttribute("data-mng_id");
    document.querySelectorAll(".mngemail").forEach((mngemail) => {
      mngemail.value = this.dataset.mng_email;
    });
    document.querySelectorAll(".mngimap").forEach((mngimap) => {
      mngimap.value = this.dataset.mng_imap;
    });
    document.querySelectorAll(".mngfrom").forEach((mngfrom) => {
      mngfrom.value = this.dataset.mng_from;
    });
    document.querySelectorAll(".mngpassword").forEach((mngpassword) => {
      mngpassword.value = this.dataset.mng_password;
    });
    // validacion de formulario de edicion
    document.querySelectorAll(".validateFormUpd").forEach((button) => {
      button.addEventListener("click", function (vld) {
        vld.preventDefault();
        const form = this.closest("#form_upd");
        form.action = `/manage/${mng_id}`;
        if (form.checkValidity()) {
          confirmUpdate();
        } else {
          form.reportValidity();
        }
      });
    });
    document.querySelectorAll(".validateFormPass").forEach((button) => {
      button.addEventListener("click", function (vld) {
        vld.preventDefault();
        const form = this.closest("#form_pass");
        form.action = `/manage/password/${mng_id}`;
        if (form && form.checkValidity()) {
          confirmPassword();
        } else {
          form.reportValidity();
        }
      });
    });
  });
});
// validacion del formulario de crear
document.getElementById("validateFormCrt").addEventListener("click", function (vld) {
    vld.preventDefault();
    const form = this.closest(`#form_crt`);
    if (form.checkValidity()) {
      confirmCreate();
    } else {
      form.reportValidity();
    }
  });
// confirmaciones
function confirmUpdate() {
  Swal.fire({
    title: "¿Actualizar Cuenta?",
    icon: "info",
    showCancelButton: true,
    confirmButtonColor: "rgba(4,17,43,0.92)",
    confirmButtonText: "Sí, guardar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      document.getElementById("form_upd").submit();
    }
  });
}
function confirmPassword() {
  Swal.fire({
    title: "¿Actualizar Contraseña de App?",
    icon: "info",
    showCancelButton: true,
    confirmButtonColor: "rgba(4,17,43,0.92)",
    confirmButtonText: "Sí, guardar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      document.getElementById("form_pass").submit();
    }
  });
}
function confirmCreate() {
  Swal.fire({
    title: "¿Registar Cuenta?",
    icon: "info",
    showCancelButton: true,
    confirmButtonColor: "rgba(4,17,43,0.92)",
    confirmButtonText: "Sí, guardar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      document.getElementById("form_crt").submit();
    }
  });
}
function confirmState(state, id) {
  Swal.fire({
    title: "¿Cambiar estado de la cuenta?",
    text: "Recuerda, no podras realizar consultas de codigo a este correo",

    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    confirmButtonText: "Sí, cambiar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "/manage/state/" + state + "/" + id;
    }
  });
}
// tabla
$(document).ready(function () {
  $("#table").DataTable({
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
    },
  });
});
// Boton de la contraseña
function password() {
  const input = document.querySelectorAll("#mngpassword");
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
