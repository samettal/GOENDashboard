// bar graph javascript functions
document.addEventListener('DOMContentLoaded', function () {

  const ctx1 = document.getElementById('currentProductionConsumptionBarChart');
  const barChartCurrentProductionConsumption = new Chart(ctx1, {
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

  const ctx2 = document.getElementById('last10ValuesProductionConsumptionLineChart');
  const lineChartProduction = new Chart(ctx2, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Production kW',
        data: [],
        fill: 'origin',
        backgroundColor: ['rgba(75, 220, 192, 0.3)'],
        borderWidth: 3,
        borderColor: 'rgb(75, 220, 192)',
      },
      {
        label: 'Consumption kW',
        data: [],
        fill: 'origin',
        backgroundColor: ['rgba(240, 15, 20, 0.3)'],
        borderWidth: 3,
        borderColor: 'rgb(240, 15, 20)'
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

  const ctx4 = document.getElementById('dailyBalanceBarChart');
  const barChartDailyBalance = new Chart(ctx4, {
    type: 'bar',
    data: {
      labels: ['Balance'],
      datasets: [{
        label: 'Daily Balance by kW',
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

      barChartCurrentProductionConsumption.data.datasets[0].data = [data.production_value, data.consumption_value];
      barChartCurrentProductionConsumption.update();

      lineChartProduction.data.datasets[0].data = data.last_10_values_production
      lineChartProduction.data.labels = data.last_10_timestamps
      lineChartProduction.data.datasets[1].data = data.last_10_values_consumption
      lineChartProduction.update();

      barChartDailyBalance.data.datasets[0].data = [data.daily_balance_value]
      barChartDailyBalance.update();

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  updateCharts(); // initial function
  setInterval(updateCharts, 10000); // to fetch data in every 10 secs
});
