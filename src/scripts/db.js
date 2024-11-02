const dbName = 'RestoFinderDB';
const storeName = 'favorites';

let db;

const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, {keyPath: 'id'});
      }
    };

    request.onsuccess = (event) => {
      db = event.target.result; // Assign the opened db to the outer db variable
      resolve(db);
    };

    request.onerror = (event) => {
      reject(`Database error: ${event.target.errorCode}`);
    };
  });
};

const ensureDatabaseIsOpen = async () => {
  if (!db) {
    await openDatabase();
  }
};

const addFavorite = async (restaurant) => {
  await ensureDatabaseIsOpen(); // Ensure the database is open

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);

    const request = store.add(restaurant);
    request.onsuccess = () => resolve('Restaurant added to favorites.');
    request.onerror = (event) => reject(`Add favorite error: ${event.target.errorCode}`);
  });
};

const removeFavorite = async (id) => {
  await ensureDatabaseIsOpen(); // Ensure the database is open

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);

    const request = store.delete(id);
    request.onsuccess = () => resolve('Restaurant removed from favorites.');
    request.onerror = (event) => reject(`Remove favorite error: ${event.target.errorCode}`);
  });
};

const getFavorites = async () => {
  await ensureDatabaseIsOpen(); // Ensure the database is open

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event);
    };
  });
};

const isFavorite = async (id) => {
  await ensureDatabaseIsOpen(); // Ensure the database is open

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(id);

    request.onsuccess = (event) => resolve(event.target.result !== undefined);
    request.onerror = (event) => reject(`Check favorite error: ${event.target.errorCode}`);
  });
};

export {openDatabase, addFavorite, removeFavorite, getFavorites, isFavorite};
