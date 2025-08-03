const fs = require('fs').promises;
const path = require('path');

class FileDb {
  constructor(filename = 'portfolio.json') {
    this.filePath = path.join(__dirname, '../data', filename);
    this.ensureDataDirectory();
  }

  async ensureDataDirectory() {
    const dataDir = path.dirname(this.filePath);
    try {
      await fs.access(dataDir);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fs.mkdir(dataDir, { recursive: true });
      }
    }
  }

  async read() {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, return empty array
        return [];
      }
      throw error;
    }
  }

  async write(data) {
    try {
      await this.ensureDataDirectory();
      await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
      console.error('Error writing to file:', error);
      throw error;
    }
  }

  async findById(id) {
    const items = await this.read();
    return items.find(item => item.id === id);
  }

  async add(item) {
    const items = await this.read();
    items.push(item);
    await this.write(items);
    return item;
  }

  async update(id, updatedItem) {
    const items = await this.read();
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) {
      throw new Error('Item not found');
    }
    
    items[index] = { ...items[index], ...updatedItem, id };
    await this.write(items);
    return items[index];
  }

  async delete(id) {
    const items = await this.read();
    const filteredItems = items.filter(item => item.id !== id);
    
    if (items.length === filteredItems.length) {
      throw new Error('Item not found');
    }
    
    await this.write(filteredItems);
    return true;
  }
}

module.exports = FileDb;