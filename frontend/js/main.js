// js/main.js

console.log("AgroVision loaded!");

// Toggle menu mobile
const mobileMenuButton = document.querySelector("#mobile-menu-button");
const mobileMenu = document.querySelector("#mobile-menu");

// cek dulu elemen ketemu (biar tidak error)
if (mobileMenuButton && mobileMenu) {
  mobileMenuButton.addEventListener("click", function () {
    mobileMenu.classList.toggle("hidden");
  });
}
