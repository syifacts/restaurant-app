
export const lazyLoadImages = () => {
  const images = document.querySelectorAll('img[data-src]');

  const loadImage = (image) => {
    const src = image.getAttribute('data-src');
    if (!src) return;

    image.src = src;
    image.onload = () => {
      image.removeAttribute('data-src');
    };
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        loadImage(entry.target);
        observer.unobserve(entry.target);
      }
    });
  });

  images.forEach((image) => {
    observer.observe(image);
  });
};
