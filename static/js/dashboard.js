// bar graph javascript functions
document.addEventListener('DOMContentLoaded', function () {
  Chart.defaults.font.size = 18;

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
      labels: [
        '12 am - 6 am',
        '6 am - 12 pm',
        '12 pm - 6 pm',
        '6 pm - 12 am',
        'Yesterday Total'
      ],
      datasets: [{
        label: 'Daily Balance by kW',
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 3
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

// Add this function to format the values (kW or mW)
function formatPowerValue(value) {
  if (value >= 10000) {
    return (value / 1000).toFixed(1) + ' mW';
  }
  return value.toFixed(1) + ' kW';
}

// Modify the updateCharts function to update the data cards
async function updateCharts() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();

    // Update charts (existing code)
    recentValuesLineChart.data.labels = data.last_10_timestamps;
    recentValuesLineChart.data.datasets[0].data = data.last_10_values_production;
    recentValuesLineChart.data.datasets[1].data = data.last_10_values_consumption;
    recentValuesLineChart.update();

    yesterdayBalanceBarChart.data.datasets[0].data = data.yesterday_balance_values;
    yesterdayBalanceBarChart.data.datasets[0].backgroundColor = data.yesterday_balance_values.map(value => {
      return value < 0 ? 'rgba(255, 99, 132, 0.2)' : 'rgba(75, 192, 192, 0.2)';
    });
    yesterdayBalanceBarChart.data.datasets[0].borderColor = data.yesterday_balance_values.map(value => {
      return value < 0 ? 'rgb(255, 99, 132)' : 'rgb(75, 192, 192)';
    });
    yesterdayBalanceBarChart.update();

    // Update data cards
    const currentBalanceEl = document.getElementById('currentBalance');
    currentBalanceEl.textContent = formatPowerValue(Math.abs(data.current_balance));
    currentBalanceEl.className = 'data-value ' + (data.current_balance >= 0 ? 'positive' : 'negative');

    document.getElementById('last1HourProduction').textContent = formatPowerValue(data.last_1_hour_production);
    document.getElementById('last1HourConsumption').textContent = formatPowerValue(Math.abs(data.last_1_hour_consumption));

    document.getElementById('todayProduction').textContent = formatPowerValue(data.today_production);
    document.getElementById('todayConsumption').textContent = formatPowerValue(Math.abs(data.today_consumption));

    document.getElementById('last24HoursProduction').textContent = formatPowerValue(data.last_24_hours_production);
    document.getElementById('last24HoursConsumption').textContent = formatPowerValue(Math.abs(data.last_24_hours_consumption));

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

  updateCharts(); // initial function
//  TODO: It is not neccessary to update yesterday's line chart in every 10 secs. This consumes much cpu.
  setInterval(updateCharts, 10000); // to fetch data in every 10 secs
});
