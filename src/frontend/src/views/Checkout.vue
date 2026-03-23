<template>
  <div class="checkout-page container section">
    <h1 class="text-center">{{ $t("nav.cart") }}</h1>

    <div v-if="cart.length === 0" class="text-center mt-4">
      <p>{{ $t("checkout.empty_cart") }}</p>
      <router-link to="/menu" class="btn btn-primary mt-4"
        >{{ $t("checkout.browse_menu") }}</router-link
      >
    </div>

    <div v-else class="checkout-grid mt-4">
      <div class="cart-items card p-4">
        <h3>{{ $t("checkout.order_items") }}</h3>
        <div v-for="item in cart" :key="item._id" class="cart-item">
          <div>
            <strong>{{ item.name }}</strong>
            <div class="text-sm">
              {{ $t("checkout.qty") }}: {{ item.qty }} x {{ item.price.toFixed(2) }} SEK
            </div>
          </div>
          <div class="item-total">
            {{ (item.qty * item.price).toFixed(2) }} SEK
            <button @click="removeItem(item._id)" class="btn-remove">X</button>
          </div>
        </div>
        <div class="cart-total mt-4">
          <strong>{{ $t("checkout.total_amount") }}:</strong>
          <span>{{ totalAmount.toFixed(2) }} SEK</span>
        </div>
      </div>

      <div class="checkout-form card p-4">
        <h3>{{ $t("checkout.checkout_details") }}</h3>
        <form @submit.prevent="submitOrder">
          <div class="form-group">
            <label>{{ $t("checkout.name") }}</label>
            <input type="text" v-model="form.customerName" required />
          </div>
          <div class="form-group">
            <label>{{ $t("checkout.email") }}</label>
            <input type="email" v-model="form.customerEmail" required />
          </div>
          <div class="form-group">
            <label>{{ $t("checkout.phone") }}</label>
            <input type="tel" v-model="form.customerPhone" required />
          </div>
          <div class="form-group">
            <label>{{ $t("checkout.payment_method") }}</label>
            <select v-model="form.paymentMethod" required>
              <option value="Credit Card">{{ $t("checkout.credit_card") }}</option>
              <option value="Swish">{{ $t("checkout.swish") }}</option>
            </select>
          </div>

          <div v-if="form.paymentMethod === 'Swish'" class="payment-info mt-4">
            <p>
              <strong>{{ $t("checkout.swish_sim") }}</strong> {{ $t("checkout.swish_desc") }}
              {{ form.customerPhone }}.
            </p>
          </div>
          <div
            v-if="form.paymentMethod === 'Credit Card'"
            class="payment-info mt-4"
          >
            <p>
              <strong>{{ $t("checkout.card_sim") }}</strong> {{ $t("checkout.card_desc") }}
            </p>
            <input
              type="text"
              :placeholder="$t('checkout.card_number')"
              class="mt-4"
            />
          </div>

          <button
            type="submit"
            class="btn btn-primary mt-4 btn-block"
            :disabled="loading"
          >
            {{ loading ? $t("checkout.processing") : $t("checkout.place_order") }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useToast } from "vue-toastification";

export default {
  name: "Checkout",
  setup() {
    return { toast: useToast() };
  },
  data() {
    return {
      cart: [],
      form: {
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        paymentMethod: "Credit Card",
      },
      loading: false,
    };
  },
  computed: {
    totalAmount() {
      return this.cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    },
  },
  mounted() {
    this.cart = JSON.parse(localStorage.getItem("cart") || "[]");
  },
  methods: {
    removeItem(id) {
      this.cart = this.cart.filter((item) => item._id !== id);
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },
    async submitOrder() {
      this.loading = true;
      try {
        const orderData = {
          ...this.form,
          items: this.cart.map((i) => ({
            product: i._id,
            name: i.name,
            quantity: i.qty,
            price: i.price,
          })),
          totalAmount: this.totalAmount,
        };

        await axios.post(`${import.meta.env.VITE_API_URL}/orders`, orderData);

        this.toast.success(this.$t("checkout.success"));
        this.cart = [];
        localStorage.removeItem("cart");
        this.form = {
          customerName: "",
          customerEmail: "",
          customerPhone: "",
          paymentMethod: "Credit Card",
        };
      } catch (error) {
        this.toast.error(this.$t("checkout.error"));
      }
      this.loading = false;
    },
  },
};
</script>

<style scoped>
.checkout-grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 2rem;
}

@media (max-width: 768px) {
  .checkout-grid {
    grid-template-columns: 1fr;
  }
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-border);
}

.cart-item:last-child {
  border-bottom: none;
}

.text-sm {
  font-size: 0.875rem;
  color: var(--color-text-light);
}

.item-total {
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-remove {
  background: none;
  border: none;
  color: red;
  cursor: pointer;
  font-weight: bold;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  font-size: 1.25rem;
  border-top: 2px solid var(--color-border);
  padding-top: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.btn-block {
  width: 100%;
}

.payment-info {
  background: var(--color-background);
  padding: 1rem;
  border-radius: var(--border-radius-sm);
  font-size: 0.9rem;
}
</style>
