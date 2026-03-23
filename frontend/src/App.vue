<template>
  <div id="app-container">
    <header class="navbar glass-panel">
      <div class="container nav-content">
        <div class="logo">
          <h2>Siwar Huset</h2>
        </div>
        <nav :class="['nav-links', { 'mobile-open': isMobileMenuOpen }]">
          <router-link to="/" @click="closeMenu">{{ $t("nav.home") }}</router-link>
          <router-link to="/menu" @click="closeMenu">{{ $t("nav.menu") }}</router-link>
          <router-link to="/atmosphere" @click="closeMenu">{{ $t("nav.atmosphere") }}</router-link>
          <router-link to="/checkout" @click="closeMenu">{{ $t("nav.cart") }}</router-link>
        </nav>
        <div class="mobile-controls">
          <div class="lang-switcher">
            <select v-model="currentLocale" @change="changeLanguage" class="lang-select">
              <option value="sv">SV</option>
              <option value="en">EN</option>
              <option value="ar">AR</option>
            </select>
          </div>
          <button class="hamburger" @click="toggleMenu" aria-label="Toggle Navigation">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
          </button>
        </div>
      </div>
    </header>

    <main class="main-content">
      <router-view />
    </main>

    <footer class="footer">
      <div class="container text-center">
        <p>&copy; 2026 Siwar Huset. All rights reserved.</p>
        <router-link to="/admin" class="admin-link">{{ $t("nav.admin") }}</router-link>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      currentLocale: this.$i18n.locale,
      isMobileMenuOpen: false
    }
  },
  watch: {
    $route(to) {
      this.updateDocumentTitle(to);
    },
    currentLocale() {
      if (this.$route) this.updateDocumentTitle(this.$route);
    }
  },
  methods: {
    toggleMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    },
    closeMenu() {
      this.isMobileMenuOpen = false;
    },
    changeLanguage() {
      this.$i18n.locale = this.currentLocale;
      localStorage.setItem('locale', this.currentLocale);
      this.updateDirection();
    },
    updateDirection() {
      const dir = this.currentLocale === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.setAttribute('dir', dir);
    },
    updateDocumentTitle(route) {
      const routeMap = {
        'Home': 'nav.home',
        'Menu': 'nav.menu',
        'Atmosphere': 'nav.atmosphere',
        'Checkout': 'nav.cart',
        'Admin': 'nav.admin'
      };
      const key = routeMap[route.name];
      const pageName = key ? this.$t(key) : route.name;
      document.title = pageName ? `${pageName} - Siwar Huset` : 'Siwar Huset';
      
      const metaTag = document.getElementById('meta-description');
      if (metaTag) {
        const descKeyMap = {
          'Home': 'home.welcome',
          'Menu': 'home.card1_desc',
          'Atmosphere': 'home.card3_desc'
        };
        const descKey = descKeyMap[route.name] || 'home.welcome';
        metaTag.setAttribute('content', this.$t(descKey) + ' - Siwar Huset');
      }
    }
  },
  mounted() {
    this.updateDirection();
  }
}
</script>

<style scoped>
#app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 1rem 0;
  margin-bottom: 2rem;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo h2 {
  margin: 0;
  color: var(--color-primary);
  font-family: var(--font-heading);
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-links a {
  font-weight: 500;
  color: var(--color-text-main);
  text-decoration: none;
}

.nav-links a.router-link-active {
  color: var(--color-primary);
  border-bottom: 2px solid var(--color-primary);
}

.lang-select {
  padding: 0.5rem;
  width: auto;
  border-radius: var(--border-radius-sm);
  background: var(--color-background);
  color: var(--color-text-main);
}

.mobile-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.hamburger {
  display: none;
  background: none;
  border: none;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
  padding: 0;
}

.hamburger .bar {
  width: 25px;
  height: 3px;
  background-color: var(--color-primary);
  border-radius: 2px;
}

@media (max-width: 768px) {
  .nav-content {
    flex-wrap: wrap;
  }
  .hamburger {
    display: flex;
  }
  .nav-links {
    display: none;
    flex-direction: column;
    width: 100%;
    order: 3;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-border);
  }
  .nav-links.mobile-open {
    display: flex;
  }
}

.main-content {
  flex-grow: 1;
}

.footer {
  background: var(--color-secondary);
  color: white;
  padding: 2rem 0;
  margin-top: 4rem;
}

.text-center {
  text-align: center;
}

.admin-link {
  color: var(--color-text-light);
  font-size: 0.875rem;
  margin-top: 1rem;
  display: inline-block;
}

.admin-link:hover {
  color: white;
}
</style>
