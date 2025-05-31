const foto = localStorage.getItem("fotoUtilizador");
if (foto) document.getElementById("user-photo").src = foto;

