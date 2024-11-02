/* eslint-disable */

Feature('Favorite Restaurants');

Scenario('Menyukai dan membatalkan suka pada restoran', async ({ I }) => {
  I.amOnPage('/#/restaurant-list');
  I.waitForElement('.restaurant-item', 30);
  I.seeElement('.restaurant-item');

  I.click({ xpath: '//*[@class and contains(concat(" ", normalize-space(@class), " "), " restaurant-item ")][position()=1]' });

  I.seeElement('#favorite-button');
  I.click('#favorite-button');
  I.wait(2);

  const popupText = await I.grabPopupText();
  if (popupText) {
    I.acceptPopup();
    I.wait(1);
  }

  I.seeElement('#favorite-button');
  I.say('Verifying the button text after adding to favorites');
  I.see('Remove from Favorite', '#favorite-button');

  I.click('#favorite-button');
  I.wait(2);

  const popupTextCancel = await I.grabPopupText();
  if (popupTextCancel) {
    I.acceptPopup();
    I.wait(1);
  }

  I.seeElement('#favorite-button');
  I.say('Verifying the button text after removing from favorites');
  I.see('Add to Favorite', '#favorite-button');
});

/* eslint-disable */

Feature('Review Restaurant');

Scenario('Positif: Menambahkan ulasan baru dengan data valid', async ({ I }) => {
  I.amOnPage('/#/restaurant-list');
  I.waitForElement('.restaurant-item', 30);
  I.seeElement('.restaurant-item');

  I.click({ xpath: '//*[@class and contains(concat(" ", normalize-space(@class), " "), " restaurant-item ")][position()=1]' });

  I.waitForElement('#review-form', 5); 
  I.seeElement('#review-form');


  I.fillField('#reviewer-name', 'Test User');
  I.fillField('#review-text', 'Makanan lezat dan pelayanan baik!');
  

  I.click('#review-form button[type="submit"]');
  

  I.waitForElement('#reviews-list li:last-child', 5);
  I.see('Test User', '#reviews-list li:last-child');
  I.see('Makanan lezat dan pelayanan baik!', '#reviews-list li:last-child');
});