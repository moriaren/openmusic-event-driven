// src/services/CacheService.js

import { createClient } from 'redis';

class CacheService {
  constructor() {
    this._client = createClient({
      socket: {
        host: process.env.REDIS_SERVER || 'localhost',
      },
    });

    this._client.on('error', (error) => {
      console.error('Redis Error:', error);
    });

    // connect sekali saat service dibuat
    this._connect();
  }

  async _connect() {
    if (!this._client.isOpen) {
      await this._client.connect();
    }
  }

  async set(key, value, expirationInSecond = 1800) {
    await this._connect();
    await this._client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  async get(key) {
    await this._connect();
    const result = await this._client.get(key);

    if (result === null) {
      throw new Error('Cache tidak ditemukan');
    }

    return result;
  }

  async delete(key) {
    await this._connect();
    await this._client.del(key);
  }
}

export default CacheService;