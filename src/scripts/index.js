import 'regenerator-runtime';
import '../styles/main.css';
import '../styles/responsive.css';
import {openDatabase, getFavorites} from './db.js';
import {getRestaurantDetail, displayRestaurantDetail} from './detail.js';
import {displayFavoriteRestaurants} from './favorite.js';
import swRegister from './sw-register.js';
import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';

const menuButton = document.getElementById('menu');
const drawer = document.getElementById('drawer');

menuButton.addEventListener('click', () => {
  drawer.classList.toggle('open');
});

document.addEventListener('click', (event) => {
  if (!drawer.contains(event.target) && !menuButton.contains(event.target)) {
    drawer.classList.remove('open');
  }
});

const getRestaurants = async () => {
  try {
    const response = await fetch('https://restaurant-api.dicoding.dev/list');
    if (!response.ok) {
      throw new Error(`Gagal mengambil data restoran: ${response.statusText}`);
    }
    const data = await response.json();
    return data.restaurants;
  } catch (error) {
    console.error(error);
    alert('Tidak dapat mengambil data restoran. Silakan coba lagi nanti.');
    return [];
  }
};

const displayRestaurants = (restaurants) => {
  const restaurantList = document.getElementById('restaurant-list');
  restaurantList.innerHTML = '';

  restaurants.forEach((restaurant) => {
    const imageUrl = `https://restaurant-api.dicoding.dev/images/small/${restaurant.pictureId}`;

    const restaurantItem = `
      <div class="restaurant-item">
        <a href="#/detail/${restaurant.id}" class="restaurant-item__link" data-id="${restaurant.id}">
          <img 
            class="restaurant-item__thumbnail lazyload" 
            data-src="${imageUrl}" 
            alt="${restaurant.name}" 
          />
          <div class="restaurant-item__content">
            <h3 class="restaurant-item__title">${restaurant.name}</h3>
            <p class="restaurant-item__city">Kota: ${restaurant.city}</p>
            <p class="restaurant-item__rating">Rating: ${restaurant.rating}</p>
            <p class="restaurant-item__description">
              Deskripsi: ${restaurant.description}
            </p>
          </div>
        </a>
      </div>
    `;
    restaurantList.innerHTML += restaurantItem;
    const imgElement = restaurantList.querySelector(`img[data-src="${imageUrl}"]`);
    imgElement.onload = () => {
      imgElement.classList.remove('lazyload');
      imgElement.classList.add('lazyloaded');
      imgElement.src = imageUrl;
    };
  });
};

const loadRestaurantDetail = async (id) => {
  const restaurant = await getRestaurantDetail(id);
  if (restaurant) {
    displayRestaurantDetail(restaurant);
  } else {
    const detailContent = document.getElementById('detail-content');
    detailContent.innerHTML = '<p>Data restoran tidak ditemukan.</p>';
  }
};

const renderPage = async () => {
  const hash = window.location.hash.split('/');
  if (hash[1] === 'detail' && hash[2]) {
    await loadRestaurantDetail(hash[2]);
    document.getElementById('restaurant-list').classList.add('hidden');
    document.getElementById('restaurant-detail').classList.remove('hidden');

    window.scrollTo({
      top: document.getElementById('restaurant-detail').offsetTop,
      behavior: 'smooth',
    });
  } else {
    document.getElementById('restaurant-list').classList.remove('hidden');
    document.getElementById('restaurant-detail').classList.add('hidden');
  }
};

const init = async () => {
  const restaurants = await getRestaurants();
  displayRestaurants(restaurants);
  await loadFavorites();
};

const loadFavorites = async () => {
  await openDatabase();
  await getFavorites();
};

const router = async () => {
  const hash = window.location.hash;
  const restaurantList = document.getElementById('restaurant-list');
  const restaurantDetail = document.getElementById('restaurant-detail');
  const favoriteList = document.getElementById('favorite-list');

  restaurantList.classList.add('hidden');
  restaurantDetail.classList.add('hidden');
  favoriteList.classList.add('hidden');

  if (hash === '#/favorites') {
    favoriteList.classList.remove('hidden');
    await displayFavoriteRestaurants();
    window.scrollTo({top: favoriteList.offsetTop, behavior: 'smooth'});
  } else if (hash.startsWith('#/detail/')) {
    const id = hash.split('/')[2];
    restaurantDetail.classList.remove('hidden');
    await loadRestaurantDetail(id);
    window.scrollTo({top: restaurantDetail.offsetTop, behavior: 'smooth'});
  } else {
    restaurantList.classList.remove('hidden');
    const restaurants = await getRestaurants();
    displayRestaurants(restaurants);
  }
};

window.addEventListener('load', () => {
  init();
  swRegister();
});

window.addEventListener('hashchange', router);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./sw.bundle.js')
    .then((registration) => {
      console.log('Service worker registered:', registration);
    })
    .catch((error) => {
      console.error('Service worker registration failed:', error);
    });
}
