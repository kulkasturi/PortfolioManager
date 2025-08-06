

const BASE_URL = 'http://localhost:8089/api';

export function renderTransactions() {
    
    console.log("✅ renderTransactions is running");  // <== Add this at the top
     
      
  const section = document.getElementById('transactions');
  section.innerHTML = `
    <h2>Transactions</h2>
    <form id="txForm">
      <select id="txAsset" required></select>
      <input type="number" id="txAmount" placeholder="₹ Amount" required />
      <input type="number" id="txQty" placeholder="Quantity"/>
      <input type="date" id="txDate" required />
      <select id="txType">
        <option value="Buy">Buy</option>
        <option value="Sell">Sell</option>
        <option value="Update">Update</option>
      </select>
      <input type="text" id="txNotes" placeholder="Notes (optional)" />
      <button type="submit">Record</button>
    </form>
    <div id="transactionList" class="transaction-list"></div>
  `;

  // Fetch all assets and populate dropdown
  fetch(`${BASE_URL}/assets`)
    .then(res => res.json())
    .then(assets => {
      const assetSelect = document.getElementById('txAsset');
      assetSelect.innerHTML = assets.map(a => `
        <option value="${a.id}">${a.asset_name}</option>
      `).join('');
    });

  // Fetch and show all transactions
  fetchTransactions();

  // Handle form submission
  document.getElementById('txForm').onsubmit = function (e) {
    e.preventDefault();

    const payload = {
      asset_id: parseInt(document.getElementById('txAsset').value),
      amount: parseFloat(document.getElementById('txAmount').value),
      quantity: parseFloat(document.getElementById('txQty').value),
      transaction_type: document.getElementById('txType').value,
      transaction_date: document.getElementById('txDate').value,
      notes: document.getElementById('txNotes').value
    };

    // Adjust 'type' field to match backend
    payload.type = payload.transaction_type;
    delete payload.transaction_type;

    fetch(`${BASE_URL}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to add transaction");
        return res.json();
      })
      .then(() => {
        document.getElementById('txForm').reset();
        setTimeout(fetchTransactions, 300); // Refresh after delay
      })
      .catch(err => alert(err.message));
  };
}

// Fetch and display all transactions
function fetchTransactions() {
  fetch(`${BASE_URL}/transactions`)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById('transactionList');
      if (!data.length) {
        list.innerHTML = `<p>No transactions found.</p>`;
        return;
      }

      list.innerHTML = data.map(t => `
        <div class="card">
          <h3>${t.asset_name}</h3>
          <p>${t.type} | ₹${t.amount} | Qty: ${t.quantity}</p>
          <p>Date: ${t.transaction_date}</p>
          <p><i>${t.notes || ''}</i></p>
        </div>
      `).join('');
    })
    .catch(err => {
      console.error('Failed to fetch transactions:', err);
    });
}
