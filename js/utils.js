// js/utils.js
export function loadImages(paths, callback) {
  const images = [];
  let loadedCount = 0;

  paths.forEach((path, i) => {
    const img = new Image();
    img.src = path;
    img.onload = () => {
      loadedCount++;
      if (loadedCount === paths.length) {
        callback(images);
      }
    };
    images[i] = img;
  });
}
