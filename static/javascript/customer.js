AOS.init();
document.querySelectorAll(".dataCustomer").forEach((button) => {
  button.addEventListener("click", function (e) {
    // obtenemos la informacion del cliente por medio del que boton carga la modal de editar
    const cst_id = this.getAttribute("data-cst_id");

    document.querySelectorAll(".cstname").forEach((cstname) => {
      cstname.value = this.dataset.cst_name;
    });
    document.querySelectorAll(".cstlastname").forEach((cstlastname) => {
      cstlastname.value = this.dataset.cst_lastname;
    });
    document.querySelectorAll(".cstphonenumber").forEach((cstphonenumber) => {
      cstphonenumber.value = this.dataset.cst_phone_number;
      new Cleave(cstphonenumber, {
        phone: true,
        phoneRegionCode: "CO",
      });
    });
    // validacion de editar form
    document.querySelectorAll(".validationFormUpd").forEach((button) => {
      button.addEventListener("click", function (vld) {
        vld.preventDefault();
        const form = this.closest("#form_upd");
        form.action = `customer/${cst_id}`;
        if (form && form.checkValidity()) {
          confirmUpdate();
        } else {
          form.reportValidation();
        }
      });
    });
  });
});
document
  .getElementById("validationFormCrt")
  .addEventListener("click", function (vld) {
    vld.defaultPrevented();
    const form = this.closest("#form_crt");
    if (form && form.checkValidity()) {
      confirmCreate();
    } else {
      form.reportValidation();
    }
  });

function confirmUpdate() {
  Swal.fire({
    title: "¿Actualizar Cliente?",
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
    title: "¿Registrar Cliente?",
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
    columnDefs: [
      {
        targets: [2], // Ajusta al índice de tu columna de email y cel
        render: function (data, type, row) {
          if (type === "display" && data) {
            if (data) {
              let partes = data.match(/^(\d{3})(\d{3})(\d{4})$/);
              if (partes) {
                return `(${partes[1]}) ${partes[2]}-${partes[3]}`; // (322) 000-0000
              }
            }
          }
          return data;
        },
      },
    ],
  });
});
// cleave de telefono para el registro
document.querySelectorAll(".phonenumber").forEach(function (tel) {
  new Cleave(tel, {
    phone: true,
    phoneRegionCode: "CO",
  });
});
