<template>
  <div class="status-container">
    <!-- State Loading -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Memuat status pesanan...</p>
    </div>

    <!-- State Data Ada -->
    <div v-else-if="order" class="status-card">
      <div class="header">
        <h2>Warung Mak Bos</h2>
        <span class="order-no">{{ order.order_number }}</span>
        <div class="table-badge">Meja {{ order.table_number }}</div>
      </div>

      <div class="queue-box" :class="order.status">
  <template v-if="order.status === 'pending'">
    <span class="queue-label">Urutan Antrian</span>
    <h1 class="queue-num">#{{ queuePosition }}</h1>
    <p v-if="ordersAhead > 0">Ada <strong>{{ ordersAhead }}</strong> pesanan lagi di depan kamu.</p>
    <p v-else class="highlight">Pesanan kamu diproses berikutnya!</p>
  </template>

<template v-else-if="order.status === 'cooking' || order.status === 'processing' || order.status === 'preparing'">
    <div class="icon-bounce"></div>
    <h3>Pesanan Sedang Dimasak</h3>
    <p>Koki sedang menyiapkan santapan lezatmu!</p>
  </template>

        <template v-else-if="order.status === 'completed'">
          <div class="icon-pop"></div>
          <h3>Pesanan Selesai!</h3>
          <p>Silakan nikmati hidanganmu.</p>
        </template>

<template v-else-if="order.status === 'cancelled'">
    <div class="icon-pop">❌</div>
    <h3>Pesanan Dibatalkan</h3>
    <p>Pesanan ini telah dibatalkan.</p>
  </template>
</div>

      <!-- DETAIL PESANAN -->
<div class="summary">
  <h4>Detail Pesanan</h4>
  <div v-for="item in order.items" :key="item.id" class="summary-item">
    <!-- PERBAIKAN: Gunakan item.product_name || item.name agar tidak kosong jika key-nya berbeda -->
    <span><strong>{{ item.quantity }}x</strong> {{ item.product_name || item.name }}</span>
    <span>Rp {{ (Number(item.price || 0) * Number(item.quantity || 1)).toLocaleString('id-ID') }}</span>
  </div>
  <div class="total">
    <span>Total Bayar</span>
    <!-- PERBAIKAN: Fallback order.total_price || order.total agar tidak Rp NaN -->
    <span class="total-price">
      Rp {{ Number(order.total_price || order.total || 0).toLocaleString('id-ID') }}
    </span>
  </div>
</div>

<!-- AREA PEMBAYARAN & UCAPAN TERIMA KASIH -->
<div v-if="order.status === 'completed'" class="payment-section">
  
  <!-- JIKA SUDAH LUNAS / PAID -->
  <div v-if="order.payment_status === 'paid' || order.is_paid" class="payment-card alert-success">
    <div class="card-icon">🎉</div>
    <h4>Pembayaran Lunas!</h4>
    <p>Terima kasih sudah memesan dan menikmati santapan di <strong>Warung Mak Bos</strong>. Sampai jumpa di pesanan berikutnya!</p>
  </div>

  <!-- JIKA BELUM LUNAS / PROSES PEMBAYARAN -->
  <template v-else>
    <h3>Pilih Metode Pembayaran</h3>
    <p class="payment-subtitle">Pilih metode pembayaran yang kamu inginkan:</p>

    <!-- Pilihan Metode jika belum memilih -->
    <div v-if="!order.payment_method || order.payment_method === 'unpaid'" class="payment-grid">
      <button @click="choosePayment('cash')" class="btn-pay btn-cash">
        <span class="pay-icon">💵</span>
        <div class="pay-text">
          <strong>Tunai / Cash</strong>
          <small>Bayar di kasir</small>
        </div>
      </button>

      <button @click="choosePayment('qris')" class="btn-pay btn-qris">
        <span class="pay-icon">📱</span>
        <div class="pay-text">
          <strong>QRIS / E-Wallet</strong>
          <small>GoPay, OVO, Dana, ShopeePay</small>
        </div>
      </button>
    </div>

    <!-- Instruksi Pembayaran Tunai -->
    <div v-else-if="order.payment_method === 'cash'" class="payment-card alert-cash">
      <div class="card-icon">💵</div>
      <h4>Pembayaran Tunai</h4>
      <p>Silakan menuju kasir dan sebutkan <strong>Meja {{ order.table_number }}</strong> untuk menyelesaikan pembayaran.</p>
    </div>

    <!-- Instruksi Pembayaran QRIS -->
    <div v-else-if="order.payment_method === 'qris'" class="payment-card alert-qris">
      <div class="card-icon">📱</div>
      <h4>Scan QRIS Warung</h4>
      <p>Scan kode QR di bawah menggunakan aplikasi E-Wallet / Mobile Banking kamu:</p>
      <div class="qris-box">
        <img src="/images/qris-warung.jpeg" alt="QRIS Warung" class="qris-img" />
      </div>
      <p class="qris-note">Tunjukkan bukti transfer kepada staf saat makanan diantar.</p>
    </div>
  </template>

</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const order = ref(null)
const loading = ref(true)
const queuePosition = ref(1)
const ordersAhead = ref(0)
const targetOrderId = route.params.id 

let pollingTimer = null 

const checkOrderOwnership = () => {
  let myOrders = []
  try {
    const stored = localStorage.getItem('my_orders')
    myOrders = stored ? JSON.parse(stored) : []
  } catch (e) {
    console.error('Error parsing my_orders:', e)
  }

  const myOrdersString = myOrders.map(id => String(id))
  if (!myOrdersString.includes(String(targetOrderId))) {
    router.push('/')
    return false
  }
  return true
}
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'
const API_URL = `${API_BASE_URL}/products`
  
 // Pastikan polling tetap berjalan selama status masih 'pending', 'processing', atau 'preparing'
const fetchOrderStatus = async () => {
  if (!checkOrderOwnership()) return

  const orderId = targetOrderId?.value || targetOrderId || route.params.id

  if (!orderId) {
    loading.value = false
    return
  }

  try {
    const res = await axios.get(`${API_BASE_URL}/orders/${orderId}/status`)
    
    if (res.data && res.data.success) {
      const dataOrder = res.data.order
      
      // 1. Format ulang total_price
      dataOrder.total_price = Number(dataOrder.total_price || dataOrder.total || 0)
      
      // 2. TIMPA SELURUH OBJECT agar Reaktivitas Vue Bekerja 100%
      order.value = { ...dataOrder }
      
      // 3. Update nilai antrian secara langsung
      queuePosition.value = res.data.queue_position ?? 1
      ordersAhead.value = res.data.orders_ahead ?? 0

      // 4. HANYA hentikan polling JIKA pesanan benar-benar sudah SELESAI atau DIBATALKAN
      if (['completed', 'cancelled'].includes(order.value.status)) {
        stopPolling()
      }
    }
  } catch (err) {
    console.error('Fetch Order Error:', err)
    if (err.response && (err.response.status === 404 || err.response.status === 403)) {
      stopPolling()
      router.push('/')
    }
  } finally {
    loading.value = false
  }
}
 const choosePayment = async (method) => {
  try {
    // Dipasang URL lengkap ke port 8000 Laravel
    await axios.patch(`${API_BASE_URL}/orders/${route.params.id}/payment`,{
      payment_method: method
    })
    
    // Update state lokal agar UI langsung merespons pilihan user
    if (order.value) {
      order.value.payment_method = method
    }
  } catch (err) {
    console.error('Gagal update metode pembayaran:', err)
    alert('Gagal memilih metode pembayaran. Silakan coba lagi.')
  }
}
const stopPolling = () => {
  if (pollingTimer) {
    clearInterval(pollingTimer)
    pollingTimer = null
  }
}

onMounted(() => {
  fetchOrderStatus()

  // Polling tiap 3 detik
  pollingTimer = setInterval(() => {
    fetchOrderStatus()
  }, 3000)
})

onUnmounted(() => {
  stopPolling()
})
</script>

<style scoped>
/* Alert Success / Pembayaran Lunas */
.alert-success { 
  background: #f0fff4; 
  border: 1px solid #9ae6b4; 
  color: #22543d; 
}
.alert-success h4 { 
  color: #276749; 
  font-size: 18px;
}

.status-container { 
  max-width: 440px; 
  margin: 40px auto; 
  padding: 0 16px; 
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.status-card { 
  background: #ffffff; 
  padding: 28px 24px; 
  border-radius: 20px; 
  box-shadow: 0 10px 30px rgba(0,0,0,0.06); 
  text-align: center; 
}

/* Header UI */
.header h2 { margin: 0; font-size: 22px; color: #2d3748; }
.order-no { font-size: 12px; color: #a0aec0; display: block; margin-top: 4px; }
.table-badge { 
  display: inline-block;
  background: #fff5f5;
  color: #e53e3e;
  font-weight: 700;
  padding: 4px 14px;
  border-radius: 20px;
  margin-top: 10px;
  font-size: 13px;
}

/* Queue Box */
.queue-box { 
  background: #fffaf0; 
  border: 2px dashed #f6ad55; 
  padding: 24px 16px; 
  border-radius: 16px; 
  margin: 24px 0; 
}
.queue-label { font-size: 13px; color: #718096; text-transform: uppercase; tracking: 1px; }
.queue-num { font-size: 52px; color: #dd6b20; margin: 6px 0; font-weight: 800; }
.highlight { color: #dd6b20; font-weight: 600; }

.icon-bounce { font-size: 44px; animation: bounce 1.5s infinite; }
.icon-pop { font-size: 44px; }
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

/* Detail Pesanan */
.summary { text-align: left; border-top: 1px dashed #e2e8f0; padding-top: 20px; }
.summary h4 { margin: 0 0 12px 0; color: #4a5568; font-size: 15px; }
.summary-item { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px; color: #4a5568; }
.total { display: flex; justify-content: space-between; font-size: 16px; border-top: 1px solid #edf2f7; padding-top: 12px; margin-top: 12px; font-weight: 600; }
.total-price { color: #dd6b20; font-size: 18px; }

/* Payment Section Modern */
.payment-section { margin-top: 28px; border-top: 1px solid #edf2f7; padding-top: 20px; text-align: left; }
.payment-section h3 { font-size: 17px; margin: 0; color: #2d3748; }
.payment-subtitle { font-size: 13px; color: #718096; margin: 4px 0 16px 0; }

.payment-grid { display: flex; flex-direction: column; gap: 12px; }

.btn-pay {
  display: flex;
  align-items: center;
  padding: 14px 18px;
  border-radius: 14px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.btn-cash { background: #f0fff4; border-color: #c6f6d5; }
.btn-cash:hover { background: #dcffe4; transform: translateY(-2px); }

.btn-qris { background: #ebf8ff; border-color: #bee3f8; }
.btn-qris:hover { background: #e1f4ff; transform: translateY(-2px); }

.pay-icon { font-size: 28px; margin-right: 14px; }
.pay-text strong { display: block; font-size: 15px; color: #2d3748; }
.pay-text small { font-size: 12px; color: #718096; }

/* Alert Result Cards */
.payment-card { padding: 20px; border-radius: 14px; text-align: center; }
.alert-cash { background: #f0fff4; border: 1px solid #c6f6d5; color: #22543d; }
.alert-qris { background: #ebf8ff; border: 1px solid #bee3f8; color: #2b6cb0; }
.card-icon { font-size: 32px; margin-bottom: 6px; }
.payment-card h4 { margin: 0 0 6px 0; font-size: 16px; }
.payment-card p { font-size: 13px; margin: 0; line-height: 1.5; }

.qris-box { background: white; padding: 12px; display: inline-block; border-radius: 12px; margin: 12px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.qris-img { width: 170px; height: 170px; object-fit: contain; }
.qris-note { font-size: 11px; opacity: 0.8; }

/* Loading State */
.loading-state { text-align: center; padding: 60px 0; color: #718096; }
.spinner { width: 36px; height: 36px; border: 4px solid #e2e8f0; border-top: 4px solid #dd6b20; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 12px auto; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
</style>
