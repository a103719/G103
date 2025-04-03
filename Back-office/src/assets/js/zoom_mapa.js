let zoomLevel = 1;
  
function zoomImage(event) {
  event.preventDefault();

  const image = document.getElementById("imagemMapa");
  const delta = event.deltaY > 0 ? -0.1 : 0.1;
  zoomLevel += delta;

  // Limites de zoom
  if (zoomLevel < 1) zoomLevel = 1;
  if (zoomLevel > 3) zoomLevel = 3;

  image.style.transform = `scale(${zoomLevel})`;
  image.style.transformOrigin = "center center";
}