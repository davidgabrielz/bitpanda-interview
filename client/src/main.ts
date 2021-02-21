import VueCompositionAPI from '@vue/composition-api';
import Vue from 'vue';
import Vuex from 'vuex';

import store from '@/stores/todoStore';

import App from './App.vue';

import 'vue-material-design-icons/styles.css';

Vue.config.productionTip = false;

Vue.use(VueCompositionAPI);
Vue.use(Vuex);

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
