let accnickname = false;
let accprovider = false;
let accdatepay = false;
let accemail = false;
let accnumberphone = false;
let accuser = false;
let accpassword = false;
let crtPros = false;

function validatechanges(inputValue, input, action, value) {
  const modal = document.getElementById(
    action == "create" ? "createModal" : "editModal",
  );

  // modal.querySelector(".btnuser").classList.remove("d-none");
  if (input === "accnickname") {
    if (!inputValue && action === "create") {
      accnickname = false;
    } else if (action === "update" && inputValue === value) {
      accnickname = false;
    } else {
      accnickname = true;
    }
  } else if (input === "accprovider") {
    if (!inputValue && action === "create") {
      accprovider = false;
    } else if (action === "update" && inputValue === value) {
      accprovider = false;
    } else {
      accprovider = true;
    }
  } else if (input === "accdatepay") {
    if (!inputValue && action === "create") {
      accdatepay = false;
    } else if (action === "update" && inputValue === value) {
      accdatepay = false;
    } else {
      accdatepay = true;
    }
  } else if (input === "accemail") {
    if (!inputValue && action === "create") {
      accemail = false;
    } else if (action === "update" && inputValue === value) {
      accemail = false;
    } else {
      accemail = true;
    }
  } else if (input === "accnumberphone") {
    if (!inputValue && action === "create") {
      accnumberphone = false;
    } else if (action === "update" && inputValue === value) {
      accnumberphone = false;
    } else {
      accnumberphone = true;
    }
  } else if (input === "accuser") {
    if (!inputValue && action === "create") {
      accuser = false;
    } else if (action === "update" && inputValue === value) {
      accuser = false;
    } else {
      accuser = true;
    }
  } else if (input === "crtPros") {
    if (!inputValue && action === "create") {
      crtPros = false;
    } else {
      crtPros = true;
    }
  } else {
    if (!inputValue && action === "create") {
      accpassword = false;
    } else if (action === "update" && inputValue === value) {
      accpassword = false;
    } else {
      accpassword = true;
    }
  }

  // console.log(inputValue, value, input);
  // console.log(
  //   accnickname,
  //   accprovider,
  //   accdatepay,
  //   accemail,
  //   accnumberphone,
  //   accuser,
  //   accpassword,
  // );
  if (
    accnickname === false &&
    accprovider === false &&
    accdatepay === false &&
    accemail === false &&
    accnumberphone === false &&
    accuser === false &&
    crtPros === false &&
    accpassword === false
  ) {
    modal.querySelector(".modal-footer").classList.add("d-none");
  } else {
    modal.querySelector(".modal-footer").classList.remove("d-none");
  }
}

document.querySelectorAll(".accCrt").forEach((button) => {
  button.onclick = function () {
    const modal = document.getElementById("createModal");
    const form = modal.querySelector("form");
    const accnickname = modal.querySelector("#accnickname");
    const accprovider = modal.querySelector("#accprovider");
    const accdatepay = modal.querySelector("#accdatepay");
    const accemail = modal.querySelector("#accemail");
    const accnumberphone = modal.querySelector("#accnumberphone");
    const accuser = modal.querySelector("#accuser");
    const accpassword = modal.querySelector("#accpassword");
    const crtPros = modal.querySelector("#crtPros");
    inputdate(accdatepay);
    accnickname.onchange = function () {
      validatechanges(this.value, "accnickname", "create");
    };
    accprovider.onchange = function () {
      validatechanges(this.value, "accprovider", "create");
    };
    $(accdatepay).on("apply.daterangepicker", function () {
      validatechanges(this.value, "accdatepay", "create");
    });
    $(accdatepay).on("cancel.daterangepicker", function () {
      validatechanges(this.value, "accdatepay", "create");
    });
    ["keydown", "paste", "drop"].forEach((event) =>
      accdatepay.addEventListener(event, (e) => e.preventDefault()),
    );
    accemail.onchange = function () {
      validatechanges(this.value, "accemail", "create");
    };
    accnumberphone.onchange = function () {
      validatechanges(this.value, "accnumberphone", "create");
    };
    accuser.onchange = function () {
      validatechanges(this.value, "accuser", "create");
    };
    accpassword.onchange = function () {
      validatechanges(this.value, "accpassword", "create");
    };
    crtPros.onchange = function () {
      validatechanges(this.checked ? this.value : "", "crtPros", "create");
    };

    modal.querySelector("#btnSubmit").onclick = function (clv) {
      clv.preventDefault();

      if (
        form &&
        form.checkValidity() &&
        (accemail.value || accnumberphone.value || accuser.value)
      ) {
        confirmAccount("register", form);
      } else {
        if (!accemail.value || !accnumberphone.value || !accuser.value) {
          accemail.setCustomValidity("este campo es requerido");
          accnumberphone.setCustomValidity("este campo es requerido");
          accuser.setCustomValidity("este campo es requerido");
        }
        form.reportValidity();

        accemail.setCustomValidity("");
        accnumberphone.setCustomValidity("");
        accuser.setCustomValidity("");
      }
    };
  };
});

document.querySelectorAll(".accEdit").forEach((button) => {
  button.onclick = function (vld) {
    const modal = document.getElementById("editModal");
    const form = modal.querySelector("form");
    const accnickname = modal.querySelector("#accnickname");
    const accprovider = modal.querySelector("#accprovider");
    const accdatepay = modal.querySelector("#accdatepay");
    const accemail = modal.querySelector("#accemail");
    const accnumberphone = modal.querySelector("#accnumberphone");
    const accuser = modal.querySelector("#accuser");
    const accpassword = modal.querySelector("#accpassword");
    const buttonDates = modal.querySelector(".buttonDates");

    const acc_id = this.getAttribute("data-acc_id");
    const acc_nickname = this.getAttribute("data-acc_nickname");
    const acc_provider = this.getAttribute("data-acc_provider");
    const acc_date_pay = this.getAttribute("data-acc_date_pay");
    const acc_email = this.getAttribute("data-acc_email");
    const acc_number_phone = this.getAttribute("data-acc_number_phone");
    const acc_user = this.getAttribute("data-acc_user");
    const acc_password = this.getAttribute("data-acc_password");

    inputdate(accdatepay, acc_date_pay);
    accnickname.value = acc_nickname;
    accprovider.value = acc_provider;
    accdatepay.value = acc_date_pay;
    accemail.value = acc_email;
    accnumberphone.value = acc_number_phone;
    accuser.value = acc_user;
    accpassword.value = acc_password;

    accnickname.onchange = function () {
      validatechanges(this.value, "accnickname", "update", acc_nickname);
    };
    accprovider.onchange = function () {
      validatechanges(this.value, "accprovider", "update", acc_provider);
    };
    $(accdatepay).on("apply.daterangepicker", function () {
      validatechanges(this.value, "accdatepay", "update", acc_date_pay);
    });
    $(accdatepay).on("cancel.daterangepicker", function () {
      validatechanges(this.value, "accdatepay", "update", acc_date_pay);
    });
    ["keydown", "paste", "drop"].forEach((event) =>
      accdatepay.addEventListener(event, (e) => e.preventDefault()),
    );
    accemail.onchange = function () {
      validatechanges(this.value, "accemail", "update", acc_email);
    };
    accnumberphone.onchange = function () {
      validatechanges(this.value, "accnumberphone", "update", acc_number_phone);
    };
    accuser.onchange = function () {
      validatechanges(this.value, "accuser", "update", acc_user);
    };
    accpassword.onchange = function () {
      validatechanges(this.value, "accpassword", "update", acc_password);
    };
    buttonDates.onclick = function () {
      inputdate(accdatepay);
    };

    modal.querySelector(".btn-close").onclick = function (event) {
      event.preventDefault();
      if (
        accnickname.value != acc_nickname ||
        accprovider.value != acc_provider ||
        accdatepay.value != acc_date_pay ||
        accemail.value != acc_email ||
        accpassword.value != acc_password ||
        accnumberphone.value != acc_number_phone ||
        accuser.value != acc_user
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

    modal.querySelector("#btnSubmit").onclick = function (clv) {
      clv.preventDefault();
      if (
        form &&
        form.checkValidity() &&
        (accemail.value || accnumberphone.value || accuser.value)
      ) {
        form.action = `/account/${acc_id}`;
        confirmAccount("update", form);
      } else {
        if (!accemail.value || !accnumberphone.value || !accuser.value) {
          accemail.setCustomValidity("este campo es requerido");
          accnumberphone.setCustomValidity("este campo es requerido");
          accuser.setCustomValidity("este campo es requerido");
        }
        form.reportValidity();
        accemail.setCustomValidity("");
        accnumberphone.setCustomValidity("");
        accuser.setCustomValidity("");
      }
    };
  };
});

function confirmAccount(action, form, id) {
  Swal.fire({
    title: ` ${action === "register" ? "¿Registar Cuenta?" : action === "update" ? "¿Actualizar Cuenta?" : "¿Cambiar estado de la cuenta?"}`,
    icon: action === "state" ? "warning" : "info",
    text:
      action === "state"
        ? "Recuerda, no debe haber ninguna venta activa con esta cuenta"
        : "",
    showCancelButton: true,
    confirmButtonColor: action != "state" ? "rgba(4,17,43,0.92)" : "#d33",
    confirmButtonText: "Sí, guardar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      action != "state"
        ? form.submit()
        : (window.location.href = "/account/state/" + id);
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
    colReorder: {
      columns: ":not(:last-child)",
    },
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
        targets: [0, 1, 2, 3, 4],
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
      if (search && search !== null) {
        this.api().search(search).draw();
        this.api().state.clear();
      }
    },
  });
});
// format para el input de telefono

document.querySelectorAll(".accphonenumber").forEach((tel) => {
  new Cleave(tel, {
    phone: true,
    phoneRegionCode: "CO",
  });
});

inputdate = (input, value) => {
  $(input).daterangepicker({
    singleDatePicker: true,
    autoUpdateInput: value ? true : false,
    opens: "center",
    startDate: value ? moment(value, "DD/MM/YYYY") : moment().startOf("day"),
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
      const hoy = value ? moment(value, "DD/MM/YYYY") : moment().startOf("day");
      const especiales = [
        hoy.clone().add(10, "days"),
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

  // $ (input).on("apply.daterangepicker", function (ev, picker) {
  //   $(this).val(
  //     picker.startDate.format("DD/MM/YYYY") +
  //       " - " +
  //       picker.endDate.format("DD/MM/YYYY"),
  //   );
  // });
  $(input).on("apply.daterangepicker", function (ev, picker) {
    $(this).val(picker.startDate.format("DD/MM/YYYY"));
  });
  $(input).on("cancel.daterangepicker", function () {
    $(this).val("");
  });
};

// ========================== GST. PERFILES
document.querySelectorAll(".dataProfiles").forEach((pro) => {
  pro.addEventListener("click", function () {
    document.getElementById("acc_nickname_modal").innerHTML = `
    ${this.getAttribute("data-acc_nickname")}
    `;
    document.getElementById("max_profile_account").innerHTML =
      `${this.getAttribute("data-acc_profiles")}`;

    document.getElementById("max_profile_platform").innerHTML =
      `${this.getAttribute("data-pla_max_profiles")}`;
  });
});

async function action(btn, type, acc_id, pro_id) {
  const form = btn.closest("form");

  if (type === "show") {
    // Código para mostrar el formulario (Flecha abajo)
    btn.closest(".content_profile").classList.add("d-none");
    btn
      .closest(".content_profiles")
      .querySelector(".content_form-profile")
      .classList.remove("d-none");
  } else if (type === "hide") {
    // Código para ocultar el formulario (Flecha arriba)
    const form_action = form.getAttribute("data-form_pro_id");
    const content_message = form.querySelector(".content_message");
    const proprofile = form.querySelector(".proprofile").value.trim();
    const propinprofile = form.querySelector(".propinprofile").value.trim();
    const prostate = form.querySelector(".prostate")?.value || "";
    if (form.checkValidity() && form_action == "new_profile") {
      try {
        const response = await fetch(`/create/profile/${acc_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            proprofile: proprofile,
            propin: propinprofile,
          }),
        });
        if (response.ok) {
          const result = await response.json();
          getProfile(acc_id);
        } else {
          const result = await response.json();
          console.log(result);
          throw new Error(result.error);
        }
      } catch (error) {
        console.log(error);
        setTimeout(() => {
          content_message.querySelector(".alert").classList.remove("show");
          setTimeout(
            () =>
              content_message.querySelector(".alert").classList.add("d-none"),
            150,
          );
        }, 3000);
        return (content_message.innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
              <div>
                ${String(error).replace("Error:", "")}
              </div>
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            `);
      }
    } else if (form.checkValidity() && form_action == "upd_profile" && pro_id) {
      try {
        const response = await fetch(`/update/profile/${pro_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            proprofile: proprofile,
            propin: propinprofile,
            prostate: prostate,
            acc_id: acc_id,
          }),
        });
        if (response.ok) {
          const result = await response.json();
          getProfile(acc_id);
        } else {
          const result = await response.json();
          console.log(result);
          throw new Error(result.error);
        }
      } catch (error) {
        console.log(error);
        setTimeout(() => {
          content_message.querySelector(".alert").classList.remove("show");
          setTimeout(
            () =>
              content_message.querySelector(".alert").classList.add("d-none"),
            150,
          );
        }, 3000);
        return (content_message.innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
              <div>
                ${String(error).replace("Error:", "")}
              </div>
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            `);
      }
    } else {
      btn
        .closest(".content_profiles")
        .querySelector(".content_form-profile")
        .classList.add("d-none");

      if (btn.closest(".content_profiles").querySelector(".content_profile")) {
        btn
          .closest(".content_profiles")
          .querySelector(".content_profile")
          .classList.remove("d-none");
      }

      if (btn.getAttribute("data-plus") == "true") {
        document.querySelector(".content_modal-profiles").innerHTML =
          `<div class="d-flex justify-content-center m-2">
          <i class="bi bi-plus-circle-fill plus_profile fs-3 text-primary" role="button" onclick="action(this, 'plus', '${acc_id}')"></i>
      </div>`;
      }
    }
  } else if (type === "delete") {
    try {
      const response = await fetch(`/delete/profile/${pro_id}`);
      if (response.ok) {
        const result = await response.json();
        getProfile(acc_id);
      } else {
        const result = await response.json();
        throw new Error(result.mensaje);
      }
    } catch (error) {
      return (content_message.innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
              <div>
                ${String(error).replace("Error:", "")}
              </div>
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            `);
    }
  } else if (type === "plus") {
    // Código para el botón de añadir perfil (+)
    btn.classList.add("d-none");
    document.querySelector(".content_modal-profiles").innerHTML = `
      <div class="content_profiles">
        <div class="col-12 p-3 border border-secondary-1 rounded content_form-profile bg-light">
          <form data-form_pro_id="new_profile">
            <div class="content_message"></div>
            <span class="d-flex justify-content-end gap-2">
              <i class="bi bi-chevron-up" role="button" data-plus="true" onclick="action(this, 'hide', '${acc_id}')"></i>
            </span>

            <div class="row g-2">
              <div class="form-floating col-6">
                <input type="text" name="proprofile" class="form-control proprofile shadow-sm" placeholder="Extra" required max-length="50">
                <label class="form-label">Perfil*</label>
              </div>
              <div class="form-floating col-6">
                <input type="text" name="propinprofile" class="form-control propinprofile shadow-sm" placeholder="0033 (opcional)">
                <label class="form-label">PIN</label>
              </div>
            </div>
            
          </form>
        </div>
      </div>`;
  } else {
    btn
      .closest(".content_profiles")
      .querySelector("#content_adition_profile").innerHTML = `
      <div class="content_profiles">
        <div class="col-12 p-3 border border-secondary-1 rounded content_form-profile">
          <form data-form_pro_id="new_profile">
            <div class="content_message"></div>
            <span class="d-flex justify-content-end gap-2">
              <i class="bi bi-chevron-up" role="button" onclick="action(this, 'hide', '${acc_id}')"></i>
            </span>

            <div class="row g-2">
              <div class="form-floating col-6">
                <input type="text" name="proprofile" class="form-control proprofile shadow-sm" placeholder="Extra" required max-length="50">
                <label class="form-label">Perfil*</label>
              </div>
              <div class="form-floating col-6">
                <input type="text" name="propinprofile" class="form-control propinprofile shadow-sm" placeholder="0033 (opcional)">
                <label class="form-label">PIN</label>
              </div>
            </div>
            
          </form>
        </div>
      </div>`;
  }
}

async function getProfile(acc_id) {
  document.querySelector(".content_modal-profiles").innerHTML = `
              <div class="d-flex justify-content-center m-2">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>`;
  const response = await fetch(`/get/profile/${acc_id}`);
  if (response.ok) {
    const profiles = await response.json();
    document.getElementById("max_profile_account").innerHTML =
      `${profiles.length}`;
    if (profiles.length === 0) {
      return (document.querySelector(".content_modal-profiles").innerHTML =
        `<div class="d-flex justify-content-center mx-auto">
          <i class="bi bi-plus-circle-fill plus_profile fs-3 text-primary" role="button" onclick="action(this, 'plus', '${acc_id}')"></i>
      </div>`);
    }

    document.querySelector(".content_modal-profiles").innerHTML = profiles
      .map((data) => {
        return ` 
      <div class="content_profiles">
        <div class="col-12 d-flex justify-content-between p-3 border border-secondary-1 rounded content_profile" role="button" ${data.pro_state == "disable" ? "disabled" : `onclick="action(this, 'show', '${acc_id}')"`} > 
          <small class="pro_profile_modal badge py-1 px-2 rounded-pill text-dark-emphasis bg-light shadow-sm text-truncate d-flex gap-1 align-items-center" style="max-width: 150px;">
              <i class="ti ti-tag fs-6"></i> 
              Perfil ${data.pro_profile}
          </small> 
          <small class="pro_pin_modal badge py-1 px-2 rounded-pill text-dark-emphasis bg-light shadow-sm text-truncate d-flex gap-1 align-items-center" style="max-width: 100px;">
              <i class="ti ti-lock fs-6"></i> ${data.pro_pin_profile != "" && data.pro_pin_profile != null ? data.pro_pin_profile : "Sin Pin"}
          </small> 
          <small class="pro_state_modal badge py-1 px-2 rounded-pill text-${data.pro_state == "enable" ? "primary-emphasis bg-primary-subtle" : data.pro_state == "pending" ? "warning-emphasis bg-warning-subtle" : "danger-emphasis bg-danger-subtle"} shadow-sm d-flex gap-1 align-items-center">${data.pro_state == "enable" ? "Disponible" : data.pro_state == "pending" ? "Pendiente" : "No disponible"}</small> 

          <span>
            <i class="ti ti-chevron-down show-modal" role="button" onclick="action(this, 'show', '${acc_id}')"></i>
          </span> 
        </div>

        <div class="col-12 p-3 border border-secondary-1 rounded d-none content_form-profile bg-light shadow-sm"> 
          <form  data-form_pro_id="upd_profile">
            <div class="content_message"></div>
              <span class="d-flex justify-content-end gap-2 mb-1">
                <i class="ti ti-trash fs-6" role="button" onclick="action(this, 'delete', '${acc_id}', '${data.pro_id}')"></i>
                <i class="ti ti-chevron-up fs-6 hide-modal" role="button" onclick="action(this, 'hide', '${acc_id}', '${data.pro_id}')"></i>
              </span> 
              <div class="row g-2">
                <div class="form-floating col-6 col-lg-4">
                    <input type="text" name="proprofile" class="form-control proprofile shadow-sm" placeholder="Extra" value="${data.pro_profile}" onchange="function(this)">
                    <label class="form-label">Perfil*</label>
                </div>

                <div class="form-floating col-6 col-lg-4">
                    <input type="text" name="propinprofile" class="form-control propinprofile shadow-sm" placeholder="0033 (opcional)" value="${data.pro_pin_profile}">
                    <label class="form-label">PIN</label>
                </div>

                <div class="form-floating col-12 col-lg-4">
                    <select class="form-select prostate shadow-sm" name="prostate" ${data.pro_state == "disable" ? "disabled" : ""}>
                        <option value="enable" ${data.pro_state == "enable" ? "selected" : ""}>Disponible</option>
                        <option value="pending" ${data.pro_state == "pending" ? "selected" : ""}>Pendiente</option>
                    </select>
                    <label class="form-label">Estado*</label>
                </div>
              </div>
          </form>
        </div>

        <div class="d-flex gap-2 my-2 ${profiles.length == document.getElementById("max_profile_platform").textContent && data.pro_id === profiles.at(-1).pro_id ? "d-none" : ""}">
          <div> 
            <button class="btn btn-outline-secondary btn-sm d-flex fw-bold text-nowrap" disabled>
              AND
            </button>
          </div>
          <div class="w-100">
            <hr class="text-seccondary-emphasis">
          </div>
          <div class="${profiles.length == document.getElementById("max_profile_platform").textContent ? "d-none" : document.getElementById("max_profile_platform").textContent}"> 
            <a class="text-decoration-none small text-dark-emphasis fw-bold text-nowrap d-flex align-items-center" type="button" onclick="action(this, 'add', '${acc_id}', '${data.pro_id}')">
              <i class="ti ti-plus"></i> Perfil
            </a>
          </div>
        </div>
        <div id="content_adition_profile" class="bg-light">
        </div>
      </div>
      `;
      })
      .join(``);
  } else {
    return (document.querySelector(".content_modal-profiles").innerHTML = `
    <div class="d-flex justify-content-center m-2">
      <small class="text-muted">Error al cargar los perfiles</small>
    </div>
    `);
  }
}

$(document).on("shown.bs.modal", ".modal", function () {
  const modal = $(this);
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
