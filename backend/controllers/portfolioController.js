const PortfolioItem = require('../models/PortfolioItem');
const FileDb = require('../utils/fileDb');
const priceService = require('../utils/priceService');

const db = new FileDb();

class PortfolioController {
  // GET /api/portfolio - Get all portfolio items
  async getAllItems(req, res) {
    try {
      const items = await db.read();
      const portfolioItems = items.map(item => PortfolioItem.fromJSON(item));
      
      // Fetch current prices for all items
      const priceMap = await priceService.getCurrentPrices(portfolioItems);
      
      // Calculate values for each item
      portfolioItems.forEach(item => {
        const currentPrice = priceMap.get(item.id);
        item.calculateValues(currentPrice);
      });

      res.json(portfolioItems);
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
      res.status(500).json({ error: 'Failed to fetch portfolio items' });
    }
  }

  // GET /api/portfolio/:id - Get specific portfolio item
  async getItemById(req, res) {
    try {
      const { id } = req.params;
      const itemData = await db.findById(id);
      
      if (!itemData) {
        return res.status(404).json({ error: 'Portfolio item not found' });
      }

      const item = PortfolioItem.fromJSON(itemData);
      const currentPrice = await priceService.getCurrentPrice(item.tickerSymbol, item.assetType);
      item.calculateValues(currentPrice);

      res.json(item);
    } catch (error) {
      console.error('Error fetching portfolio item:', error);
      res.status(500).json({ error: 'Failed to fetch portfolio item' });
    }
  }

  // POST /api/portfolio - Add new portfolio item
  async createItem(req, res) {
    try {
      const item = new PortfolioItem(req.body);
      
      // Validate the item
      const errors = item.validate();
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      // Save to database (only persistent fields)
      const itemToSave = {
        id: item.id,
        tickerSymbol: item.tickerSymbol,
        assetType: item.assetType,
        quantity: item.quantity,
        purchasePrice: item.purchasePrice,
        purchaseDate: item.purchaseDate
      };

      await db.add(itemToSave);

      // Fetch current price and calculate values for response
      const currentPrice = await priceService.getCurrentPrice(item.tickerSymbol, item.assetType);
      item.calculateValues(currentPrice);

      res.status(201).json(item);
    } catch (error) {
      console.error('Error creating portfolio item:', error);
      res.status(500).json({ error: 'Failed to create portfolio item' });
    }
  }

  // PUT /api/portfolio/:id - Update portfolio item
  async updateItem(req, res) {
    try {
      const { id } = req.params;
      
      // Check if item exists
      const existingData = await db.findById(id);
      if (!existingData) {
        return res.status(404).json({ error: 'Portfolio item not found' });
      }

      // Create updated item with merged data
      const updatedData = { ...existingData, ...req.body, id };
      const item = new PortfolioItem(updatedData);
      
      // Validate the updated item
      const errors = item.validate();
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      // Update in database (only persistent fields)
      const itemToUpdate = {
        tickerSymbol: item.tickerSymbol,
        assetType: item.assetType,
        quantity: item.quantity,
        purchasePrice: item.purchasePrice,
        purchaseDate: item.purchaseDate
      };

      await db.update(id, itemToUpdate);

      // Fetch current price and calculate values for response
      const currentPrice = await priceService.getCurrentPrice(item.tickerSymbol, item.assetType);
      item.calculateValues(currentPrice);

      res.json(item);
    } catch (error) {
      console.error('Error updating portfolio item:', error);
      res.status(500).json({ error: 'Failed to update portfolio item' });
    }
  }

  // DELETE /api/portfolio/:id - Delete portfolio item
  async deleteItem(req, res) {
    try {
      const { id } = req.params;
      
      await db.delete(id);
      res.status(204).send();
    } catch (error) {
      if (error.message === 'Item not found') {
        return res.status(404).json({ error: 'Portfolio item not found' });
      }
      
      console.error('Error deleting portfolio item:', error);
      res.status(500).json({ error: 'Failed to delete portfolio item' });
    }
  }
}

module.exports = new PortfolioController();