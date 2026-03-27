AOS.init();
// carga de informacion de cada registro en modales dinamicas para la Edicion
document.querySelectorAll(".dataAccount").forEach((button) => {
  button.addEventListener("click", function (vld) {
    const acc_id = this.getAttribute("data-acc_id");
    document.querySelectorAll(".accnickname").forEach((accnickname) => {
      accnickname.value = this.dataset.acc_nickname;
    });
    document.querySelectorAll(".accprovider").forEach((accprovider) => {
      accprovider.value = this.dataset.acc_provider;
    });
    document.querySelectorAll(".accdatepay").forEach((accdatepay) => {
      accdatepay.value = this.dataset.acc_date_pay;
    });
    document.querySelectorAll(".accemail").forEach((accemail) => {
      accemail.value = this.dataset.acc_email;
    });
    document.querySelectorAll(".accphonenumber").forEach((accphonenumber) => {
      accphonenumber.value = this.dataset.acc_number_phone;
    });
    document.querySelectorAll(".accpassword").forEach((accpassword) => {
      accpassword.value = this.dataset.acc_password;
    });
    // reporte de campos en el formulario de edicion
    document.querySelectorAll(".validateFormUpd").forEach((button) => {
      button.addEventListener("click", function (vld) {
        vld.preventDefault();
        const form = this.closest("#form_upd");
        form.action = `/account/${acc_id}`;
        if (form && form.checkValidity()) {
          confirmUpdate();
        } else {
          form.reportValidity();
        }
      });
    });
  });
});
// reporte de campos en el formulario de creacion

document
  .getElementById("validateFormCrt")
  .addEventListener("click", function (vld) {
    vld.preventDefault();
    form = this.closest("#form_crt");
    if (form && form.checkValidity()) {
      confirmCreate();
    } else {
      form.reportValidity();
    }
  });

// ventanasd de confirmaciones
function confirmUpdate() {
  Swal.fire({
    title: "¿Actualizar cuenta?",
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
    title: "¿Crear cuenta?",
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

function confirmState(id) {
  Swal.fire({
    title: "¿Cambiar estado de la cuenta?",
    text: "Recuerda, no debe haber ninguna venta activa con esta cuenta",

    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    confirmButtonText: "Sí, cambiar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "/account/state/" + id;
    }
  });
}
// tabla
$(document).ready(function () {
  let params = new URLSearchParams(window.location.search);
  let search = params.get("acc_nickname");

  $("#table").DataTable({
    pageLength: 10,
    stateSave: true,
    order: [],
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
    },
    columnDefs: [
      {
        targets: [2], // Ajusta al índice de tu columna de fecha
        render: function (data, type, row) {
          if (type === "display" && data) {
            // Para formato ISO: "2024-01-15"
            let partes = data.split("-");
            if (partes.length === 3) {
              return `${partes[2]}/${partes[1]}/${partes[0]}`; // DD/MM/YYYY
            }
          }
          return data;
        },
      },
      {
        targets: [3], // Ajusta al índice de tu columna de email y cel
        render: function (data, type, row) {
          if (type === "display" && data) {
            if (data) {
              let partes = data.match(/^(\d{3})(\d{3})(\d{4})$/); //aplicamos formateo en 3 partes
              if (partes) {
                return `(${partes[1]}) ${partes[2]}-${partes[3]}`; // (322) 000-0000
              }
            }
          }
          return data;
        },
      },
    ],
    initComplete: function () {
      if (search && search !== null) {
        this.api().search(search).draw();
        this.api().state.clear();
      }
    },
  });
});
// format para el input de telefono
document.querySelectorAll(".accphonenumber").forEach(function (tel) {
  new Cleave(tel, {
    phone: true,
    phoneRegionCode: "CO",
  });
});
// Boton de la contraseña

function password() {
  const input = document.querySelectorAll("#accpassword");
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
