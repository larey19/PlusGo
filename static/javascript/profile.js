AOS.init();

document.querySelectorAll(".dataProfile").forEach((button)  => {
  button.addEventListener("click", function (e) {
    const pro_id = this.getAttribute("data-pro_id");
    document.querySelectorAll(".proprofile").forEach((proprofile) => {
        proprofile.value = this.dataset.pro_profile;
    });
    document.querySelectorAll(".propin").forEach((propin) => {
        propin.value = this.dataset.pro_pin;
    });
    document.querySelectorAll(".prostate").forEach((prostate) => {
        prostate.value = this.dataset.pro_state;
    });
    document.querySelectorAll(".validateFormUpd").forEach((button) => {
      button.addEventListener("click", function (clv) {
        clv.preventDefault();
        const form = this.closest("#form_upd");
        form.action = `/profile/${pro_id}`;
        if (form && form.checkValidity()) {
          confirmUpdate();
        } else {
          form.reportValidity();
        }
      });
    });
  });
});
document
  .getElementById("validateFormCrt")
  .addEventListener("click", function (clv) {
    clv.preventDefault();
    const form = this.closest("#form_crt");
    if (form && form.checkValidity()) {
      confirmCreate();
    } else {
      form.reportValidity();
    }
  });

function confirmUpdate() {
  Swal.fire({
    title: "¿Actualizar Perfil?",
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
function confirmCreate() {
  Swal.fire({
    title: "¿Crear Perfil?",
    icon: "info",
    showCancelButton: true,
    confirmButtonColor: "rgba(4,17,43,0.92)",
    confirmButtonText: "Sí, crear",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      document.getElementById("form_crt").submit();
    }
  });
}
function confirmDelete(id) {
  Swal.fire({
    title: "¿Eliminar perfil?",
    text: "Recuerda, no debe haber ninguna venta activa con este perfil",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    confirmButtonText: "Sí, continuar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "/profile/delete/" + id;
    }
  });
}
