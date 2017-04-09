<template>
  <div style="height:100%;">
    <view-box v-ref:view-box>
        <section class="banner">
          <img :src="homeBannerUrl">
        </section>

        <div class="home_banner_spliter"></div>

        <div class="cell" v-for="session in sessionList">
          <section class="album" @click="goToGoodsList(session)">
            <section class="imgdivClass">
              <img :src="session.bannerUrl" class="bannerImg"/>
            </section>
            <section class="titlehere">
              {{session.title}}
            </section>
            <section class="status">
              <section class="countclass">
                <section class="count">
                  <span class="numverclass" :class="[session.itemCountClass]">{{session.numberOfGoods}}</span>件宝贝
                </section>
              </section>
              <section :class="[session.bidTimeClass,session.backgroundColorClass]">
                <span>{{session.auctionStatusDesc}}</span>
                <div class="cornertobe"></div>
              </section>
            </section>
          </section>
        </div>

      <tabbar slot="bottom">
        <tabbar-item selected link="/">
          <img slot="icon" src="../assets/img/home.png">
          <span slot="label">首页</span>
        </tabbar-item>
        <tabbar-item link="/myOrders">
          <img slot="icon" src="../assets/img/order.png">
          <span slot="label">我的订单</span>
        </tabbar-item>
        <tabbar-item v-if="user.role == 'administrator'" link="/admin">
          <img slot="icon" src="../assets/img/set.png">
          <span slot="label">管理后台</span>
        </tabbar-item>
      </tabbar>
    </view-box>
  </div>
</template>

<script>
  import DateFormat from "../utils/DateFormat.js"
  import { Tabbar, TabbarItem , Scroller ,ViewBox } from 'vux'
  export default{
    components: {
      Tabbar,
      TabbarItem,
      Scroller,
      ViewBox
    },
    data(){
      return {
        homeBannerUrl: "",
        sessionList: [],
        user: {}
      }
    },
    created: function () {
      this.$http.get('/users/currentUser')
        .then(response=>{return response.body})
        .then(this.setUser);

      this.$http.get('/systemConfigs/configKey/HOME_BANNER_KEY')
        .then(response=>{return response.body})
        .then(this.setHomeBanner);

      this.$http.get('/sessions')
        .then(response=>{return response.body})
        .then(this.setSessionList);
    },
    methods: {
      setUser(user){
        this.user = user;
      },
      setHomeBanner(homeBanner){
        this.homeBannerUrl = homeBanner.value;
      },
      setSessionList(responseBody){
        var sessions = responseBody.items;
        var sessionList = this.sessionList;
        sessions.forEach(function (session) {
          var startTime = DateFormat.parseDate(session.startTime, "yyyy-MM-dd HH:mm:ss");
          var endTime = DateFormat.parseDate(session.endTime, "yyyy-MM-dd HH:mm:ss");
          var now = new Date();

          if (now.getTime() < startTime.getTime()) {
            session.itemCountClass = "goldenColor";
            session.auctionStatusDesc = DateFormat.format(startTime, "MM月dd日 HH:mm") + " 开始";
            session.bidTimeClass = "bidTime";
            session.backgroundColorClass = "goldenBackgroundColor";
          } else if (now.getTime() < endTime.getTime()) {
            session.itemCountClass = "redColor";
            session.auctionStatusDesc = DateFormat.format(endTime, "MM月dd日 HH:mm") + " 结束";
            session.bidTimeClass = "bidTime";
            session.backgroundColorClass = "redBackgroundColor";
          } else {
            session.itemCountClass = "grayColor";
            session.auctionStatusDesc = "已结束";
            session.bidTimeClass = "bidTime2";
            session.backgroundColorClass = "grayBackgroundColor";
          }

          sessionList.push(session);
        });
      },
      goToGoodsList(session){
        this.$router.push('/goodsList/'+session.id);
      }
    }
  }
</script>

<style>
  @import "../assets/css/session_list.css";
</style>
<style>
  html {
    font-size: 37.5px !important;
  }
  body {
    font-size: 14.0625px;
  }
</style>
