<template>
  <div class="admin-page container section">
    <h1 class="text-center">{{ $t('admin.title') }}</h1>

    <div v-if="!token" class="login-form card p-4 mx-auto" style="max-width: 400px; margin: 0 auto; margin-top: 2rem;">
      <h3>{{ $t('admin.login_title') }}</h3>
      <form @submit.prevent="handleLogin">
        <div class="form-group mt-4">
          <label>{{ $t('admin.email') }}</label>
          <input type="email" v-model="loginForm.email" required />
        </div>
        <div class="form-group mt-4">
          <label>{{ $t('admin.password') }}</label>
          <input type="password" v-model="loginForm.password" required />
        </div>
        <button type="submit" class="btn btn-primary btn-block mt-4" :disabled="loading">
          {{ loading ? $t('admin.logging_in') : $t('admin.login_btn') }}
        </button>
      </form>
    </div>

    <div v-else class="dashboard mt-4">
      <div class="d-flex justify-between align-center mb-4">
        <h2>{{ $t('admin.dashboard') }}</h2>
        <button @click="logout" class="btn btn-secondary">{{ $t('admin.logout') }}</button>
      </div>

      <div class="tabs mb-4">
        <button 
          :class="['btn', activeTab === 'pending' ? 'btn-primary' : 'btn-secondary']"
          @click="activeTab = 'pending'"
        >{{ $t('admin.pending_orders') }} <span v-if="pendingCount > 0">({{ pendingCount }})</span></button>
        <button 
          :class="['btn', activeTab === 'history' ? 'btn-primary' : 'btn-secondary']"
          @click="activeTab = 'history'"
        >{{ $t('admin.order_history') }}</button>
        <button 
          :class="['btn', activeTab === 'inventory' ? 'btn-primary' : 'btn-secondary']"
          @click="activeTab = 'inventory'"
        >{{ $t('admin.inventory') }}</button>
      </div>

      <div v-if="['pending', 'history'].includes(activeTab)" class="orders-section">
        <div class="card p-4">
          <h3>
            {{ activeTab === 'pending' ? $t('admin.pending_orders') : $t('admin.order_history') }}
            <span v-if="activeTab === 'pending' && pendingCount > 0">({{ pendingCount }})</span>
          </h3>
          <div style="overflow-x: auto;">
            <table class="table w-100 mt-4">
              <thead>
                <tr>
                  <th>{{ $t('admin.id') }}</th>
                  <th>{{ $t('admin.time') }}</th>
                  <th>{{ $t('admin.customer') }}</th>
                  <th>{{ $t('admin.order_products') }}</th>
                  <th>{{ $t('admin.total') }}</th>
                  <th>{{ $t('admin.status') }}</th>
                  <th>{{ $t('admin.action') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in displayedOrders" :key="order._id">
                  <td>{{ order._id.substring(0, 8) }}</td>
                  <td>{{ new Date(order.createdAt).toLocaleString() }}</td>
                  <td>{{ order.customerName }}<br/><small>{{ order.customerPhone }}</small></td>
                  <td>
                    <ul style="margin: 0; padding-left: 1rem; font-size: 0.9rem;">
                      <li v-for="item in order.items" :key="item._id">
                        {{ item.quantity }}x {{ item.name }}
                      </li>
                    </ul>
                  </td>
                  <td>{{ order.totalAmount.toFixed(2) }} SEK</td>
                  <td>
                    <span v-if="order.status === 'pending'">{{ $t('admin.pending') }}</span>
                    <span v-else-if="order.status === 'completed'">{{ $t('admin.completed') }}</span>
                    <span v-else-if="order.status === 'cancelled'">{{ $t('admin.cancelled') }}</span>
                    <span v-else>{{ order.status }}</span>
                  </td>
                  <td>
                    <select v-model="order.status" @change="updateOrderStatus(order)">
                      <option value="pending">{{ $t('admin.pending') }}</option>
                      <option value="completed">{{ $t('admin.completed') }}</option>
                      <option value="cancelled">{{ $t('admin.cancelled') }}</option>
                    </select>
                  </td>
                </tr>
                <tr v-if="displayedOrders.length === 0">
                  <td colspan="7" class="text-center pt-4 pb-4">{{ $t('admin.no_orders') }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'inventory'" class="inventory-section">
        <div class="card p-4">
          <h3>{{ $t('admin.manage_inventory') }}</h3>
          <form @submit.prevent="addProduct" class="mb-4 mt-4">
            <h4>{{ $t('admin.add_product') }}</h4>
            <div class="grid-form mt-4">
              <div class="form-group"><input type="text" v-model="newProduct.name" :placeholder="$t('admin.name')" required /></div>
              <div class="form-group"><input type="number" step="0.01" v-model="newProduct.price" :placeholder="$t('admin.price')" required /></div>
              <div class="form-group">
                <select v-model="newProduct.category" required>
                  <option value="Pizzas">{{ $t('categories.pizzas') }}</option>
                  <option value="Bakery">{{ $t('categories.bakery') }}</option>
                  <option value="Manakeesh">{{ $t('categories.manakeesh') }}</option>
                  <option value="Desserts">{{ $t('categories.desserts') }}</option>
                  <option value="Dairy">{{ $t('categories.dairy') }}</option>
                  <option value="Coffee/Tea">{{ $t('categories.coffee_tea') }}</option>
                  <option value="Nuts">{{ $t('categories.nuts') }}</option>
                  <option value="Spices">{{ $t('categories.spices') }}</option>
                </select>
              </div>
              <div class="form-group"><input type="text" v-model="newProduct.description" :placeholder="$t('admin.description')" /></div>
              <div class="form-group">
                <input type="file" @change="uploadFile" accept="image/*" />
                <div v-if="newProduct.image" class="mt-2">
                  <img :src="newProduct.image" alt="Preview" style="max-height: 100px; border-radius: 4px;" />
                </div>
                <small v-if="uploading">Uploading...</small>
              </div>
            </div>
            <button type="submit" class="btn btn-primary mt-2">{{ $t('admin.btn_add') }}</button>
          </form>

          <h4 class="mt-4 border-top pt-4">{{ $t('admin.current_products') }}</h4>
          <div style="overflow-x: auto;">
            <table class="table w-100 mt-4">
              <thead>
                <tr>
                  <th>{{ $t('admin.name') }}</th>
                  <th>{{ $t('admin.category') }}</th>
                  <th>{{ $t('admin.price') }}</th>
                  <th>{{ $t('admin.action') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in products" :key="product._id">
                  <td>{{ product.name }}</td>
                  <td>{{ product.category === 'Coffee/Tea' ? $t('categories.coffee_tea') : $t(`categories.${product.category.toLowerCase()}`) }}</td>
                  <td>{{ product.price.toFixed(2) }} SEK</td>
                  <td>
                    <button @click="deleteProduct(product._id)" class="btn-remove">{{ $t('admin.delete') }}</button>
                  </td>
                </tr>
                <tr v-if="products.length === 0">
                  <td colspan="4" class="text-center pt-4 pb-4">{{ $t('admin.no_products') }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useToast } from 'vue-toastification';

export default {
  name: 'Admin',
  setup() {
    return { toast: useToast() }
  },
  data() {
    return {
      token: localStorage.getItem('adminToken') || '',
      loginForm: { email: '', password: '' },
      loading: false,
      uploading: false,
      activeTab: 'pending',
      orders: [],
      products: [],
      newProduct: {
        name: '', price: '', category: 'Pizzas', description: '', image: ''
      }
    }
  },
  computed: {
    pendingOrders() {
      return this.orders.filter(o => o.status === 'pending');
    },
    historyOrders() {
      return this.orders.filter(o => o.status !== 'pending');
    },
    pendingCount() {
      return this.pendingOrders.length;
    },
    displayedOrders() {
      return this.activeTab === 'pending' ? this.pendingOrders : this.historyOrders;
    }
  },
  mounted() {
    if (this.token) {
      this.fetchAdminData();
    }
  },
  methods: {
    getAuthHeaders() {
      return { headers: { Authorization: `Bearer ${this.token}` } };
    },
    async handleLogin() {
      this.loading = true;
      try {
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, this.loginForm);
        this.token = data.token;
        localStorage.setItem('adminToken', data.token);
        this.toast.success('Login Successful');
        this.fetchAdminData();
      } catch (error) {
        this.toast.error('Invalid Credentials');
      }
      this.loading = false;
    },
    logout() {
      this.token = '';
      localStorage.removeItem('adminToken');
      this.orders = [];
      this.products = [];
    },
    async uploadFile(e) {
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('image', file);
      this.uploading = true;
      try {
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${this.token}`
          },
        };
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/upload`, formData, config);
        this.newProduct.image = `${import.meta.env.VITE_BASE_URL}${data.url}`;
        this.toast.success('Image Uploaded');
      } catch (error) {
        this.toast.error('Image upload failed');
      }
      this.uploading = false;
    },
    async fetchAdminData() {
      try {
        const pRes = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
        this.products = pRes.data;

        const oRes = await axios.get(`${import.meta.env.VITE_API_URL}/orders`, this.getAuthHeaders());
        this.orders = oRes.data;
      } catch (error) {
        this.toast.error('Failed to fetch admin data (or unauthorized).');
        if (error.response && error.response.status === 401) {
          this.logout();
        }
      }
    },
    async updateOrderStatus(order) {
      try {
        await axios.put(`${import.meta.env.VITE_API_URL}/orders/${order._id}/status`, { status: order.status }, this.getAuthHeaders());
        this.toast.success('Order status updated');
        await this.fetchAdminData();
      } catch (error) {
        this.toast.error('Failed to update status');
      }
    },
    async addProduct() {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/products`, this.newProduct, this.getAuthHeaders());
        this.toast.success('Product added successfully!');
        this.newProduct = { name: '', price: '', category: 'Pizzas', description: '', image: '' };
        this.fetchAdminData();
      } catch (error) {
        this.toast.error('Failed to add product');
      }
    },
    async deleteProduct(id) {
      if (!confirm('Are you sure?')) return;
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/products/${id}`, this.getAuthHeaders());
        this.toast.success('Product deleted');
        this.fetchAdminData();
      } catch (error) {
        this.toast.error('Failed to delete product');
      }
    }
  }
}
</script>

<style scoped>
.form-group { margin-bottom: 0; }
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}
.btn-block { width: 100%; }
.mt-4 { margin-top: 1.5rem; }
.mt-2 { margin-top: 0.5rem; }
.mb-4 { margin-bottom: 1.5rem; }
.pt-4 { padding-top: 1.5rem; }
.pb-4 { padding-bottom: 1.5rem; }
.p-4 { padding: 1.5rem; }
.mx-auto { margin-left: auto; margin-right: auto; }
.d-flex { display: flex; }
.justify-between { justify-content: space-between; }
.align-center { align-items: center; }
.tabs { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; }
.table { width: 100%; border-collapse: collapse; min-width: 600px; }
.table th, .table td { padding: 1rem; border-bottom: 1px solid var(--color-border); text-align: left; }
.table th { font-weight: 600; color: var(--color-secondary); background: #f8fafc; }
.btn-remove { background: none; border: none; color: red; cursor: pointer; text-decoration: underline; }
.w-100 { width: 100%; }
.grid-form { display: grid; gap: 1rem; grid-template-columns: 1fr 1fr; }
.border-top { border-top: 1px solid var(--color-border); }
@media (max-width: 768px) {
  .grid-form { grid-template-columns: 1fr; }
}
</style>
