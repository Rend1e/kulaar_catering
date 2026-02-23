// Анимация появления блоков при скролле
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.2 }
);

// Наблюдаем за всеми секциями
document.querySelectorAll("section").forEach((sec) => observer.observe(sec));

// Работа с корзиной
const cartModal = document.getElementById("cartModal");
const openCartBtn = document.getElementById("openCart");
const closeCartBtn = document.getElementById("closeCart");

if (openCartBtn) {
  openCartBtn.onclick = () => cartModal.classList.add("active");
}

if (closeCartBtn) {
  closeCartBtn.onclick = () => cartModal.classList.remove("active");
}

// Закрытие модалки по клику на фон
if (cartModal) {
  cartModal.onclick = (e) => {
    if (e.target === cartModal) {
      cartModal.classList.remove("active");
    }
  };
}

// Обработчики для кнопок "В корзину"
document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.onclick = (e) => {
    e.stopPropagation();
    const card = e.target.closest(".product-card");
    const title = card.querySelector(".product-title").textContent;
    const price = card.querySelector(".product-price").textContent;

    alert(`Товар "${title}" добавлен в корзину! Цена: ${price}`);
    // Здесь будет логика добавления в корзину
  };
});