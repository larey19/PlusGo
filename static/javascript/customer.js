let cstname = false;
let cstphonenumber = false;
let cstlastname = false;

function validatechanges(inputValue, input, action, value) {
  const modal = document.getElementById(
    action == "create" ? "createModal" : "editModal",
  );

  // modal.querySelector(".btnuser").classList.remove("d-none");
  if (input === "cstname") {
    if (!inputValue && action == "create") {
      cstname = false;
    }
    if (inputValue === value && action == "update") {
      cstname = false;
    } else {
      cstname = true;
    }
  } else if (input === "cstlastname") {
    if (!inputValue && action == "create") {
      cstlastname = false;
    }
    if (inputValue === value && action == "update") {
      cstlastname = false;
    } else {
      cstlastname = true;
    }
  } else {
    if (!inputValue && action == "create") {
      cstphonenumber = false;
    }
    if (inputValue === value && action == "update") {
      cstphonenumber = false;
    } else {
      cstphonenumber = true;
    }
  }

  // console.log(inputValue, input);
  console.log(cstname, cstlastname, cstphonenumber);
  if (cstname === false && cstlastname === false && cstphonenumber === false) {
    modal.querySelector(".modal-footer").classList.add("d-none");
  } else {
    modal.querySelector(".modal-footer").classList.remove("d-none");
  }
}

document.querySelectorAll(".dataCustomer").forEach((button) => {
  button.onclick = function (event) {
    const modal = document.getElementById("editModal");
    const form = modal.querySelector("form");
    const cstname = modal.querySelector("#cstname");
    const cstlastname = modal.querySelector("#cstlastname");
    const cstphonenumber = modal.querySelector("#cstphonenumber");
    // obtenemos la informacion del cliente por medio del que boton carga la modal de editar
    const cst_id = this.getAttribute("data-cst_id");
    const cst_name = this.getAttribute("data-cst_name");
    const cst_lastname = this.getAttribute("data-cst_lastname");
    const cst_phone_number = this.getAttribute("data-cst_phone_number");

    cstname.value = cst_name;
    cstlastname.value = cst_lastname;
    cstphonenumber.value = cst_phone_number;

    new Cleave(cstphonenumber, {
      phone: true,
      phoneRegionCode: "CO",
    });

    cstname.onchange = function () {
      validatechanges(this.value, "cstname", "update", cst_name);
    };
    cstlastname.onchange = function () {
      validatechanges(this.value, "cstlastname", "update", cst_lastname);
    };
    cstphonenumber.onchange = function () {
      validatechanges(
        this.value.replace(" ", ""),
        "cstphonenumber",
        "update",
        cst_phone_number,
      );
    };

    modal.querySelector(".btn-close").onclick = function (event) {
      event.preventDefault();
      if (
        cstname.value != cst_name ||
        cstlastname.value != cst_lastname ||
        cstphonenumber.value.replace(" ", "") != cst_phone_number
      ) {
        Swal.fire({
          title: "Hay cambios sin guardar",
          icon: "info",
          showCancelButton: true,
          confirmButtonColor: "rgba(4,17,43,0.92)",
          confirmButtonText: "Quedarme",
          cancelButtonText: "Salir",
        }).then((result) => {
          if (!result.isConfirmed) {
            bootstrap.Modal.getInstance(modal).hide();
            modal.querySelector(".modal-footer").classList.add("d-none")
          }
        });
      } else {
        bootstrap.Modal.getInstance(modal).hide();
      }
    };

    modal.querySelector("#btnSubmit").onclick = function (clv) {
      clv.preventDefault();
      if (form && form.checkValidity()) {
        form.action = `/customer/${cst_id}`;
        confirmCustomer("update", form);
      } else {
        form.reportValidity();
      }
    };
  };
});

document.querySelectorAll(".cstCrt").forEach((button) => {
  button.onclick = function (event) {
    const modal = document.getElementById("createModal");
    const form = modal.querySelector("form");
    const cstname = modal.querySelector("#cstname");
    const cstlastname = modal.querySelector("#cstlastname");
    const cstphonenumber = modal.querySelector("#cstphonenumber");

    new Cleave(cstphonenumber, {
      phone: true,
      phoneRegionCode: "CO",
    });

    cstname.onchange = function () {
      validatechanges(this.value, "cstname", "create");
    };
    cstlastname.onchange = function () {
      validatechanges(this.value, "cstlastname", "create");
    };
    cstphonenumber.onchange = function () {
      validatechanges(this.value.replace(" ", ""), "cstphonenumber", "create");
    };

    modal.querySelector("#btnSubmit").onclick = function (clv) {
      clv.preventDefault();
      if (form && form.checkValidity()) {
        form.action = `/customer`;
        confirmCustomer("create", form);
      } else {
        form.reportValidity();
      }
    };
  };
});

function confirmCustomer(action, form, id) {
  Swal.fire({
    title: `${action === "create" ? "¿Registar Cliente?" : "¿Actualizar Cliente?"}`,
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
}

$(document).ready(function () {
  $("#table").DataTable({
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
