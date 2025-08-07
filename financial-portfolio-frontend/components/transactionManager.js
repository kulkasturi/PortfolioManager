

const BASE_URL = 'http://localhost:8089/api';

const DUMMY_PRICES = {
  // 🏦 Stocks
  'HDFC': 310,
  'SBI': 590,
  'Axis': 730,
  'ICICI': 850,
  'TCS': 3700,
  'Infosys': 1550,
  'Reliance': 2850,
  'Wipro': 420,
  'Maruti': 10200,
  'HUL': 2600,

  // 📈 Mutual Funds
  'Mutual Fund': 105,  // base
  'Nippon India Small Cap': 98,
  'HDFC Equity Fund': 135,
  'SBI Bluechip Fund': 123,
  'Axis Growth Fund': 110,
  'ICICI Value Discovery': 142,

  // 🪙 Gold & Fixed Deposits
  'Gold': 6700,     // per gram
  'FD': 100000,     // 1 lakh FD value

  // ₿ Crypto (optional)
  'Bitcoin': 5000000,
  'Ethereum': 330000,
  'Solana': 17000,

  // 🏠 REITs / Real Estate Funds (optional)
  'Embassy REIT': 320,
  'Brookfield REIT': 310
};


export function renderTransactions() {
  console.log("✅ renderTransactions is running");

  const section = document.getElementById('transactions');
  section.innerHTML = `
    <h2>Transactions</h2>
    <form id="txForm" class="form-style">
      <input type="text" id="txAssetName" placeholder="Asset Name (e.g., HDFC)" required />
      <select id="txAssetType" required>
        <option value="">Select Asset Type</option>
        <option value="Stock">Stock</option>
        <option value="Mutual Fund">Mutual Fund</option>
        <option value="FD">Fixed Deposit</option>
        <option value="Gold">Gold</option>
      </select>
      <input type="number" id="txAmount" placeholder="₹ Amount" required />
      <input type="number" id="txQty" placeholder="Quantity" style="display:none;" />
      <input type="date" id="txDate" required />
      <select id="txType">
        <option value="Buy">Buy</option>
        <option value="Sell">Sell</option>
      </select>
      <input type="text" id="txNotes" placeholder="Notes (optional)" />
      <button type="submit">Record</button>
    </form>
    <div id="transactionList" class="transaction-list"></div>

    <!-- SELL MODAL -->
    <div id="sellModal" class="modal" style="display:none;>
      <div class="modal-content">
        <h3>Sell Asset</h3>
        <form id="sellForm">
          <input type="hidden" id="sellAssetName" />
          <input type="hidden" id="sellAssetType" name="sellAssetType" />
          <input type="number" id="sellAmount" placeholder="₹ Amount" required />
          <input type="number" id="sellQty" placeholder="Quantity" />
          <input type="date" id="sellDate" required />
          <input type="text" id="sellNotes" placeholder="Notes (optional)" />
          <div class="modal-actions">
            <button type="submit">Confirm Sell</button>
            <button type="button" onclick="closeSellModal()">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `;

  const assetTypeField = document.getElementById('txAssetType');
  const qtyField = document.getElementById('txQty');

  assetTypeField.addEventListener('change', () => {
    const type = assetTypeField.value;
    const needsQty = ['Stock', 'Mutual Fund', 'Gold'].includes(type);
    qtyField.style.display = needsQty ? 'block' : 'none';
    qtyField.required = needsQty;
    if (!needsQty) qtyField.value = '';
  });

  // Handle Buy/Sell
  document.getElementById('txForm').onsubmit = function (e) {
    e.preventDefault();

    const payload = {
      asset_name: document.getElementById('txAssetName').value.trim(),
      asset_type: document.getElementById('txAssetType').value,
      amount: parseFloat(document.getElementById('txAmount').value),
      quantity: qtyField.value ? parseFloat(qtyField.value) : null,
      transaction_date: document.getElementById('txDate').value,
      type: document.getElementById('txType').value,
      notes: document.getElementById('txNotes').value
    };

    const endpoint = payload.type === 'Buy'
      ? `${BASE_URL}/transactions/add`
      : `${BASE_URL}/transactions/sell`;

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error("❌ Failed to add transaction");
        return res.json();
      })
      .then(() => {
        document.getElementById('txForm').reset();
        qtyField.style.display = 'none';
        fetchTransactions();
      })
      .catch(err => alert(err.message));
  };

  // Sell form inside modal
  document.getElementById('sellForm').onsubmit = function (e) {
    e.preventDefault();

    console.log(document.getElementById('sellAssetType'))

    const payload = {
    
      asset_name: document.getElementById('sellAssetName').value,
      asset_type: document.getElementById('sellAssetType').value,
      amount: parseFloat(document.getElementById('sellAmount').value),
      quantity: document.getElementById('sellQty').value ? parseFloat(document.getElementById('sellQty').value) : null,
      transaction_date: document.getElementById('sellDate').value,
      notes: document.getElementById('sellNotes').value
    };

    console.log("Selling asset:", payload);

    fetch(`${BASE_URL}/transactions/sell`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error("❌ Failed to sell asset");
        return res.json();
      })
      .then(() => {
        closeSellModal();
        fetchTransactions();
      })
      .catch(err => alert(err.message));
  };

  fetchTransactions();
}

// Fetch and render transactions
function fetchTransactions() {
  fetch(`${BASE_URL}/transactions`)
    .then(res => res.json())
    .then(data => {
      console.log("Fetched transactions:", data); 
      const list = document.getElementById('transactionList');
      console.log(list)
      if (!data.length) {
        list.innerHTML = `<p>No transactions found.</p>`;
        return;
      }

      list.innerHTML = data.map(t => {
        const currentPrice = DUMMY_PRICES[t.asset_name] || DUMMY_PRICES[t.asset_type] || '-';
        return `
          <div class="card">
            <h3>${t.asset_name}</h3>
            <p>${t.type} | ₹${t.amount}${t.quantity ? ` | Qty: ${t.quantity}` : ''} | Asset Type: ${t.asset_type}</p>
            <p>Date: ${t.transaction_date}</p>
            <p><i>${t.notes || ''}</i></p>
            <p class="current-price">💹 Current Price: ₹${currentPrice}</p>
            ${t.type === 'Buy' ? `<button onclick="openSellModal('${t.asset_name}', '${t.asset_type}')">Sell</button>` : ''}
          </div>
        `;
      }).join('');
    })
    .catch(err => {
      console.error('❌ Failed to fetch transactions:', err);
    });
}

window.openSellModal = function (assetName, assetType) {
  console.log(assetType)
  document.getElementById('sellAssetName').value = assetName;
  document.getElementById('sellAssetType').value = assetType;

  const needsQty = ['Stock', 'Mutual Fund', 'Gold'].includes(assetType);
  document.getElementById('sellQty').style.display = needsQty ? 'block' : 'none';
  document.getElementById('sellQty').required = needsQty;

  document.getElementById('sellModal').style.display = 'block';
};

window.closeSellModal = function () {
  document.getElementById('sellForm').reset();
  document.getElementById('sellModal').style.display = 'none';
};

