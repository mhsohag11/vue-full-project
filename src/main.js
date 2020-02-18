import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import * as firebase from 'firebase'
import Alert from './components/Shared/Alert.vue'
require ('./assets/css/main.scss');

Vue.component('app-alert' , Alert)

Vue.config.productionTip = false

firebase.initializeApp({
  apiKey: 'AIzaSyA0hKn6-P2qQ0vN0GuSLqruVEGKUnPwMRg',
  authDomain: 'devs-meet.firebaseapp.com',
  databaseURL: 'https://devs-meet.firebaseio.com',
  projectId: 'devs-meet',
  storageBucket: 'devs-meet.appspot.com',
  messagingSenderId: '1072966140458',
  appId: '1:1072966140458:web:2609bc503b6ab4dc50f953',
  measurementId: 'G-1KE775377N'
})
firebase.auth().onAuthStateChanged( (user) => {
  if (user) {
    store.dispatch('autoSignIn' , user )
  } 
  new Vue({
    router,
    store,
    vuetify,
    render: h => h(App),
  }).$mount('#app')  
})
