

// import { createPieChart, createLineChart } from '../charts.js';

// export function renderDashboard() {
//   const section = document.getElementById('dashboard');
//   section.innerHTML = `
//     <h2>Portfolio Overview</h2>
    
//     <div class="chart-wrapper">
//       <canvas id="pieChart" width="300" height="300"></canvas>
//     </div>
    
//     <div class="chart-wrapper">
//       <canvas id="lineChart" width="600" height="300"></canvas>
//     </div>
    
//     <div id="insights" class="insights-box"></div>
//     <div id="snapshotList"></div>
//   `;

//   // ✅ PIE CHART — Asset Allocation
//   fetch('http://localhost:8089/api/assets/allocation')
//     .then(res => res.json())
//     .then(data => {
//       const labels = data.map(item => item.asset_type);
//       const values = data.map(item => item.total);
//       const ctx = document.getElementById('pieChart').getContext('2d');
//       createPieChart(ctx, labels, values);
//     });

//   // ✅ LINE CHART — Portfolio Growth
//   fetch('http://localhost:8089/api/snapshots')
//     .then(res => res.json())
//     .then(data => {
//       const dates = data.map(s => s.snapshot_date);
//       const values = data.map(s => s.total_current_value);
//       const gains = data.map(s => s.todays_gain_loss);

//       const ctx = document.getElementById('lineChart').getContext('2d');
//       createLineChart(ctx, dates, values);

//       document.getElementById('insights').innerHTML = `
//         <p>Total Current Value: ₹${values.at(-1)}</p>
//         <p>Today’s Gain/Loss: ₹${gains.at(-1)}</p>
//       `;
//     });
// }



// import { createPieChart, createLineChart } from '../charts.js';

// const tips = [
//   'images/tip1.jpg',
//   'images/tip2.jpg',
//   'images/tip3.jpg',
//   'images/tip4.jpg',
//   'images/tip5.jpg',
//   'images/tip6.jpg',
//   'images/tip7.jpg'
// ];

// export function renderDashboard() {
//   const section = document.getElementById('dashboard');
//   const randomTip = tips[Math.floor(Math.random() * tips.length)];


//   section.innerHTML = `
//     <div class="dashboard-header">
      
//       <div>
       
//         <h3 class="welcome">Welcome back, Chirag! 📊</h3>
//         <p class="subtitle">Here’s your portfolio overview</p>
//       </div>
//     </div>

//     <div class="insight-banner" id="insights"></div>
//      </div>
//       <div class="test-buttons">
//       <button onclick="addTestGain()">Simulate Gain</button>
//       <button onclick="addTestLoss()">Simulate Loss</button>
//     </div>

//     <div class="charts-grid">
//       <div class="chart-card">
//         <h3>Asset Allocation</h3>
//         <canvas id="pieChart" width="300" height="300"></canvas>
//       </div>
//       <div class="chart-card">
//         <h3>Portfolio Growth</h3>
//         <canvas id="lineChart" width="600" height="300"></canvas>
//       </div>
//     </div>

//     <div class="tip-banner">
//       <h4>💡 Investment Tip</h4>
//       <img src="${randomTip}" class="tip-image" />
//     </div>
     
//   `;

//   // Asset Allocation Pie Chart
//   fetch('http://localhost:8089/api/assets/allocation')
//     .then(res => res.json())
//     .then(data => {
//       const labels = data.map(item => item.asset_type);
//       const values = data.map(item => item.total);
//       const ctx = document.getElementById('pieChart').getContext('2d');
//       createPieChart(ctx, labels, values);
//     });

//   // Portfolio Growth Line Chart
//   fetch('http://localhost:8089/api/snapshots')
//     .then(res => res.json())
//     .then(data => {
//       const dates = data.map(s => s.snapshot_date);
//       const values = data.map(s => s.total_current_value);
//       const gains = data.map(s => s.todays_gain_loss);

//       const ctx = document.getElementById('lineChart').getContext('2d');
//       createLineChart(ctx, dates, values);

//       const insightsBox = document.getElementById('insights');
//       const latestValue = values.at(-1);
//       const todayGain = gains.at(-1);
//       insightsBox.innerHTML = `
//         <div class="total-box">
//           <p>Total Current Value</p>
//           <h2>₹${latestValue}</h2>
//         </div>
//         <div class="gain-box ${todayGain >= 0 ? 'positive' : 'negative'}">
//           <p>Today’s Gain/Loss</p>
//           <h2>₹${todayGain}</h2>
//           ${todayGain >= 0 ? '<div class="celebrate">🎉</div>' : ''}
//         </div>
//       `;
//     });
// }

// window.addTestGain = () => {
//   fetch('http://localhost:8089/api/snapshots', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       snapshot_date: new Date().toISOString().split('T')[0],
//       total_investment: 110000,
//       total_current_value: 118000,
//       todays_gain_loss: 8000,
//       best_performer: 'Reliance',
//       worst_performer: 'Paytm'
//     })
//   }).then(() => location.reload());
// };

// window.addTestLoss = () => {
//   fetch('http://localhost:8089/api/snapshots', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       snapshot_date: new Date().toISOString().split('T')[0],
//       total_investment: 110000,
//       total_current_value: 100000,
//       todays_gain_loss: -10000,
//       best_performer: 'Gold ETF',
//       worst_performer: 'Zomato'
//     })
//   }).then(() => location.reload());
// };



import { createPieChart, createLineChart } from '../charts.js';

const tips = [
  'images/tip1.png',
  'images/tip2.png',
  'images/tip3.png',
  'images/tip4.png',
  'images/tip5.png',
  'images/tip6.jpg',
  //'images/tip7.jpg'
];

export function renderDashboard() {
  const section = document.getElementById('dashboard');
  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  section.innerHTML = `
    <div class="welcome-container">
      <h2 class="typing">👋 Welcome back, Chirag!</h2>
      <p class="tagline-text">Your Smart Investment Companion — <strong>Fintrack</strong></p>
    </div>

    <div class="insight-banner">
      <div class="card shadow-card">
        <div class="card-icon">💰</div>
        <p>Total Current Value</p>
        <h2 id="totalValue">--</h2>
      </div>
      <div class="card shadow-card" id="gainCard">
        <div class="card-icon">📈</div>
        <p>Today’s Gain/Loss</p>
        <h2 id="gainValue">--</h2>
      </div>
    </div>

    <div class="test-buttons">
      <button class="sim-btn" onclick="addTestGain()">🚀 Simulate Gain/Loss</button>
    </div>

    <div class="charts-grid">
      <div class="chart-card">
        <h3>Asset Allocation</h3>
        <canvas id="pieChart" width="300" height="300"></canvas>
      </div>
      <div class="chart-card">
        <h3>Portfolio Growth</h3>
        <canvas id="lineChart" width="600" height="300"></canvas>
      </div>
    </div>

    <div class="tip-banner">
      <h4>💡 Investment Tip</h4>
      <img src="${randomTip}" class="tip-image" />
    </div>
  `;

  // PIE CHART
  fetch('http://localhost:8089/api/assets/allocation')
    .then(res => res.json())
    .then(data => {
      const labels = data.map(item => item.asset_type);
      const values = data.map(item => item.total);
      const ctx = document.getElementById('pieChart').getContext('2d');
      createPieChart(ctx, labels, values);
    });

  // LINE CHART
  fetch('http://localhost:8089/api/snapshots')
    .then(res => res.json())
    .then(data => {
      const dates = data.map(s => s.snapshot_date);
      const values = data.map(s => s.total_current_value);
      const gains = data.map(s => s.todays_gain_loss);

      const ctx = document.getElementById('lineChart').getContext('2d');
      createLineChart(ctx, dates, values);

      const latestValue = values.at(-1);
      const todayGain = gains.at(-1);

      document.getElementById('totalValue').textContent = `₹${latestValue}`;
      document.getElementById('gainValue').textContent = `₹${todayGain}`;
      const gainCard = document.getElementById('gainCard');
      gainCard.classList.add(todayGain >= 0 ? 'positive' : 'negative');
      gainCard.querySelector('.card-icon').textContent = todayGain >= 0 ? '📈' : '📉';
    });
}

window.addTestGain = () => {
  fetch('http://localhost:8089/api/snapshots', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      snapshot_date: new Date().toISOString().split('T')[0],
      total_investment: 110000,
      total_current_value: 118000,
      todays_gain_loss: 8000,
      best_performer: 'Reliance',
      worst_performer: 'Paytm'
    })
  }).then(() => location.reload());
};

window.addTestLoss = () => {
  fetch('http://localhost:8089/api/snapshots', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      snapshot_date: new Date().toISOString().split('T')[0],
      total_investment: 110000,
      total_current_value: 100000,
      todays_gain_loss: -10000,
      best_performer: 'Gold ETF',
      worst_performer: 'Zomato'
    })
  }).then(() => location.reload());
};
