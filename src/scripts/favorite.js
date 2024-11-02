import {getFavorites} from './db.js';

const displayFavoriteRestaurants = async () => {
  const favoritesContainer = document.getElementById('favorites-container');

  if (!favoritesContainer) {
    console.error('Element \'favorites-container\' not found');
    return;
  }

  favoritesContainer.innerHTML = '';

  try {
    const favorites = await getFavorites();
    if (favorites.length === 0) {
      favoritesContainer.innerHTML = '<p>Belum ada restoran favorit yang ditambahkan.</p>';
      return;
    }

    favorites.forEach((restaurant) => {
      const restaurantCard = document.createElement('div');
      restaurantCard.classList.add('restaurant-card');
      restaurantCard.innerHTML = `
        <img src="https://restaurant-api.dicoding.dev/images/medium/${restaurant.pictureId}" alt="${restaurant.name}" class="restaurant-image" />
        <h3>${restaurant.name}</h3>
        <p>${restaurant.city ? `Kota: ${restaurant.city}` : ''}</p>
        <p>${restaurant.rating ? `Rating: ${restaurant.rating}` : ''}</p>
        <p>${restaurant.description ? restaurant.description.slice(0, 100) + '...' : ''}</p>
        <a href="#/detail/${restaurant.id}" class="detail-link">Lihat Detail</a>
      `;
      favoritesContainer.appendChild(restaurantCard);
    });
  } catch (error) {
    console.error('Gagal mengambil data favorit:', error);
    favoritesContainer.innerHTML = '<p>Gagal memuat restoran favorit.</p>';
  }
};

const backToHomeButton = document.getElementById('back-to-home');
if (backToHomeButton) {
  backToHomeButton.addEventListener('click', () => {
    window.location.hash = '';
  });
}

export {displayFavoriteRestaurants};


