// bar graph javascript functions
document.addEventListener('DOMContentLoaded', function () {
  const ctx = document.getElementById('currentProductionConsumptionBarChart');
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Production', 'Consumption'],
      datasets: [{
        label: 'by kW',
        data: [0, 0],
        backgroundColor: ['#4caf50', '#f44336'],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  async function updateChart() {
    try {
      const response = await fetch('/api/data');
      const data = await response.json();
      chart.data.datasets[0].data = [data.production_value, data.consumption_value];
      chart.update();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  updateChart(); // initial function
  setInterval(updateChart, 10000); // to fetch data in every 10 secs
});