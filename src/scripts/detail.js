import 'regenerator-runtime';
import {addFavorite, removeFavorite, isFavorite} from './db.js';

const getRestaurantDetail = async (id) => {
  try {
    const response = await fetch(`https://restaurant-api.dicoding.dev/detail/${id}`);

    // Log status respons untuk debug
    console.log('Response status:', response.status);

    if (!response.ok) throw new Error(`Gagal mengambil detail restoran: ${response.statusText}`);

    const data = await response.json();

    if (!data || !data.restaurant) throw new Error('Data restoran tidak ditemukan');

    return data.restaurant;
  } catch (error) {
    console.error('Error fetching restaurant detail:', error);
    return null; // Mengembalikan null jika terjadi kesalahan
  }
};


const displayRestaurantDetail = async (restaurant) => {
  const detailContent = document.getElementById('detail-content');
  if (!detailContent) {
    console.error('Element \'detail-content\' not found');
    return;
  }
  if (!restaurant) {
    detailContent.innerHTML = '<p>Data restoran tidak ditemukan.</p>';
    return;
  }


  detailContent.innerHTML = `
    <h3>${restaurant.name}</h3>
    <img src="https://restaurant-api.dicoding.dev/images/medium/${restaurant.pictureId}" alt="${restaurant.name}" />
    <p><strong>Alamat:</strong> ${restaurant.address}</p>
    <p><strong>Kota:</strong> ${restaurant.city}</p>
    <p><strong>Deskripsi:</strong> ${restaurant.description}</p>
    
    <h4>Menu Makanan:</h4>
    <ul>${restaurant.menus.foods.map((food) => `<li>${food.name}</li>`).join('')}</ul>

    <h4>Menu Minuman:</h4>
    <ul>${restaurant.menus.drinks.map((drink) => `<li>${drink.name}</li>`).join('')}</ul>

    <h4>Customer Reviews:</h4>
    <ul id="reviews-list">
      ${restaurant.customerReviews.map((review) => `
        <li>
          <strong>${review.name}</strong>: ${review.review} <em>(${review.date})</em>
        </li>`).join('')}
    </ul>

    <button id="back-button">Kembali ke Daftar Restoran</button>
    <button id="favorite-button">${await isFavorite(restaurant.id) ? 'Remove from Favorite' : 'Add to Favorite'}</button>
    <form id="review-form">
      <input type="text" id="reviewer-name" placeholder="Nama" required>
      <textarea id="review-text" placeholder="Review" required></textarea>
      <button type="submit">Kirim Review</button>
    </form>
  `;


  const reviewForm = document.getElementById('review-form');
  const reviewsContainer = document.getElementById('reviews-list');


  reviewForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const reviewerName = document.getElementById('reviewer-name').value;
    const reviewText = document.getElementById('review-text').value;
    const restaurantId = restaurant.id;

    try {
      const response = await fetch('https://restaurant-api.dicoding.dev/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: restaurantId,
          name: reviewerName,
          review: reviewText,
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal mengirim ulasan');
      }


      const newReview = document.createElement('li');
      newReview.innerHTML = `<strong>${reviewerName}</strong>: ${reviewText} <em>(Baru saja)</em>`;
      reviewsContainer.prepend(newReview);


      reviewForm.reset();
    } catch (error) {
      console.error(error);
      alert('Gagal mengirim ulasan. Silakan coba lagi.');
    }
  });


  const backButton = document.getElementById('back-button');
  if (backButton) {
    backButton.addEventListener('click', () => {
      window.location.hash = '#';
    });
  }


  const favoriteButton = document.getElementById('favorite-button');
  if (favoriteButton) {
    favoriteButton.addEventListener('click', async () => {
      const isFav = await isFavorite(restaurant.id);
      if (isFav) {
        await removeFavorite(restaurant.id);
        alert(`${restaurant.name} telah dihapus dari favorit.`);
        favoriteButton.textContent = 'Add to Favorite';
      } else {
        await addFavorite(restaurant);
        alert(`${restaurant.name} telah ditambahkan ke favorit.`);
        favoriteButton.textContent = 'Remove from Favorite';
      }
    });
  }
};

export {getRestaurantDetail, displayRestaurantDetail};
