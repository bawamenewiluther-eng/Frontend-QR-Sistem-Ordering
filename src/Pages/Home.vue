<script setup>
import logo from './assets/logo.png'
import ayam from './assets/ayam.png'

const testimoni = [
  {
    nama: 'Raden',
    peran: 'Pelanggan Setia',
    kutipan: 'Cita rasa otentik dengan penyajian yang sangat berkelas. Berasa makan hidangan istimewa setiap hari.',
    rating: 5
  },
  {
    nama: 'Xie Anzhieng',
    peran: 'Anak Rantau',
    kutipan: 'Atmosphere dan kelezatan masakannya selalu sukses mengobati rasa rindu akan masakan rumah.',
    rating: 5
  },
  {
    nama: 'YuYu',
    peran: 'Pencinta Kuliner',
    kutipan: 'Rempah-rempahnya sangat kaya dan resep sambalnya benar-benar racikan tingkat tinggi.',
    rating: 5
  }
]
</script>

<template>
  <div class="luxury-wrapper">

    <!-- HERO SECTION -->
    <section id="beranda" class="hero">
      <div class="container hero-content">

        <div class="hero-text">
          <span class="luxury-badge">CITA RASA OTENTIK & EKSKLUSIF</span>

          <h1>
            Kelezatan Rempah Nusantara,
            <span class="amber-text"> Sentuhan Kemewahan.</span>
          </h1>

          <p>
            Nikmati mahakarya masakan rumahan dengan bahan segar pilihan dan bumbu rempah kaya rasa. Pengalaman santap hangat yang menggugah selera.
          </p>

          <div class="hero-buttons">
            <RouterLink to="/menu" class="btn btn-amber">
              Lihat Menu
            </RouterLink>

            <a href="#tentang" class="btn btn-outline">
              Tentang Kami
            </a>
          </div>
        </div>

        <div class="hero-image">
          <div class="image-frame">
            <img :src="logo" alt="Logo Warung Mak Bos">
          </div>
        </div>

      </div>
    </section>

    <!-- TENTANG KAMI -->
    <section id="tentang" class="about">
      <div class="container">

        <div class="section-title text-center">
          <span class="amber-subtitle">WARISAN RASA</span>
          <h2>Dapur Kedua yang Hangat & Elegan</h2>
          <div class="divider"></div>
          <p>
            Warung Mak Bos hadir membawa misi mulia: menghadirkan kembali kehangatan masakan ibu dengan kelezatan rempah otentik dan standar penyajian yang istimewa.
          </p>
        </div>

        <div class="about-wrap">

          <div class="about-visual">
            <div class="visual-border">
              <img :src="ayam" alt="Masakan Warung Mak Bos" class="about-photo">
            </div>

            <div class="luxury-receipt">
              <div class="receipt-header">
                <p class="receipt-title">WARUNG MAK BOS</p>
                <p class="receipt-sub">Authentic Culinary Experience</p>
              </div>
              <div class="receipt-divider"></div>
              <div class="receipt-row"><span>Didirikan</span><span>2020</span></div>
              <div class="receipt-row"><span>Koleksi Menu</span><span>10+ Varian</span></div>
              <div class="receipt-row"><span>Pelanggan</span><span>500+ Tamu</span></div>
              <div class="receipt-divider"></div>
              <p class="receipt-footer">Kehangatan Rasa Keluarga</p>
            </div>
          </div>

          <div class="about-grid">

            <div class="about-card">
              <div class="about-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
              </div>
              <div>
                <h3>Rempah Segar & Berkualitas</h3>
                <p>Menggunakan bumbu rempah pilihan tanpa bahan pengawet untuk meresapkan rasa yang kuat dan lezat.</p>
              </div>
            </div>

            <div class="about-card">
              <div class="about-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/>
                  <path d="M12 6V12L16 14"/>
                </svg>
              </div>
              <div>
                <h3>Dimasak Fresh Setiap Hari</h3>
                <p>Setiap sajian disiapkan hangat-hangat (*freshly cooked*) demi menjaga kenikmatan aroma dan tekstur.</p>
              </div>
            </div>

            <div class="about-card">
              <div class="about-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"/>
                </svg>
              </div>
              <div>
                <h3>Resep Asli Rumah</h3>
                <p>Menjaga racikan warisan yang familiar di lidah namun disajikan secara modern dan bersih.</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>

    <!-- TESTIMONI -->
    <section id="testimoni" class="testimoni">
      <div class="container">

        <div class="section-title text-center">
          <span class="amber-subtitle">KATA MEREKA</span>
          <h2>Apresiasi dari Pelanggan</h2>
          <div class="divider"></div>
        </div>

        <div class="testi-grid">
          <div
            v-for="item in testimoni"
            :key="item.nama"
            class="testi-card"
          >
            <div class="testi-quote-mark">&ldquo;</div>

            <div class="testi-stars">
              <span v-for="n in item.rating" :key="n" class="star-amber">★</span>
            </div>

            <p class="testi-teks">{{ item.kutipan }}</p>

            <div class="testi-orang">
              <div class="testi-avatar">{{ item.nama.charAt(0) }}</div>
              <div>
                <p class="testi-nama">{{ item.nama }}</p>
                <p class="testi-peran">{{ item.peran }}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- CTA RESERVASI / PESAN -->
    <section class="cta">
      <div class="container cta-box">
        <h2>Lapar & Ingin Masakan Lezat?</h2>
        <p>Pesan langsung via WhatsApp untuk menikmati hidangan favoritmu hangat-hangat.</p>
        <a
          href="https://wa.me/6285262645595"
          target="_blank"
          class="btn btn-amber btn-large"
        >
          Pesan via WhatsApp
        </a>
      </div>
    </section>

    <!-- KONTAK & LOKASI -->
    <section id="kontak" class="contact">
      <div class="container contact-grid">

        <div class="contact-text">
          <span class="amber-subtitle">LOKASI & KONTAK</span>
          <h2>Mampir ke Warung</h2>
          <div class="divider align-left"></div>

          <div class="contact-info">
            <div class="contact-item">
              <span class="contact-icon">📍</span>
              <div>
                <strong>Alamat</strong>
                <p>Jl. Alfalah II, Medan, Sumatera Utara</p>
              </div>
            </div>

            <div class="contact-item">
              <span class="contact-icon">📞</span>
              <div>
                <strong>Telepon / WhatsApp</strong>
                <p>0852-6264-5595</p>
              </div>
            </div>

            <!-- TIKTOK -->
            <div class="contact-item">
              <span class="contact-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-1.28V9.16a6.34 6.34 0 0 0-3.32.93 6.32 6.32 0 1 0 10.36 4.91V8.5a8.28 8.28 0 0 0 4.07 1.64V6.69z"/>
                </svg>
              </span>
              <div>
                <strong>TikTok Resmi</strong>
                <p>@WarungMakBos</p>
              </div>
            </div>

            <!-- INSTAGRAM -->
            <div class="contact-item">
              <span class="contact-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </span>
              <div>
                <strong>Instagram Resmi</strong>
                <p>@WarungMakBos</p>
              </div>
            </div>

          </div>
        </div>

        <div class="contact-map">
          <iframe
            src="https://www.google.com/maps?q=Jl.+Alfalah+II,+Medan&output=embed"
            width="100%"
            height="100%"
            style="border: 0;"
            allowfullscreen
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

      </div>
    </section>

    

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

/* BRIGHT WARM LUXURY PALETTE */
.luxury-wrapper {
  background-color: #fdfbf7; /* Bright Warm Cream */
  color: #2d241e;
  font-family: 'Plus Jakarta Sans', sans-serif;
  overflow-x: hidden;
}

h1, h2, h3, .receipt-title {
  font-family: 'Playfair Display', serif;
}

.amber-text {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.amber-subtitle {
  color: #d97706;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 3px;
  display: block;
  margin-bottom: 8px;
}

.section-title h2 {
  font-size: 36px;
  color: #231912;
  margin-bottom: 12px;
}

.section-title p {
  color: #6b5a4e;
  max-width: 620px;
  margin: 0 auto;
  line-height: 1.8;
}

.divider {
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #d97706, #c2410c, transparent);
  margin: 15px auto 25px;
}

.divider.align-left {
  margin-left: 0;
}

/* BUTTONS */
.btn {
  display: inline-block;
  padding: 14px 32px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-amber {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  color: #ffffff;
  border: none;
  box-shadow: 0 4px 15px rgba(217, 119, 6, 0.3);
}

.btn-amber:hover {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  box-shadow: 0 6px 20px rgba(217, 119, 6, 0.45);
  transform: translateY(-2px);
}

.btn-outline {
  border: 2px solid #d97706;
  color: #b45309;
  background: transparent;
}

.btn-outline:hover {
  background: rgba(217, 119, 6, 0.1);
  color: #78350f;
}

/* HERO SECTION */
.hero {
  position: relative;
  padding: 100px 0 80px;
  background: 
    radial-gradient(circle at 80% 20%, rgba(251, 191, 36, 0.25) 0%, transparent 50%),
    radial-gradient(circle at 10% 80%, rgba(249, 115, 22, 0.15) 0%, transparent 40%);
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 60px;
}

.luxury-badge {
  display: inline-block;
  padding: 6px 16px;
  border: 1px solid rgba(217, 119, 6, 0.3);
  background: rgba(251, 191, 36, 0.2);
  color: #92400e;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  margin-bottom: 25px;
  border-radius: 50px;
}

.hero h1 {
  font-size: 50px;
  line-height: 1.18;
  color: #231912;
  margin-bottom: 25px;
}

.hero p {
  color: #57463a;
  font-size: 16px;
  line-height: 1.8;
  margin-bottom: 40px;
  max-width: 480px;
}

.hero-buttons {
  display: flex;
  gap: 20px;
}

.image-frame {
  position: relative;
  padding: 20px;
  border: 2px solid rgba(217, 119, 6, 0.25);
  border-radius: 30px;
  background: #ffffff;
  box-shadow: 0 15px 35px rgba(180, 83, 9, 0.1);
}

.image-frame img {
  width: 100%;
  max-height: 420px;
  object-fit: contain;
}

/* TENTANG KAMI */
.about {
  padding: 90px 0;
  background: #f7f2e9;
}

.about-wrap {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 70px;
  align-items: center;
  margin-top: 50px;
}

.about-visual {
  position: relative;
}

.visual-border {
  padding: 10px;
  border: 2px solid rgba(217, 119, 6, 0.2);
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
}

.about-photo {
  width: 100%;
  height: 420px;
  object-fit: cover;
  border-radius: 12px;
}

.luxury-receipt {
  position: absolute;
  right: -20px;
  bottom: -25px;
  width: 230px;
  background: #ffffff;
  border: 1px solid rgba(217, 119, 6, 0.3);
  padding: 22px 18px;
  box-shadow: 0 15px 30px rgba(0,0,0,0.1);
  border-radius: 10px;
}

.receipt-title {
  color: #b45309;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 1px;
  text-align: center;
}

.receipt-sub {
  color: #8c7665;
  font-size: 10px;
  text-align: center;
  margin-bottom: 12px;
}

.receipt-divider {
  border-top: 1px dashed rgba(217, 119, 6, 0.3);
  margin: 12px 0;
}

.receipt-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #42342b;
  margin-bottom: 6px;
}

.receipt-footer {
  font-size: 11px;
  color: #d97706;
  text-align: center;
  font-style: italic;
  margin-top: 10px;
}

.about-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.about-card {
  display: flex;
  gap: 20px;
  padding: 22px;
  background: #ffffff;
  border: 1px solid rgba(217, 119, 6, 0.15);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
}

.about-card:hover {
  border-color: #d97706;
  transform: translateX(6px);
  box-shadow: 0 8px 25px rgba(217, 119, 6, 0.12);
}

.about-icon {
  width: 46px;
  height: 46px;
  border-radius: 10px;
  background: rgba(251, 191, 36, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.about-icon svg {
  width: 24px;
  height: 24px;
  stroke: #b45309;
}

.about-card h3 {
  color: #231912;
  font-size: 18px;
  margin-bottom: 6px;
}

.about-card p {
  color: #6b5a4e;
  font-size: 14px;
  line-height: 1.6;
}

/* TESTIMONI */
.testimoni {
  padding: 90px 0;
  background: #fdfbf7;
}

.testi-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
  margin-top: 45px;
}

.testi-card {
  background: #ffffff;
  border: 1px solid rgba(217, 119, 6, 0.15);
  padding: 30px 25px;
  border-radius: 12px;
  position: relative;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
}

.testi-card:hover {
  border-color: #d97706;
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(217, 119, 6, 0.15);
}

.testi-quote-mark {
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 55px;
  color: rgba(217, 119, 6, 0.15);
  font-family: 'Playfair Display', serif;
  line-height: 1;
}

.star-amber {
  color: #f59e0b;
  font-size: 14px;
  margin-right: 2px;
}

.testi-teks {
  color: #42342b;
  font-size: 14px;
  line-height: 1.7;
  font-style: italic;
  margin: 18px 0 22px;
}

.testi-orang {
  display: flex;
  align-items: center;
  gap: 12px;
}

.testi-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #ffffff;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.testi-nama {
  color: #231912;
  font-weight: 600;
  font-size: 15px;
}

.testi-peran {
  color: #8c7665;
  font-size: 12px;
}

/* CTA */
.cta {
  padding: 70px 0;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
}

.cta-box {
  text-align: center;
  padding: 50px 30px;
  border: 2px solid rgba(217, 119, 6, 0.2);
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(217, 119, 6, 0.08);
}

.cta-box h2 {
  font-size: 34px;
  color: #231912;
  margin-bottom: 12px;
}

.cta-box p {
  color: #6b5a4e;
  margin-bottom: 28px;
}

.btn-large {
  padding: 16px 38px;
  font-size: 15px;
}

/* KONTAK */
.contact {
  padding: 90px 0;
  background: #f7f2e9;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.contact-text h2 {
  font-size: 36px;
  color: #231912;
}

.contact-info {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.contact-item {
  display: flex;
  gap: 18px;
  align-items: center;
}

.contact-icon {
  font-size: 18px;
  background: rgba(251, 191, 36, 0.3);
  color: #b45309;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: 1px solid rgba(217, 119, 6, 0.2);
  flex-shrink: 0;
}

.contact-item strong {
  color: #231912;
  display: block;
  font-size: 15px;
  margin-bottom: 2px;
}

.contact-item p {
  color: #6b5a4e;
  font-size: 14px;
  margin: 0;
}

.contact-map {
  height: 380px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid rgba(217, 119, 6, 0.2);
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
}

/* FOOTER */
.footer {
  background: #231912;
  color: #f7f2e9;
  padding: 30px 0;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer p {
  font-size: 14px;
  color: #d6c5b3;
  margin: 0;
}

.footer-socials {
  display: flex;
  gap: 15px;
}

.social-link {
  color: #f7f2e9;
  background: rgba(255, 255, 255, 0.1);
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: #d97706;
  color: #ffffff;
  transform: translateY(-3px);
}

/* RESPONSIVE */
@media (max-width: 992px) {
  .hero-content, .about-wrap, .contact-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .testi-grid {
    grid-template-columns: 1fr;
  }

  .hero h1 {
    font-size: 38px;
  }

  .luxury-receipt {
    position: relative;
    right: 0;
    bottom: 0;
    width: 100%;
    margin-top: 20px;
  }

  .footer-content {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
}
</style>