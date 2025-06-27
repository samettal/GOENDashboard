// bar graph javascript functions
document.addEventListener('DOMContentLoaded', function () {

  const ctx1 = document.getElementById('recentValuesLineChart');
  const recentValuesLineChart = new Chart(ctx1, {
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

  const ctx2 = document.getElementById('yesterdayBalanceBarChart');
  const yesterdayBalanceBarChart = new Chart(ctx2, {
    type: 'bar',

    data: {
      labels: [],
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

      recentValuesLineChart.data.labels = data.last_10_timestamps
      recentValuesLineChart.data.datasets[0].data = data.last_10_values_production
      recentValuesLineChart.data.datasets[1].data = data.last_10_values_consumption
      recentValuesLineChart.update();

      yesterdayBalanceBarChart.data.datasets[0].data = [data.daily_balance_value]
      yesterdayBalanceBarChart.update();

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  updateCharts(); // initial function
  setInterval(updateCharts, 10000); // to fetch data in every 10 secs
});
