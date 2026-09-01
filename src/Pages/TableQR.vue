<template>
  <div class="qr-display-container">
    <div class="qr-card">
      <h2>Warung Mak Bos</h2>
      <h1 class="table-number">MEJA {{ tableNumber }}</h1>
      <p class="subtitle">Scan QR ini untuk mulai memesan</p>

      <!-- Gambar QR Code -->
      <div class="qr-code-box">
        <qrcode-vue :value="qrToken" :size="220" level="H" />
      </div>

      <p class="timer-info">QR diperbarui otomatis setiap menit</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import QrcodeVue from 'qrcode.vue'

const route = useRoute()
// Ambil nomor meja dari URL parameter, misal: /qr-meja/2
const tableNumber = route.params.id || '1'

// Secret key tiap meja (Nanti disimpan seragam dengan backend)
const tableSecrets = {
  '1': 'SECRET_MEJA_1',
  '2': 'SECRET_MEJA_2',
  '3': 'SECRET_MEJA_3',
  '4': 'SECRET_MEJA_4',
  '5': 'SECRET_MEJA_5'
}

const qrToken = ref('')
let intervalId = null

const generateDynamicToken = () => {
  const secret = tableSecrets[tableNumber] || 'SECRET_DEFAULT'
  // Pembulatan timestamp per 60 detik (1 menit)
  const currentMinuteTimestamp = Math.floor(Date.now() / 60000) * 60
  
  // Format Payload QR: MEJA-02|SECRET_MEJA_2|TIMESTAMP
  qrToken.value = `MEJA-${tableNumber}|${secret}|${currentMinuteTimestamp}`
}

onMounted(() => {
  generateDynamicToken()
  // Update token setiap 10 detik untuk memastikan sync waktu
  intervalId = setInterval(generateDynamicToken, 10000)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<style scoped>
.qr-display-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #fffaf0;
  padding: 20px;
}
.qr-card {
  background: white;
  padding: 30px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  border: 2px solid #f8c63d;
  max-width: 350px;
  width: 100%;
}
.table-number {
  font-size: 32px;
  color: #dfa817;
  margin: 10px 0;
}
.subtitle { color: #666; font-size: 14px; margin-bottom: 20px; }
.qr-code-box {
  display: flex;
  justify-content: center;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 12px;
}
.timer-info { font-size: 12px; color: #aaa; margin-top: 15px; }
</style>