// bar graph javascript functions
document.addEventListener('DOMContentLoaded', function () {
  const ctx1 = document.getElementById('currentProductionConsumptionBarChart');
  const barChart = new Chart(ctx1, {
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

  const ctx2 = document.getElementById('currentProductionLineChart');
  const lineChartProduction = new Chart(ctx2, {
    type: 'line',
    data: {
      labels: [1,2,3,4,5,6,7,8,9,10],
      datasets: [{
        label: 'Production kW',
        data: [],
        backgroundColor: ['#4caf50'],
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

  const ctx3 = document.getElementById('currentConsumptionLineChart');
  const lineChartConsumption = new Chart(ctx3, {
    type: 'line',
    data: {
      labels: [1,2,3,4,5,6,7,8,9,10],
      datasets: [{
        label: 'Consumption kW',
        data: [],
        backgroundColor: ['#4caf50'],
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

  async function updateCharts() {
    try {
      const response = await fetch('/api/data');
      const data = await response.json();
      barChart.data.datasets[0].data = [data.production_value, data.consumption_value];
      barChart.update();
      lineChartProduction.data.datasets[0].data = data.last_10_values_production
      lineChartProduction.update();
      lineChartConsumption.data.datasets[0].data = data.last_10_values_consumption
      lineChartConsumption.update();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  updateCharts(); // initial function
  setInterval(updateCharts, 10000); // to fetch data in every 10 secs
});
