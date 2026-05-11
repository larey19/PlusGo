$(document).ready(function () {
  $("#table").DataTable({
    pageLength: 10,
    order: [[1, "desc"]],
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
    },
    columnDefs: [
      {
        targets: [0], // Ajusta al índice de tu columna de fecha
        render: function (data, type, row) {
          if (type === "display" && data) {
            // Para formato ISO: "netflix <info-net@blbalbla>"
            let partes = data.split(" ");
            if (partes.length === 2) {
              return `${partes[0]}`; // netflix
            }
          }
          return data;
        },
      },
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
    ],
    layout: {
      bottomEnd: null,
      topEnd: null,
      topStart: null,
    },
  });
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
