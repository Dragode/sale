// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource';
import App from './App.vue'
import Admin from './components/Admin.vue'
import AddSession from './components/AddSession.vue'
import AddGoods from './components/AddGoods.vue'
import OrderManage from './components/OrderManage.vue'
import UserManage from './components/UserManage.vue'
import SetSystemConfig from './components/SetSystemConfig.vue'

import SessionList from './components/SessionList.vue'
import MyOrders from './components/MyOrders.vue'
import GoodsList from './components/GoodsList.vue'
import GoodsDetail from './components/GoodsDetail.vue'
import Register from './components/Register.vue'
import CashDepositDesc from './components/CashDepositDesc.vue'
import AuctionMall from './components/AuctionMall.vue'

Vue.use(VueRouter);
Vue.use(VueResource);

const routes = [
  {
    path: '/admin',
    component: Admin
  },
  {
    path: '/addSession',
    component: AddSession
  },
  {
    path: '/addGoods',
    component: AddGoods
  },
  {
    path: '/orderManage',
    component: OrderManage
  },
  {
    path: '/userManage',
    component: UserManage
  },
  {
    path: '/setSystemConfig',
    component: SetSystemConfig
  },

  {
    path: '/',
    component: SessionList
  },
  {
    path: '/myOrders',
    component: MyOrders
  },
  {
    path: '/goodsList/:sessionId',
    component: GoodsList
  },
  {
    path: '/goodsDetail/:goodsId',
    component: GoodsDetail
  },
  {
    path: '/register/:goodsId',
    component: Register
  },
  {
    path: '/cashDepositDesc',
    component: CashDepositDesc
  },
  {
    path: '/auctionMall/:goodsId',
    component: AuctionMall
  }
];

const router = new VueRouter({
  routes
});

FastClick.attach(document.body)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app-box');
