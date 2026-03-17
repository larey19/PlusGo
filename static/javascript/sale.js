AOS.init();

// SCRIPTS CARGA DE DATOS A MODALES Y VALIDACION DE EDICION
document.querySelectorAll(".dataSale").forEach((cstid) => {
  cstid.addEventListener("click", function (c) {
    const sal_id = this.getAttribute("data-sal_id");
    const sal_price = this.getAttribute("data-sal_price");
    const sal_date_start = this.getAttribute("data-sal_date_start");
    const sal_date_end = this.getAttribute("data-sal_date_end");
    const sal_description = this.getAttribute("data-sal_description");
    const acc_email = this.getAttribute("data-acc_email");
    const cst_id = this.getAttribute("data-cst_id");
    const cst_name = this.getAttribute("data-cst_name");
    const cst_lastname = this.getAttribute("data-cst_lastname");
    const cst_phone_number = this.getAttribute("data-cst_phone_number");
    const pro_id = this.getAttribute("data-pro_id");
    const pro_profile = this.getAttribute("data-pro_profile");
    // ============= DETALLES
    document.getElementById("cst_fullname").innerHTML =
      `${cst_name} ${cst_lastname}`;
    document.getElementById("cst_phone_number").innerHTML =
      `<i class="bi bi-phone-fill me-1"></i>Tel: ${cst_phone_number}`;
    document.getElementById("pro_profile").innerHTML =
      `<i class="bi bi-tag-fill me-1"></i>Perfil: ${pro_profile}`;
    document.getElementById("sal_date_start").innerHTML =
      `<i class="bi bi-calendar-event me-2"></i> ${sal_date_start}`;
    document.getElementById("sal_date_end").innerHTML =
      `<i class="bi bi-calendar-check me-2"></i> ${sal_date_end}`;
    document.getElementById("sal_price").innerHTML = `$ ${sal_price}`;
    document.getElementById("acc_email").innerHTML =
      `<i class="bi bi-envelope-at me-2 text-secondary"></i> ${acc_email}`;
    document.getElementById("sal_description").innerHTML =
      `<i class="bi bi-info-circle me-1"></i> ${sal_description}`;
    // ============== CARGAR DATOS PARA EDITAR Y PARA REGISTRAR
    document.getElementsByName("cstid").forEach((cstid) => {
      if (cst_id != null && cst_id != "") {
        cstid.value = this.dataset.cst_id;
      }
    });
    document.getElementsByName("saldatestart").forEach((datestart) => {
      if (sal_date_start != null && sal_date_start != "") {
        datestart.value = this.dataset.sal_date_start;
      }
    });
    document.getElementsByName("saldateend").forEach((dateend) => {
      if (sal_date_end != null && sal_date_end != "") {
        dateend.value = this.dataset.sal_date_end;
      }
    });
    document.getElementsByName("salprice").forEach((salprice) => {
      if (sal_price != null && sal_price != "") {
        salprice.value = this.dataset.sal_price;
      }
      new Cleave(salprice, {
        numeral: true,
        numeralThousandsGroupStyle: "thousand",
        numeralDecimalScale: 0,
      });
    });
    document.getElementsByName("proid").forEach((proid) => {
      if (pro_id != null && pro_id != "") {
        proid.value = this.dataset.pro_id;
      }
    });
    document.getElementsByName("saldescription").forEach((saldescription) => {
      if (sal_description != null && sal_description != "") {
        saldescription.textContent = this.dataset.sal_description;
      }
    });
    // VALIDACION EDITAR
    document
      .getElementById("validateFormUpd")
      .addEventListener("click", function (vld) {
        vld.preventDefault();
        form = this.closest("#form_upd");
        form.action = `/sale/${sal_id}`;
        if (form && form.checkValidity()) {
          confirmUpdate();
        } else {
          form.reportValidity();
        }
      });
  });
});
// VALIDACION DE EDICION
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
// CONFIRMACIONES DE ACCIONES
function confirmCreate() {
  Swal.fire({
    title: "¿Registrar venta?",
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
function confirmUpdate() {
  Swal.fire({
    title: "¿Actualizar venta?",
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
function confirmDelete(id) {
  if (id != null && id != "") {
    Swal.fire({
      title: "¿Eliminar venta?",
      text: "Desactivar y eliminar una venta no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/sale/state/" + id;
      }
    });
  }
}
// UTILIDADES DE PAGINA
$(document).ready(function () {
  let params = new URLSearchParams(window.location.search);

  let cst_name = params.get("cst_name");
  let pro_profile = params.get("pro_profile");
  let search = `${cst_name} ${pro_profile}`;
  $("#table").DataTable({
    stateSave: true,
    order: [],
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
    },
    columnDefs: [
      {
        targets: [2], // Ajusta al índice de tu columna de fecha
        render: function (data, type) {
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
        targets: [1], // Ajusta al índice de tu columna de fecha
        render: function (data, type) {
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
        targets: [3],
        render: function (data, type) {
          if (type === "display") {
            if (data != null && data != "") {
              let formateado = new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(data);
  
              return `<span class="badge bg-primary">${formateado}</span>`;
            }
          }
          return data;
        },
      }
    ],
    initComplete: function () {
      if (
        (cst_name && cst_name !== null) ||
        (pro_profile && pro_profile !== null)
      ) {
        this.api().search(search).draw();
        this.api().state.clear();
      }
    },
  });
});
$(document).on("shown.bs.modal", ".modal", function () {
  $(this)
    .find(".js-example-responsive")
    .select2({
      theme: "bootstrap-5",
      width: "100%",
      placeholder: "Cliente",
      allowClear: true,
      dropdownParent: $(this),
      language: {
        noResults: function () {
          return "No se encontró el cliente";
        },
      },
    });
});
