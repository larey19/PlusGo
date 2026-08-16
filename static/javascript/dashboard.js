$("#tableSale").on("draw.dt", function () {
  AOS.refreshHard();
});

$("#tableAcc").on("draw.dt", function () {
  AOS.refreshHard();
});
// DIAGRAMAS
const data = document.getElementById("data");
const cSale = document.getElementById("myChartSale");
const meses = JSON.parse(data.dataset.meses);
const totalsale = JSON.parse(data.dataset.totalsale);
new Chart(cSale, {
  type: "bar",
  data: {
    labels: meses,
    datasets: [
      {
        data: totalsale,

        borderWidth: 1,
        backgroundColor: ["rgba(54, 162, 235, 0.2)"],
        borderColor: ["rgb(54, 162, 235)"],
        borderRadius: 10,
      },
    ],
  },

  options: {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});
const cPlatform = document.getElementById("myChartPlatform");
const plaName = JSON.parse(data.dataset.planame);
const plaSale = JSON.parse(data.dataset.plasale);
new Chart(cPlatform, {
  type: "pie",
  data: {
    labels: plaName,
    datasets: [
      {
        data: plaSale,
        borderWidth: 1,
      },
    ],
  },

  options: {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  },
});

// ================ TABLAS
$(document).ready(function () {
  $("#tableUltTrgSale").DataTable({
    pageLength: 5,
    autoWidth: false,
    fixedHeader: false,
    rowReorder: false,
    // scrollY: "80vh",
    // scrollCollapse: true,
    keys: {
      columns: ":not(:last-child)",
    },
    order: [],
    ordering: {
      indicators: false,
      handler: false,
    },
    layout: {
      topStart: null,
      topEnd: null,
      bottomStart: null,
      bottomEnd: null,
      bottom: "info",
    },
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
    },
  });

  $("#tableSale").DataTable({
    pageLength: 10,
    stateSave: true,
    colReorder: {
      columns: ":not(:last-child)",
    },
    autoWidth: false,
    fixedHeader: false,
    rowReorder: false,
    // scrollY: "80vh",
    // scrollCollapse: true,
    keys: {
      columns: ":not(:last-child)",
    },
    order: [],
    columnDefs: [
      {
        targets: [0, 1, 2, 3, 4, 5],
        columnControl: [
          "order",
          [
            "searchList",
            {
              extend: "searchClear",
              text: "Borrar Busqueda",
            },
          ],
        ],
      },
    ],
    ordering: {
      indicators: false,
      handler: false,
    },
    layout: {
      topStart: {
        buttons: [
          {
            extend: "collection",
            text: '<i class="ti ti-filter fw-medium"></i> Filtrar',
            className: "btn-sm btn_blue_plusgo",
            buttons: [
              "pageLength",
              {
                extend: "ccSearchClear",
                text: '<div class="d-flex justify-content-between align-items-center"> Borrar Filtros <i class="ti ti-filter-off fw-medium"></i> </div>',
              },
            ],
          },
        ],
      },

      topEnd: {
        search: {
          text: `<i class="ti ti-filter-2-search  fw-medium text-dark-emphasis"></i>`,
          placeholder: "Buscar",
        },
      },
      bottomStart: null,
      bottomEnd: null,
      bottom: "info",
    },
    pagingType: "full_numbers",
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
      columnControl: {
        list: {
          all: "Seleccionar",
          none: "Deseleccionar",
          empty: "Sin datos",
          search: "Buscar...", // placeholder del input que filtra las opciones de la lista
        },
      },
      paginate: {
        first: `<i class="ti ti-chevrons-left fw-medium"></i>`,
        last: `<i class="ti ti-chevrons-right fw-medium"></i>`,
        previous: `<i class="ti ti-chevron-left fw-medium"></i>`,
        next: `<i class="ti ti-chevron-right fw-medium"></i>`,
      },
    },
  });

  $("#tableAcc").DataTable({
    pageLength: 10,
    stateSave: true,
    fixedColumns: false,
    colReorder: false,
    autoWidth: false,
    fixedHeader: false,
    // scrollY: "80vh",
    // scrollCollapse: true,
    keys: {
      columns: ":not(:last-child)",
    },
    order: [],
    columnDefs: [
      {
        targets: [0, 1, 2],
        columnControl: [
          "order",
          [
            "searchList",
            {
              extend: "searchClear",
              text: "Borrar Busqueda",
            },
          ],
        ],
      },
    ],
    ordering: {
      indicators: false,
      handler: false,
    },
    layout: {
      topStart: null,
      top: {
        buttons: [
          {
            extend: "collection",
            text: '<i class="ti ti-filter fw-medium"></i> Filtrar',
            className: "btn-sm btn_blue_plusgo",
            buttons: [
              "pageLength",
              {
                extend: "ccSearchClear",
                text: '<div class="d-flex justify-content-between align-items-center"> Borrar Filtros <i class="ti ti-filter-off fw-medium"></i> </div>',
              },
            ],
          },
        ],
      },

      topEnd: null,
      bottomStart: null,
      bottomEnd: null,
      bottom: "info",
    },
    pagingType: "full_numbers",
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
      columnControl: {
        list: {
          all: "Seleccionar",
          none: "Deseleccionar",
          empty: "Sin datos",
          search: "Buscar...", // placeholder del input que filtra las opciones de la lista
        },
      },
      paginate: {
        first: `<i class="ti ti-chevrons-left fw-medium"></i>`,
        last: `<i class="ti ti-chevrons-right fw-medium"></i>`,
        previous: `<i class="ti ti-chevron-left fw-medium"></i>`,
        next: `<i class="ti ti-chevron-right fw-medium"></i>`,
      },
    },
  });
});
//  ================ TIEMPO TOTAL VENTAS
document
  .getElementById("sale_time_change")
  .addEventListener("click", function (clk) {
    let saletime = document.getElementById("sale-time");
    let saletotal = document.getElementById("sale-total");

    if (saletotal.classList.contains("sale")) {
      saletotal.classList.replace("sale", "sale-today");
      saletime.innerHTML = " (Hoy)";
      saletotal.innerHTML = this.getAttribute("data-sale_total_today");
    } else if (saletotal.classList.contains("sale-today")) {
      saletotal.classList.replace("sale-today", "sale-yesterday");
      saletime.innerHTML = " (Ayer)";
      saletotal.innerHTML = this.getAttribute("data-sale_total_yesterday");
    } else if (saletotal.classList.contains("sale-yesterday")) {
      saletotal.classList.replace("sale-yesterday", "sale-weekly");
      saletime.innerHTML = " (Act. Semana)";
      saletotal.innerHTML = this.getAttribute("data-sale_total_weekly");
    } else {
      saletotal.classList.replace("sale-weekly", "sale");
      saletime.innerHTML = "";
      saletotal.innerHTML = this.getAttribute("data-sale_total");
    }
  });

document.querySelectorAll(".popover-dismiss").forEach((pop) => {
  new bootstrap.Popover(pop, {
    trigger: "focus",
    html: true,
    placement: "right",
    // title: "Preview Usuario",
    content: function () {
      let cst_name = this.getAttribute("data-cst_name");
      let cst_lastname = this.getAttribute("data-cst_lastname");
      let sal_date_start = this.getAttribute("data-sal_date_start");
      let sal_date_end = this.getAttribute("data-sal_date_end");
      let acc_email = this.getAttribute("data-acc_email");
      let acc_number_phone = this.getAttribute("data-acc_number_phone").match(
        /^(\d{3})(\d{3})(\d{4})$/,
      );
      let pro_profile = this.getAttribute("data-pro_profile");
      let pla_name = this.getAttribute("data-pla_name");
      let acc_user = this.getAttribute("data-acc_user");
      let sal_price = this.getAttribute("data-sal_price");

      return `
      <div class="d-flex flex-column gap-2">

        <div class="d-flex gap-2">
          <div class="rounded-circle shadow-sm p-2 d-flex justify-content-center align-items-center text-white bg-primary">
              <i class="bi bi-person-fill fs-4 px-2"></i>
          </div>
          <div class="text-nowrap text-truncate text-dark-emphasis d-flex flex-column justify-content-center">
            <h6 class="fw-semibold m-0">
              ${cst_name && cst_lastname ? cst_name + " " + cst_lastname : cst_name}
            </h6>
            <small class="m-0 fw-medium">
              Venta de ${pla_name}
            </small>
          </div>
        </div>
        
        <div>
          <hr class="my-1 text-black">
        </div>

        <div class="d-flex flex-column">
          <div class="text-nowrap text-truncate text-dark-emphasis m-0 d-flex gap-2">
            <small class="fw-medium text-primary">
            <i class="ti ti-mail fs-5"></i>
            </small>
            <small>
            ${acc_email ? acc_email : acc_number_phone ? "(" + acc_number_phone[1] + ")" + " " + acc_number_phone[2] + "-" + acc_number_phone[3] : acc_user}
            </small>
          </div>

          <div class="text-nowrap text-truncate text-dark-emphasis m-0 d-flex gap-2">
            <small class="fw-medium text-primary">
            <i class="ti ti-tag fs-5"></i>
            </small>
            <small>
            Perfil ${pro_profile}
            </small>
          </div>
          
          <div class="text-nowrap text-truncate text-dark-emphasis m-0 d-flex gap-2">
            <small class="fw-medium text-primary">
            <i class="ti ti-calendar-event fs-5"></i>
            </small>
            <small>
            ${sal_date_start} - ${sal_date_end}
            </small>
          </div>

          <div class="text-nowrap text-truncate text-dark-emphasis m-0 d-flex gap-2">
            <small class="fw-medium text-primary">
            <i class="ti ti-cash fs-5"></i>
            </small>
            <small>
            $ ${sal_price}
            </small>
          </div>
        </div>
      </div>`;
    },
  });
});

// ================== CAMBIO DE PASS
function validatePassword(button, event) {
  event.preventDefault();
  const form = button.closest("#formpassword");
  const passnew = form.querySelector("#userpasswordnew");
  const passcheck = form.querySelector("#userpasswordcheck");  
  if (passnew.value != passcheck.value) {
    Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    }).fire({
      icon: "error",
      // title:  action == "" ? "" : "",
      text: "Contraseñas no coinciden"
    });
  }
  else if (form && form.checkValidity()) {
    Swal.fire({
      title: "¿Actualizar Contraseña?",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "rgba(4,17,43,0.92)",
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        form.submit();
      }
    });
  } else {
    form.reportValidity();
  }
}

if (document.getElementById("passwordUser")) {
  const modal = new bootstrap.Modal(document.getElementById("passwordUser"));
  modal.show();
}
