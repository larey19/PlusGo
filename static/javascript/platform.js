AOS.init();


document.querySelectorAll(".plamessage").forEach((pla) => {
  pla.value=`*... {tittle_add}🍿*
{account}
*CLV:* {password}

*Perfil 👤*
{profile}

*Pin*
{pin}

*VIGENCIA {date} 🗓️*

*NO CAMBIAR PREFIJO DEL PERFIL ⚠️*

RENOVACIONES 1, 2 y 3 DÍAS ANTES DE VENCER.

*Gracias por tu compra 🫂*`
});



document.querySelectorAll(".dataPlatform").forEach((pla) => {
  pla.addEventListener("click", function (platform) {
    const pla_id = this.getAttribute("data-pla_id");

    document.querySelector(".planame").value = this.dataset.pla_name;
    document.querySelector(".plaprofiles").value = this.dataset.pla_profiles;
    document.querySelector(".plamessage").value = this.dataset.pla_message;

    document
      .getElementById("validateFormCrt")
      .addEventListener("click", function (clv) {
        clv.preventDefault();
        form = this.closest("#form_crt");
        form.action = `/platform`;
        if (form && form.checkValidity()) {
          confirmCreate();
        } else {
          form.reportValidity();
        }
      });
    document.querySelectorAll(".validateFormUpd").forEach((button) => {
      button.addEventListener("click", function (clv) {
        clv.preventDefault();
        form = this.closest("#form_upd");
        form.action = `/platform/${pla_id}`;
        if (form && form.checkValidity()) {
          confirmUpdate();
        } else {
          form.reportValidity();
        }
      });
    });
  });
});

function confirmUpdate(pla_id) {
  Swal.fire({
    title: "¿Actualizar Plataforma?",
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
    title: "¿Registar Plataforma?",
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
$(document).ready(function () {
  $("#table").DataTable({
    order: [],
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
    },
  });
});
