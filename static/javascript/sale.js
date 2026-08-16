let cstid = false;
let saldate = false;
let salprice = false;
let propin = false;
let salstate = false;
let saldescription = false;

function validatechanges(inputValue, input, action, value) {
  const modal = document.getElementById(
    action == "create" ? "crtSale" : "editSale",
  );

  if (input === "cstid") {
    if (action == "create" && !inputValue) {
      cstid = false;
    } else if (action == "update" && inputValue === value) {
      cstid = false;
    } else {
      cstid = true;
    }
  } else if (input === "saldate") {
    if (action == "create" && !inputValue) {
      saldate = false;
    } else if (action == "update" && inputValue === value) {
      saldate = false;
    } else {
      saldate = true;
    }
  } else if (input === "propin") {
    if (action == "create" && !inputValue) {
      propin = false;
    } else if (action == "update" && inputValue === value) {
      propin = false;
    } else {
      propin = true;
    }
  } else if (input === "saldescription") {
    if (action == "create" && !inputValue) {
      saldescription = false;
    } else if (action == "update" && inputValue === value) {
      saldescription = false;
    } else {
      saldescription = true;
    }
  } else if (input === "salstate") {
    if (action == "create" && !inputValue) {
      salstate = false;
    } else if (action == "update" && inputValue === value) {
      salstate = false;
    } else {
      salstate = true;
    }
  } else {
    if (action == "create" && !inputValue) {
      salprice = false;
    } else if (action == "update" && inputValue === value) {
      salprice = false;
    } else {
      salprice = true;
    }
  }

  // console.log("cstid:", cstid);
  // console.log("saldate:", saldate);
  // console.log("salprice:", salprice);
  // console.log("propin:", propin);
  // console.log("saldDescription:", saldescription);
  // console.log("input:", inputValue, "val:" , value);
  if (
    cstid === false &&
    saldate === false &&
    salprice === false &&
    propin === false &&
    salstate === false &&
    saldescription === false
  ) {
    modal.querySelector(".modal-footer").classList.add("d-none");
  } else {
    modal.querySelector(".modal-footer").classList.remove("d-none");
  }
}

// SCRIPT COPIA DE DATOS DE VENTA
document.querySelectorAll("#copySale").forEach((sl) => {
  sl.onclick = function (clk) {
    const modal = document.getElementById("crtSale");
    const cst_id = this.getAttribute("data-cst_id");
    const sal_date_start = this.getAttribute("data-sal_date_start");
    const sal_date_end = this.getAttribute("data-sal_date_end");
    const sal_price = this.getAttribute("data-sal_price");
    const sal_description = this.getAttribute("data-sal_description");
    const acc_email = this.getAttribute("data-acc_email");
    const pro_pin_profile = this.getAttribute("data-pro_pin_profile");
    const sal_state = this.getAttribute("data-sal_state");

    const cstid = modal.querySelector("#cstid");
    const saldate = modal.querySelector("#saldate");
    const salprice = modal.querySelector("#salprice");
    const propin = modal.querySelector("#propin");
    const saldescription = modal.querySelector("#saldescription");
    const buttonPin = modal.querySelector("#buttonPin");
    const clrDescription = modal.querySelector("#clrDescription");
    const salstate = modal.querySelector("#salstate");

    const iconCopy = this.querySelector("#iconCopy");

    if (this.classList.contains("copy")) {
      this.classList.replace("copy", "copy-active");
      iconCopy.classList.replace("ti-copy-plus", "ti-copy-x");

      document.querySelectorAll(".copy").forEach((sale) => {
        sale.classList.add("d-none");
      });
      // ============== CARGAR DATOS EN MODAL REGISTRAR
      cstid.value = cst_id;
      saldate.value = `${sal_date_start} - ${sal_date_end}`;
      inputdate(saldate, sal_date_start, sal_date_end);
      salprice.value = sal_price;
      new Cleave(salprice, {
        numeral: true,
        numeralThousandsGroupStyle: "thousand",
      });
      salstate.value = sal_state;
      propin.value = pro_pin_profile;
      saldescription.textContent = sal_description;
      copySale("copy");
    } else {
      this.classList.replace("copy-active", "copy");
      document.querySelectorAll(".copy").forEach((sale) => {
        sale.classList.remove("d-none");
      });
      iconCopy.classList.replace("ti-copy-x", "ti-copy-plus");
      // ============== ELIMINA DATOS DE REGISTRAR
      cstid.value = "";
      saldate.value = "";
      salprice.value = "";
      saldescription.value = "";
      salstate.value = "";
      propin.value = "";
      clrDescription.classList.add("d-none");
      copySale("cut");
    }
  };
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
    const acc_password = this.getAttribute("data-acc_password");
    const cst_name = this.getAttribute("data-cst_name");
    const cst_lastname = this.getAttribute("data-cst_lastname");
    const cst_phone_number = this.getAttribute("data-cst_phone_number");
    const pro_profile = this.getAttribute("data-pro_profile");
    const pro_pin_profile = this.getAttribute("data-pro_pin_profile");
    const pla_message = this.getAttribute("data-pla_message");

    const cstFullname = document.getElementById("cst_fullname");
    const cstPhoneNumber = document.getElementById("cst_phone_number");

    const salDateStart = document.getElementById("sal_date_start");
    const salDateEnd = document.getElementById("sal_date_end");
    const salPrice = document.getElementById("sal_price");
    const salDescription = document.getElementById("sal_description");

    const accEmail = document.getElementById("acc_email");
    const accPassword = document.getElementById("acc_password");

    const proProfile = document.getElementById("pro_profile");
    const proPinProfile = document.getElementById("pro_pin_profile");

    const dataAcc = document.getElementById("dataAcc");
    const copyButton = document.getElementById("copyButton");
    const copyButton2 = document.getElementById("copyButton2");
    // ============= CARGA DATOS EN MODAL DETALLES

    cstFullname.innerHTML = `${cst_name} ${cst_lastname}`;
    cstPhoneNumber.innerHTML = `<i class="ti ti-device-mobile fs-5"></i> ${cst_phone_number}`;
    salDateStart.innerHTML = `<i class="ti ti-calendar-event fs-5"></i> ${sal_date_start}`;
    salDateEnd.innerHTML = `<i class="ti ti-calendar-event fs-5"></i> ${sal_date_end}`;
    salPrice.innerHTML = `$ ${sal_price}`;
    accEmail.innerHTML = `<i class="ti ti-mail fs-5"></i> ${acc_email}`;
    accPassword.innerHTML = `<i class="ti ti-lock fs-5"></i> ${acc_password}`;
    proProfile.innerHTML = `<i class="ti ti-tag fs-5"></i> Perfil ${pro_profile}`;
    proPinProfile.innerHTML = `<i class="ti ti-password-user fs-5"></i> ${pro_pin_profile}`;
    salDescription.innerHTML = `<i class="ti ti-info-circle"></i> ${sal_description}`;
    // informacion de la cuenta modal detalles
    dataAcc.onclick = function () {
      if (!this.classList.contains("flex-column")) {
        this.classList.add("flex-column");

        accEmail.style.maxWidth = "100%";
        accPassword.style.maxWidth = "100%";
        proProfile.style.maxWidth = "100%";

        proPinProfile.classList.remove("d-none");
        copyButton.classList.remove("d-none");
        copyButton2.classList.remove("d-none");
      }
    };
    copyButton2.onclick = function () {
      dataAcc.classList.remove("flex-column");

      accEmail.style.maxWidth = "150px";
      accPassword.style.maxWidth = "150px";
      proProfile.style.maxWidth = "150px";

      proPinProfile.classList.add("d-none");
      copyButton.classList.add("d-none");
      copyButton2.classList.add("d-none");
    };

    // ================ COPIAR EN PORTAPAPELES MENSAJE DE DATOS DE VENTA

    copyButton.onclick = function () {
      if (pla_message) {
        this.classList.replace("ti-copy", "ti-copy-check");

        navigator.clipboard.writeText(pla_message).then(() => {
          setTimeout(() => {
            this.classList.replace("ti-copy-check", "ti-copy");
          }, 3000);
        });
      } else {
        this.classList.replace("ti-copy", "ti-copy-off");

        setTimeout(() => {
          this.classList.replace("ti-copy-off", "ti-copy");
        }, 3000);
      }
    };
  });
});
// SCRIPTS MODAL CREATE
document.querySelectorAll(".dataSaleCreate").forEach((sale) => {
  sale.onclick = function (c) {
    // ============== CARGAR DATOS PARA MODAL REGISTRO
    const modal = document.getElementById("crtSale");
    const form = modal.querySelector("form");

    const proid = modal.querySelector("#proid");
    const cstid = modal.querySelector("#cstid");
    const saldate = modal.querySelector("#saldate");
    const salprice = modal.querySelector("#salprice");
    const propin = modal.querySelector("#propin");
    const saldescription = modal.querySelector("#saldescription");
    const buttonPin = modal.querySelector("#buttonPin");
    const buttonDates = modal.querySelector(".buttonDates");
    const salstate = modal.querySelector("#salstate");
    const clrDescription = modal.querySelector("#clrDescription");

    const acc_email = this.getAttribute("data-acc_email");
    const pro_pin_profile = this.getAttribute("data-pro_pin_profile");
    const pro_id = this.getAttribute("data-pro_id");

    proid.value = pro_id;
    propin.disabled = propin.value ? false : true;

    if (pro_pin_profile) {
      propin.value = pro_pin_profile;
    }

    inputdate(saldate);
    new Cleave(salprice, {
      numeral: true,
      numeralThousandsGroupStyle: "thousand",
    });

    cstid.onchange = function () {
      validatechanges(this.value, "cstid", "create");
    };
    $(saldate).on("apply.daterangepicker", function () {
      validatechanges(this.value, "saldate", "create");
    });
    $(saldate).on("cancel.daterangepicker", function () {
      validatechanges(this.value, "saldate", "create");
    });
    // $(document).on("click", ".daterangepicker td.available", function () {
    //     console.log("Fecha seleccionada");
    // });
    salprice.onchange = function () {
      validatechanges(this.value, "salprice", "create");
    };
    propin.onchange = function () {
      validatechanges(this.value, "propin", "create");
    };
    salstate.onchange = function () {
      validatechanges(this.value, "salstate", "create");
    };
    saldescription.onchange = function () {
      validatechanges(this.value, "saldescription", "create");
      if (this.value.length > 0) {
        clrDescription.classList.remove("d-none");
      } else {
        clrDescription.classList.add("d-none");
      }
    };

    clrDescription.onclick = () => {
      saldescription.value = "";
      clrDescription.classList.add("d-none");
      validatechanges(saldescription.value, "saldescription", "create");
    };

    // cambio de propin
    buttonPin.onclick = () => {
      buttonpin(buttonPin, propin, modal);
    };

    buttonDates.onclick = () => {
      inputdate(saldate);
    };

    modal.querySelector("#btnSubmit").onclick = function (clv) {
      clv.preventDefault();
      // VALIDACION DE CREACION
      if (form && form.checkValidity() && saldate.value.trim() != "") {
        const dates = saldate.value.split(" - ");
        form.action = `/sale`;
        const sale = {
          account: acc_email,
          days:
            (new Date(dates[1].split("/").reverse().join("-")) -
              new Date(dates[0].split("/").reverse().join("-"))) /
            86400000,
          price: salprice.value,
        };
        confirmSale("create", form, sale);
      } else {
        form.reportValidity();
      }
    };
  };
});
// SCRIPTS MODAL UPDATE
document.querySelectorAll(".dataSaleUpdate").forEach((sale) => {
  sale.onclick = function (c) {
    const modal = document.getElementById("editSale");
    const form = modal.querySelector("form");

    const pro_id = this.getAttribute("data-pro_id");
    const cst_id = this.getAttribute("data-cst_id");
    const sal_id = this.getAttribute("data-sal_id");
    const sal_date_start = this.getAttribute("data-sal_date_start");
    const sal_date_end = this.getAttribute("data-sal_date_end");
    const sal_state = this.getAttribute("data-sal_state");
    const sal_price = this.getAttribute("data-sal_price");
    const sal_description = this.getAttribute("data-sal_description");
    const acc_email = this.getAttribute("data-acc_email");
    const pro_pin_profile = this.getAttribute("data-pro_pin_profile");

    const cstid = modal.querySelector("#cstid");
    const proid = modal.querySelector("#proid");
    const saldate = modal.querySelector("#saldate");
    const salprice = modal.querySelector("#salprice");
    const salstate = modal.querySelector("#salstate");
    const propin = modal.querySelector("#propin");
    const saldescription = modal.querySelector("#saldescription");
    const buttonPin = modal.querySelector("#buttonPin");
    const buttonDates = modal.querySelector(".buttonDates");
    const clrDescription = modal.querySelector("#clrDescription");

    // ============== CARGAR DATOS PARA EDITAR
    cstid.value = cst_id;
    proid.value = pro_id;
    saldate.value = `${sal_date_start} - ${sal_date_end}`;
    inputdate(saldate, sal_date_start, sal_date_end);
    salprice.value = sal_price;
    new Cleave(salprice, {
      numeral: true,
      numeralThousandsGroupStyle: "thousand",
    });
    salstate.value = sal_state;
    propin.value = pro_pin_profile;
    saldescription.value = sal_description;

    if (saldescription.value.length > 0) {
      clrDescription.classList.remove("d-none");
    } else {
      clrDescription.classList.add("d-none");
    }

    cstid.onchange = function () {
      validatechanges(this.value, "cstid", "update", cst_id);
    };
    saldate.onchange = function () {
      validatechanges(
        this.value,
        "saldate",
        "update",
        `${sal_date_start} - ${sal_date_end}`,
      );
    };
    salprice.onchange = function () {
      validatechanges(this.value, "salprice", "update", sal_price);
    };
    salstate.onchange = function () {
      validatechanges(this.value, "salstate", "update", sal_state);
    };
    propin.onchange = function () {
      validatechanges(this.value, "propin", "update", pro_pin_profile);
    };
    saldescription.onchange = function () {
      validatechanges(this.value, "saldescription", "update", sal_description);
      if (this.value.length > 0) {
        clrDescription.classList.remove("d-none");
      } else {
        clrDescription.classList.add("d-none");
      }
    };

    // cambio de propin
    buttonPin.onclick = () => {
      buttonpin(buttonPin, propin, modal);
    };

    buttonDates.onclick = () => {
      inputdate(saldate);
    };

    clrDescription.onclick = () => {
      saldescription.value = "";
      clrDescription.classList.add("d-none");
      validatechanges(
        saldescription.value,
        "saldescription",
        "update",
        sal_description,
      );
    };
    // validamos cambios al cerrar modal
    modal.querySelector(".btn-close").onclick = function (event) {
      event.preventDefault();
      if (
        cstid.value != cst_id ||
        saldate.value != `${sal_date_start} - ${sal_date_end}` ||
        salprice.value.replace(",", "") != sal_price ||
        saldescription.value != sal_description ||
        propin.value != pro_pin_profile
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

    // validamos al momento de enviar la info
    modal.querySelector("#btnSubmit").onclick = function (clv) {
      clv.preventDefault();

      if (form && form.checkValidity() && saldate.value.trim() != "") {
        const dates = saldate.value.split(" - ");
        form.action = `/sale/${sal_id}`;
        const sale = {
          account: acc_email,
          days:
            (new Date(dates[1].split("/").reverse().join("-")) -
              new Date(dates[0].split("/").reverse().join("-"))) /
            86400000,
          id: sal_id,
          price: salprice.value,
        };
        confirmSale("update", form, sale);
      } else {
        form.reportValidity();
      }
    };
  };
});

// CONFIRMACIONES DE ACCIONES
function confirmSale(action, form, sale) {
  console.log(sale);
  Swal.fire({
    title: ` ${action === "create" ? "¿Registar venta?" : action === "update" ? "¿Actualizar venta?" : "¿Eliminar la venta?"}`,
    icon: action === "delete" ? "warning" : "info",
    text:
      action === "delete"
        ? `En ${sale["account"]}, eliminar una venta no se puede deshacer.`
        : `En ${sale["account"]} por ${sale["days"]} días a $${sale["price"]}`,
    showCancelButton: true,
    confirmButtonColor: action != "delete" ? "rgba(4,17,43,0.92)" : "#d33",
    confirmButtonText: "Sí, guardar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      action != "delete"
        ? form.submit()
        : (window.location.href = "/sale/state/" + sale["id"]);
    }
  });
}

function copySale(action) {
  Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    // didOpen: (toast) => {
    //   toast.onmouseenter = Swal.stopTimer;
    //   toast.onmouseleave = Swal.resumeTimer;
    // },
  }).fire({
    icon: action == "copy" ? "success" : "info",
    // title:  action == "copy" ? "Venta Duplicada" : "Venta Borrada",
    text:
      action == "copy"
        ? "Info cargada en la modal de registro"
        : "Info Borrada de la moral de registro",
  });
}

// UTILIDADES DE PAGINA
$(document).ready(function () {
  let params = new URLSearchParams(window.location.search);

  let cst_name = params.get("cst_name");
  let pro_profile = params.get("pro_profile");
  let search = `${cst_name} ${pro_profile}`;
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
        targets: [0, 1, 2, 3, 4, 5, 6, 7],
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
// select de clientes
$(document).on("shown.bs.modal", ".modal", function () {
  const modal = $(this);
  // CLIENTE
  modal.find(".select-client").each(function () {
    $(this).select2({
      theme: "bootstrap-5",
      width: "100%",
      placeholder: "Cliente",
      allowClear: true,
      dropdownParent: modal,
      language: {
        noResults: function () {
          return "No se encontró el cliente";
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

// input de pin del perfil modales registro y edicion
buttonpin = (icon, input, modal) => {
  modal.addEventListener("hide.bs.modal", () => {
    icon.classList.replace("ti-pencil-off", "ti-pencil");
    input.setAttribute("disabled", true);
  });

  if (icon.classList.contains("ti-pencil")) {
    icon.classList.replace("ti-pencil", "ti-pencil-off");
    input.removeAttribute("disabled");
  } else {
    icon.classList.replace("ti-pencil-off", "ti-pencil");
    input.setAttribute("disabled", true);
  }
};

inputdate = (input, date_start, date_end) => {
  $(input).daterangepicker({
    autoUpdateInput: date_start && date_end ? true : false,
    opens: "center",
    startDate: date_start
      ? moment(date_start, "DD/MM/YYYY")
      : moment().startOf("day"),
    endDate: date_end
      ? moment(date_end, "DD/MM/YYYY")
      : moment().add(30, "days"),
    locale: {
      format: "DD/MM/YYYY",
      applyLabel: "Aplicar",
      cancelLabel: "Limpiar",
      fromLabel: "Desde",
      toLabel: "Hasta",
      customRangeLabel: "Personalizado",
      weekLabel: "S",
      daysOfWeek: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
      monthNames: [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ],
      firstDay: 1,
    },
    isCustomDate: function (date) {
      const hoy = moment().startOf("day");
      const especiales = [
        hoy.clone().add(15, "days"),
        hoy.clone().add(30, "days"),
        hoy.clone().add(60, "days"),
        hoy.clone().add(90, "days"),
      ];

      if (especiales.some((d) => d.isSame(date, "day"))) {
        return "dia-especial";
      }
      return false;
    },
  });

  $(input).on("apply.daterangepicker", function (ev, picker) {
    $(this).val(
      picker.startDate.format("DD/MM/YYYY") +
        " - " +
        picker.endDate.format("DD/MM/YYYY"),
    );
  });
  // $(input).on("apply.daterangepicker", function (ev, picker) {
  //   $(this).val(picker.startDate.format("DD/MM/YYYY"));
  // });
  $(input).on("cancel.daterangepicker", function () {
    $(this).val("");
  });
};

// centra la plataforma selecionada y si no tiene ningun venta disposible oculta boton de copiar
document.addEventListener("DOMContentLoaded", function () {
  const activo = document.querySelector(".text-primary");
  if (activo) {
    activo.scrollIntoView({ inline: "center" });
  }

  if (!document.querySelector(".copy")) {
    document.querySelectorAll("#copySale").forEach((copy) => {
      copy.classList.add("d-none");
    });
  }
});

const container = document.getElementById("platformScroll");
const left = document.getElementById("platformLeft");
const right = document.getElementById("platformRight");

function updatePlatformArrows() {
  const scrollLeft = container.scrollLeft;
  const maxScroll = container.scrollWidth - container.clientWidth;
  // Hay contenido oculto hacia la izquierda
  if (scrollLeft > 5) {
    left.classList.remove("d-none");
  } else {
    left.classList.add("d-none");
  }
  // Hay contenido oculto hacia la derecha
  if (scrollLeft < maxScroll - 5) {
    right.classList.remove("d-none");
  } else {
    right.classList.add("d-none");
  }
}
updatePlatformArrows();
container.addEventListener("scroll", updatePlatformArrows);
left.addEventListener("click", () => {
  container.scrollBy({
    left: -200,
    behavior: "smooth",
  });
});
right.addEventListener("click", () => {
  container.scrollBy({
    left: 200,
    behavior: "smooth",
  });
});
window.addEventListener("resize", updatePlatformArrows);

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
      let acc_number_phone = this.getAttribute("data-acc_number_phone");
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
            ${acc_email ? acc_email : acc_number_phone ? acc_number_phone : acc_user}
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
