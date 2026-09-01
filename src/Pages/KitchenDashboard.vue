<template>
  <div class="kitchen-container">
    <header class="kitchen-header">
      <h1>👨‍🍳 Dashboard Dapur & Kasir</h1>
      <p>Kelola antrian pesanan masuk secara real-time</p>
    </header>

    <!-- Empty State jika tidak ada pesanan -->
    <div v-if="activeOrders.length === 0" class="empty-state">
      <p>☕ Belum ada antrian pesanan masuk.</p>
    </div>

    <div v-else class="orders-grid">
      <div 
        v-for="item in activeOrders" 
        :key="item.id" 
        class="kitchen-card" 
        :class="item.status"
      >
        <div class="card-head">
          <!-- Fallback untuk nomor meja -->
          <span class="table-badge">
            Meja {{ item.table_number || item.table?.number || item.table_id || '-' }}
          </span>
          <span class="status-badge">{{ (item.status || 'PENDING').toUpperCase() }}</span>
        </div>

        <!-- Fallback untuk nomor order -->
        <p class="order-code">No. Order: {{ item.order_number || item.order_code || ('ORD-' + item.id) }}</p>
        
        <!-- Render Items / Produk -->
        <ul class="items-list">
          <li v-for="(prod, idx) in (item.items || item.order_items || [])" :key="prod.id || idx">
            <strong>{{ prod.quantity || prod.qty }}x</strong> 
            {{ prod.product_name || prod.product?.name || 'Menu' }}
          </li>
        </ul>

        <div class="card-footer">
          <!-- Tombol Aksi Dapur -->
          <button 
            v-if="item.status === 'pending'" 
            @click="changeStatus(item.id, 'cooking')" 
            class="btn-action btn-cook"
          >
            👨‍🍳 Mulai Masak
          </button>

          <button 
            v-if="item.status === 'cooking' || item.status === 'processing'" 
            @click="changeStatus(item.id, 'completed')" 
            class="btn-action btn-done"
          >
            ✅ Selesai Dimasak
          </button>

          <button 
            v-if="item.status === 'completed'" 
            @click="changeStatus(item.id, 'paid')" 
            class="btn-action btn-paid"
          >
            💵 Lunas / Selesai
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000/api'
const activeOrders = ref([])
let timer = null

// Fungsi mengambil admin key dari URL / LocalStorage
const getAdminKey = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const keyFromUrl = urlParams.get('key')
  
  if (keyFromUrl) {
    localStorage.setItem('admin_secret_key', keyFromUrl)
    return keyFromUrl
  }
  
  return localStorage.getItem('admin_secret_key') || 'admin123'
}

// Fetch list order aktif
const fetchOrders = async () => {
  const adminKey = getAdminKey()

  try {
    const res = await axios.get(`${API_BASE_URL}/kitchen/orders`, {
      headers: {
        'x-admin-secret': adminKey
      }
    })

    // Unpack data jika backend membungkusnya dalam res.data.data
    const data = res.data.data || res.data
    activeOrders.value = Array.isArray(data) ? data : []

  } catch (err) {
    console.error('Error Dapur:', err)
  }
}

// Update status order secara dinamis
const changeStatus = async (id, newStatus) => {
  const adminKey = getAdminKey()

  try {
    await axios.patch(
      `${API_BASE_URL}/orders/${id}/update-status`, 
      { status: newStatus },
      {
        headers: {
          'x-admin-secret': adminKey,
          'Accept': 'application/json'
        }
      }
    )
    await fetchOrders()
  } catch (err) {
    console.error('Gagal update status:', err)
    alert('Gagal mengubah status pesanan!')
  }
}

onMounted(() => {
  fetchOrders()
  timer = setInterval(fetchOrders, 3000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.kitchen-container { padding: 30px; background: #f8f9fa; min-height: 100vh; }
.kitchen-header h1 { margin: 0; font-size: 24px; color: #333; }
.kitchen-header p { color: #666; font-size: 14px; margin-top: 4px; }

.empty-state { margin-top: 40px; text-align: center; color: #777; font-size: 16px; }

.orders-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; margin-top: 25px; }
.kitchen-card { background: white; padding: 20px; border-radius: 12px; border-left: 6px solid #ccc; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }

/* Warna border berdasarkan status */
.kitchen-card.pending { border-left-color: #ffc107; }
.kitchen-card.cooking, .kitchen-card.processing { border-left-color: #17a2b8; }
.kitchen-card.completed { border-left-color: #28a745; }

.card-head { display: flex; justify-content: space-between; align-items: center; }
.table-badge { font-weight: bold; font-size: 18px; color: #333; }
.status-badge { font-size: 11px; font-weight: bold; padding: 4px 8px; border-radius: 4px; background: #eee; }
.order-code { font-size: 12px; color: #888; margin-top: 4px; }

.items-list { margin: 15px 0; padding-left: 18px; font-size: 14px; }
.items-list li { margin-bottom: 6px; }

.btn-action { width: 100%; padding: 10px; border: none; border-radius: 8px; font-weight: bold; color: white; cursor: pointer; transition: opacity 0.2s; }
.btn-action:hover { opacity: 0.9; }

.btn-cook { background: #17a2b8; }
.btn-done { background: #28a745; }
.btn-paid { background: #6c757d; }
</style>