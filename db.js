/* ===================================================================
   TravelMate ✨ Minimal Persistent Database (IndexedDB)
   =================================================================== */

const DB_NAME = 'TravelMateDB';
const DB_VERSION = 1;

class TravelMateDB {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Trips Store
        if (!db.objectStoreNames.contains('trips')) {
          db.createObjectStore('trips', { keyPath: 'id' });
        }

        // Itinerary Store
        if (!db.objectStoreNames.contains('itinerary')) {
          const itinStore = db.createObjectStore('itinerary', { keyPath: 'id', autoIncrement: true });
          itinStore.createIndex('trip_id', 'trip_id', { unique: false });
        }

        // Packing Store
        if (!db.objectStoreNames.contains('packing')) {
          const packStore = db.createObjectStore('packing', { keyPath: 'id', autoIncrement: true });
          packStore.createIndex('trip_id', 'trip_id', { unique: false });
        }

        // Budget Store
        if (!db.objectStoreNames.contains('budget')) {
          const budgetStore = db.createObjectStore('budget', { keyPath: 'id', autoIncrement: true });
          budgetStore.createIndex('trip_id', 'trip_id', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }

  // --- Trips ---
  async saveTrip(trip) {
    return this._put('trips', trip);
  }

  async getAllTrips() {
    return this._getAll('trips');
  }

  async getTrip(id) {
    return this._get('trips', id);
  }

  // --- Itinerary ---
  async saveItineraryDays(tripId, days) {
    const tx = this.db.transaction('itinerary', 'readwrite');
    const store = tx.objectStore('itinerary');
    const index = store.index('trip_id');
    const getReq = index.getAllKeys(tripId);

    return new Promise((resolve, reject) => {
      getReq.onsuccess = () => {
        getReq.result.forEach(key => store.delete(key));
        days.forEach(day => {
          store.add({
            trip_id: tripId,
            day: day.dayNum,
            title: day.title,
            city: day.city,
            hotel: day.hotel,
            activities: {
              morning: day.morning,
              afternoon: day.afternoon,
              evening: day.evening
            }
          });
        });
      };
      tx.oncomplete = () => resolve();
      tx.onerror = (e) => reject(e.target.error);
    });
  }

  async getItinerary(tripId) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('itinerary', 'readonly');
      const store = tx.objectStore('itinerary');
      const index = store.index('trip_id');
      const req = index.getAll(tripId);
      req.onsuccess = () => resolve(req.result);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  // --- Packing ---
  async savePackingList(tripId, items) {
    const tx = this.db.transaction('packing', 'readwrite');
    const store = tx.objectStore('packing');
    const index = store.index('trip_id');
    const getReq = index.getAllKeys(tripId);

    return new Promise((resolve, reject) => {
      getReq.onsuccess = () => {
        getReq.result.forEach(key => store.delete(key));
        items.forEach(item => {
          store.add({
            trip_id: tripId,
            category: item.category,
            text: item.text,
            packed: item.packed
          });
        });
      };
      tx.oncomplete = () => resolve();
      tx.onerror = (e) => reject(e.target.error);
    });
  }

  async getPacking(tripId) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('packing', 'readonly');
      const store = tx.objectStore('packing');
      const index = store.index('trip_id');
      const req = index.getAll(tripId);
      req.onsuccess = () => resolve(req.result);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  // --- Budget ---
  async saveExpenses(tripId, expenses) {
    const tx = this.db.transaction('budget', 'readwrite');
    const store = tx.objectStore('budget');
    const index = store.index('trip_id');
    const getReq = index.getAllKeys(tripId);

    return new Promise((resolve, reject) => {
      getReq.onsuccess = () => {
        getReq.result.forEach(key => store.delete(key));
        expenses.forEach(exp => {
          store.add({
            trip_id: tripId,
            category: exp.category,
            item: exp.item,
            date: exp.date,
            amount: exp.amount
          });
        });
      };
      tx.oncomplete = () => resolve();
      tx.onerror = (e) => reject(e.target.error);
    });
  }

  async getBudget(tripId) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('budget', 'readonly');
      const store = tx.objectStore('budget');
      const index = store.index('trip_id');
      const req = index.getAll(tripId);
      req.onsuccess = () => resolve(req.result);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  // Helpers
  _put(storeName, value) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(value);
      req.onsuccess = () => resolve(req.result);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  _get(storeName, key) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  _getAll(storeName) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = (e) => reject(e.target.error);
    });
  }
}

const tmDB = new TravelMateDB();
