<template>
  <div class="menu-page">

    <!-- HEADER MENU -->
    <section class="menu-header">
      <p>MENU KAMI</p>
      <h1><span>Warung Mak Bos</span></h1>
      <div class="line"></div>
      <p class="description">
        Nikmati berbagai pilihan makanan dan minuman lezat, hemat, dan cocok untuk menemani aktivitasmu.
      </p>
    </section>

    <!-- BAR PENCARIAN & CATEGORY TAB FILTER -->
    <section class="filter-search-section">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Cari makanan atau minuman..." 
        />
        <button v-if="searchQuery" @click="searchQuery = ''" class="clear-search">✕</button>
      </div>

      <!-- Tab Kategori -->
      <div class="category-tabs">
        <button 
          :class="['tab-btn', { active: selectedCategory === 'all' }]"
          @click="selectedCategory = 'all'"
        >
          🍽️ Semua ({{ products.length }})
        </button>
        <button 
          :class="['tab-btn', { active: selectedCategory === 'makanan' }]"
          @click="selectedCategory = 'makanan'"
        >
          🍛 Makanan ({{ countByCategory('makanan') }})
        </button>
        <button 
          :class="['tab-btn', { active: selectedCategory === 'minuman' }]"
          @click="selectedCategory = 'minuman'"
        >
          🥤 Minuman ({{ countByCategory('minuman') }})
        </button>
      </div>
    </section>

    <!-- ADMIN PANEL -->
    <section v-if="isAdmin" class="admin-panel">
      <div class="admin-header">
        <h3>⚡ Panel Admin - Tambah Menu</h3>
        <button @click="exitAdmin" class="btn-exit">Keluar Mode Admin</button>
      </div>
      <form @submit.prevent="createProduct" class="admin-form" enctype="multipart/form-data">
        <div class="form-group">
          <input v-model="form.name" placeholder="Nama Makanan / Minuman" required />
        </div>

        <div class="form-group">
          <select v-model="form.category" class="select-category" required>
            <option value="makanan">🍛 Makanan</option>
            <option value="minuman">🥤 Minuman</option>
          </select>
        </div>

        <div class="price-input-wrapper">
          <span class="currency-prefix">Rp</span>
          <input 
            type="text"
            v-model="form.price"
            @input="handlePriceInput"
            class="input-price-no-spinner" 
            placeholder="0"
            required 
          />
        </div>

        <div class="form-group file-upload-wrapper">
          <label class="custom-file-upload">
            <input type="file" @change="handleFileUpload" accept="image/jpeg,image/png,image/jpg,image/webp"/>
            <span class="file-label">
              📁 {{ selectedFileName || 'Pilih Gambar (JPG, JPEG, PNG, WEBP max 2MB)' }}
            </span>
          </label>
        </div>

        <!-- Deskripsi Opsional -->
        <div class="form-group full-width">
          <textarea 
            v-model="form.description" 
            class="fixed-textarea" 
            placeholder="Deskripsi Makanan / Minuman (Opsional)" 
            rows="4"
          ></textarea>
        </div>

        <button type="submit" class="btn-save full-width">+ Tambah Menu</button>
      </form>
    </section>

    <!-- CONTAINER DAFTAR MENU -->
    <section class="menu-container">
      <div v-if="filteredProducts.length === 0" class="empty-state">
        <p>🔍 Menu yang kamu cari tidak ditemukan...</p>
      </div>

      <div v-for="product in filteredProducts" :key="product.id" class="menu-card">
        <div class="image-wrapper">
          <!-- FIX: Menghapus gambar ganda -->
          <img 
            :src="product.image || '/images/gambardefault.png'" 
            :alt="product.name" 
            @error="(e) => e.target.src = '/images/gambardefault.png'"
          />
          <span class="category-badge">
            {{ (product.category || '').toLowerCase() === 'minuman' ? '🥤 Minuman' : '🍛 Makanan' }}
          </span>
        </div>
        <div class="menu-info">
          <h2>{{ product.name }}</h2>
          
          <div class="description-scroll-wrapper">
            <p>{{ product.description || '' }}</p>
          </div>

          <div class="bottom">
            <strong>{{ formatRupiah(product.price) }}</strong>
            <div v-if="isAdmin" class="admin-actions">
              <button @click="openEditModal(product)" class="btn-edit">Edit</button>
              <button @click="deleteProduct(product.id)" class="btn-delete">Hapus</button>
            </div>
            <button v-else @click="addToCart(product)" class="btn-order">+ Pesan</button>
          </div>
        </div>
      </div>
    </section>

    <!-- TAMPILAN RINGKASAN PESANAN -->
    <div v-if="!isAdmin && cart.length > 0" class="cart-floating-section">
      <div class="cart-header">
        <h3>🛒 Ringkasan Pesanan</h3>
        <span class="badge-count">{{ totalItemsCount }} Item</span>
      </div>

      <div class="cart-items">
        <div v-for="item in cart" :key="item.id" class="cart-item">
          <div class="item-details">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-price">{{ formatRupiah(item.price) }} x {{ item.qty }} = <strong>{{ formatRupiah(item.price * item.qty) }}</strong></span>
          </div>
          
          <div class="qty-controls">
            <button @click="decreaseQty(item)" class="btn-qty">-</button>
            <span class="qty-num">{{ item.qty }}</span>
            <button @click="increaseQty(item)" class="btn-qty">+</button>
            <button @click="removeFromCart(item.id)" class="btn-remove-item" title="Hapus">🗑️</button>
          </div>
        </div>
      </div>

      <!-- FIX: Penataan tag pembungkus cart-footer & perbaikan error item.total_price -->
      <div class="cart-footer">
        <div class="total-box">
          <span class="total-label">Total</span>
          <strong class="total-amount">{{ formatRupiah(totalPrice) }}</strong>
        </div>
        <button class="btn-checkout" @click="handleCheckoutClick">
          Pesan Sekarang
        </button>
      </div>
    </div>

    <!-- MODAL EDIT ADMIN -->
    <div v-if="isEditing" class="modal-overlay">
      <div class="modal-content">
        <h3>Edit Menu Makanan / Minuman</h3>
        <form @submit.prevent="updateProduct" class="modal-form">
          <label>Nama Menu:</label>
          <input v-model="editForm.name" required />

          <label>Kategori:</label>
          <select v-model="editForm.category" class="select-category" required>
            <option value="makanan">🍛 Makanan</option>
            <option value="minuman">🥤 Minuman</option>
          </select>

          <label>Harga (Rp):</label>
          <div class="price-input-wrapper">
            <span class="currency-prefix">Rp</span>
            <input 
              type="text" 
              v-model="editForm.price" 
              @input="handleEditPriceInput"
              class="input-price-no-spinner" 
              required 
            />
          </div>

          <label>Ganti Gambar (Opsional):</label>
          <label class="custom-file-upload">
            <input type="file" @change="handleEditFileUpload" accept="image/jpeg,image/png,image/jpg,image/webp" />
            <span class="file-label">
              📁 {{ editSelectedFileName || 'Pilih Gambar Baru (JPG, JPEG, PNG, WEBP max 2MB)' }}
            </span>
          </label>

          <label>Deskripsi (Opsional):</label>
          <textarea v-model="editForm.description" class="fixed-textarea" rows="3"></textarea>

          <div class="modal-actions">
            <button type="button" @click="closeEditModal" class="btn-cancel">Batal</button>
            <button type="submit" class="btn-save">Simpan Perubahan</button>
          </div>
        </form>
      </div>
    </div>

    <ScanModal 
      v-if="showScanner" 
      @qrValidated="handleQrSuccess" 
      @close="showScanner = false" 
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'
import ScanModal from './ScanModal.vue'

const router = useRouter()
const route = useRoute()

// CONFIG & API (Gunakan Environment Variable agar siap deploy ke Vercel/Railway)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'
const API_URL = `${API_BASE_URL}/products`

// 1. PERBAIKAN: Ambil key MURNI dari URL query atau LocalStorage saja (TANPA DEFAULT FALLBACK)
const getAdminKey = () => {
  return route.query.admin || localStorage.getItem('admin_secret') || ''
}

// STATE UNTUK SCANNER & MODAL
const showScanner = ref(false)
const showQrScanner = ref(false)
const validatedTable = ref('')

const products = ref([])
const isAdmin = ref(false)
const isEditing = ref(false)

const searchQuery = ref('')
const selectedCategory = ref('all')
const cart = ref([])

const selectedFileName = ref('')
const editSelectedFileName = ref('')

const form = ref({ name: '', category: 'makanan', price: '', description: '', imageFile: null })
const editForm = ref({ id: null, name: '', category: 'makanan', price: '', description: '', imageFile: null })

// FUNGSIONALITAS CHECKOUT
const handleCheckoutClick = () => {
  if (cart.value.length === 0) {
    alert('Keranjang belanjaanmu masih kosong!')
    return
  }
  showScanner.value = true
  showQrScanner.value = true
}

const submitOrderToSystem = () => {
  handleCheckoutClick()
}

// PROSES PESANAN KE BACKEND
const processOrder = async (tableNumber) => {
  showScanner.value = false
  showQrScanner.value = false

  const cartList = Array.isArray(cart.value) ? cart.value : []

  if (cartList.length === 0) {
    alert('Keranjang belanjaanmu kosong!')
    return
  }

  const payload = {
    table_number: String(tableNumber),
    items: cartList.map(item => ({
      product_id: item.id,
      quantity: Number(item.qty),
      price: Number(item.price)
    }))
  }

  try {
    const res = await axios.post(`${API_BASE_URL}/orders`, payload)
    const orderData = res.data.data || res.data.order || res.data
    const orderId = orderData.id || res.data.order_id

    if (orderId) {
      let myOrders = []
      try {
        const stored = localStorage.getItem('my_orders')
        myOrders = stored ? JSON.parse(stored) : []
      } catch (e) {
        myOrders = []
      }
      
      myOrders.push(orderId)
      localStorage.setItem('my_orders', JSON.stringify(myOrders))

      cart.value = []
      router.push(`/order-status/${orderId}`)
    } else {
      alert('Pesanan terkirim, tetapi ID pesanan tidak ditemukan.')
    }
  } catch (err) {
    console.error('Create Order Error:', err.response?.data || err)
    alert('Gagal membuat pesanan: ' + (err.response?.data?.message || 'Silakan coba lagi.'))
  }
}

const handleQrSuccess = (tableNumber) => processOrder(tableNumber)
const handleQrValidated = (tableNumber) => processOrder(tableNumber)

// HELPER KATEGORI & FILTER
const getCategory = (prod) => {
  if (!prod.category) return 'makanan'
  return String(prod.category).toLowerCase().trim()
}

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const pCategory = getCategory(product)
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          (product.description && product.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
    
    const matchesCategory = selectedCategory.value === 'all' || pCategory === selectedCategory.value

    return matchesSearch && matchesCategory
  })
})

const countByCategory = (cat) => {
  return products.value.filter(p => getCategory(p) === cat).length
}

// AKSI KERANJANG
const addToCart = (product) => {
  const existingItem = cart.value.find(item => item.id === product.id)
  if (existingItem) {
    existingItem.qty += 1
  } else {
    cart.value.push({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      qty: 1
    })
  }
}

const increaseQty = (item) => { item.qty += 1 }
const decreaseQty = (item) => {
  if (item.qty > 1) {
    item.qty -= 1
  } else {
    removeFromCart(item.id)
  }
}
const removeFromCart = (id) => {
  cart.value = cart.value.filter(item => item.id !== id)
}

const totalPrice = computed(() => {
  return cart.value.reduce((sum, item) => sum + (item.price * item.qty), 0)
})

const totalItemsCount = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.qty, 0)
})

// 2. PERBAIKAN: PROTEKSI KETAT LIFECYCLE HOOK
onMounted(() => {
  const urlAdminKey = route.query.admin
  const savedKey = localStorage.getItem('admin_secret')

  // Cek apakah key valid dari URL (?admin=MAKBOS2026 atau ?admin=admin123)
  if (urlAdminKey === 'MAKBOS2026' || urlAdminKey === 'admin123') {
    isAdmin.value = true
    localStorage.setItem('admin_secret', urlAdminKey)
  } 
  // Cek apakah user memiliki key valid yang pernah tersimpan di LocalStorage
  else if (savedKey === 'MAKBOS2026' || savedKey === 'admin123') {
    isAdmin.value = true
  } 
  // Jika tidak ada key valid, pastikan status admin MATI
  else {
    isAdmin.value = false
    localStorage.removeItem('admin_secret')
  }

  fetchProducts()
})

const handlePriceInput = (e) => {
  const cleanValue = e.target.value.replace(/\D/g, '')
  form.value.price = cleanValue
}

const handleEditPriceInput = (e) => {
  const cleanValue = e.target.value.replace(/\D/g, '')
  editForm.value.price = cleanValue
}

const handleFileUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    form.value.imageFile = file
    selectedFileName.value = file.name
  }
}

const handleEditFileUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    editForm.value.imageFile = file
    editSelectedFileName.value = file.name
  }
}

const fetchProducts = async () => {
  try {
    const response = await axios.get(API_URL)
    products.value = response.data.data || response.data
  } catch (err) {
    console.error('Gagal mengambil data produk:', err)
  }
}

const createProduct = async () => {
  const formData = new FormData()
  formData.append('name', form.value.name)
  formData.append('category', form.value.category)
  formData.append('price', Number(form.value.price) || 0)
  formData.append('description', form.value.description || '')
  if (form.value.imageFile) {
    formData.append('image', form.value.imageFile)
  }

  try {
    await axios.post(API_URL, formData, {
      headers: { 
        'x-admin-secret': getAdminKey(), 
        'Content-Type': 'multipart/form-data' 
      }
    })
    alert('Menu baru berhasil disimpan!')
    form.value = { name: '', category: 'makanan', price: '', description: '', imageFile: null }
    selectedFileName.value = ''
    fetchProducts()
  } catch (err) {
    console.error(err.response?.data)
    alert(err.response?.data?.message || 'Gagal mengunggah menu.')
  }
}

const updateProduct = async () => {
  const formData = new FormData()
  formData.append('_method', 'PUT')
  formData.append('name', editForm.value.name)
  formData.append('category', editForm.value.category)
  formData.append('price', Number(editForm.value.price) || 0)
  formData.append('description', editForm.value.description || '')
  
  if (editForm.value.imageFile) {
    formData.append('image', editForm.value.imageFile)
  }

  try {
    await axios.post(`${API_URL}/${editForm.value.id}`, formData, {
      headers: { 
        'x-admin-secret': getAdminKey(), 
        'Content-Type': 'multipart/form-data' 
      }
    })
    alert('Menu berhasil diperbarui!')
    isEditing.value = false
    fetchProducts()
  } catch (err) {
    console.error(err.response?.data)
    alert(err.response?.data?.message || 'Gagal memperbarui menu.')
  }
}

const openEditModal = (product) => {
  editForm.value = { 
    ...product, 
    category: getCategory(product), 
    description: product.description || '',
    imageFile: null 
  }
  editSelectedFileName.value = ''
  isEditing.value = true
}

const closeEditModal = () => { isEditing.value = false }

const deleteProduct = async (id) => {
  if (!confirm('Yakin ingin menghapus menu ini?')) return
  try {
    await axios.delete(`${API_URL}/${id}`, { 
      headers: { 'x-admin-secret': getAdminKey() } 
    })
    alert('Menu berhasil dihapus!')
    fetchProducts()
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal menghapus menu.')
  }
}

// 3. PERBAIKAN: Bersihkan URL query saat keluar mode admin
const exitAdmin = () => {
  isAdmin.value = false
  localStorage.removeItem('admin_secret')
  router.replace({ path: route.path, query: {} })
}

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number)
}
</script>
<style scoped>
.menu-page {
  min-height: 100vh;
  background: #fffaf0;
  padding-bottom: 120px;
  color: #222;
}

.menu-header {
  text-align: center;
  padding: 60px 20px 30px;
  background: white;
}

.menu-header > p:first-child {
  margin: 0 0 15px;
  color: #dfa817;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: 3px;
}

.menu-header h1 {
  margin: 0;
  font-family: Georgia, serif;
  font-size: clamp(42px, 10vw, 65px);
  line-height: 1.5;
}

.menu-header h1 span {
  color: #020000;
  font-style: italic;
}

.line {
  width: 70px;
  height: 4px;
  margin: 20px auto;
  background: #f8c63d;
  border-radius: 10px;
}

.description {
  max-width: 650px;
  margin: auto;
  color: #666;
  font-size: 17px;
  line-height: 1.7;
}

.filter-search-section {
  max-width: 1200px;
  margin: 20px auto 0;
  padding: 0 25px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.search-box {
  position: relative;
  width: 100%;
  max-width: 500px;
  display: flex;
  align-items: center;
}

.search-box input {
  width: 100%;
  padding: 12px 40px 12px 45px;
  border: 2px solid #f1dfaa;
  border-radius: 30px;
  font-size: 15px;
  outline: none;
  background: #ffffff;
  transition: 0.3s;
}

.search-box input:focus {
  border-color: #dfa817;
  box-shadow: 0 4px 15px rgba(223, 168, 23, 0.2);
}

.search-icon {
  position: absolute;
  left: 15px;
  font-size: 16px;
  color: #aaa;
}

.clear-search {
  position: absolute;
  right: 15px;
  background: none;
  border: none;
  font-size: 14px;
  color: #888;
  cursor: pointer;
}

.category-tabs {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.tab-btn {
  background: #ffffff;
  border: 1.5px solid #f1dfaa;
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  color: #555;
  transition: 0.3s;
}

.tab-btn:hover {
  background: #fff8e7;
}

.tab-btn.active {
  background: #dfa817;
  color: white;
  border-color: #dfa817;
  box-shadow: 0 4px 12px rgba(223, 168, 23, 0.3);
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 50px 0;
  color: #888;
  font-size: 16px;
}

.admin-panel {
  max-width: 1200px;
  margin: 30px auto -10px;
  padding: 25px;
  background: #fff8e7;
  border: 2px dashed #f8c63d;
  border-radius: 16px;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.admin-header h3 {
  margin: 0;
  color: #dfa817;
}

.admin-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.select-category {
  padding: 10px 14px;
  border: 1px solid #e2d3a7;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  outline: none;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.full-width {
  grid-column: 1 / -1;
}

.price-input-wrapper {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #e2d3a7;
  border-radius: 8px;
  padding: 0 12px;
}

.currency-prefix {
  color: #333;
  font-weight: bold;
  font-size: 14px;
  margin-right: 6px;
}

.input-price-no-spinner {
  width: 100%;
  border: none !important;
  outline: none !important;
  padding: 10px 0 !important;
  font-size: 14px;
  background: transparent;
}

.custom-file-upload {
  display: inline-block;
  padding: 10px 14px;
  cursor: pointer;
  background: #ffffff;
  border: 1px dashed #dfa817;
  border-radius: 8px;
}

.custom-file-upload input[type="file"] {
  display: none;
}

.file-label {
  font-size: 13px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.fixed-textarea {
  resize: none !important;
  height: 90px;
}

.admin-form input,
.admin-form textarea {
  padding: 10px 14px;
  border: 1px solid #e2d3a7;
  border-radius: 8px;
  font-size: 14px;
}

.btn-save {
  background: #28a745;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.btn-exit {
  background: #dc3545;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.menu-container {
  max-width: 1200px;
  margin: auto;
  padding: 40px 25px 60px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
}

.menu-card {
  overflow: hidden;
  display: flex;
  background: white;
  border-radius: 22px;
  border: 1px solid #f1dfaa;
  box-shadow: 0 8px 25px rgba(0, 0, 0, .07);
  transition: .3s;
  height: 250px;
}

.menu-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, .12);
}

.image-wrapper {
  position: relative;
  width: 180px;
  min-width: 180px;
  height: 100%;
  overflow: hidden;
  background: #f5f5f5;
  flex-shrink: 0;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

.category-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.65);
  color: white;
  font-size: 10px;
  font-weight: bold;
  padding: 3px 8px;
  border-radius: 12px;
  backdrop-filter: blur(4px);
}

.menu-info {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.menu-info h2 {
  margin: 0 0 8px;
  font-size: 20px;
}

.description-scroll-wrapper {
  max-height: 80px;
  overflow-y: auto;
  padding-right: 5px;
}

.description-scroll-wrapper > p {
  margin: 0;
  color: #707070;
  line-height: 1.5;
  font-size: 14px;
}

.bottom {
  margin-top: auto;
  padding-top: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.bottom strong {
  color: #dfa817;
  font-size: 18px;
}

.btn-order {
  border: none;
  background: #f8c63d;
  color: #111;
  padding: 8px 16px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
}

.btn-order:hover {
  background: #e0ae27;
}

.admin-actions {
  display: flex;
  gap: 8px;
}

.btn-edit {
  background: #007bff;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-delete {
  background: #dc3545;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.cart-floating-section {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 380px;
  max-width: calc(100vw - 40px);
  background: #ffffff;
  border: 2px solid #f8c63d;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  padding: 20px;
  z-index: 999;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.cart-header h3 {
  margin: 0;
  font-size: 18px;
  color: #222;
}

.badge-count {
  background: #dfa817;
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 4px 10px;
  border-radius: 20px;
}

.cart-items {
  max-height: 200px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 15px;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fffdf5;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #f7eaaf;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.item-name {
  font-weight: bold;
  font-size: 14px;
}

.item-price {
  font-size: 12px;
  color: #666;
}

.qty-controls {
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-qty {
  background: #eee;
  border: none;
  width: 26px;
  height: 26px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.btn-qty:hover {
  background: #ddd;
}

.qty-num {
  font-size: 14px;
  font-weight: bold;
  min-width: 18px;
  text-align: center;
}

.btn-remove-item {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 14px;
  margin-left: 4px;
}

.cart-footer {
  border-top: 1px dashed #ccc;
  padding-top: 12px;
}

.total-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 12px;
}

.total-amount {
  color: #dfa817;
  font-size: 18px;
}

.btn-checkout {
  width: 100%;
  background: #28a745;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 10px;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s;
}

.btn-checkout:hover {
  background: #218838;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 25px;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modal-form input,
.modal-form textarea {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}

.btn-cancel {
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
}

@media (max-width: 850px) {
  .menu-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 550px) {
  .menu-card {
    flex-direction: column;
    height: auto;
  }
  .image-wrapper {
    width: 100%;
    min-width: 100%;
    height: 200px;
  }
  .admin-form {
    grid-template-columns: 1fr;
  }
}
</style>
