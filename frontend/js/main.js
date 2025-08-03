// Portfolio Management Frontend JavaScript

class PortfolioManager {
    constructor() {
        this.apiBase = '/api/portfolio';
        this.portfolioData = [];
        this.init();
    }

    init() {
        this.bindEventListeners();
        this.loadPortfolio();
    }

    bindEventListeners() {
        // Add item form
        const addForm = document.getElementById('add-item-form');
        addForm.addEventListener('submit', (e) => this.handleAddItem(e));

        // Edit item form
        const editForm = document.getElementById('edit-item-form');
        editForm.addEventListener('submit', (e) => this.handleEditItem(e));

        // Modal controls
        const closeModal = document.getElementById('close-modal');
        const cancelEdit = document.getElementById('cancel-edit');
        const modal = document.getElementById('edit-modal');

        closeModal.addEventListener('click', () => this.closeModal());
        cancelEdit.addEventListener('click', () => this.closeModal());
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    async loadPortfolio() {
        try {
            this.showLoading(true);
            const response = await fetch(this.apiBase);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.portfolioData = await response.json();
            this.updateUI();
            this.hideError();
        } catch (error) {
            console.error('Error loading portfolio:', error);
            this.showError('Failed to load portfolio data. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    async handleAddItem(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const itemData = Object.fromEntries(formData.entries());

        try {
            this.showLoading(true);
            const response = await fetch(this.apiBase, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(itemData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.errors ? errorData.errors.join(', ') : 'Failed to add item');
            }

            // Reset form and reload portfolio
            e.target.reset();
            await this.loadPortfolio();
            this.hideError();
        } catch (error) {
            console.error('Error adding item:', error);
            this.showError(error.message);
        } finally {
            this.showLoading(false);
        }
    }

    async handleEditItem(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const itemData = Object.fromEntries(formData.entries());
        const itemId = itemData.id;
        delete itemData.id; // Remove id from update data

        try {
            this.showLoading(true);
            const response = await fetch(`${this.apiBase}/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(itemData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.errors ? errorData.errors.join(', ') : 'Failed to update item');
            }

            this.closeModal();
            await this.loadPortfolio();
            this.hideError();
        } catch (error) {
            console.error('Error updating item:', error);
            this.showError(error.message);
        } finally {
            this.showLoading(false);
        }
    }

    async deleteItem(itemId) {
        if (!confirm('Are you sure you want to delete this portfolio item?')) {
            return;
        }

        try {
            this.showLoading(true);
            const response = await fetch(`${this.apiBase}/${itemId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete item');
            }

            await this.loadPortfolio();
            this.hideError();
        } catch (error) {
            console.error('Error deleting item:', error);
            this.showError('Failed to delete item. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    editItem(item) {
        // Populate modal form with item data
        document.getElementById('edit-id').value = item.id;
        document.getElementById('edit-ticker').value = item.tickerSymbol;
        document.getElementById('edit-asset-type').value = item.assetType;
        document.getElementById('edit-quantity').value = item.quantity;
        document.getElementById('edit-purchase-price').value = item.purchasePrice;
        document.getElementById('edit-purchase-date').value = item.purchaseDate;

        // Show modal
        document.getElementById('edit-modal').style.display = 'block';
    }

    closeModal() {
        document.getElementById('edit-modal').style.display = 'none';
    }

    updateUI() {
        this.updateSummary();
        this.updateTable();
    }

    updateSummary() {
        const totalValue = this.portfolioData.reduce((sum, item) => sum + (item.currentValue || 0), 0);
        const totalPL = this.portfolioData.reduce((sum, item) => sum + (item.profitLoss || 0), 0);

        const totalValueElement = document.getElementById('total-value');
        const totalPLElement = document.getElementById('total-pl');

        totalValueElement.textContent = this.formatCurrency(totalValue);
        totalPLElement.textContent = this.formatCurrency(totalPL);

        // Apply styling based on profit/loss
        totalPLElement.className = 'stat-value';
        if (totalPL > 0) {
            totalPLElement.classList.add('positive');
        } else if (totalPL < 0) {
            totalPLElement.classList.add('negative');
        }
    }

    updateTable() {
        const tbody = document.getElementById('portfolio-tbody');
        const noItemsMessage = document.getElementById('no-items-message');

        if (this.portfolioData.length === 0) {
            tbody.innerHTML = '';
            noItemsMessage.style.display = 'block';
            return;
        }

        noItemsMessage.style.display = 'none';
        
        tbody.innerHTML = this.portfolioData.map(item => {
            const plClass = this.getPLClass(item.profitLoss);
            
            return `
                <tr>
                    <td><strong>${item.tickerSymbol}</strong></td>
                    <td><span class="asset-type">${this.formatAssetType(item.assetType)}</span></td>
                    <td>${this.formatNumber(item.quantity)}</td>
                    <td>${this.formatCurrency(item.purchasePrice)}</td>
                    <td>${this.formatDate(item.purchaseDate)}</td>
                    <td>${this.formatCurrency(item.currentPrice)}</td>
                    <td><strong>${this.formatCurrency(item.currentValue)}</strong></td>
                    <td class="${plClass}"><strong>${this.formatCurrency(item.profitLoss, true)}</strong></td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-edit" onclick="portfolioManager.editItem(${JSON.stringify(item).replace(/"/g, '&quot;')})">
                                Edit
                            </button>
                            <button class="btn btn-delete" onclick="portfolioManager.deleteItem('${item.id}')">
                                Delete
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    getPLClass(profitLoss) {
        if (profitLoss > 0) return 'profit';
        if (profitLoss < 0) return 'loss';
        return 'neutral';
    }

    formatCurrency(amount, showSign = false) {
        if (amount === null || amount === undefined) return '$0.00';
        
        const formatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(Math.abs(amount));

        if (showSign && amount !== 0) {
            return amount > 0 ? `+${formatted}` : `-${formatted}`;
        }
        
        return amount < 0 ? `-${formatted}` : formatted;
    }

    formatNumber(num, decimals = 2) {
        if (num === null || num === undefined) return '0';
        
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(num);
    }

    formatDate(dateString) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    formatAssetType(assetType) {
        const typeMap = {
            'STOCK': 'Stock',
            'ETF': 'ETF',
            'BOND': 'Bond',
            'MUTUAL_FUND': 'Mutual Fund',
            'CRYPTO': 'Crypto',
            'CASH': 'Cash'
        };
        return typeMap[assetType] || assetType;
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        loading.style.display = show ? 'flex' : 'none';
    }

    showError(message) {
        const errorDiv = document.getElementById('error-message');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        // Auto-hide error after 5 seconds
        setTimeout(() => {
            this.hideError();
        }, 5000);
    }

    hideError() {
        document.getElementById('error-message').style.display = 'none';
    }
}

// Initialize the portfolio manager when the DOM is loaded
let portfolioManager;

document.addEventListener('DOMContentLoaded', () => {
    portfolioManager = new PortfolioManager();
});

// Refresh data every 5 minutes
setInterval(() => {
    if (portfolioManager) {
        portfolioManager.loadPortfolio();
    }
}, 5 * 60 * 1000);