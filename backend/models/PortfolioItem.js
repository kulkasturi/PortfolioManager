const { v4: uuidv4 } = require('uuid');

class PortfolioItem {
  constructor({
    id = null,
    tickerSymbol,
    assetType,
    quantity,
    purchasePrice,
    purchaseDate
  }) {
    this.id = id || uuidv4();
    this.tickerSymbol = tickerSymbol.toUpperCase();
    this.assetType = assetType.toUpperCase();
    this.quantity = parseFloat(quantity);
    this.purchasePrice = parseFloat(purchasePrice);
    this.purchaseDate = purchaseDate;
    
    // Transient fields (calculated, not stored)
    this.currentPrice = null;
    this.currentValue = null;
    this.profitLoss = null;
  }

  // Validate the portfolio item data
  validate() {
    const errors = [];

    if (!this.tickerSymbol || this.tickerSymbol.trim() === '') {
      errors.push('Ticker symbol is required');
    }

    const validAssetTypes = ['STOCK', 'BOND', 'CASH', 'MUTUAL_FUND', 'ETF', 'CRYPTO'];
    if (!validAssetTypes.includes(this.assetType)) {
      errors.push(`Asset type must be one of: ${validAssetTypes.join(', ')}`);
    }

    if (isNaN(this.quantity) || this.quantity <= 0) {
      errors.push('Quantity must be a positive number');
    }

    if (isNaN(this.purchasePrice) || this.purchasePrice <= 0) {
      errors.push('Purchase price must be a positive number');
    }

    if (!this.purchaseDate || !this.isValidDate(this.purchaseDate)) {
      errors.push('Purchase date must be in YYYY-MM-DD format');
    }

    return errors;
  }

  isValidDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    
    const date = new Date(dateString);
    const timestamp = date.getTime();
    
    if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) return false;
    
    return date.toISOString().startsWith(dateString);
  }

  // Calculate current value and profit/loss
  calculateValues(currentPrice) {
    if (this.assetType === 'CASH') {
      this.currentPrice = 1.0;
      this.currentValue = this.quantity;
      this.profitLoss = 0;
    } else {
      this.currentPrice = currentPrice || this.purchasePrice;
      this.currentValue = this.currentPrice * this.quantity;
      this.profitLoss = (this.currentPrice - this.purchasePrice) * this.quantity;
    }
  }

  // Return a plain object for JSON serialization (excluding methods)
  toJSON() {
    return {
      id: this.id,
      tickerSymbol: this.tickerSymbol,
      assetType: this.assetType,
      quantity: this.quantity,
      purchasePrice: this.purchasePrice,
      purchaseDate: this.purchaseDate,
      currentPrice: this.currentPrice,
      currentValue: this.currentValue,
      profitLoss: this.profitLoss
    };
  }

  // Create instance from stored data
  static fromJSON(data) {
    return new PortfolioItem(data);
  }
}

module.exports = PortfolioItem;