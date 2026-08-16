let mngemail = false;
let mngimap = false;
let mngpassword = false;
let mngfrom = false;

function validatechanges(inputValue, input, action, value) {
  const modal = document.getElementById(
    action == "create"
      ? "crtManage"
      : action == "update"
        ? "putManage"
        : "putPassword",
  );

  if (input === "mngemail") {
    if (action == "create" && !inputValue) {
      mngemail = false;
    } else if (action == "update" && inputValue === value) {
      mngemail = false;
    } else {
      mngemail = true;
    }
  } else if (input === "mngimap") {
    if (action == "create" && !inputValue) {
      mngimap = false;
    } else if (action == "update" && inputValue === value) {
      mngimap = false;
    } else {
      mngimap = true;
    }
  } else if (input === "mngfrom") {
    if (action == "create" && !inputValue) {
      mngfrom = false;
    } else if (action == "update" && JSON.stringify(inputValue) === JSON.stringify(value.split(", "))) {
      mngfrom = false;
    } else {
      mngfrom = true;
    }
  } else {
    if (action == "create" && !inputValue) {
      mngpassword = false;
    } else if (action == "update" || action == "updatePass" && inputValue === value) {
      mngpassword = false;
    } else {
      mngpassword = true;
    }
  }

  // console.log("mngemail:", mngemail);
  // console.log("mngimap:", mngimap);
  // console.log("mngpassword:", mngpassword);
  // console.log("mngfrom:", mngfrom);
  // console.log("input:", inputValue, "val:", value);
  // console.log(modal.querySelector(".modal-footer"));
  
  if (
    mngemail === false &&
    mngimap === false &&
    mngpassword === false &&
    mngfrom === false
  ) {    
    modal.querySelector(".modal-footer").classList.add("d-none");
  } else {
    modal.querySelector(".modal-footer").classList.remove("d-none");
  }
}

// MODAL DE REGISTRO
document.querySelectorAll(".accCrt").forEach((button) => {
  button.onclick = function (e) {
    const modal = document.getElementById("crtManage");

    const form = modal.querySelector("form");
    const mngemail = modal.querySelector("#mngemail");
    const mngimap = modal.querySelector("#mngimap");
    const mngpassword = modal.querySelector("#mngpassword");
    const mngfrom = modal.querySelector("#mngfrom");

    mngemail.onchange = function () {
      validatechanges(this.value, "mngemail", "create");
    };
    mngimap.onchange = function () {
      validatechanges(this.value, "mngimap", "create");
    };
    mngpassword.onchange = function () {
      validatechanges(this.value, "mngpassword", "create");
    };
    mngfrom.onchange = function () {
      validatechanges(this.value, "mngfrom", "create");
    };

    // VALIDAR EL ENVIO
    document.getElementById("btnSubmit").onclick = function (vld) {
      vld.preventDefault();
      if (form && form.checkValidity()) {
        confirmManage("create", form);
      } else {
        form.reportValidity();
      }
    };
  };
});
// CARGA DE DATOS PARA MODAL EDICION DE CONTRASEÑA
document.querySelectorAll(".updPassword").forEach((button) => {
  button.onclick = function (e) {
    const modal = document.getElementById("putPassword");

    const form = modal.querySelector("form");
    const mngpassword = modal.querySelector("#mngpassword");
    const mng_password = this.getAttribute("data-mng_password");
    const mng_id = this.getAttribute("data-mng_id");

    mngpassword.value = mng_password;
    mngpassword.onchange = function () {
      validatechanges(this.value, "mngpassword", "updatePass", mng_password);
    };

    // validacion al cerrar modal
    modal.querySelector(".btn-close").onclick = function (event) {
      event.preventDefault();

      if (mngpassword.value != mng_password) {
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
            modal.querySelector(".modal-footer").classList.add("d-none");
          }
        });
      } else {
        bootstrap.Modal.getInstance(modal).hide();
      }
    };

    modal.querySelector("#btnSubmit").onclick = function (clv) {
      clv.preventDefault();
      // VALIDACION DE CREACION
      if (form && form.checkValidity()) {
        form.action = `/manage/password/${mng_id}`;
        const account = {
          account: mng_email,
        };
        confirmManage("update", form, account);
      } else {
        form.reportValidity();
      }
    };
  };
});
// CARGA DE DATOS PARA MODAL DINAMICA EDICION
document.querySelectorAll(".dataManage").forEach((button) => {
  button.onclick = function (e) {
    const modal = document.getElementById("putManage");

    const form = modal.querySelector("form");
    const mngemail = modal.querySelector("#mngemail");
    const mngimap = modal.querySelector("#mngimap");
    const mngpassword = modal.querySelector("#mngpassword");
    const mngfrom = modal.querySelector("#mngfrom");

    const mng_id = this.getAttribute("data-mng_id");
    const mng_email = this.getAttribute("data-mng_email");
    const mng_from = this.getAttribute("data-mng_from");
    const mng_imap = this.getAttribute("data-mng_imap");
    // const mng_password = this.getAttribute("data-mng_password");
    mngemail.value = mng_email;
    mngimap.value = mng_imap;
    $(mngfrom).val(mng_from.split(", ")).trigger("change");

    mngemail.onchange = function () {
      validatechanges(this.value, "mngemail", "update", mng_email);
    };
    mngimap.onchange = function () {
      validatechanges(this.value, "mngimap", "update", mng_imap);
    };
    mngfrom.onchange = function () {
      validatechanges($(this).val(), "mngfrom", "update", mng_from);
    };

    // validacion al cerrar modal
    modal.querySelector(".btn-close").onclick = function (event) {
      event.preventDefault();

      if (
        mngemail.value != mng_email ||
        mngimap.value != mng_imap ||
        JSON.stringify($(mngfrom).val()) != JSON.stringify(mng_from.split(", "))
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
            modal.querySelector(".modal-footer").classList.add("d-none");
          }
        });
      } else {
        bootstrap.Modal.getInstance(modal).hide();
      }
    };

    // validacion de formulario de edicion
    document.querySelectorAll(".validateFormUpd").forEach((button) => {
      button.addEventListener("click", function (vld) {
        vld.preventDefault();
        const form = this.closest("#form_upd");
        if (form.checkValidity()) {
          confirmUpdate();
        } else {
          form.reportValidity();
        }
      });
    });

    modal.querySelector("#btnSubmit").onclick = function (clv) {
      clv.preventDefault();
      // VALIDACION DE CREACION
      if (form && form.checkValidity()) {
        form.action = `/manage/${mng_id}`;
        const account = {
          account: mng_email,
        };
        confirmManage("update", form, account);
      } else {
        form.reportValidity();
      }
    };
  };
});

function confirmManage(action, form, account) {
  // console.log(account);
  Swal.fire({
    title: ` ${action === "create" ? "¿Registar cuenta?" : action === "update" ? "¿Actualizar cuenta?" : action === "password" ? "¿Actualizar Contraseña de App?" : "¿Cambiar estado de la cuenta?"}`,
    icon: action === "state" ? "warning" : "info",
    text:
      action === "state"
        ? `${account["state"] === "active" ? "Desactivar" : "Activar"} ${account["account"]} hara que ${account["state"] === "active" ? "no" : ""} se puedan realizar consutas de codigos.`
        : action === "update" || action === "state"
          ? `En ${account["account"]}`
          : "",
    showCancelButton: true,
    confirmButtonColor: action != "state" ? "rgba(4,17,43,0.92)" : "#d33",
    confirmButtonText: "Sí, guardar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      action != "state"
        ? form.submit()
        : (window.location.href =
            "/manage/state/" + account['state'] + "/" + account["id"]);
    }
  });
}

// tabla
$(document).ready(function () {
  $("#table").DataTable({
    pageLength: 25,
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
        targets: ":not(:last-child)",
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

// select de las plataformas
$(document).on("shown.bs.modal", ".modal", function () {
  const modal = $(this);
  modal.find(".select").each(function () {
    $(this).select2({
      theme: "bootstrap-5",
      width: "100%",
      placeholder: "Cliente",
      allowClear: true,
      dropdownParent: modal,
      closeOnSelect: true,
      language: {
        noResults: function () {
          return "No se encontró el Cliente";
        },
      },
    });
  });
  modal
    .val(null)
    .trigger("change")
    .find(".select-multiple")
    .each(function () {
      $(this).select2({
        theme: "bootstrap-5",
        width: "100%",
        placeholder: "Netflix",
        allowClear: true,
        dropdownParent: modal,
        closeOnSelect: false,
        multiple: true,
        language: {
          noResults: function () {
            return "No se encontró la cuenta";
          },
        },
      });
    });
  // ESTADO
  modal.find(".select-state").each(function () {
    $(this).select2({
      theme: "bootstrap-5",
      width: "100%",
      placeholder: "Estado",
      allowClear: false,
      dropdownParent: modal,
      minimumResultsForSearch: Infinity,
    });
  });
});
