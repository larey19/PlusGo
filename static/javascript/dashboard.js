AOS.init();
// DIAGRAMAS
const data = document.getElementById("data");
const cSale = document.getElementById("myChartSale");
const meses = JSON.parse(data.dataset.meses);
const totalsale = JSON.parse(data.dataset.totalsale);
new Chart(cSale, {
  type: "bar",
  data: {
    labels: meses,
    datasets: [
      {
        label: "Ventas por Mes",
        data: totalsale,
        borderWidth: 3,
      },
    ],
  },

  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});
const cPlatform = document.getElementById("myChartPlatform");
const plaName = JSON.parse(data.dataset.planame);
const plaSale = JSON.parse(data.dataset.plasale);
new Chart(cPlatform, {
  type: "doughnut",
  data: {
    labels: plaName,
    datasets: [
      {
        data: plaSale,
        borderWidth: 0,
      },
    ],
  },

  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Plataformas Vendidas",
      },
    },
  },
});

// =================CONFIRMACION CIERRE SESSION
function confirmLogout() {
  Swal.fire({
    title: "¿Cerrar la sesion de tu cuenta?",
    showCancelButton: true,
    confirmButtonColor: "rgba(4,17,43,0.92)",
    confirmButtonText: "Sí, continuar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = '/logout';
    }
  });
}
// ================ TABLAS
$(document).ready(function () {
  $("#tableUltTrgSale").DataTable({
    order: [],
    pageLength: 5,
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
    },
    columnDefs: [
      {
        targets: [1], // Ajusta al índice de tu columna de fecha
        render: function (data, type, row) {
          if (type === "display" && data) {
            // Para formato ISO con hora: "2024-01-15 14:30:00"
            let partes = data.split(" ");
            if (partes.length === 2) {
              let fechaPartes = partes[0].split("-");
              if (fechaPartes.length === 3) {
                return `${fechaPartes[2]}/${fechaPartes[1]}/${fechaPartes[0]} ${partes[1]}`; // DD/MM/YYYY HH:MM:SS
              }
            }
          }
          return data;
        },
      },
      {
        targets: [3],
        render: function (data, type, row) {
          if (type === "display") {
            let formateado = new Intl.NumberFormat("es-CO", {
              style: "currency",
              currency: "COP",
              maximumFractionDigits: 0,
            }).format(data);

            return `<span class="badge bg-primary">${formateado}</span>`;
          }
          return data;
        },
      },
    ],
    layout: {
      bottomEnd: null,
      topEnd: null,
      topStart: null,
    },
  });

  $("#tableSale").DataTable({
    order: [],
    pageLength: 10,
    stateSave: true,
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
    },
    columnDefs: [
      {
        targets: [1], // Ajusta al índice de tu columna de fecha
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
    ],
    layout: {
      bottomEnd: null,
      topEnd: null,
    },
  });

  $("#tableAcc").DataTable({
    order: [],
    pageLength: 10,
    stateSave: true,
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
    layout: {
      bottomEnd: null,
      topEnd: null,
    },
  });
});
