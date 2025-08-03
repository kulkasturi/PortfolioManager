const fetch = require('node-fetch');

class PriceService {
  constructor() {
    this.cache = new Map();
    this.baseUrl = 'https://c4rm9elh30.execute-api.us-east-1.amazonaws.com/default/cachedPriceData';
  }

  // Get cache key for today's date
  getCacheKey(ticker) {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    return `${ticker}-${today}`;
  }

  // Check if we have a cached price for today
  getCachedPrice(ticker) {
    const key = this.getCacheKey(ticker);
    return this.cache.get(key);
  }

  // Cache a price for today
  setCachedPrice(ticker, price) {
    const key = this.getCacheKey(ticker);
    this.cache.set(key, price);
    
    // Clean up old cache entries (older than today)
    this.cleanupCache();
  }

  // Remove cache entries older than today
  cleanupCache() {
    const today = new Date().toISOString().split('T')[0];
    
    for (const [key, value] of this.cache.entries()) {
      const keyDate = key.split('-').slice(-3).join('-'); // Extract YYYY-MM-DD from key
      if (keyDate !== today) {
        this.cache.delete(key);
      }
    }
  }

  // Fetch price from external API
  async fetchPriceFromAPI(ticker) {
    try {
      const url = `${this.baseUrl}?ticker=${encodeURIComponent(ticker)}`;
      console.log(`Fetching price for ${ticker} from API...`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Portfolio-Management-App/1.0'
        },
        timeout: 10000 // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // The API should return a price field
      if (data && typeof data.price === 'number' && data.price > 0) {
        return data.price;
      } else {
        throw new Error('Invalid price data received from API');
      }
    } catch (error) {
      console.error(`Error fetching price for ${ticker}:`, error.message);
      return null;
    }
  }

  // Main method to get current price
  async getCurrentPrice(ticker, assetType) {
    // For CASH, always return 1.0
    if (assetType === 'CASH') {
      return 1.0;
    }

    // For assets that don't support real-time pricing (BOND, MUTUAL_FUND for now)
    if (!['STOCK', 'ETF', 'CRYPTO'].includes(assetType)) {
      return null; // Will default to purchase price
    }

    // Check cache first
    const cachedPrice = this.getCachedPrice(ticker);
    if (cachedPrice !== undefined) {
      console.log(`Using cached price for ${ticker}: ${cachedPrice}`);
      return cachedPrice;
    }

    // Fetch from API
    const price = await this.fetchPriceFromAPI(ticker);
    
    if (price !== null) {
      this.setCachedPrice(ticker, price);
      console.log(`Fetched and cached price for ${ticker}: ${price}`);
    }
    
    return price;
  }

  // Get prices for multiple tickers at once
  async getCurrentPrices(items) {
    const pricePromises = items.map(async (item) => {
      const price = await this.getCurrentPrice(item.tickerSymbol, item.assetType);
      return { id: item.id, price };
    });

    const results = await Promise.all(pricePromises);
    const priceMap = new Map();
    
    results.forEach(({ id, price }) => {
      priceMap.set(id, price);
    });

    return priceMap;
  }
}

module.exports = new PriceService();