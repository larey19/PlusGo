AOS.init();
// SCRIPT COPIA DE DATOS DE VENTA
document.querySelectorAll("#clipButton").forEach((sl) => {
  sl.addEventListener("click", function (clk) {
    if (sl.classList.contains("dataSaleClip")) {
      sl.classList.replace("dataSaleClip", "dataSaleClip2");
      document.querySelectorAll("#clipboard").forEach((clip) => {
        clip.classList.replace("bi-clipboard", "bi-clipboard-x");
        Swal.fire({
          title: "Venta Copiada",
          icon: "success",
          showConfirmButton: false,
          timer: 800,
        });
      });

      document.querySelectorAll(".dataSaleClip").forEach((sale) => {
        sale.classList.add("d-none");
      });

      // ============== CARGAR DATOS EN MODAL REGISTRAR
      document.querySelector(".cst_id").value = this.dataset.cst_id;
      document.querySelector(".sal_date_start").value =
        this.dataset.sal_date_start;
      document.querySelector(".sal_date_end").value = this.dataset.sal_date_end;
      document.querySelector(".sal_price").value = this.dataset.sal_price;
      new Cleave(document.querySelector(".sal_price"), {
        numeral: true,
        numeralThousandsGroupStyle: "thousand",
        numeralDecimalScale: 0,
      });
      document.querySelector(".sal_description").textContent =
        this.dataset.sal_description;
      document.querySelector(".pro_pin").value = this.dataset.pro_pin_profile;
    } else {
      this.classList.replace("dataSaleClip2", "dataSaleClip");
      document.querySelectorAll("#clipboard").forEach((clip) => {
        clip.classList.replace("bi-clipboard-x", "bi-clipboard");
        Swal.fire({
          title: "Venta Eliminada",
          icon: "info",
          showConfirmButton: false,
          timer: 800,
        });
      });

      // ============== ELIMINA DATOS DE REGISTRAR
      document.querySelector(".cst_id").value = "";
      document.querySelector(".sal_date_start").value = "";
      document.querySelector(".sal_date_end").value = "";
      document.querySelector(".sal_price").value = "";
      document.querySelector(".sal_description").textContent = "";
      document.querySelector(".pro_pin").value = "";
      document.querySelectorAll(".dataSaleClip").forEach((sale) => {
        sale.classList.remove("d-none");
      });
    }
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
    const acc_password = this.getAttribute("data-acc_password");
    const cst_name = this.getAttribute("data-cst_name");
    const cst_lastname = this.getAttribute("data-cst_lastname");
    const cst_phone_number = this.getAttribute("data-cst_phone_number");
    const pro_profile = this.getAttribute("data-pro_profile");
    const pro_pin_profile = this.getAttribute("data-pro_pin_profile");
    const pla_message = this.getAttribute("data-pla_message");
    // ============= CARGA DATOS EN MODAL DETALLES
    document.getElementById("cst_fullname").innerHTML =
      `${cst_name} ${cst_lastname}`;
    document.getElementById("cst_phone_number").innerHTML =
      `<i class="bi bi-phone-fill me-1"></i>Tel: ${cst_phone_number}`;
    document.getElementById("sal_date_start").innerHTML =
      `<i class="bi bi-calendar-event me-2"></i> ${sal_date_start}`;
    document.getElementById("sal_date_end").innerHTML =
      `<i class="bi bi-calendar-check me-2"></i> ${sal_date_end}`;
    document.getElementById("sal_price").innerHTML = `$ ${sal_price}`;
    document.getElementById("acc_email").innerHTML =
      `<i class="bi bi-envelope-at text-secondary"></i> ${acc_email}`;
    document.getElementById("acc_password").innerHTML =
      `<i class="bi bi-lock text-secondary"></i>Clave: ${acc_password}`;
    document.getElementById("pro_profile").innerHTML =
      `<i class="bi bi-tag-fill text-secondary"></i>Perfil ${pro_profile}`;
    document.getElementById("pro_pin_profile").innerHTML =
      `<i class="bi bi-lock text-secondary"></i>Pin: ${pro_pin_profile}`;
    document.getElementById("sal_description").innerHTML =
      `<i class="bi bi-info-circle me-1"></i> ${sal_description}`;

    // ================ COPIAR EN PORTAPAPELES MENSAJE DE DATOS DE VENTA
    document.getElementById("copyButton").addEventListener("click", () => {
      if (pla_message) {
        document
          .getElementById("copyButton")
          .classList.replace("bi-copy", "bi-check-circle");
        navigator.clipboard.writeText(pla_message).then(() => {
          setTimeout(
            () =>
              document
                .getElementById("copyButton")
                .classList.replace("bi-check-circle", "bi-copy"),
            3000,
          );
        });
      } else
        document
          .getElementById("copyButton")
          .classList.replace("bi-copy", "bi-x-circle");
      setTimeout(() => {
        document
          .getElementById("copyButton")
          .classList.replace("bi-x-circle", "bi-copy");
      }, 3000);
    });
  });
});
// SCRIPTS MODAL CREATE
document.querySelectorAll(".dataSaleCreate").forEach((sale) => {
  sale.addEventListener("click", function (c) {
    const acc_email = this.getAttribute("data-acc_email");

    // ============== CARGAR DATOS PARA MODAL REGISTRO
    document.querySelectorAll(".proid").forEach((proid) => {
      proid.value = this.dataset.pro_id;
    });
    document.querySelector(".propin").value = this.dataset.pro_pin_profile;

    // VALIDACION DE CREACION
    document
      .getElementById("validateFormCrt")
      .addEventListener("click", function (vld) {
        vld.preventDefault();
        form = this.closest("#form_crt");
        account = acc_email;
        if (form && form.checkValidity()) {
          confirmCreate(account);
        } else {
          form.reportValidity();
        }
      });
  });
});
// SCRIPTS MODAL UPDATE 
document.querySelectorAll(".dataSaleUpdate").forEach((sale) => {
  sale.addEventListener("click", function (c) {
    const sal_id = this.getAttribute("data-sal_id");
    const acc_email = this.getAttribute("data-acc_email");

    // ============== CARGAR DATOS PARA EDITAR
    document.querySelector(".cstid").value = this.dataset.cst_id;
    document.querySelector(".saldatestart").value = this.dataset.sal_date_start;
    document.querySelector(".saldateend").value = this.dataset.sal_date_end;
    document.querySelector(".salprice").value = this.dataset.sal_price;
    new Cleave(document.querySelector(".salprice"), {
      numeral: true,
      numeralThousandsGroupStyle: "thousand",
      numeralDecimalScale: 0,
    });
    document.querySelectorAll(".proid").forEach((proid) => {
      proid.value = this.dataset.pro_id;
    });
    document.querySelector(".propin").value = this.dataset.pro_pin_profile;
    document.querySelector(".saldescription").textContent =
      this.dataset.sal_description;
    // VALIDACION EDITAR
    document
      .getElementById("validateFormUpd")
      .addEventListener("click", function (vld) {
        vld.preventDefault();
        form = this.closest("#form_upd");
        form.action = `/sale/${sal_id}`;
        account = acc_email;
        console.log(account);
        if (form && form.checkValidity()) {
          confirmUpdate(account);
        } else {
          form.reportValidity();
        }
      });
  });
});

// CONFIRMACIONES DE ACCIONES
function confirmCreate(account) {
  Swal.fire({
    title: "¿Registrar venta?",
    text: `En ${account}`,
    icon: "info",
    showCancelButton: true,
    confirmButtonColor: "rgba(4,17,43,0.92)",
    confirmButtonText: "Sí, guardar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      document.getElementById("form_crt").submit();
    }
  });
}
function confirmUpdate(account) {
  Swal.fire({
    title: "¿Actualizar venta?",
    text: `En ${account}`,
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
function confirmDelete(id, account) {
  if (id != null && id != "") {
    Swal.fire({
      title: "¿Eliminar venta?",
      text: `En ${account}, Desactivar y eliminar una venta no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/sale/state/" + id;
      }
    });
  }
}

// UTILIDADES DE PAGINA
$(document).ready(function () {
  let params = new URLSearchParams(window.location.search);

  let cst_name = params.get("cst_name");
  let pro_profile = params.get("pro_profile");
  let search = `${cst_name} ${pro_profile}`;
  $("#table").DataTable({
    stateSave: true,
    order: [],
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
    },
    columnDefs: [
      {
        targets: [2], // Ajusta al índice de tu columna de fecha
        render: function (data, type) {
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
        targets: [1], // Ajusta al índice de tu columna de fecha
        render: function (data, type) {
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
        targets: [3],
        render: function (data, type) {
          if (type === "display") {
            if (data != null && data != "") {
              let formateado = new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(data);

              return `<span class="badge bg-primary">${formateado}</span>`;
            }
          }
          return data;
        },
      },
      {
        targets: [4], // Ajusta al índice de tu columna de email y cel
        render: function (data, type, row) {
          if (type === "display" && data) {
            if (data) {
              let partes = data.match(/^(\d{3})(\d{3})(\d{4})$/);
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
  $(this)
    .find(".js-example-responsive")
    .select2({
      theme: "bootstrap-5",
      width: "100%",
      placeholder: "Cliente",
      allowClear: true,
      dropdownParent: $(this),
      language: {
        noResults: function () {
          return "No se encontró el cliente";
        },
      },
    });
});
// formatea el precio de la modal de registro
new Cleave(document.querySelector(".sal_price"), {
  numeral: true,
  numeralThousandsGroupStyle: "thousand",
  numeralDecimalScale: 0,
});
// input de pin del perfil modales registro y edicion
document.querySelectorAll("#buttonPin").forEach((button) => {
  button.closest(".modal").addEventListener("hide.bs.modal", () => {
    button.classList.replace("bi-pencil-fill", "bi-pencil");
    document.querySelectorAll("#propin").forEach((propin) => {
      propin.setAttribute("disabled", true);
    });
  });
  button.addEventListener("click", function (clk) {
    if (button.classList.contains("bi-pencil")) {
      button.classList.replace("bi-pencil", "bi-pencil-fill");
      document.querySelectorAll("#propin").forEach((propin) => {
        propin.removeAttribute("disabled");
      });
    } else {
      button.classList.replace("bi-pencil-fill", "bi-pencil");
      document.querySelectorAll("#propin").forEach((propin) => {
        propin.setAttribute("disabled", true);
      });
    }
  });
});
// informacion de la cuenta modal detalles
document.getElementById("dataAcc").addEventListener("click", function (clk) {
  if (!document.getElementById("dataAcc").classList.contains("flex-column")) {
    document.getElementById("dataAcc").classList.add("flex-column");
    document.getElementById("acc_email").style.maxWidth = "100%";
    document.getElementById("acc_password").style.maxWidth = "100%";
    document.getElementById("pro_profile").style.maxWidth = "100%";
    document.getElementById("pro_pin_profile").classList.remove("d-none");
    document.getElementById("copyData").classList.remove("d-none");
  } else {
    document.getElementById("dataAcc").classList.remove("flex-column");
    document.getElementById("acc_email").style.maxWidth = "150px";
    document.getElementById("acc_password").style.maxWidth = "150px";
    document.getElementById("pro_profile").style.maxWidth = "150px";
    document.getElementById("pro_pin_profile").classList.add("d-none");
    document.getElementById("copyData").classList.add("d-none");
  }
});
