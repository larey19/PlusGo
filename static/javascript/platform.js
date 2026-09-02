const messageTmp = `*... {tittle_add}🍿*
{account}
*CLV:* {password}

*Perfil 👤*
{profile}

*Pin*
{pin}

*VIGENCIA {date} 🗓️*

*NO CAMBIAR PREFIJO DEL PERFIL ⚠️*

RENOVACIONES 1, 2 y 3 DÍAS ANTES DE VENCER.

*Gracias por tu compra 🫂*`;

// ASIGAMOS EL TEMPLATE A LOS CAMPOS DE MENSAJE EN LAS MODALES
document.querySelectorAll(".plamessage").forEach((pla) => {
  pla.value = messageTmp;
});
// MODAL DE CREAR
document.querySelectorAll(".plaCrt").forEach((pla) => {
  pla.onclick = function () {
    const modal = document.getElementById("createModal");
    const form = modal.querySelector("#form_crt");
    const planame = modal.querySelector("#planame");
    const plaprofiles = modal.querySelector("#plaprofiles");
    const plamessage = modal.querySelector("#plamessage");
    // console.log(planame, plaprofiles, plamessage);

    planame.onchange = function () {
      validatechanges(this.value, "planame", "create");
    };
    plaprofiles.onchange = function () {
      validatechanges(this.value, "plaprofiles", "create");
    };
    plamessage.onchange = function () {
      if (this.value != messageTmp) {
        validatechanges(this.value, "plamessage", "create");
      }
    };

    modal.querySelector("#btnSubmit").onclick = function (clv) {
      clv.preventDefault();
      form.action = `/platform`;
      if (form && form.checkValidity()) {
        confirmPlatform("register", form);
      } else {
        form.reportValidity();
      }
    };
  };
});
// MODAL DE ACTUALIZAR
document.querySelectorAll(".plaUpd").forEach((pla) => {
  pla.onclick = function () {
    const modal = document.getElementById("editModal");
    const form = modal.querySelector("#form_upd");
    const pla_id = this.getAttribute("data-pla_id");
    const pla_name = this.getAttribute("data-pla_name");
    const pla_profiles = this.getAttribute("data-pla_profiles");
    const pla_message = this.getAttribute("data-pla_message");

    const planame = modal.querySelector("#planame");
    const plaprofiles = modal.querySelector("#plaprofiles");
    const plamessage = modal.querySelector("#plamessage");
    // console.log(planame, plaprofiles, plamessage);

    plamessage.value = pla_message || messageTmp;
    plaprofiles.value = pla_profiles;
    planame.value = pla_name;

    planame.onchange = function () {
      validatechanges(this.value, "planame", "update", pla_name);
    };
    plaprofiles.onchange = function () {
      validatechanges(this.value, "plaprofiles", "update", pla_profiles);
    };
    plamessage.onchange = function () {
      validatechanges(this.value, "plamessage", "update", pla_message);
    };

    modal.querySelector(".btn-close").onclick = function (event) {
      event.preventDefault();
      // console.log(
      //   plamessage.value,
      //   pla_message,
      //   planame.value,
      //   pla_name,
      //   pla_profiles,
      //   plaprofiles.value,
      // );

      if (
        plamessage.value != (pla_message || messageTmp) ||
        planame.value != pla_name ||
        pla_profiles != plaprofiles.value
      ) {
        Swal.fire({
          title: "Hay cambios sin guardar",
          icon: "info",
          showCancelButton: true,
          confirmButtonColor: "rgba(4,17,43,0.92)",
          allowOutsideClick: false,
          allowEscapeKey: false,
          confirmButtonText: "Quedarme",
          cancelButtonText: "Salir",
        }).then((result) => {
          if (!result.isConfirmed) {
            bootstrap.Modal.getInstance(modal).hide();

            modal.querySelector(".modal-footer").classList.add("d-none");
          }
        });
      } else {
        bootstrap.Modal.getInstance(modal).hide();
      }
    };
    modal.querySelector("#btnSubmit").onclick = function (clv) {
      clv.preventDefault();
      form.action = `/platform/${pla_id}`;
      if (form && form.checkValidity()) {
        confirmPlatform("update", form);
      } else {
        form.reportValidity();
      }
    };
  };
});

let plamessage = false;
let plaprofiles = false;
let planame = false;
function validatechanges(inputValue, input, action, value) {
  const modal = document.getElementById(
    action == "create" ? "createModal" : "editModal",
  );

  // modal.querySelector(".btnuser").classList.remove("d-none");
  if (input === "plamessage") {
    if (!inputValue && action === "create") {
      plamessage = false;
    } else if (inputValue === value && action === "update") {
      plamessage = false;
    } else {
      plamessage = true;
    }
  } else if (input === "plaprofiles") {
    if (!inputValue && action === "create") {
      plaprofiles = false;
    } else if (inputValue === value && action === "update") {
      plaprofiles = false;
    } else {
      plaprofiles = true;
    }
  } else {
    if (!inputValue && action === "create") {
      planame = false;
    } else if (inputValue === value && action === "update") {
      planame = false;
    } else {
      planame = true;
    }
  }

  // console.log(inputValue, input);
  // console.log(plamessage, plaprofiles, planame);
  if (plamessage === false && plaprofiles === false && planame === false) {
    modal.querySelector(".modal-footer").classList.add("d-none");
  } else {
    modal.querySelector(".modal-footer").classList.remove("d-none");
  }
}

// CONFIMACION
function confirmPlatform(action, form) {
  Swal.fire({
    title: ` ${action === "register" ? "¿Registar Plataforma?" : "¿Actualizar Plataforma?"}`,
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

// COMPLEMENTOS
$(document).ready(function () {
  $("#table").DataTable({
    pageLength: 100,
    stateSave: false,
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
