<template>
  <div class="pesanan-container">
    <div class="header-section">
      <h2>Riwayat Pesanan Saya</h2>
      <p class="subtitle">Pantau status masak dan antrian pesanan kamu secara real-time.</p>
    </div>

    <!-- State Loading -->
    <div v-if="loading" class="state-info">
      <div class="spinner"></div>
      <p>Memuat riwayat pesanan...</p>
    </div>

    <!-- State Kosong -->
    <div v-else-if="orders.length === 0" class="state-info empty-box">
      <div class="empty-icon">🍽️</div>
      <p>Belum ada pesanan aktif. Yuk pesan makanan dulu!</p>
    </div>

    <!-- Daftar Pesanan -->
    <div v-else class="orders-list">
      <div v-for="item in orders" :key="item.id" class="order-card">
        <!-- Header Kartu -->
        <div class="card-header">
          <div>
            <span class="order-num">{{ item.order_number }}</span>
            <span class="table-tag">Meja {{ item.table_number }}</span>
          </div>
          <span class="status-badge" :class="item.status">
            {{ formatStatus(item.status) }}
          </span>
        </div>

        <!-- INFORMASI ANTRIAN (Hanya muncul jika status 'pending') -->
        <div v-if="item.status === 'pending'" class="queue-info-box">
          <div class="queue-badge">
            <span>Posisi Antrian:</span>
            <strong>#{{ item.queue_position || 1 }}</strong>
          </div>
          <p v-if="item.orders_ahead > 0" class="queue-detail">
            Ada <strong>{{ item.orders_ahead }}</strong> pesanan lagi di depan kamu.
          </p>
          <p v-else class="queue-detail highlight">
            🔥 Pesanan kamu akan diproses berikutnya!
          </p>
        </div>

        <!-- Detail Ringkasan Menu -->
<div class="items-summary">
  <div v-for="prod in item.items" :key="prod.id" class="item-row">
    <span>
      <strong>{{ prod.quantity }}x</strong> 
      <!-- Gunakan prod.product?.name ATAU prod.product_name -->
      {{ prod.product ? prod.product.name : (prod.product_name || 'Menu') }}
    </span>
    <span>
      Rp {{ (Number(prod.price || prod.unit_price || 0) * Number(prod.quantity || 1)).toLocaleString('id-ID') }}
    </span>
  </div>
</div>

        <!-- Footer Kartu & Tombol Aksi -->
        <div class="card-footer">
          <div class="total-box">
            <span class="total-label">Total</span>
            <!-- FIX: Menangani berbagai kemungkinan key total dari backend agar tidak NaN -->
            <strong class="total-price">
              Rp {{ Number(item.total_price || item.total_amount || item.total || 0).toLocaleString('id-ID') }}
            </strong>
          </div>

          <!-- Tombol Batalkan Pesanan (Jika Pending) -->
          <button 
            v-if="item.status === 'pending'" 
            @click="cancelOrder(item.id)" 
            class="btn-cancel"
          >
            ❌ Batalkan
          </button>

          <!-- Tombol Rincian / Status Detail -->
          <button 
            v-else-if="item.status !== 'cancelled'" 
            @click="$router.push(`/order-status/${item.id}`)" 
            class="btn-detail"
          >
            👁️ Lihat Detail
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

const orders = ref([])
const loading = ref(true)
let pollingTimer = null

const fetchMyOrders = async () => {
  try {
    const stored = localStorage.getItem('my_orders')
    if (!stored) {
      orders.value = []
      loading.value = false
      return
    }

    let orderIds = []
    try {
      orderIds = JSON.parse(stored)
    } catch (e) {
      orderIds = []
    }

    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      orders.value = []
      loading.value = false
      return
    }

    const requests = orderIds.map(id => 
      axios.get(`${API_BASE_URL}/orders/${id}`).catch(() => null)
    )
    
    const responses = await Promise.all(requests)
    
    const validOrders = []
    const validIds = []

    responses.forEach((r, index) => {
      if (r && r.data) {
        // Ambil data sebenarnya (menangani jika terbungkus res.data.data)
        const raw = r.data.data || r.data

        validOrders.push(raw)
        validIds.push(orderIds[index])
      }
    })

    if (validIds.length !== orderIds.length) {
      localStorage.setItem('my_orders', JSON.stringify(validIds))
    }

    orders.value = validOrders
  } catch (err) {
    console.error('Gagal mengambil data pesanan:', err)
  } finally {
    loading.value = false
  }
}
const cancelOrder = async (id) => {
  if (!confirm('Apakah kamu yakin ingin membatalkan pesanan ini?')) return

  try {
    await axios.patch(`${API_BASE_URL}/orders/${id}/cancel`)
    alert('Pesanan berhasil dibatalkan.')
    fetchMyOrders()
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal membatalkan pesanan!')
  }
}

const stopPolling = () => {
  if (pollingTimer) {
    clearInterval(pollingTimer)
    pollingTimer = null
  }
}

const formatStatus = (status) => {
  const map = {
    pending: '⏳ Menunggu Antrian',
    cooking: '🍳 Sedang Dimasak',
    processing: '🍳 Sedang Dimasak',
    completed: '✅ Selesai',
    paid: '🎉 Lunas',
    cancelled: '🚫 Dibatalkan'
  }
  return map[status] || status
}

onMounted(() => {
  fetchMyOrders()
  pollingTimer = setInterval(fetchMyOrders, 3000)
})

onUnmounted(() => {
  stopPolling()
})
</script>
<style scoped>
.pesanan-container {
  max-width: 480px;
  margin: 30px auto;
  padding: 0 16px;
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.header-section {
  text-align: center;
  margin-bottom: 24px;
}
.header-section h2 {
  margin: 0;
  color: #2d3748;
  font-size: 22px;
}
.subtitle {
  font-size: 13px;
  color: #718096;
  margin-top: 4px;
}

.state-info {
  text-align: center;
  color: #718096;
  margin-top: 40px;
  padding: 30px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
.empty-icon { font-size: 40px; margin-bottom: 10px; }

.order-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 18px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.06);
  border: 1px solid #edf2f7;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}
.order-num {
  font-weight: 700;
  display: block;
  font-size: 16px;
  color: #2d3748;
}
.table-tag {
  font-size: 12px;
  color: #e53e3e;
  background: #fff5f5;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 600;
}

.status-badge {
  font-size: 11px;
  padding: 6px 10px;
  border-radius: 20px;
  font-weight: 700;
}
.status-badge.pending { background: #fffaf0; color: #dd6b20; border: 1px solid #fbd38d; }
.status-badge.cooking, .status-badge.processing { background: #ebf8ff; color: #3182ce; border: 1px solid #90cdf4; }
.status-badge.completed, .status-badge.paid { background: #f0fff4; color: #38a169; border: 1px solid #9ae6b4; }
.status-badge.cancelled { background: #fff5f5; color: #e53e3e; border: 1px solid #feb2b2; }

/* Box Antrian Real-Time */
.queue-info-box {
  background: #fffaf0;
  border: 1px dashed #ed8936;
  border-radius: 12px;
  padding: 12px 14px;
  margin-bottom: 12px;
}
.queue-badge {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #795e00;
}
.queue-badge strong {
  font-size: 18px;
  color: #dd6b20;
}
.queue-detail {
  font-size: 12px;
  margin: 4px 0 0 0;
  color: #718096;
}
.queue-detail.highlight {
  color: #dd6b20;
  font-weight: 600;
}

/* Item Summary */
.items-summary {
  margin: 14px 0;
  border-top: 1px solid #edf2f7;
  border-bottom: 1px solid #edf2f7;
  padding: 10px 0;
}
.item-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #4a5568;
  margin-bottom: 6px;
}
.item-row:last-child { margin-bottom: 0; }

/* Footer */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.total-box {
  display: flex;
  flex-direction: column;
}
.total-label { font-size: 11px; color: #a0aec0; text-transform: uppercase; }
.total-price { font-size: 16px; color: #dd6b20; font-weight: 700; }

.btn-cancel {
  background: #fff5f5;
  color: #e53e3e;
  border: 1px solid #feb2b2;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  transition: all 0.2s;
}
.btn-cancel:hover { background: #ffe3e3; }

.btn-detail {
  background: #38a169;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  transition: all 0.2s;
}
.btn-detail:hover { background: #2f855a; }

/* Spinner Loading */
.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #edf2f7;
  border-top: 3px solid #dd6b20;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 10px auto;
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
</style>