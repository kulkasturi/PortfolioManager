import { renderDashboard } from './components/dashboard.js';
import { renderAssets } from './components/assetManager.js';
import { renderGoals } from './components/goalManager.js';
import { renderTransactions } from './components/transactionManager.js';

function clearSections() {
  document.querySelectorAll('section').forEach(sec => sec.classList.remove('active'));
}



window.navigate = function (id) {
  clearSections();
  document.getElementById(id).classList.add('active');
  switch (id) {
    case 'dashboard': renderDashboard(); break;
    case 'assets': renderAssets(); break;
    case 'goals': renderGoals(); break;
    case 'transactions': renderTransactions(); break;
  }
};


window.navigate = navigate;
// Load default view
window.onload = () => navigate('dashboard');

