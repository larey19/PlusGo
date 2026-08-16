$(document).ready(function () {
  $("#table").DataTable({
    pageLength: 25,
    stateSave: true,
    colReorder: true,
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
        targets: this.querySelector(".dataSaleDetails") ?  ":not(:last-child)" : "_all",
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
      bottom2: "info",
      bottom: "paging",
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

// SCRIPTS MODAL DETALLES
document.querySelectorAll(".dataSaleDetails").forEach((sale) => {
  sale.addEventListener("click", function (c) {
    const sal_id = this.getAttribute("data-sal_id");
    const sal_price = this.getAttribute("data-sal_price");
    const sal_date_start = this.getAttribute("data-sal_date_start");
    const sal_date_end = this.getAttribute("data-sal_date_end");
    const sal_description = this.getAttribute("data-sal_description");
    const acc_email = this.getAttribute("data-acc_email");
    const trg_action = this.getAttribute("data-trg_action");
    const cst_name = this.getAttribute("data-cst_name");
    const cst_lastname = this.getAttribute("data-cst_lastname");
    const pro_profile = this.getAttribute("data-pro_profile");
    const trg_date = this.getAttribute("data-trg_date");

    const cstFullname = document.getElementById("cst_fullname");

    const salDateStart = document.getElementById("sal_date_start");
    const salDateEnd = document.getElementById("sal_date_end");
    const salPrice = document.getElementById("sal_price");
    const salDescription = document.getElementById("sal_description");

    const accEmail = document.getElementById("acc_email");
    const accPassword = document.getElementById("acc_password");

    const proProfile = document.getElementById("pro_profile");
    const trgaction = document.getElementById("trg_action");

    // ============= CARGA DATOS EN MODAL DETALLES

    cstFullname.innerHTML = `${cst_name} ${cst_lastname}`;
    salDateStart.innerHTML = `<i class="ti ti-calendar-event fs-5"></i> ${sal_date_start}`;
    salDateEnd.innerHTML = `<i class="ti ti-calendar-event fs-5"></i> ${sal_date_end}`;
    salPrice.innerHTML = `$ ${sal_price}`;
    accEmail.innerHTML = `<i class="ti ti-mail fs-5"></i> ${acc_email}`;
    // accPassword.innerHTML = `<i class="ti ti-lock fs-5"></i> ${acc_password}`;
    proProfile.innerHTML = `<i class="ti ti-tag fs-5"></i> Perfil ${pro_profile}`;
    // proPinProfile.innerHTML = `<i class="ti ti-password-user fs-5"></i> ${pro_pin_profile}`;
    trgaction.innerHTML = `<i class="ti ti-info-circle"></i> ${trg_action} el ${trg_date}`;
    salDescription.innerHTML = `<i class="ti ti-info-circle"></i> ${sal_description}`;
    
  });
});
