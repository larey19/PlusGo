document.addEventListener("DOMContentLoaded", function () {
  const dataEl = document.getElementById("mailData");
  if (!dataEl) return;

  const correos = JSON.parse(dataEl.textContent);
  if (!correos.length) return;

  const frame = document.getElementById("mailModalFrame");
  const asuntoEl = document.getElementById("mailAsunto");
  const deEl = document.getElementById("mailDe");
  const fechaEl = document.getElementById("mailFecha");
  const counterEl = document.getElementById("mailCounter");
  const prevBtn = document.getElementById("mailPrevBtn");
  const nextBtn = document.getElementById("mailNextBtn");

  let current = 0; // 👈 arranca en el último (más reciente)

  function render(index) {
    current = index;
    const item = correos[current];

    new bootstrap.Tooltip(asuntoEl, {
      trigger: "hover focus",
      title: item.asunto,
      placement: "bottom",
    });
    asuntoEl.textContent = item.asunto;
    deEl.textContent = item.de;
    fechaEl.textContent = item.fecha;
    frame.srcdoc = item.cuerpo;
    counterEl.textContent = `(${current + 1} / ${correos.length})`;

    prevBtn.classList.toggle("d-none", current === 0);
    nextBtn.classList.toggle("d-none", current === correos.length - 1);
  }

  prevBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (current > 0) render(current - 1);
  });

  nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (current < correos.length - 1) render(current + 1);
  });

  render(current);

  launchConfetti();
});

$(document)
  .find(".select")
  .select2({
    theme: "bootstrap-5",
    width: "100%",
    placeholder: "Escoga el Correo a consultar",
    language: {
      noResults: function () {
        return "No se encontró la cuenta";
      },
    },
  });

function launchConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { x: 0.5, y: 0.6 },
  });
}
