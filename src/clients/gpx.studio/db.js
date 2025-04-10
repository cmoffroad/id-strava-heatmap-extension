/**
 * Wraps an IndexedDB object store, providing simplified get/put operations
 */
class DatabaseStoreWrapper {
  constructor(store) {
    this.store = store;
  }

  async deepMergeResults(store, obj, executeRequest) {
    const result = Array.isArray(obj) ? [] : {};

    await Promise.all(
      Object.entries(obj).map(async ([key, value]) => {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          result[key] = await this.deepMergeResults(store, value, executeRequest);
        } else {
          await executeRequest(store.get(key), (retrieved) => {
            result[key] = retrieved ?? value;
          });
        }
      })
    );

    return result;
  }

  /**
   * Retrieves multiple keys from the store with fallback values
   * @param {Object} object - Key-value pairs where values are fallbacks
   * @returns {Promise<Object>} - Retrieved or fallback values
   * @throws {Error} If input is not a non-empty object
   */
  async get(object) {
    if (!object || typeof object !== 'object' || Object.keys(object).length === 0) {
      throw new Error('get() requires a non-empty object parameter');
    }

    return this.deepMergeResults(this.store, object, this._executeRequest.bind(this));
  }

  /**
   * Stores multiple key-value pairs in the store
   * @param {Object} object - Key-value pairs to store
   * @returns {Promise<Object>} - Operation results (typically keys or null on error)
   * @throws {Error} If input is not a non-empty object
   */
  async put(object) {
    if (!object || typeof object !== 'object' || Object.keys(object).length === 0) {
      throw new Error('put() requires a non-empty object parameter');
    }

    const results = {};
    await Promise.all(
      Object.entries(object).map(([key, value]) =>
        this._executeRequest(this.store.put(value, key), (result) => {
          results[key] = result ?? null;
        })
      )
    );
    return results;
  }

  /**
   * Helper method to execute an IndexedDB request and handle its promise
   * @private
   * @param {IDBRequest} request - The IndexedDB request to execute
   * @param {Function} onSuccess - Callback for successful request
   * @returns {Promise<void>}
   */
  _executeRequest(request, onSuccess) {
    return new Promise((resolve) => {
      request.onsuccess = () => {
        onSuccess(request.result);
        resolve();
      };
      request.onerror = () => {
        onSuccess(null);
        resolve(); // Continue despite errors
      };
    });
  }
}

/**
 * Wraps an IndexedDB database instance for easier transaction management
 */
class DatabaseWrapper {
  constructor(db, dbName) {
    this.db = db;
    this.dbName = dbName;
  }

  /**
   * Opens a store within a transaction
   * @param {string} storeName - Name of the store to open
   * @param {'readonly' | 'readwrite'} [mode='readwrite'] - Transaction mode
   * @returns {Promise<DatabaseStoreWrapper>} - Wrapped store instance
   * @throws {Error} If storeName is not provided
   */
  async openStore(storeName, mode = 'readwrite') {
    if (!storeName) {
      throw new Error('Store name is required');
    }
    // Validate mode
    if (!['readonly', 'readwrite'].includes(mode)) {
      throw new Error('Mode must be "readonly" or "readwrite"');
    }
    const transaction = this.db.transaction([storeName], mode);
    const store = transaction.objectStore(storeName);
    return new DatabaseStoreWrapper(store);
  }

  /**
   * Closes the database connection
   */
  close() {
    this.db.close();
  }
}

/**
 * Opens an IndexedDB database connection
 * @param {string} dbName - Name of the database to open
 * @returns {Promise<DatabaseWrapper>} - Wrapped database instance
 * @throws {Error} If dbName is not provided or on connection error
 */
export async function openDatabase(dbName) {
  if (!dbName) {
    throw new Error('Database name is required');
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName);

    request.onsuccess = (event) => {
      resolve(new DatabaseWrapper(event.target.result, dbName));
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}
