AOS.init();
$(document).ready(function () {
  $("#table").DataTable({
    order: [[0, "desc"]],
    pageLength: 10,
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
    },
    columnDefs: [
      {
        targets: [2], // Ajusta al índice de tu columna de fecha
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
    ],
  });
  $("#tableSale").DataTable({
    order: [[0, "desc"]],
    pageLength: 10,
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
    },
    columnDefs: [
      {
        targets: [2], // Ajusta al índice de tu columna de fecha
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
        targets: [4],
        render: function (data, type, row) {
          if (type === "display") {
            let formateado = new Intl.NumberFormat("es-CO", {
              style: "currency",
              currency: "COP",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(data);

            return `<span class="badge bg-primary">${formateado}</span>`;
          }
          return data;
        },
      },
    ],
  });
});
