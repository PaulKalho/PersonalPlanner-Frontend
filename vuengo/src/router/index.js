import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LogIn from '../views/login.vue'
import signup from '../views/signup.vue'
import MyAccount from '../views/dashboard/MyAccount.vue'
import store from '../store'
import Use from '../views/Use.vue'
import Done from '../views/Done.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/sign-up',
    name: 'signup',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: signup
  },{
    path: '/log-in',
    name: 'LogIn',
    component: LogIn
  },{
    path: '/dashboard/my-account',
    name: 'MyAccount',
    component: MyAccount,
    meta: {
      requireLogin: true
    }
  },{
    path: '/app',
    name: 'Use',
    component: Use,
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/app/done',
    name: 'Done',
    component: Done, 
    meta: {
      requireLogin: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requireLogin) && !store.state.isAuthenticated) {
    next('/log-in')
  } else {
    next()
  }
})

export default router
