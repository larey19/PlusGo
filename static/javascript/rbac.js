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
// ==================================================== ROLES
// MODAL DE PERMISOS DE ROL
function rolpermissions(button) {
  const rol_name = button.getAttribute("data-rol_name");
  const permission = button.getAttribute("data-permission");
  const modal = document.getElementById("datarolpermissions");

  modal.querySelector("h5").innerHTML = `Permisos del ${rol_name}`;
  JSON.parse(permission).forEach((per) => {
    const checkbox = modal.querySelector(`[id="permission-${per.per_name}"]`);

    if (checkbox) {
      checkbox.checked = per.control === 1;
    }
  });
}
// MODAL DE REGISTRO DE ROL
document.querySelectorAll(".createRolPermissions").forEach((button) => {
  button.addEventListener("click", function () {
    // console.log(this)
    let permission = [];
    const modal = document.getElementById("createRolPermissionsModal");
    const form = modal.querySelector("form");
    const rol_name = form.querySelector(".rolename");
    const next = modal.querySelectorAll(".next");
    const back = modal.querySelectorAll(".back");
    const submitForm = form.querySelector(".validateRolPer");

    form.action = "/rbac/roles/permissions";
    next.forEach((nxt) => {
      nxt.onclick = () => {
        if (form && form.reportValidity()) {
          modal
            .querySelector("#progress1")
            .classList.replace("bi-circle-fill", "bi-check-circle");
          modal
            .querySelector("#progress2")
            .classList.replace("bi-circle", "bi-circle-fill");
          modal.querySelector(".row").classList.add("d-none");
          modal.querySelector(".card-body").classList.remove("d-none");
          modal.querySelector(".btnRolPer").classList.remove("d-none");
          modal.querySelector("h5").innerHTML =
            `Asignar Permisos a ${rol_name.value}`;
        }
      };
    });
    back.forEach((bck) => {
      bck.onclick = () => {
        modal.querySelector("h5").innerHTML = `Registrar Rol`;
        modal.querySelector(".card-body").classList.add("d-none");
        modal.querySelector(".btnRolPer").classList.add("d-none");
        modal.querySelector(".row").classList.remove("d-none");
        modal
          .querySelector("#progress1")
          .classList.replace("bi-check-circle", "bi-circle-fill");
        modal
          .querySelector("#progress2")
          .classList.replace("bi-circle-fill", "bi-circle");
      };
    });
    submitForm.onclick = function (event) {
      event.preventDefault();
      submitForm.disabled = true;
      if (form && form.checkValidity()) {
        form.querySelectorAll(".form-check-input").forEach((checkbox) => {
          if (checkbox.checked) {
            permission.push(checkbox.value);
          }
        });
        if (permission.length > 0) {
          Swal.fire({
            title: "¿Registrar Rol?",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "rgba(4,17,43,0.92)",
            confirmButtonText: "Sí, guardar",
            cancelButtonText: "Cancelar",
          }).then((result) => {
            if (result.isConfirmed) {
              form.submit();
            } else {
              submitForm.disabled = false;
            }
          });
        } else {
          flashy("No hay permisos seleccionados", {
            Animation: "bounce",
            closable: false,
            icon: `<i class="bi bi-exclamation-triangle-fill"></i>`,
          });
        }
      }
    };
  });
});
// MODAL DE EDICION DE ROL
document.querySelectorAll(".datarolper").forEach((rp) => {
  rp.addEventListener("click", function () {
    let permission = []; // permisos seleccionados
    let permissionRol = []; // se cargan los permisos que tiene el rol
    const modal = document.getElementById("updateRolPermissionsModal");
    const form = modal.querySelector("form");
    const rol_name = form.querySelector(".rolename");
    const rolname = this.getAttribute("data-rol_name");
    const rolpermissions = this.getAttribute("data-permission");
    const rolid = this.getAttribute("data-rol_id");
    const next = modal.querySelectorAll(".next");
    const back = modal.querySelectorAll(".back");
    const submitForm = form.querySelector(".validateRolPer");
    const closeModal = modal.querySelector(".btn-close");
    form.action = `/rbac/roles/permissions/${rolid}`;

    next.forEach((nxt) => {
      // oculta la primera seccion y hace visible la segunda
      nxt.onclick = () => {
        if (form && form.reportValidity()) {
          modal
            .querySelector("#progress1")
            .classList.replace("bi-circle-fill", "bi-check-circle");
          modal
            .querySelector("#progress2")
            .classList.replace("bi-circle", "bi-circle-fill");
          modal.querySelector(".row").classList.add("d-none");
          modal.querySelector(".card-body").classList.remove("d-none");
          modal.querySelector("h5").innerHTML =
            `Asignar Permisos a ${rol_name.value}`;
          // console.log(permission, permissionRol);
          // modal.querySelector(".btnRolPer").classList.remove("d-none");
          validate();
        }
      };
    });
    back.forEach((bck) => {
      // oculta la segunda seccion y hace visible la primera
      bck.onclick = () => {
        modal.querySelector("h5").innerHTML = `Editar Rol ${rolname}`;
        modal.querySelector(".card-body").classList.add("d-none");
        console.log(modal);
        modal.querySelector(".btnRolPer").classList.add("d-none");
        modal.querySelector(".row").classList.remove("d-none");
        modal
          .querySelector("#progress1")
          .classList.replace("bi-check-circle", "bi-circle-fill");
        modal
          .querySelector("#progress2")
          .classList.replace("bi-circle-fill", "bi-circle");
      };
    });

    submitForm.onclick = function (event) {
      console.log(this);

      event.preventDefault();
      submitForm.disabled = true;
      if (form && form.checkValidity()) {
        if (permission.length > 0) {
          Swal.fire({
            title: "¿Actualizar Rol?",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "rgba(4,17,43,0.92)",
            confirmButtonText: "Sí, guardar",
            cancelButtonText: "Cancelar",
          }).then((result) => {
            if (result.isConfirmed) {
              form.submit();
            } else {
              submitForm.disabled = false;
            }
          });
        } else {
          flashy("No hay permisos seleccionados", {
            Animation: "bounce",
            closable: false,
            icon: `<i class="bi bi-exclamation-triangle-fill"></i>`,
          });
        }
      }
    };
    closeModal.onclick = function (event) {
      event.preventDefault();
      if (
        permission.length != permissionRol.length ||
        !permission.every((per) => permissionRol.includes(per)) ||
        rolname != rol_name.value
      ) {
        // console.log("mondaa", permission, permissionRol);
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
            // oculta la segunda seccion y hace visible la primera
            modal.querySelector("h5").innerHTML = `Editar Rol ${rolname}`;
            modal.querySelector(".card-body").classList.add("d-none");
            modal.querySelector(".btnRolPer").classList.add("d-none");
            modal.querySelector(".row").classList.remove("d-none");
            modal
              .querySelector("#progress1")
              .classList.replace("bi-check-circle", "bi-circle-fill");
            modal
              .querySelector("#progress2")
              .classList.replace("bi-circle-fill", "bi-circle");
          }
          // console.log("asi tannn", permission, permissionRol);
        });
      } else {
        // console.log("todo igual", permission, permissionRol);
        bootstrap.Modal.getInstance(modal).hide();
      }
    };

    // CARGAMOS LA INFO DEL ROL A LA MODAL
    modal.querySelector("h5").innerHTML = `Actualizar ${rolname}`;
    rol_name.value = rolname;
    JSON.parse(rolpermissions).forEach((per) => {
      const checkbox = modal.querySelector(`[id="permission-${per.per_name}"]`);
      if (checkbox) {
        checkbox.checked = per.control === 1;
        if (checkbox.checked) {
          permissionRol.push(checkbox.value);
        }
      }
    });

    form.querySelectorAll(".form-check-input").forEach((checkbox) => {
      if (checkbox.checked) {
        permission.push(checkbox.value);
      }
      checkbox.onchange = function () {
        if (checkbox.checked) {
          permission.push(checkbox.value);
          validate();
        } else {
          const eliminar = permission.findIndex((item) => item == this.value);
          if (eliminar !== -1) {
            permission.splice(eliminar, 1);
          }
          validate();
        }
      };
    });
    function validate() {
      if (
        permission.length != permissionRol.length ||
        !permission.every((per) => permissionRol.includes(per)) ||
        rolname != rol_name.value
      ) {
        modal.querySelector(".btnRolPer").classList.remove("d-none");
      } else {
        modal.querySelector(".btnRolPer").classList.add("d-none");
      }
    }
  });
});

//=========================================== CONFIRMACIONES

function validateUser(button, event, action, user_id) {
  event.preventDefault();
  form = button.closest(
    action === "create" ? "#formUserCreate" : "#formuserupdate",
  );
  form.action = action === "create" ? `/rbac/user` : `/rbac/user/${user_id}`;
  console.log(button);

  button.disabled = true;
  if (form && form.checkValidity()) {
    Swal.fire({
      title:
        action === "create" ? "¿Registrar Usuario?" : "¿Actualizar Usuario?",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "rgba(4,17,43,0.92)",
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        form.submit();
      } else {
        button.disabled = false;
      }
    });
  } else {
    form.reportValidity();
  }
}

function validatechanges(inputValue, input, action) {
  if (action == "create") {
    const modal = document.getElementById("createUserModal");

    let username = false;
    let userlastname = false;
    let useruser = false;
    let usernumberphone = false;
    let rolid = false;

    modal.querySelector(".btnuser").classList.remove("d-none");
    if (input === "username") {
      if (!inputValue) {
        username = false;
      } else {
        username = true;
      }
    } else if (input === "userlastname") {
      if (!inputValue) {
        userlastname = false;
      } else {
        userlastname = true;
      }
    } else if (input === "useruser") {
      if (!inputValue) {
        useruser = false;
      } else {
        useruser = true;
      }
    } else if (input === "usernumberphone") {
      if (!inputValue) {
        usernumberphone = false;
      } else {
        usernumberphone = true;
      }
    } else {
      if (!inputValue) {
        rolid = false;
      } else {
        rolid = true;
      }
    }
    console.log(inputValue, input);
    // console.log(username, userlastname, useruser, usernumberphone, rolid);
    if (
      username === false &&
      userlastname === false &&
      useruser === false &&
      usernumberphone === false &&
      rolid === false
    ) {
      modal.querySelector(".btnuser").classList.add("d-none");
    }
  } else {
    const modal = document.getElementById("editUserModal");

    let username = false;
    let userlastname = false;
    let useruser = false;
    let usernumberphone = false;
    let rolid = false;

    modal.querySelector(".btnuser").classList.remove("d-none");
    const user_name = document
      .querySelector(".datauser")
      .getAttribute("data-user_name");
    const user_lastname = document
      .querySelector(".datauser")
      .getAttribute("data-user_lastname");
    const user_user = document
      .querySelector(".datauser")
      .getAttribute("data-user_user");
    const user_phone_number = document
      .querySelector(".datauser")
      .getAttribute("data-user_phone_number");
    const rol_id = document
      .querySelector(".datauser")
      .getAttribute("data-rol_id");

    if (input === "username") {
      if (user_name === inputValue) {
        username = false;
      } else {
        username = true;
      }
    } else if (input === "userlastname") {
      if (user_lastname === inputValue) {
        userlastname = false;
      } else {
        userlastname = true;
      }
    } else if (input === "useruser") {
      if (user_user === inputValue) {
        useruser = false;
      } else {
        useruser = true;
      }
    } else if (input === "usernumberphone") {
      if (user_phone_number === inputValue) {
        usernumberphone = false;
      } else {
        usernumberphone = true;
      }
    } else {
      if (rol_id === inputValue) {
        rolid = false;
      } else {
        rolid = true;
      }
    }

    // console.log(username, userlastname, useruser, usernumberphone, rolid);
    // console.log(user_name, user_lastname, user_user, user_phone_number, rol_id);

    if (
      username === false &&
      userlastname === false &&
      useruser === false &&
      usernumberphone === false &&
      rolid === false
    ) {
      modal.querySelector(".btnuser").classList.add("d-none");
    }
  }
}

// ============================== MODAL DE EDICION DE USUARIO
document.querySelectorAll(".datauser").forEach((user) => {
  user.addEventListener("click", function () {
    const modal = document.getElementById("editUserModal");

    const UserName = modal.querySelector("#username");
    const UserNameText = modal.querySelector("#usernametext");
    const UserNameData = modal.querySelector(".usernamedata");
    const UserNameInput = modal.querySelector(".usernameinput");
    const UserNameInputClose = modal.querySelector(".usernameinputclose");

    const UserLastname = modal.querySelector("#userlastname");
    const UserLastnameText = modal.querySelector("#userlastnametext");
    const UserLastnameData = modal.querySelector(".userlastnamedata");
    const UserLastnameInput = modal.querySelector(".userlastnameinput");
    const UserLastnameInputClose = modal.querySelector(
      ".userlastnameinputclose",
    );

    const UserUser = modal.querySelector("#useruser");
    const UserUserText = modal.querySelector("#userusertext");
    const UserUserData = modal.querySelector(".useruserdata");
    const UserUserInput = modal.querySelector(".useruserinput");
    const UserUserInputClose = modal.querySelector(".useruserinputclose");

    const UserNumberPhone = modal.querySelector("#usernumberphone");
    const UserNumberPhoneText = modal.querySelector("#usernumberphonetext");
    const UserNumberPhoneData = modal.querySelector(".usernumberphonedata");
    const UserNumberPhoneInput = modal.querySelector(".usernumberphoneinput");
    const UserNumberPhoneInputClose = modal.querySelector(
      ".usernumberphoneinputclose",
    );

    const Rol = modal.querySelector("#rolid");
    const RolText = modal.querySelector("#rolnametext");
    const RolData = modal.querySelector(".rolnamedata");
    const RolInput = modal.querySelector(".rolnameinput");
    const RolInputClose = modal.querySelector(".rolnameinputclose");

    const user_id = this.getAttribute("data-user_id");
    const user_name = this.getAttribute("data-user_name");
    const user_lastname = this.getAttribute("data-user_lastname");
    const user_user = this.getAttribute("data-user_user");
    const user_phone_number = this.getAttribute("data-user_phone_number");
    const rol_name = this.getAttribute("data-rol_name");
    const rol_id = this.getAttribute("data-rol_id");

    const leyenda = modal.querySelector(".leyendRole");
    const icon = modal.querySelector("#iconUser");
    const bg = modal.querySelector("#bgUser");

    // nombre
    UserNameText.innerHTML = `${user_name} <i class="bi bi-chevron-right"></i>`;

    UserName.value = user_name;

    UserNameData.onclick = () => {
      UserNameData.classList.add("d-none");
      UserNameInput.classList.remove("d-none");
    };

    UserNameInputClose.onclick = () => {
      if (UserName.checkValidity()) {
        UserNameInput.classList.add("d-none");
        UserNameData.classList.remove("d-none");
        modal.querySelector("#usernametext").innerHTML =
          `${UserName.value} <i class="bi bi-chevron-right"></i>`;
        validatechanges(UserName.value, "username");
      } else {
        UserName.reportValidity();
      }
    };

    // apellido
    UserLastnameText.innerHTML = `${user_lastname} <i class="bi bi-chevron-right"></i>`;

    UserLastname.value = user_lastname;

    UserLastnameData.onclick = () => {
      UserLastnameData.classList.add("d-none");
      UserLastnameInput.classList.remove("d-none");
    };

    UserLastnameInputClose.onclick = () => {
      UserLastnameInput.classList.add("d-none");
      UserLastnameData.classList.remove("d-none");
      UserLastnameText.innerHTML = `${UserLastname.value.length > 0 ? UserLastname.value : "Sin Apellido"} <i class="bi bi-chevron-right"></i>`;
      validatechanges(UserLastname.value, "userlastname");
    };

    // usuario
    UserUserText.innerHTML = `${user_user} <i class="bi bi-chevron-right"></i>`;

    UserUser.value = user_user;

    UserUserData.onclick = () => {
      UserUserData.classList.add("d-none");
      UserUserInput.classList.remove("d-none");
    };
    UserUserInputClose.onclick = () => {
      if (UserUser.checkValidity()) {
        UserUserInput.classList.add("d-none");
        UserUserData.classList.remove("d-none");
        UserUserText.innerHTML = `${UserUser.value} <i class="bi bi-chevron-right"></i>`;
        validatechanges(UserUser.value, "useruser");
      } else {
        UserUser.reportValidity();
      }
    };

    // celular numero
    let partes = user_phone_number.match(/^(\d{3})(\d{3})(\d{4})$/);
    UserNumberPhoneText.innerHTML = `(${partes[1]}) ${partes[2]}-${partes[3]} <i class="bi bi-chevron-right"></i>`;

    UserNumberPhone.value = user_phone_number;

    UserNumberPhoneData.onclick = () => {
      UserNumberPhoneData.classList.add("d-none");
      UserNumberPhoneInput.classList.remove("d-none");
    };

    UserNumberPhoneInputClose.onclick = () => {
      let partes = UserNumberPhone.value
        .replace(" ", "")
        .match(/^(\d{3})(\d{3})(\d{4})$/);
      if (partes) {
        UserNumberPhoneInput.classList.add("d-none");
        UserNumberPhoneData.classList.remove("d-none");
        UserNumberPhoneText.innerHTML = `(${partes[1]}) ${partes[2]}-${partes[3]} <i class="bi bi-chevron-right"></i>`;
        validatechanges(
          UserNumberPhone.value.replace(" ", ""),
          "usernumberphone",
        );
      } else {
        UserNumberPhone.setCustomValidity("El telefono es requerido");
        UserNumberPhone.reportValidity();
      }
    };

    new Cleave(UserNumberPhone, {
      phone: true,
      phoneRegionCode: "CO",
    });
    // nombre del rol
    icon.classList.remove(
      "text-primary-emphasis",
      "text-info-emphasis",
      "text-success-emphasis",
    );
    bg.classList.remove(
      "bg-primary-subtle",
      "bg-info-subtle",
      "bg-success-subtle",
    );
    leyenda.classList.remove(
      "text-primary-emphasis",
      "text-info-emphasis",
      "text-success-emphasis",
    );
    leyenda.innerHTML = rol_name;
    if (rol_name.toLowerCase() === "gerente") {
      icon.classList.add("text-primary-emphasis");
      leyenda.classList.add("text-primary-emphasis");
      bg.classList.add("bg-primary-subtle");
    } else if (rol_name.toLowerCase() === "admin") {
      icon.classList.add("text-info-emphasis");
      leyenda.classList.add("text-info-emphasis");
      bg.classList.add("bg-info-subtle");
    } else {
      icon.classList.add("text-success-emphasis");
      leyenda.classList.add("text-success-emphasis");
      bg.classList.add("bg-success-subtle");
    }

    if (rol_name.toLowerCase() != "gerente") {
      Rol.remove("Gerente");
      RolText.innerHTML = `${rol_name} <i class="bi bi-chevron-right"></i>`;
      RolData.role = "button";
      RolData.onclick = () => {
        RolData.classList.add("d-none");
        RolInput.classList.remove("d-none");
      };
      RolInputClose.onclick = () => {
        // console.log(Rol, Rol.textContent, Rol.value);
        if (Rol.checkValidity()) {
          RolInput.classList.add("d-none");
          RolData.classList.remove("d-none");
        } else {
          Rol.reportValidity();
        }
      };
      Rol.onchange = function () {
        Rol.value = this.value;
        icon.classList.remove(
          "text-primary-emphasis",
          "text-info-emphasis",
          "text-success-emphasis",
        );
        bg.classList.remove(
          "bg-primary-subtle",
          "bg-info-subtle",
          "bg-success-subtle",
        );
        leyenda.classList.remove(
          "text-primary-emphasis",
          "text-info-emphasis",
          "text-success-emphasis",
        );
        // leyenda.innerHTML = this.options[this.selectedIndex].textContent;
        if (
          this.options[this.selectedIndex].textContent.toLowerCase() ===
          "gerente"
        ) {
          leyenda.classList.add("text-primary-emphasis");
          icon.classList.add("text-primary-emphasis");
          bg.classList.add("bg-primary-subtle");
        } else if (
          this.options[this.selectedIndex].textContent.toLowerCase() === "admin"
        ) {
          leyenda.classList.add("text-info-emphasis");
          icon.classList.add("text-info-emphasis");
          bg.classList.add("bg-info-subtle");
        } else {
          leyenda.classList.add("text-success-emphasis");
          icon.classList.add("text-success-emphasis");
          bg.classList.add("bg-success-subtle");
        }

        RolText.innerHTML = `${this.options[this.selectedIndex].textContent} <i class="bi bi-chevron-right"></i>`;
        leyenda.innerHTML = this.options[this.selectedIndex].textContent;
        validatechanges(this.value, "rolname");
      };
    } else {
      RolText.innerHTML = `${rol_name}`;

      Rol.add(new Option("Gerente", rol_id, false, true));
    }

    modal.querySelector(".validateUser").onclick = function (e) {
      validateUser(this, e, "", user_id);
    };

    modal.querySelector(".btn-close").onclick = () => {
      if (!modal.querySelector(".btnuser").classList.contains("d-none")) {
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
            modal.querySelector(".btnuser").classList.add("d-none");
          }
        });
      } else {
        bootstrap.Modal.getInstance(modal).hide();
      }
    };
  });
});

// ============================== MODAL DE REGISTRO DE USUARIO
document.querySelectorAll(".createUser").forEach((user) => {
  user.addEventListener("click", function () {
    const modal = document.getElementById("createUserModal");

    const UserName = modal.querySelector("#username");
    const UserNameText = modal.querySelector("#usernametext");
    const UserNameData = modal.querySelector(".usernamedata");
    const UserNameInput = modal.querySelector(".usernameinput");
    const UserNameInputClose = modal.querySelector(".usernameinputclose");

    const UserLastname = modal.querySelector("#userlastname");
    const UserLastnameText = modal.querySelector("#userlastnametext");
    const UserLastnameData = modal.querySelector(".userlastnamedata");
    const UserLastnameInput = modal.querySelector(".userlastnameinput");
    const UserLastnameInputClose = modal.querySelector(
      ".userlastnameinputclose",
    );

    const UserUser = modal.querySelector("#useruser");
    const UserUserText = modal.querySelector("#userusertext");
    const UserUserData = modal.querySelector(".useruserdata");
    const UserUserInput = modal.querySelector(".useruserinput");
    const UserUserInputClose = modal.querySelector(".useruserinputclose");

    const UserNumberPhone = modal.querySelector("#usernumberphone");
    const UserNumberPhoneText = modal.querySelector("#usernumberphonetext");
    const UserNumberPhoneData = modal.querySelector(".usernumberphonedata");
    const UserNumberPhoneInput = modal.querySelector(".usernumberphoneinput");
    const UserNumberPhoneInputClose = modal.querySelector(
      ".usernumberphoneinputclose",
    );

    const Rol = modal.querySelector("#rolid");
    const RolText = modal.querySelector("#rolnametext");
    const RolData = modal.querySelector(".rolnamedata");
    const RolInput = modal.querySelector(".rolnameinput");
    const RolInputClose = modal.querySelector(".rolnameinputclose");
    // nombre

    UserNameData.onclick = () => {
      UserNameData.classList.add("d-none");
      UserNameInput.classList.remove("d-none");
    };

    UserNameInputClose.onclick = () => {
      if (UserName.checkValidity()) {
        UserNameInput.classList.add("d-none");
        UserNameData.classList.remove("d-none");
        modal.querySelector("#usernametext").innerHTML =
          `${UserName.value} <i class="bi bi-chevron-right"></i>`;
        validatechanges(UserName.value, "username", "create");
      } else {
        UserName.reportValidity();
      }
    };

    // apellido
    UserLastnameData.onclick = () => {
      UserLastnameData.classList.add("d-none");
      UserLastnameInput.classList.remove("d-none");
    };

    UserLastnameInputClose.onclick = () => {
      UserLastnameInput.classList.add("d-none");
      UserLastnameData.classList.remove("d-none");
      UserLastnameText.innerHTML = `${UserLastname.value.length > 0 ? UserLastname.value : "Sin Apellido"} <i class="bi bi-chevron-right"></i>`;
      validatechanges(UserLastname.value, "userlastname", "create");
    };

    // usuario

    UserUserData.onclick = () => {
      UserUserData.classList.add("d-none");
      UserUserInput.classList.remove("d-none");
    };
    UserUserInputClose.onclick = () => {
      if (UserUser.checkValidity()) {
        UserUserInput.classList.add("d-none");
        UserUserData.classList.remove("d-none");
        UserUserText.innerHTML = `${UserUser.value} <i class="bi bi-chevron-right"></i>`;
        validatechanges(UserUser.value, "useruser", "create");
      } else {
        UserUser.reportValidity();
      }
    };

    // celular numero

    UserNumberPhoneData.onclick = () => {
      UserNumberPhoneData.classList.add("d-none");
      UserNumberPhoneInput.classList.remove("d-none");
    };

    UserNumberPhoneInputClose.onclick = () => {
      let partes = UserNumberPhone.value
        .replace(" ", "")
        .match(/^(\d{3})(\d{3})(\d{4})$/);
      if (partes) {
        UserNumberPhoneInput.classList.add("d-none");
        UserNumberPhoneData.classList.remove("d-none");
        UserNumberPhoneText.innerHTML = `(${partes[1]}) ${partes[2]}-${partes[3]} <i class="bi bi-chevron-right"></i>`;
        validatechanges(
          UserNumberPhone.value.replace(" ", ""),
          "usernumberphone",
          "create",
        );
      } else {
        UserNumberPhone.setCustomValidity("El telefono es requerido");
        UserNumberPhone.reportValidity();
      }
    };

    new Cleave(UserNumberPhone, {
      phone: true,
      phoneRegionCode: "CO",
    });
    // nombre del rol

    Rol.value = "";
    RolData.role = "button";

    RolData.onclick = () => {
      RolData.classList.add("d-none");
      RolInput.classList.remove("d-none");
    };
    RolInputClose.onclick = () => {
      console.log(Rol, Rol.textContent, Rol.value);
      if (Rol.checkValidity()) {
        RolInput.classList.add("d-none");
        RolData.classList.remove("d-none");
      } else {
        Rol.reportValidity();
      }
    };

    Rol.onchange = function () {
      const leyenda = modal.querySelector(".leyendRole");
      const icon = modal.querySelector("#iconUser");
      const bg = modal.querySelector("#bgUser");
      Rol.value = this.value;
      icon.classList.remove(
        "text-primary-emphasis",
        "text-info-emphasis",
        "text-success-emphasis",
      );
      bg.classList.remove(
        "bg-primary-subtle",
        "bg-info-subtle",
        "bg-success-subtle",
      );
      leyenda.classList.remove(
        "text-primary-emphasis",
        "text-info-emphasis",
        "text-success-emphasis",
      );
      leyenda.innerHTML = this.options[this.selectedIndex].textContent;
      if (
        this.options[this.selectedIndex].textContent.toLowerCase() === "gerente"
      ) {
        leyenda.classList.add("text-primary-emphasis");
        icon.classList.add("text-primary-emphasis");
        bg.classList.add("bg-primary-subtle");
      } else if (
        this.options[this.selectedIndex].textContent.toLowerCase() === "admin"
      ) {
        leyenda.classList.add("text-info-emphasis");
        icon.classList.add("text-info-emphasis");
        bg.classList.add("bg-info-subtle");
      } else {
        leyenda.classList.add("text-success-emphasis");
        icon.classList.add("text-success-emphasis");
        bg.classList.add("bg-success-subtle");
      }

      RolText.innerHTML = `${this.options[this.selectedIndex].textContent} <i class="bi bi-chevron-right"></i>`;
      leyenda.innerHTML = this.options[this.selectedIndex].textContent;
      validatechanges(this.value, "rolname", "create");
    };

    modal.querySelector(".validateUser").onclick = function (e) {
      validateUser(this, e, "create");
    };
  });
});

// ============================== PERMISOS DE USARIO

function userrolpermissions(button) {
  const user_name = button.getAttribute("data-user_name");
  const user_lastname = button.getAttribute("data-user_lastname");

  const rol_name = button.getAttribute("data-rol_name");
  const permission = button.getAttribute("data-permission");

  const modal = document.getElementById("datapermissionsuserrol");

  modal.querySelector("h5").innerHTML =
    `Permisos del ${rol_name} ${user_name} ${user_lastname}`;
  JSON.parse(permission).forEach((per) => {
    const checkbox = modal.querySelector(`[id="permission-${per.per_name}"]`);
    if (checkbox) {
      checkbox.checked = per.control === 1;
    }
  });
}

// COMPLEMENTOS USUARIO

$(".modal").on("shown.bs.modal", function () {
  $(this)
    .find(".select-responsive")
    .select2({
      theme: "bootstrap-5",
      width: "100%",
      placeholder: "Seleccione Rol",
      allowClear: true,
      language: {
        noResults: function () {
          return "No se encontró el rol";
        },
      },
    });
});

document.querySelectorAll(".popover-dismiss").forEach((pop) => {
  new bootstrap.Popover(pop, {
    trigger: "click",
    html: true,
    // title: "Preview Usuario",
    content: function () {
      let user_name = this.getAttribute("data-user_name");
      let user_lastname = this.getAttribute("data-user_lastname");
      let user_user = this.getAttribute("data-user_user");
      let user_phone_number = this.getAttribute("data-user_phone_number")
        .replace(" ", "")
        .match(/^(\d{3})(\d{3})(\d{4})$/);
      let rol_name = this.getAttribute("data-rol_name");

      return `
      <div class="d-flex justify-content-center align-items-center gap-2">
        <div>
          <div class="rounded-circle shadow-sm p-2 d-flex justify-content-center align-items-center text-light fw-bolder text-uppercase fs-2 datauser ${rol_name.toLowerCase() == "gerente" ? "text-primary-emphasis bg-primary-subtle" : rol_name.toLowerCase() == "admin" ? "text-info-emphasis bg-info-subtle" : "text-success-emphasis bg-success-subtle"}">
            <i class="bi bi-person-fill fs-1 px-2"></i>
          </div>
        </div>

        <div class="d-flex flex-column">
          <h6 class="fw-bold text-nowrap text-truncate ${rol_name.toLowerCase() == "gerente" ? "text-primary-emphasis" : rol_name.toLowerCase() == "admin" ? "text-info-emphasis" : "text-success-emphasis"} text-opacity-75 m-0">
            ${user_name && user_lastname ? user_name + " " + user_lastname : user_name}
          </h6>

          <div class="fw-medium text-nowrap text-truncate text-black text-opacity-75 m-0 d-flex justify-content-between gap-2">
            <small class="fw-bold text-black text-opacity-75">
            Usuario:
            </small>
            <small>
            ${user_user}
            </small>
          </div>

          <div class="fw-medium text-nowrap text-truncate text-black text-opacity-75 m-0 d-flex justify-content-between gap-2">
            <small class="fw-bold text-black text-opacity-75">
            Rol:
            </small>
            <small>
            ${rol_name}
            </small>
          </div>

          <div class="fw-medium text-nowrap text-truncate text-black text-opacity-75 m-0 d-flex justify-content-center gap-2">
            <small>
            (${user_phone_number[1]}) ${user_phone_number[2]}-${user_phone_number[3]} 
            </small>
          </div>
        </div>
      </div>
    `;
    },
  });
});
