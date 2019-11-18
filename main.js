import Vue from 'vue'
import App from './App'
import store from './pages/store/index'
Vue.config.productionTip = false
import Base from './baseinfo'
const base = type =>{
	return new Promise(resolve =>{
		resolve(Base[type])
	})
}
import Loading from '@/components/loading/loading'
Vue.component('Loading',Loading)
App.mpType = 'app'
Vue.prototype.$store = store;

Vue.prototype.$api = {base}

const app = new Vue({
    ...App
})
app.$mount()
