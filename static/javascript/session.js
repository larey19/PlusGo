document.querySelectorAll(".iconCard").forEach((icon) => {
  icon.onclick = () => {
    const card = icon.closest(".card");
    const cardfooter = card.querySelector(".card-footer");
    if (cardfooter.classList.contains("d-none")) {
      cardfooter.classList.remove("d-none");
      icon.classList.replace("bi-chevron-down", "bi-chevron-up");
    } else {
      cardfooter.classList.add("d-none");
      icon.classList.replace("bi-chevron-up", "bi-chevron-down");
    }
  };
});

// CONFIRMACIONES DE ACCIONES
function confirmSession(action, id) {
  Swal.fire({
    title: action == 'only' ? `¿Cerrar sesión?` : `¿Cerrar Sesión en todos los dispositivos?`,
    icon: "warning",
    text: `El cierre de sesión puede tardar unos minutos en reflejarse en el dispostivo`,
    showCancelButton: true,
    confirmButtonColor: "#d33",
    confirmButtonText: "Sí, continuar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = action == "only" ? "/session/" + id : "/sessions/" + id;
    }
  });
}
