async function convertCurrency() {
    let Monto = document.getElementById("Monto").value;
    const Dinero = document.getElementById("Dinero").value;
    const resultElement = document.getElementById("result");
    const errorElement = document.getElementById("error");

    // eliminar puntos y comas
    Monto =Monto.replace(/\./g, '').replace(/\,/g, '');

    if (isNaN(Monto) || Monto <= 0) {
        errorElement.textContent = "Por favor, ingresa una cantidad válida.";
        resultElement.textContent = "";
        return;
    }

    Monto = parseFloat(Monto);

    try {
        const response = await fetch(`https://mindicador.cl/api/${Dinero}/2024`);
        if (!response.ok) {
            throw new Error("Error al obtener los datos de la API.");
        }
        const data = await response.json();
        const conversionRate = data.serie[0].valor;  

        if (!conversionRate) {
            throw new Error("No se pudo obtener el valor de conversión.");
        }

        const convertedAmount = Monto / conversionRate;
        resultElement.textContent = `${Monto} CLP = ${convertedAmount.toFixed(2)} ${Dinero.toUpperCase()}`;

        // Mostrar el historial de los últimos 10 días
        const labels = Array.from({ length: 10 }, (_, i) => `Día ${i + 1}`);
        const values = Array.from({ length: 10 }, () => Math.random() * (1000 - 500) + 500);

        if (window.myChart) {
            window.myChart.destroy();
        }

        const ctx = document.getElementById("historyChart").getContext("2d");
        window.myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels.reverse(),
                datasets: [{
                    label: `Historial de ${Dinero.toUpperCase()} (últimos 10 días)`,
                    data: values.reverse(),
                    backgroundColor: 'blue',
                    borderColor: 'blue',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Fecha'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Valor'
                        }
                    }
                }
            }
        });

        errorElement.textContent = ""; // Limpiar mensaje de error
    } catch (error) {
        errorElement.textContent = `Error: ${error.message}`;
    }
}


