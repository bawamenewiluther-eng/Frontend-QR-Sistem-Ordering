<script setup>
import Navbar from '../src/Template/Navbar.vue'
import Footer from '../src/Template/Footer.vue'
</script>

<template>
  <div class="website">
    <Navbar />
    <!-- Pembungkus halaman utama agar footer terdorong ke bawah -->
    <main class="main-content">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  height: 100%;
}

body {
  font-family: Arial, Helvetica, sans-serif;
  color: #252525;
  background: #F5E6C8;
  height: 100%;
}

/* STICKY FOOTER LAYOUT */
.website {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Mengambil minimal 100% tinggi layar */
}

.main-content {
  flex: 1; /* Meregangkan area tengah untuk mendorong footer ke bawah */
}

a {
  text-decoration: none;
  color: inherit;
}

.container {
  width: 90%;
  max-width: 1150px;
  margin: auto;
}

/* HERO */

.hero {
  padding: 90px 0;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 130px;
}

.badge {
  display: inline-block;
  background: #F4C542;
  color: #020000;
  padding: 8px 15px;
  border-radius: 50px;
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 20px;
}

.hero h1 {
  font-family: 'Bodoni Moda', serif;
  font-size: 60px;
  font-weight: 500;
  line-height: 1;
  margin-bottom: 50px;
}

.hero h1 span {
  display: block;
  font-style: italic;
  color: #F4C542;
}

.hero p {
  font-size: 18px;
  line-height: 1.7;
  color: #020000;
  margin-bottom: 20px;
}

.hero-buttons {
  display: flex;
  gap: 15px;
}

.btn {
  display: inline-block;
  padding: 14px 24px;
  border-radius: 8px;
  font-weight: bold;
}

.primary {
  background: #F4C542;
  color: #020000;
  border: 1px solid transparent;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.primary:hover {
  background: #ffffff;
  color: #020000;
  border-color: #F4C542;
}

.secondary {
  border: 1px solid #F4C542;
  color: #020000;
}

.hero-image img {
  width: 100%;
  height: 480px;
  object-fit: cover;
  border-radius: 25px;
}

/* SECTION */

section {
  scroll-margin-top: 80px;
}

.section-title {
  text-align: center;
  max-width: 650px;
  margin: auto;
  margin-bottom: 50px;
}

.section-title span,
.contact-label {
  color: #F4C542;
  font-size: 30px;
  font-weight: bold;
  letter-spacing: 2px;
}

.section-title h2 {
  font-family: 'Bodoni Moda', serif;
  font-size: 36px;
  margin: 12px 0;
}

.section-title p {
  color: #020000;
  line-height: 1.7;
}

/* ABOUT */

.about {
  padding: 90px 0;
}

.about-wrap {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 60px;
  align-items: center;
}

.about-visual {
  position: relative;
}

.about-photo {
  width: 100%;
  height: 420px;
  object-fit: cover;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

/* NOTA — elemen ciri khas warung, ditempel di atas foto */
.nota {
  position: absolute;
  left: -30px;
  bottom: -30px;
  width: 200px;
  background: #fffdf5;
  padding: 18px 14px 20px;
  transform: rotate(-4deg);
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.2);
  font-family: 'Courier New', Courier, monospace;
  clip-path: polygon(
    0% 0%, 100% 0%, 100% 96%,
    92% 100%, 84% 96%, 76% 100%, 68% 96%,
    60% 100%, 52% 96%, 44% 100%, 36% 96%,
    28% 100%, 20% 96%, 12% 100%, 4% 96%, 0% 100%
  );
  transition: transform 0.25s ease;
}

.nota:hover {
  transform: rotate(-1deg) translateY(-3px);
}

.nota-judul {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  text-align: center;
  color: #020000;
}

.nota-alamat {
  margin: 2px 0 8px;
  font-size: 10px;
  text-align: center;
  color: #7a7a7a;
}

.nota-garis {
  border-top: 1px dashed #cccccc;
  margin: 6px 0;
}

.nota-baris {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  padding: 2px 0;
  color: #020000;
}

.nota-terima-kasih {
  margin: 8px 0 0;
  font-size: 10px;
  text-align: center;
  font-style: italic;
  color: #7a7a7a;
}

.about-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.about-card {
  display: flex;
  gap: 18px;
  align-items: flex-start;
  text-align: left;
  padding: 24px;
  background: #ffffff;
  border: 1px solid #f5e9c8;
  border-radius: 16px;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.about-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 30px rgba(0, 0, 0, 0.08);
  border-color: #F4C542;
}

.about-icon {
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: #F4C542;
  display: flex;
  align-items: center;
  justify-content: center;
}

.about-icon svg {
  width: 26px;
  height: 26px;
  color: #020000;
}

.about-card h3 {
  margin-bottom: 6px;
}

.about-card p {
  color: #020000;
  line-height: 1.6;
}

/* PRODUCTS */

.products {
  padding: 90px 0;
  background: #FBF3E0;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}

.product-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.07);
}

.product-image img {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.product-info {
  padding: 25px;
  color: #020000;
}

.product-info h3 {
  margin-bottom: 10px;
}

.price {
  color: #020000;
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 20px;
}

.order-button {
  display: block;
  text-align: center;
  background: #F4C542;
  color: Black;
  padding: 12px;
  border-radius: 7px;
  font-weight: bold;
  border: 1px solid transparent;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.order-button:hover {
  background: #ffffff;
  color: #020000;
  border-color: #F4C542;
}

/* TESTIMONI */

.testimoni {
  padding: 90px 0;
}

.testi-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}

.testi-card {
  position: relative;
  background: #ffffff;
  border-left: 3px solid #F4C542;
  border-radius: 12px;
  padding: 26px 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.testi-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 30px rgba(0, 0, 0, 0.1);
}

.testi-quote {
  position: absolute;
  top: 6px;
  right: 18px;
  font-family: 'Bodoni Moda', serif;
  font-size: 46px;
  color: #f4e2ab;
  line-height: 1;
}

.testi-stars {
  color: #F4C542;
  font-size: 14px;
  letter-spacing: 2px;
  margin-bottom: 12px;
}

.testi-stars .star-kosong {
  color: #e9e2cf;
}

.testi-teks {
  font-style: italic;
  color: #020000;
  line-height: 1.6;
  margin-bottom: 20px;
  padding-right: 20px;
}

.testi-orang {
  display: flex;
  align-items: center;
  gap: 12px;
}

.testi-avatar {
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #F4C542;
  color: #020000;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.testi-nama {
  font-weight: 700;
  font-size: 14px;
}

.testi-peran {
  font-size: 12px;
  color: #7a7a7a;
}

/* CTA */

.cta {
  background: #F4C542;
  color: white;
  text-align: center;
  padding: 70px 20px;
}

.cta h2 {
  font-size: 35px;
  margin-bottom: 12px;
}

.cta p {
  margin-bottom: 25px;
}

.whatsapp {
  background: white;
  color: #020000;
}

/* CONTACT */

.contact {
  padding: 90px 0;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.contact h2 {
  font-size: 40px;
  margin: 15px 0;
}

.contact-grid > div:first-child p {
  color: #020000;
  line-height: 1.7;
  max-width: 500px;
}

.contact-heading {
  display: block;
  font-size: 22px;
  margin-bottom: 20px;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.contact-item strong {
  display: block;
  margin-bottom: 4px;
}

.contact-info p {
  color: #020000;
  margin-top: 5px;
}

.contact-map {
  border-radius: 15px;
  overflow: hidden;
  height: 320px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.07);
}

.contact-map iframe {
  display: block;
}

/* RESPONSIVE */

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

  .hero {
    padding: 60px 0;
  }

  .hero-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .hero h1 {
    font-size: 40px;
  }

  .hero-image img {
    height: 350px;
  }

  .about-wrap {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .about-photo {
    height: 320px;
  }

  .nota {
    left: 12px;
    bottom: -24px;
    width: 170px;
  }

  .about-grid,
  .product-grid,
  .testi-grid {
    grid-template-columns: 1fr;
  }

  .contact-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .contact-map {
    height: 260px;
  }

  .section-title h2 {
    font-size: 30px;
  }
}
</style>