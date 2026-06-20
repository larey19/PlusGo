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
    if (profiles.length === 0) {
      return (document.querySelector(".content_modal-profiles").innerHTML =
        `<div class="d-flex justify-content-center m-2">
          <i class="bi bi-plus-circle-fill plus_profile fs-3 text-primary" role="button" onclick="action(this, 'plus', '${acc_id}')"></i>
      </div>`);
    }
    document.getElementById("max_profile_account").innerHTML =
      `${profiles.length}`;

    document.querySelector(".content_modal-profiles").innerHTML = profiles
      .map((data) => {
        return ` 
      <div class="content_profiles">
        <div class="col-12 d-flex justify-content-between p-3 border border-secondary-1 rounded content_profile" role="button" ${data.pro_state == "disable" ? "disabled" : `onclick="action(this, 'show', '${acc_id}')"`} > 
          <small class="pro_profile_modal badge py-1 px-2 rounded-pill text-bg-light shadow-sm text-truncate" style="max-width: 150px;">
              <i class="bi bi-tag-fill"></i> 
              Perfil ${data.pro_profile}
          </small> 
          <small class="pro_pin_modal badge py-1 px-2 rounded-pill text-bg-light shadow-sm text-truncate" style="max-width: 100px;">
              <i class="bi bi-lock-fill"></i> ${data.pro_pin_profile != "" && data.pro_pin_profile != null ? data.pro_pin_profile : "Sin Pin"}
          </small> 
          <small class="pro_state_modal badge py-1 px-2 rounded-pill text-bg-${data.pro_state == "enable" ? "primary" : data.pro_state == "pending" ? "warning" : "danger"} shadow-sm">${data.pro_state == "enable" ? "Disponible" : data.pro_state == "pending" ? "Pendiente" : "No disponible"}</small> 

          <span>
            <i class="bi bi-chevron-down show-modal" role="button" onclick="action(this, 'show', '${acc_id}')"></i>
          </span> 
        </div>

        <div class="col-12 p-3 border border-secondary-1 rounded d-none content_form-profile bg-light shadow-sm"> 
          <form  data-form_pro_id="upd_profile">
            <div class="content_message"></div>
              <span class="d-flex justify-content-end gap-2 mb-1">
                <i class="bi bi-trash-fill" role="button" onclick="action(this, 'delete', '${acc_id}', '${data.pro_id}')"></i>
                <i class="bi bi-chevron-up hide-modal" role="button" onclick="action(this, 'hide', '${acc_id}', '${data.pro_id}')"></i>
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

        <div class="d-flex gap-2 my-2 ${data.pro_id === profiles.at(-1).pro_id ? 'd-none' : ''}">
          <div> 
            <button class="btn btn-outline-secondary btn-sm d-flex fw-bold text-nowrap" disabled>
              AND
            </button>
          </div>
          <div class="w-100">
            <hr class="text-seccondary-emphasis">
          </div>
          <div class="${profiles.length == document.getElementById('max_profile_platform').textContent ? 'd-none' : document.getElementById('max_profile_platform').textContent}"> 
            <button class="btn btn-sm d-flex fw-bold text-nowrap" type="button" onclick="action(this, 'add', '${acc_id}', '${data.pro_id}')">
              + Perfil
            </button>
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
