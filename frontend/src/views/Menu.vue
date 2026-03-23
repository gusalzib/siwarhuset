<template>
  <div class="menu-page container section">
    <h1 class="text-center">{{ $t("nav.menu") }}</h1>

    <div class="category-filter">
      <button
        v-for="cat in categories"
        :key="cat"
        @click="selectedCategory = cat"
        :class="[
          'btn',
          selectedCategory === cat ? 'btn-primary' : 'btn-secondary',
        ]"
      >
        {{ getCategoryTranslation(cat) }}
      </button>
    </div>

    <div v-if="loading" class="text-center mt-4">{{ $t('menu.loading') }}</div>
    <div v-else-if="error" class="text-center mt-4 text-error">{{ error }}</div>
    <div v-else class="products-grid mt-4">
      <div
        v-for="product in filteredProducts"
        :key="product._id"
        class="card product-card"
      >
        <img
          v-if="product.image && product.image.trim() !== ''"
          :src="product.image"
          :alt="product.name + ' - Freshly prepared at Siwar Huset'"
          class="product-img"
        />
        <div class="product-info p-4">
          <h3>{{ product.name }}</h3>
          <p class="desc">{{ product.description }}</p>
          <div class="price-row">
            <span class="price">{{ product.price.toFixed(2) }} SEK</span>
            <button @click="addToCart(product)" class="btn btn-primary btn-sm">
              {{ $t('menu.add_to_cart') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useToast } from "vue-toastification";

export default {
  name: "Menu",
  setup() {
    return { toast: useToast() };
  },
  data() {
    return {
      products: [],
      categories: [
        "All",
        "Pizzas",
        "Bakery",
        "Manakeesh",
        "Desserts",
        "Dairy",
        "Coffee/Tea",
        "Nuts",
        "Spices",
      ],
      selectedCategory: "All",
      loading: true,
      error: null,
    };
  },
  computed: {
    filteredProducts() {
      if (this.selectedCategory === "All") return this.products;
      return this.products.filter((p) => p.category === this.selectedCategory);
    },
  },
  async mounted() {
    await this.fetchProducts();
  },
  methods: {
    getCategoryTranslation(cat) {
      if (cat === "All") return this.$t("categories.all");
      if (cat === "Coffee/Tea") return this.$t("categories.coffee_tea");
      return this.$t(`categories.${cat.toLowerCase()}`);
    },
    async fetchProducts() {
      try {
        const { data } = await axios.get("http://localhost:5000/api/products");
        this.products = data;
        this.loading = false;
      } catch (err) {
        this.error = this.$t('menu.failed_to_load');
        this.loading = false;
      }
    },
    addToCart(product) {
      let cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existing = cart.find((item) => item._id === product._id);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ ...product, qty: 1 });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      this.toast.success(`${product.name} ${this.$t('menu.added_to_cart')}`);
    },
  },
};
</script>

<style scoped>
.category-filter {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.product-card {
  display: flex;
  flex-direction: column;
}

.product-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-info {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.desc {
  color: var(--color-text-light);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  flex-grow: 1;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.price {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-primary);
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.text-error {
  color: red;
}
</style>
