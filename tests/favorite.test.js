import {addFavorite, removeFavorite, getFavorites, isFavorite, openDatabase} from '../src/scripts/db';

describe('Favorite Restaurant Integration Test', () => {
  beforeAll(async () => {
    await openDatabase();
  });

  const sampleRestaurant = {
    id: 'qdv5juczeskfw1e867',
    name: 'Melting Pot',
    pictureId: 'https://restaurant-api.dicoding.dev/images/medium/14',
    city: 'Medan',
    rating: 4.2,
    description: 'Lorem ipsum dolor sit amet,',
  };

  it('should be able to add a restaurant to favorites', async () => {
    await addFavorite(sampleRestaurant);
    const favoriteRestaurants = await getFavorites();

    expect(favoriteRestaurants).toContainEqual(sampleRestaurant);
  });

  it('should be able to check if a restaurant is in favorites', async () => {
    const isFav = await isFavorite(sampleRestaurant.id);
    expect(isFav).toBe(true);
  });

  it('should be able to remove a restaurant from favorites', async () => {
    await removeFavorite(sampleRestaurant.id);
    const favoriteRestaurants = await getFavorites();

    expect(favoriteRestaurants).not.toContainEqual(sampleRestaurant);
  });

  it('should confirm that a removed restaurant is no longer in favorites', async () => {
    const isFav = await isFavorite(sampleRestaurant.id);
    expect(isFav).toBe(false);
  });
});
