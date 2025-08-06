export function renderGoals() {
    const section = document.getElementById('goals');
    section.innerHTML = `
      <h2>Goals</h2>
      <form id="goalForm">
        <input type="text" id="goalName" placeholder="Goal Name" required />
        <input type="number" id="targetAmount" placeholder="Target ₹" required />
        <input type="date" id="targetDate" required />
        <button type="submit">Add</button>
      </form>
      <div id="goalList"></div>
    `;
  
    fetchGoals();
  
    document.getElementById('goalForm').onsubmit = function (e) {
      e.preventDefault();
      const payload = {
        goal_name: document.getElementById('goalName').value,
        target_amount: parseFloat(document.getElementById('targetAmount').value),
        target_date: document.getElementById('targetDate').value
      };
  
      fetch('http://localhost:8089/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(() => renderGoals());
    };
  }
  
  function fetchGoals() {
    fetch('http://localhost:8089/api/goals')
      .then(res => res.json())
      .then(data => {
        const list = document.getElementById('goalList');
        list.innerHTML = data.map(goal => `
          <div class="card">
            <h3>${goal.goal_name}</h3>
            <p>Target: ₹${goal.target_amount}</p>
            <p>By: ${goal.target_date}</p>
          </div>
        `).join('');
      });
  }
  