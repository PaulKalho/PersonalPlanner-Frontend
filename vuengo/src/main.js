import { createApp, VueElement } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {faPenToSquare} from '@fortawesome/free-regular-svg-icons'
axios.defaults.baseURL = 'http://127.0.0.1:8000'

library.add(faPenToSquare)

createApp(App).use(store).use(router,axios).component('font-awesome-icon' , FontAwesomeIcon).mount('#app')
