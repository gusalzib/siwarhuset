<template>
  <div class="home">
    <section class="hero glass-panel">
      <div class="hero-content">
        <h1 class="hero-title">{{ $t("hero.title") }}</h1>
        <p class="hero-subtitle">{{ $t("hero.subtitle") }}</p>
        <router-link to="/menu" class="btn btn-primary mt-4">
          {{ $t("hero.cta") }}
        </router-link>
      </div>
    </section>

    <section class="section container features">
      <div class="card text-center">
        <img src="/images/bakery_card.png" :alt="$t('home.card1_title') + ' - Authentic oriental bakery'" class="card-img" />
        <div class="card-body p-4">
          <h3>{{ $t("home.card1_title") }}</h3>
          <p>{{ $t("home.card1_desc") }}</p>
        </div>
      </div>
      <div class="card text-center">
        <img src="/images/spices_card.png" :alt="$t('home.card2_title') + ' - Premium imported oriental spices'" class="card-img" />
        <div class="card-body p-4">
          <h3>{{ $t("home.card2_title") }}</h3>
          <p>{{ $t("home.card2_desc") }}</p>
        </div>
      </div>
      <div class="card text-center">
        <img src="/images/cafe_card.png" :alt="$t('home.card3_title') + ' - Cozy oriental seating and coffee'" class="card-img" />
        <div class="card-body p-4">
          <h3>{{ $t("home.card3_title") }}</h3>
          <p>{{ $t("home.card3_desc") }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { useToast } from 'vue-toastification'

export default {
  name: 'Home',
  setup() {
    return { toast: useToast() }
  },
  mounted() {
    this.toast.info(this.$t('home.welcome'), {
      timeout: 2000
    });
  }
}
</script>

<style scoped>
.home {
  animation: fadeIn 0.5s ease;
}

.hero {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 2rem;
  background: linear-gradient(rgba(10, 25, 47, 0.7), rgba(10, 25, 47, 0.7)),
              url('https://images.unsplash.com/photo-1542314831-c6a4d14eff40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80') center/cover no-repeat;
  color: white;
  border-radius: var(--border-radius-lg);
  border: none;
}

.hero-title {
  font-size: 3rem;
  color: var(--color-primary);
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  font-weight: 300;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.card {
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.card-img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-bottom: 1px solid var(--color-border);
}

.card-body {
  flex: 1;
}

.p-4 {
  padding: 2rem;
}

.mt-4 {
  margin-top: 2rem;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .hero {
    margin: 1rem 0;
    min-height: 40vh;
  }
  .hero-title {
    font-size: 2.2rem;
  }
  .hero-subtitle {
    font-size: 1.2rem;
  }
}
</style>
