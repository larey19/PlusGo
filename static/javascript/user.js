// =================CONFIRMACION CIERRE SESSION
function confirmLogout() {
  Swal.fire({
    title: "¿Cerrar Sesion?",
    showCancelButton: true,
    confirmButtonColor: "rgba(4,17,43,0.92)",
    confirmButtonText: "Sí, continuar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "/logout";
    }
  });
}

//=========================================== CONFIRMACIONES

function validatePassword(button, event, user_id) {
  event.preventDefault();
  form = button.closest("#formpassword");
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
      text: "Contraseñas no coinciden",
    });
  } else if (form && form.checkValidity()) {
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

// ==================================== SECCION DE INFORMACION

let username = false;
let userlastname = false;
let useruser = false;
let usernumberphone = false;
// logica de mostrar boton
function validatechanges(inputValue, input, value) {
  document.querySelector(".btnuser").classList.remove("d-none");

  if (input === "username") {
    if (value === inputValue) {
      username = false;
    } else {
      username = true;
    }
  } else if (input === "userlastname") {
    if (value === inputValue) {
      userlastname = false;
    } else {
      userlastname = true;
    }
  } else if (input === "useruser") {
    if (value === inputValue) {
      useruser = false;
    } else {
      useruser = true;
    }
  } else {
    if (value === inputValue) {
      usernumberphone = false;
    } else {
      usernumberphone = true;
    }
  }
  console.log(
    username === false,
    userlastname === false,
    useruser === false,
    usernumberphone === false,
  );

  if (
    username === false &&
    userlastname === false &&
    useruser === false &&
    usernumberphone === false
  ) {
    document.querySelector(".btnuser").classList.add("d-none");
  }
}

document.querySelectorAll(".getUser").forEach((btn) => {
  btn.onclick = function () {
    const user_name = this.getAttribute("data-user_name");
    const user_lastname = this.getAttribute("data-user_lastname");
    const user_user = this.getAttribute("data-user_user");
    const user_number_phone = this.getAttribute("data-user_number_phone");

    const UserName = document.querySelector("#username");
    const UserNameText = document.querySelector("#usernametext");
    const UserNameData = document.querySelector(".usernamedata");
    const UserNameInput = document.querySelector(".usernameinput");
    const UserNameInputClose = document.querySelector(".usernameinputclose");

    const UserLastname = document.querySelector("#userlastname");
    const UserLastnameText = document.querySelector("#userlastnametext");
    const UserLastnameData = document.querySelector(".userlastnamedata");
    const UserLastnameInput = document.querySelector(".userlastnameinput");
    const UserLastnameInputClose = document.querySelector(
      ".userlastnameinputclose",
    );

    const UserUser = document.querySelector("#useruser");
    const UserUserText = document.querySelector("#userusertext");
    const UserUserData = document.querySelector(".useruserdata");
    const UserUserInput = document.querySelector(".useruserinput");
    const UserUserInputClose = document.querySelector(".useruserinputclose");

    const UserNumberPhone = document.querySelector("#usernumberphone");
    const UserNumberPhoneText = document.querySelector("#usernumberphonetext");
    const UserNumberPhoneData = document.querySelector(".usernumberphonedata");
    const UserNumberPhoneInput = document.querySelector(
      ".usernumberphoneinput",
    );
    const UserNumberPhoneInputClose = document.querySelector(
      ".usernumberphoneinputclose",
    );

    const leyenda = document.querySelector(".leyendRole");
    const icon = document.querySelector("#iconUser");
    const bg = document.querySelector("#bgUser");

    // nombre

    UserNameData.onclick = () => {
      UserNameData.classList.add("d-none");
      UserNameInput.classList.remove("d-none");
    };

    UserNameInputClose.onclick = () => {
      if (UserName.checkValidity()) {
        UserNameInput.classList.add("d-none");
        UserNameData.classList.remove("d-none");
        document.querySelector("#usernametext").innerHTML =
          `${UserName.value} <i class="bi bi-chevron-right"></i>`;
        validatechanges(UserName.value, "username", user_name);
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
      validatechanges(UserLastname.value, "userlastname", user_lastname);
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
        validatechanges(UserUser.value, "useruser", user_user);
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
          user_number_phone,
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
  };
});
