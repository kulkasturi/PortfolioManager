// export function renderGoals() {
//     const section = document.getElementById('goals');
//     section.innerHTML = `
//       <h2>Goals</h2>
//       <form id="goalForm">
//         <input type="text" id="goalName" placeholder="Goal Name" required />
//         <input type="number" id="targetAmount" placeholder="Target ₹" required />
//         <input type="date" id="targetDate" required />
//         <button type="submit">Add</button>
//       </form>
//       <div id="goalList"></div>
//     `;
  
//     fetchGoals();
  
//     document.getElementById('goalForm').onsubmit = function (e) {
//       e.preventDefault();
//       const payload = {
//         goal_name: document.getElementById('goalName').value,
//         target_amount: parseFloat(document.getElementById('targetAmount').value),
//         target_date: document.getElementById('targetDate').value
//       };
  
//       fetch('http://localhost:8089/api/goals', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       }).then(() => renderGoals());
//     };
//   }
  
//   function fetchGoals() {
//     fetch('http://localhost:8089/api/goals')
//       .then(res => res.json())
//       .then(data => {
//         const list = document.getElementById('goalList');
//         list.innerHTML = data.map(goal => `
//           <div class="card">
//             <h3>${goal.goal_name}</h3>
//             <p>Target: ₹${goal.target_amount}</p>
//             <p>By: ${goal.target_date}</p>
//           </div>
//         `).join('');
//       });
//   }
  

// export function renderGoals() {
//   const section = document.getElementById('goals');
//   section.innerHTML = `
//     <h2>Goals</h2>
//     <form id="goalForm" class="p-4 bg-white rounded-lg shadow-md mb-6">
//       <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//         <input type="text" id="goalName" placeholder="Goal Name" required
//                class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
//         <input type="number" id="targetAmount" placeholder="Target ₹" required
//                class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
//         <input type="date" id="targetDate" required
//                class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
//       </div>
//       <button type="submit"
//               class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ease-in-out">
//         Add Goal
//       </button>
//     </form>
//     <div id="goalAchievabilityMessage" class="mb-4 p-3 rounded-md text-center hidden"></div>
//     <div id="goalList" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
//   `;

//   // Initial fetch of goals when the section is rendered
//   fetchGoals();

//   document.getElementById('goalForm').onsubmit = function (e) {
//     e.preventDefault();
//     const payload = {
//       goal_name: document.getElementById('goalName').value,
//       target_amount: parseFloat(document.getElementById('targetAmount').value),
//       target_date: document.getElementById('targetDate').value
//     };

//     // Get the message div
//     const messageDiv = document.getElementById('goalAchievabilityMessage');
//     messageDiv.classList.add('hidden'); // Hide previous messages before new fetch
//     messageDiv.innerHTML = ''; // Clear previous message content

//     fetch('http://localhost:8089/api/goals', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload)
//     })
//     .then(res => {
//       if (!res.ok) {
//           return res.json().then(errorData => {
//               throw new Error(errorData.error || 'Something went wrong');
//           });
//       }
//       return res.json();
//     })
//     .then(data => {
//       // Display the achievability message
//       if (data.goalAchievability) {
//         messageDiv.classList.remove('hidden');
//         // Clear all specific background/text colors before applying new ones
//         messageDiv.classList.remove('bg-green-100', 'text-green-800', 'bg-red-100', 'text-red-800');

//         // Ensure values are numbers before using toFixed (though backend should send them as such now)
//         const currentPortfolioValue = parseFloat(data.goalAchievability.currentPortfolioValue);
//         const targetAmount = parseFloat(data.goalAchievability.targetAmount);
//         const amountNeeded = parseFloat(data.goalAchievability.amountNeeded);


//         if (data.goalAchievability.isAchievable) {
//           messageDiv.classList.add('bg-green-100', 'text-green-800');
//           messageDiv.innerHTML = `🎉 **Goal Achievable!** Your current portfolio value (₹${currentPortfolioValue.toFixed(2)}) meets or exceeds your target (₹${targetAmount.toFixed(2)}).`;
//         } else {
//           messageDiv.classList.add('bg-red-100', 'text-red-800');
//           messageDiv.innerHTML = `⚠️ **Goal Not Achievable Yet.** You need ₹${amountNeeded.toFixed(2)} more to reach your target of ₹${targetAmount.toFixed(2)}. Current portfolio value: ₹${currentPortfolioValue.toFixed(2)}.`;
//         }
//       }
//       // ONLY re-fetch the goals list, do not re-render the entire section
//       fetchGoals();
//     })
//     .catch(error => {
//       console.error('Error adding goal:', error);
//       messageDiv.classList.remove('hidden');
//       messageDiv.classList.remove('bg-green-100', 'text-green-800', 'bg-red-100', 'text-red-800');
//       messageDiv.classList.add('bg-red-100', 'text-red-800');
//       messageDiv.innerHTML = `❌ Error: ${error.message}`;
//     });
//   };
// }

// function fetchGoals() {
//   fetch('http://localhost:8089/api/goals')
//     .then(res => res.json())
//     .then(data => {
//       const list = document.getElementById('goalList');
//       list.innerHTML = data.map(goal => `
//         <div class="card bg-white p-4 rounded-lg shadow-md">
//           <h3 class="text-lg font-semibold mb-2">${goal.goal_name}</h3>
//           <p class="text-gray-700">Target: ₹${parseFloat(goal.target_amount).toFixed(2)}</p>
//           <p class="text-gray-700">By: ${goal.target_date}</p>
//         </div>
//       `).join('');
//     })
//     .catch(error => {
//       console.error('Error fetching goals:', error);
//       const list = document.getElementById('goalList');
//       list.innerHTML = `<p class="text-red-500">Failed to load goals. Please check the server.</p>`;
//     });
// }
// correct bt H


export function renderGoals() {
  const section = document.getElementById('goals');
  section.innerHTML = `
    <h2>Goals</h2>
    <form id="goalForm" class="p-4 bg-white rounded-lg shadow-md mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input type="text" id="goalName" placeholder="Goal Name" required
               class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        <input type="number" id="targetAmount" placeholder="Target ₹" required
               class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        <input type="date" id="targetDate" required
               class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
      </div>
      <button type="submit"
              class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ease-in-out">
        Add Goal
      </button>
    </form>
    <div id="goalAchievabilityMessage" class="mb-4 p-3 rounded-md text-center hidden"></div>
    <div id="goalList" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
  `;

  // Initial fetch
  fetchGoals();

  document.getElementById('goalForm').onsubmit = function (e) {
    e.preventDefault();
    const payload = {
      goal_name: document.getElementById('goalName').value,
      target_amount: parseFloat(document.getElementById('targetAmount').value),
      target_date: document.getElementById('targetDate').value
    };
    console.log("Submitting goal:", payload);
    const messageDiv = document.getElementById('goalAchievabilityMessage');
    messageDiv.classList.add('hidden');
    messageDiv.innerHTML = '';

    fetch('http://localhost:8089/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(errorData => {
            throw new Error(errorData.error || 'Something went wrong');
          });
        }
        return res.json();
      })
      .then(data => {
        if (data.goalAchievability) {
          messageDiv.classList.remove('hidden');
          messageDiv.classList.remove('bg-green-100', 'text-green-800', 'bg-red-100', 'text-red-800');
          console.log("Goal achievability data:", data.goalAchievability);
          
          const currentPortfolioValue = parseFloat(data.goalAchievability.currentPortfolioValue);
          const targetAmount = parseFloat(data.goalAchievability.thisGoal);
          const amountNeeded = parseFloat(data.goalAchievability.amountNeeded);

          if (data.goalAchievability.isAchievable) {
            messageDiv.classList.add('bg-green-100', 'text-green-800');
            messageDiv.innerHTML = `🎉 <strong>Goal Achievable!</strong> Your current portfolio value (₹${currentPortfolioValue.toFixed(2)}) meets or exceeds your target (₹${targetAmount.toFixed(2)}).`;
          } else {
            messageDiv.classList.add('bg-red-100', 'text-red-800');
            messageDiv.innerHTML = `⚠️ <strong>Goal Not Achievable Yet.</strong> You need ₹${amountNeeded.toFixed(2)} more to reach your target of ₹${targetAmount.toFixed(2)}. Current portfolio value: ₹${currentPortfolioValue.toFixed(2)}.`;
          }
        }

        fetchGoals();
      })
      .catch(error => {
        console.error('Error adding goal:', error);
        messageDiv.classList.remove('hidden');
        messageDiv.classList.remove('bg-green-100', 'text-green-800', 'bg-red-100', 'text-red-800');
        messageDiv.classList.add('bg-red-100', 'text-red-800');
        messageDiv.innerHTML = `❌ Error: ${error.message}`;
      });
  };
}

function fetchGoals() {
  fetch('http://localhost:8089/api/goals')
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById('goalList');
      list.innerHTML = data.map(goal => `
        <div class="card bg-white p-4 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold mb-2">${goal.goal_name}</h3>
          <p class="text-gray-700">Target: ₹${parseFloat(goal.target_amount).toFixed(2)}</p>
          <p class="text-gray-700">By: ${goal.target_date}</p>
          <button onclick="deleteGoal(${goal.id})"
            class="mt-3 bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded transition duration-300">
            Mark as Achieved
          </button>
        </div>
      `).join('');
    })
    .catch(error => {
      console.error('Error fetching goals:', error);
      const list = document.getElementById('goalList');
      list.innerHTML = `<p class="text-red-500">Failed to load goals. Please check the server.</p>`;
    });
}

// Attach deleteGoal globally
window.deleteGoal = function (goalId) {
  if (!confirm("Are you sure you want to mark this goal as achieved?")) return;

  fetch(`http://localhost:8089/api/goals/${goalId}`, {
    method: 'DELETE'
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to delete goal.");
      return res.json();
    })
    .then(() => {
      fetchGoals(); // Refresh goals after deletion
    })
    .catch(error => {
      console.error("Error deleting goal:", error);
      alert("❌ Failed to mark goal as achieved. Try again.");
    });
};
