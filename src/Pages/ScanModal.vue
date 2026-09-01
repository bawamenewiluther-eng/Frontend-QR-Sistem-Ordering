<template>
  <div class="qr-modal-overlay">
    <div class="qr-modal-content">
      <h3>Scan QR Code di Meja</h3>
      <p class="subtitle">Arahkan kamera ke QR Code yang tampil di layar meja kamu.</p>
      
      <!-- Area Pembaca Kamera -->
      <div id="reader"></div>

      <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

      <button class="btn-close" @click="handleClose">Batal</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Html5QrcodeScanner } from 'html5-qrcode'
import axios from 'axios'

const emit = defineEmits(['qrValidated', 'close'])
const router = useRouter()

// Dynamic API Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

const errorMessage = ref('')
let scanner = null

onMounted(() => {
  initScanner()
})

const initScanner = () => {
  // Membersihkan scanner lama jika ada
  if (scanner) {
    clearScannerSilently()
  }

  scanner = new Html5QrcodeScanner("reader", {
    fps: 10,
    qrbox: { width: 220, height: 220 }
  }, false)

  scanner.render(onScanSuccess, onScanFailure)
}

const clearScannerSilently = async () => {
  if (scanner) {
    try {
      await scanner.clear()
    } catch (e) {
      console.warn('Gagal membersihkan scanner secara normal:', e)
    } finally {
      scanner = null
    }
  }
}

const onScanSuccess = async (decodedText) => {
  // Stop scanner sementara
  await clearScannerSilently()

  try {
    // Gunakan URL Backend Railway
    const res = await axios.post(`${API_BASE_URL}/validate-qr`, { qr_token: decodedText })

    if (res.data.success) {
      const orderId = res.data.order_id || res.data.order?.id || res.data.id
      const tableNumber = res.data.table_number || res.data.order?.table_number

      if (orderId) {
        let myOrders = []
        try {
          const stored = localStorage.getItem('my_orders')
          myOrders = stored ? JSON.parse(stored) : []
        } catch (e) {
          myOrders = []
        }

        if (!myOrders.map(String).includes(String(orderId))) {
          myOrders.push(orderId)
          localStorage.setItem('my_orders', JSON.stringify(myOrders))
        }

        emit('qrValidated', tableNumber)
        emit('close')
        router.push(`/order-status/${orderId}`)
      } else {
        emit('qrValidated', tableNumber)
        emit('close')
      }
    } else {
      throw new Error(res.data.message || 'QR Code tidak valid!')
    }
  } catch (err) {
    if (err.response) {
      errorMessage.value = err.response.data?.message || 'Gagal memvalidasi QR Code!'
    } else if (err.request) {
      errorMessage.value = 'Tidak dapat terhubung ke server Backend!'
    } else {
      errorMessage.value = err.message || 'Terjadi kesalahan sistem.'
    }
    
    // Inisialisasi ulang jika gagal
    setTimeout(() => {
      errorMessage.value = ''
      initScanner()
    }, 2500)
  }
}

const onScanFailure = () => {
  // Abaikan frame tanpa QR
}

const handleClose = async () => {
  await clearScannerSilently()
  emit('close')
}

onUnmounted(async () => {
  await clearScannerSilently()
})
</script>

<style scoped>
.qr-modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.qr-modal-content {
  background: white;
  padding: 20px;
  border-radius: 16px;
  text-align: center;
  max-width: 350px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}
.subtitle { font-size: 13px; color: #666; margin-bottom: 15px; }
#reader { width: 100%; border-radius: 8px; overflow: hidden; }
.error-text { color: #dc3545; font-size: 13px; font-weight: bold; margin-top: 12px; }
.btn-close { margin-top: 15px; padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; }
</style>
