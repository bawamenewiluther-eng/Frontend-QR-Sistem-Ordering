<script setup>
import { ref } from 'vue'
import logo from '../Pages/assets/logo.png'

const menuOpen = ref(false)
</script>

<template>
  <nav class="navbar">
    <div class="nav-container">
      <RouterLink to="/" class="brand" @click="menuOpen = false">
        <img :src="logo" alt="Logo Warung Mak Bos" class="logo">
        <div class="brand-name">
          <span class="warung">Warung</span>
          <span class="mak-bos">Mak Bos</span>
        </div>
      </RouterLink>

      <div class="nav-menu" :class="{ active: menuOpen }">
        <RouterLink :to="'/'">Beranda</RouterLink>
        <RouterLink to="/menu">Menu</RouterLink>
        <RouterLink to="/pesanan">Pesanan</RouterLink>
        <RouterLink :to="'/tentang_kami'">Tentang Kami</RouterLink>
      </div>

      <button
        class="menu-button"
        :class="{ active: menuOpen }"
        @click="menuOpen = !menuOpen"
        :aria-expanded="menuOpen"
        aria-label="Buka menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background-color: #F4C542;
  height: 70px;
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 1000;
}

.nav-container {
  position: sticky;
  height: 100%;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  width: 75px;
  height: 75px;
  object-fit: contain;
}

.brand-name {
  display: flex;
  flex-direction: column;
  line-height: 0.9;
  font-family: 'Luminari', Fantasy;
}

.warung,
.mak-bos {
  font-size: 22px;
  color: #020000;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 35px;
}

.nav-menu a {
  color: #020000;
  text-decoration: none;
  font-size: 17px;
  font-weight: 600;
  transition: color 0.2s ease;
}

.nav-menu a:hover {
  color: #ffffff;
}

.menu-button {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.menu-button span {
  display: block;
  height: 3px;
  width: 100%;
  background: #020000;
  border-radius: 2px;
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.menu-button.active span:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}

.menu-button.active span:nth-child(2) {
  opacity: 0;
}

.menu-button.active span:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

@media (max-width: 768px) {
  .menu-button {
    display: flex;
  }

  .nav-menu {
    display: none;
    position: absolute;
    top: 70px;
    left: 0;
    width: 100%;
    background: white;
    flex-direction: column;
    align-items: flex-start;
    padding: 25px 40px;
    gap: 20px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    z-index: 10;
  }

  .nav-menu.active {
    display: flex;
  }
}
</style>