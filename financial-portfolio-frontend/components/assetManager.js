export function renderAssets() {
    const section = document.getElementById('assets');
    section.innerHTML = `
      <h2>Assets</h2>
      <form id="assetForm">
        <input type="text" id="name" placeholder="Name" required />
        <select id="type">
          <option value="Stock">Stock</option>
          <option value="Mutual Fund">Mutual Fund</option>
          <option value="FD">FD</option>
          <option value="Gold">Gold</option>
        </select>
        <input type="number" id="amount" placeholder="Invested ₹" required />
        <button type="submit">Add</button>
      </form>
      <div id="assetList"></div>
    `;
  
    fetchAssets();
  
    document.getElementById('assetForm').onsubmit = function (e) {
      e.preventDefault();
      const payload = {
        asset_name: document.getElementById('name').value,
        asset_type: document.getElementById('type').value,
        amount_invested: parseFloat(document.getElementById('amount').value),
        purchase_date: new Date().toISOString().split('T')[0],
        current_value: parseFloat(document.getElementById('amount').value)
      };
  
      fetch('http://localhost:8089/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(() => renderAssets());
    };
  }
  
  function fetchAssets() {
    fetch('http://localhost:8089/api/assets')
      .then(res => res.json())
      .then(data => {
        console.log("Transactions from backend:", data);
        const list = document.getElementById('assetList');
        list.innerHTML = data.map(a => `
          <div class="card">
            <h3>${a.asset_name}</h3>
            <p>Type: ${a.asset_type}</p>
            <p>Invested: ₹${a.amount_invested}</p>
            <p>Current: ₹${a.current_value}</p>
            <button onclick="deleteAsset(${a.id})">Delete</button>

          </div>
        `).join('');
      });
  }
  
  window.deleteAsset = function (id) {
    fetch(`http://localhost:8089/api/assets/${id}`, {
      method: 'DELETE'
    })
    .then(() => renderAssets());
  }
  