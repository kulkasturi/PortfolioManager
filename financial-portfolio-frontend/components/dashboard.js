// import { createPieChart, createLineChart } from '../charts.js';


// export function renderDashboard() {
//     const section = document.getElementById('dashboard');
//     section.innerHTML = `
//       <h2>Portfolio Overview</h2>
//       <canvas id="pieChart" width="300" height="300"></canvas>
//       <div id="growthChartContainer">
//         <canvas id="growthChart"></canvas>
//       </div>
//       <div id="snapshotList"></div>
//     `;
  
//     // Asset Allocation Pie Chart
//     fetch('http://localhost:8089/api/assets/allocation')
//       .then(res => res.json())
//       .then(data => {
//         const labels = data.map(item => item.asset_type);
//         const values = data.map(item => item.total);
//         const ctx = document.getElementById('pieChart').getContext('2d');
//         createPieChart(ctx, labels, values);
//       });


//   fetch('http://localhost:8089/api/snapshots')
//     .then(res => res.json())
//     .then(data => {
//       const dates = data.map(s => s.snapshot_date);
//       const values = data.map(s => s.total_current_value);
//       const gains = data.map(s => s.todays_gain_loss);

//       createPieChart(document.getElementById('pieChart'), dates, gains);
//       createLineChart(document.getElementById('lineChart'), dates, values);

//       document.getElementById('insights').innerHTML = `
//         <p>Total Current Value: ₹${values.at(-1)}</p>
//         <p>Today’s Gain/Loss: ₹${gains.at(-1)}</p>
//       `;
//     });
// }



import { createPieChart, createLineChart } from '../charts.js';

export function renderDashboard() {
  const section = document.getElementById('dashboard');
  section.innerHTML = `
    <h2>Portfolio Overview</h2>
    
    <div class="chart-wrapper">
      <canvas id="pieChart" width="300" height="300"></canvas>
    </div>
    
    <div class="chart-wrapper">
      <canvas id="lineChart" width="600" height="300"></canvas>
    </div>
    
    <div id="insights" class="insights-box"></div>
    <div id="snapshotList"></div>
  `;

  // ✅ PIE CHART — Asset Allocation
  fetch('http://localhost:8089/api/assets/allocation')
    .then(res => res.json())
    .then(data => {
      const labels = data.map(item => item.asset_type);
      const values = data.map(item => item.total);
      const ctx = document.getElementById('pieChart').getContext('2d');
      createPieChart(ctx, labels, values);
    });

  // ✅ LINE CHART — Portfolio Growth
  fetch('http://localhost:8089/api/snapshots')
    .then(res => res.json())
    .then(data => {
      const dates = data.map(s => s.snapshot_date);
      const values = data.map(s => s.total_current_value);
      const gains = data.map(s => s.todays_gain_loss);

      const ctx = document.getElementById('lineChart').getContext('2d');
      createLineChart(ctx, dates, values);

      document.getElementById('insights').innerHTML = `
        <p>Total Current Value: ₹${values.at(-1)}</p>
        <p>Today’s Gain/Loss: ₹${gains.at(-1)}</p>
      `;
    });
}
