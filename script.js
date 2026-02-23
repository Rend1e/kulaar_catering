// ========== УТИЛИТЫ ==========

/**
 * Плавный скролл к элементу
 * @param {string} elementId - ID элемента
 * @param {number} offset - смещение в пикселях
 */
function scrollCategory(elementId, offset) {
  const container = document.getElementById(elementId);
  if (!container) return;
  
  container.scrollBy({
    left: offset,
    behavior: 'smooth'
  });
}

// ========== КОРЗИНА ==========

class CartManager {
  constructor() {
    this.modal = document.getElementById('cartModal');
    this.openBtn = document.getElementById('openCart');
    this.closeBtn = document.getElementById('closeCart');
    this.cartItems = [];
    
    this.init();
  }
  
  init() {
    this.initModalHandlers();
    this.initAddToCartButtons();
  }
  
  initModalHandlers() {
    if (!this.modal) return;
    
    if (this.openBtn) {
      this.openBtn.addEventListener('click', () => this.openModal());
    }
    
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.closeModal());
    }
    
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.closeModal();
      }
    });
  }
  
  openModal() {
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  closeModal() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  addToCart(card) {
    const product = {
      id: Date.now() + Math.random(),
      title: card.querySelector('.product-title')?.textContent || 'Без названия',
      price: card.querySelector('.product-price')?.textContent || '0 ₽',
      weight: card.querySelector('.product-weight')?.textContent || '',
      quantity: 1
    };
    
    this.cartItems.push(product);
    this.showNotification(`✅ "${product.title}" добавлен в корзину!`);
    this.updateCartCounter();
  }
  
  showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #000;
      color: #fff;
      padding: 12px 24px;
      border-radius: 30px;
      font-size: 14px;
      z-index: 3000;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      animation: slideUp 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 2500);
  }
  
  updateCartCounter() {
    const cartButton = document.getElementById('openCart');
    if (!cartButton) return;
    
    const count = this.cartItems.length;
    let counter = cartButton.querySelector('.cart-counter');
    
    if (count > 0) {
      if (!counter) {
        counter = document.createElement('span');
        counter.className = 'cart-counter';
        counter.style.cssText = `
          background: red;
          color: white;
          border-radius: 50%;
          padding: 2px 6px;
          font-size: 11px;
          margin-left: 5px;
        `;
        cartButton.appendChild(counter);
      }
      counter.textContent = count;
    } else if (counter) {
      counter.remove();
    }
  }
  
  initAddToCartButtons() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const card = e.target.closest('.product-card');
        if (!card) return;
        
        this.addToCart(card);
      });
    });
  }
}

// ========== НАВИГАЦИЯ ==========

class NavigationManager {
  constructor() {
    this.sections = document.querySelectorAll('.menu-block');
    this.navLinks = document.querySelectorAll('.menu-categories a');
    this.currentSection = '';
    
    this.init();
  }
  
  init() {
    this.initScrollSpy();
    this.initSmoothScroll();
  }
  
  initScrollSpy() {
    window.addEventListener('scroll', () => {
      this.updateActiveSection();
    }, { passive: true });
  }
  
  updateActiveSection() {
    const scrollPosition = window.scrollY + 150;
    
    this.sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        const currentId = section.getAttribute('id');
        if (this.currentSection !== currentId) {
          this.currentSection = currentId;
          this.highlightActiveLink(currentId);
        }
      }
    });
  }
  
  highlightActiveLink(sectionId) {
    this.navLinks.forEach(link => {
      link.classList.remove('active');
      
      const href = link.getAttribute('href');
      if (href === `#${sectionId}`) {
        link.classList.add('active');
      }
    });
  }
  
  initSmoothScroll() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        if (!targetId || targetId === '#') return;
        
        const targetSection = document.querySelector(targetId);
        if (!targetSection) return;
        
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      });
    });
  }
}

// ========== МОБИЛЬНЫЕ УЛУЧШЕНИЯ ==========

function initMobileEnhancements() {
  const isMobile = window.innerWidth <= 768;
  
  if (isMobile) {
    const scrollContainers = document.querySelectorAll('.horizontal-scroll');
    
    scrollContainers.forEach(container => {
      let isDown = false;
      let startX;
      let scrollLeft;
      
      // Мышь
      container.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
      });
      
      container.addEventListener('mouseleave', () => {
        isDown = false;
      });
      
      container.addEventListener('mouseup', () => {
        isDown = false;
      });
      
      container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
      });
      
      // Touch
      container.addEventListener('touchstart', (e) => {
        isDown = true;
        startX = e.touches[0].pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
      });
      
      container.addEventListener('touchend', () => {
        isDown = false;
      });
      
      container.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.touches[0].pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
      });
    });
  }
}

// ========== АНИМАЦИИ ==========

function addGlobalAnimations() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translate(-50%, 20px);
      }
      to {
        opacity: 1;
        transform: translate(-50%, 0);
      }
    }
    
    @keyframes fadeOut {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========

document.addEventListener('DOMContentLoaded', () => {
  console.log('Кулаар Кейтеринг: инициализация...');
  
  addGlobalAnimations();
  
  // Проверяем, есть ли секции на странице
  if (document.querySelectorAll('section').length > 0) {
    console.log('Секции найдены');
  }
  
  // Проверяем, есть ли карточки товаров
  if (document.querySelectorAll('.product-card').length > 0) {
    console.log('Карточки товаров найдены');
  }
  
  const cart = new CartManager();
  const navigation = new NavigationManager();
  initMobileEnhancements();
  
  console.log('Кулаар Кейтеринг: готов к работе!');
});

// ========== ОБРАБОТКА РАЗМЕРА ОКНА ==========

let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    initMobileEnhancements();
  }, 250);
});

// ========== ДОПОЛНИТЕЛЬНО: АНИМАЦИЯ ПОЯВЛЕНИЯ ==========
// Простая анимация без скрытия контента

window.addEventListener('load', () => {
  // Добавляем класс visible ко всем секциям постепенно
  const sections = document.querySelectorAll('section');
  sections.forEach((section, index) => {
    setTimeout(() => {
      section.style.opacity = '1';
      section.style.transform = 'translateY(0)';
    }, index * 100);
  });
});