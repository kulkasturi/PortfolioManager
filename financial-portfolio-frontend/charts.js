Chart.defaults.elements.arc.backgroundColor = '#fff';

// Plugin for shadow effect
Chart.register({
  id: 'shadowPlugin',
  beforeDatasetsDraw(chart) {
    const ctx = chart.ctx;
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 4;
  },
  afterDatasetsDraw(chart) {
    const ctx = chart.ctx;
    ctx.restore();
  }
});

export function createPieChart(ctx, labels, data) {
    return new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: ['#f39c12', '#2ecc71', '#e74c3c', '#3498db', '#9b59b6', '#1abc9c']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
  export function createLineChart(ctx, labels, data) {
    return new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Portfolio Growth',
          data,
          borderColor: '#2ecc71',
          borderWidth: 2,
          fill: false,
          tension: 0.3,
          pointBackgroundColor: '#fff',
          pointBorderColor: '#2ecc71',
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }
  