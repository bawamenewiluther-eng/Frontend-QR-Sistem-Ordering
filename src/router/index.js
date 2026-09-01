import { createRouter, createWebHistory } from 'vue-router'
import Home from '../Pages/Home.vue'
import Menu from '../Pages/Menu.vue'
import Pesanan from '../Pages/Pesanan.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/menu', name: 'menu', component: Menu },
  { path: '/pesanan', name: 'pesanan', component: Pesanan },
  {
    path: '/order-status/:id',
    name: 'OrderStatus',
    component: () => import('../Pages/OrderStatus.vue')
  },
  {
    path: '/dapur',
    name: 'KitchenDashboard',
    component: () => import('../Pages/KitchenDashboard.vue'),
    meta: { requiresAdminKey: true }
  },
  {
    path: '/qr-meja/:id',
    name: 'TableQR',
    component: () => import('../Pages/TableQR.vue')
  },
  // Catch-all route: Mengalihkan semua path acak/tidak terdaftar ke Beranda
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAdminKey) {
    const urlKey = to.query.key
    const savedKey = localStorage.getItem('admin_secret_key')
    
    // Key rahasia untuk akses halaman Dapur
    const VALID_KEY = 'admin123' 

    if (urlKey === VALID_KEY || savedKey === VALID_KEY) {
      if (urlKey) localStorage.setItem('admin_secret_key', urlKey)
      next()
    } else {
      // Mengalihkan langsung ke Beranda secara diam-diam tanpa alert
      next('/') 
    }
  } else {
    next()
  }
})

export default router