<template>
  <div class="main-container">

    <div class="wrapper">
      <!--头部-->
      <div class="first-screen">
        <!--图片轮播-->
        <swiper height="10rem" dots-position="center">
          <swiper-item v-for="(item, index) in goods.showPictures" :key="index">
            <img :src="item" style="width: 100%;">
          </swiper-item>
        </swiper>

        <!--拍卖状态-->
        <div class="rc-statusbar" :class="{'before':goods.status==0,'ing':goods.status==1,'end':goods.status>=2}">
          <div class="align-left">
            <span class="status-icon pm-iconfont">时</span>
            <span class="status-flag">{{auctionStatusDesc}}</span>
            <span class="main" v-if="goods.status==0 || goods.status==1">
              <!--TODO 当时间接近结束的时候用，即时间小于一小时用-->
              <div class="countdown" v-if="countdown">
                <div>{{countdownDesc}}</div>
              </div>
              <span class="time" v-if="!countdown">
                 <span class="time">{{formattedTime}}</span>
              </span>
              <span class="time-desc"></span>
            </span>
          </div>
          <div class="rc-statusbar-shadow"></div>
        </div>

        <!--标题、价格-->
        <section class="pai-info" :class="{'pai-info-before':goods.status==0,'pai-info-ing':goods.status==1,'pai-info-end':goods.status>=2}">
          <div class="header">
            <p class="title">{{goods.title}}</p>
            <div class="rc-mobile-share pm-share" v-if="goods.status==0 || goods.status==1">
              <div class="rc-mobile-share-wrap" @click="remind">
                <b class="icon pm-util-iconfont">空</b>
                <p v-if="goods.status==0 && registeredRemindTypes.indexOf(0)==-1">开拍提醒</p>
                <p v-if="goods.status==1 && registeredRemindTypes.indexOf(1)==-1">结拍提醒</p>
                <p v-if="goods.status==0 && registeredRemindTypes.indexOf(0)!=-1">已订阅提醒</p>
                <p v-if="goods.status==1 && registeredRemindTypes.indexOf(1)!=-1">已订阅提醒</p>
              </div>
            </div>
          </div>
          <div class="basic-price">
            <div class="unit"><b>RMB</b><span>当前价</span></div>
            <div class="price-number">
              <span class="price-comma">
                  <em class="price-comma-price">{{goods.currentPrice}}</em>
              </span>
            </div>
          </div>
        </section>

        <!--相关参数-->
        <div class="rc-param rc-param-simple">
          <dl class="list">
            <dd class="twoColumn item">
              <div class="param-name">起拍价</div>
              <div class="param-value">
                <span class="price-comma">
                  <i class="price-comma-rmb">￥</i>
                  <em class="price-comma-price">{{goods.startingPrice}}</em>
                </span>
              </div>
            </dd>
            <dd class="twoColumn item">
              <div class="param-name">市场估价</div>
              <div class="param-value">
                <span class="price-comma">
                  <i class="price-comma-rmb">￥</i>
                  <em class="price-comma-price">{{goods.evaluate}}</em>
                </span>
              </div>
            </dd>
            <dd class="twoColumn item">
              <div class="param-name">加价幅度</div>
              <div class="param-value">
                <span class="price-comma">
                  <i class="price-comma-rmb">￥</i>
                  <em class="price-comma-price">{{goods.bidIncrement}}</em>
                </span>
              </div>
            </dd>
            <dd class="twoColumn item no-border">
              <div class="param-name">延时周期</div>
              <div class="param-value">{{goods.delayCycle}}分/次</div>
            </dd>
            <dd class="twoColumn item no-border">
              <div class="param-name">品种</div>
              <div class="param-value">{{goods.breed}}</div>
            </dd>
            <dd class="twoColumn item no-border">
              <div class="param-name">规格</div>
              <div class="param-value">{{goods.standard}}</div>
            </dd>
            <dd class="twoColumn item no-border">
              <div class="param-name">作者</div>
              <div class="param-value">{{goods.author}}</div>
            </dd>
          </dl>
        </div>
      </div>

      <!--商品详情-->
      <div class="second-screen inited">
        <div class="second-screen-wrap">
          <div class="rc-tabs rc-tabs-top">
            <div class="rc-tabs-content">
              <div class="rc-tabs-tabpane">
                <div class="list-title"><strong>图文详情</strong></div>
                <!-- TODO 增加视频支持
                <div class="rc-video">
                  <video id="rc-video-9" controls="" preload="none" poster="/exampleImg/videoPoster.jpg">
                    <source src="/exampleImg/video.m3u8" type="application/x-mpegurl">
                    <source src="/exampleImg/video.mp4" type="video/mp4">
                    <p>您的浏览器不支持视频播放</p>
                  </video>
                </div>
                -->
                <div class="cdn-content">
                  <div class="cdn-content-desc">
                    <!--商品图片-->
                    <img v-for="descPic in goods.descPictures" :src="descPic">
                  </div>
                </div>

                <div class="help-tips">
                  <div class="title">拍卖须知</div>
                  <div class="text">
                    购买指导
                    <br>
                    【特别申明】本商城作品与实体店同步售卖，实体店如果同时售卖出去未及时下架。将以实体店为主。购买款将及时返还，敬请谅解。作品实体店售卖出去客服将第一时间下架商品。实体店售卖时间基本为早上8点一晚上19点。
                    <br>
                    <br>
                    <br>
                    【郑重承诺】我们所提供的藏品，均有把关，可确保材质。保真。
                    <br>
                    所有藏品图片均为实物拍摄，尽最大努力与实物颜色接近。
                    <br>
                    如有疑问请与我们联系：
                    <br>
                    13055255438黄先生，或加手机微信号。（上班时间：9:00-12:00；14:00-18:00，冬令时：13:30-17:30）
                    <br>
                    关于邮费
                    <br>
                    因系统无法设置邮费文字说明，故在此特别说明：
                    <br>
                    1、为防止物品损坏及丢失事件的发生，故雕刻作品一律顺丰到付。贵重藏品将有保价，邮费买家支付。
                    <br>
                    2、退货也一律顺丰到付。
                    <br>
                    3、因系统无法设置邮费文字说明，显示0元，但实则邮费到付，买家支付，尽请谅解！
                    <br>
                    关于发货
                    <br>
                    您完成付款后，藏品会在72小时内完成发货，配送地址为您在商城所填写的具体收货地址为准。
                    <br>
                    收到下藏品后请务必当面签收并拆包验货，如发现藏品不符或损坏，请拒收并与我们联系。
                    <br>
                    退货原则
                    <br>
                    藏品自本商城发货时间起7天内原件无损坏的情况 ，可以向本商城提出退货申请，联系管理员。本商城确认并通过申请后3天内，将藏品保持原样退回。本商城确认藏品无损坏后将全额退款。
                    <br>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--底部按钮-->
      <section class="main-op" v-if="goods.status == 1" @click="goToAuction">
        <div class="main-btn">
          <div class="jiaobao">
            <p class="action">竞拍</p>
            <p class="foregift" v-if="goods.cashDeposit != 0">
              (保证金金额<b>￥</b>{{goods.cashDeposit}})
            </p>
          </div>
        </div>
      </section>

      <confirm v-model="tipCashDeposit" title="提示"
               confirm-text="知道了" cancel-text="查看保证金描述"
               @on-cancel="seeCashDepositDesc">
        <p style="text-align:center;">该商品需要缴纳保证金，请联系客服。客服联系方式：xxxxx</p>
      </confirm>

      <alert v-model="tipBlackList" :title="'提示'">请联系客服开通购买权限。客服联系方式：xxxxx</alert>
    </div>
  </div>
</template>

<script>
  import { Swiper , SwiperItem , dateFormat , Confirm , AlertPlugin } from 'vux'
  import Vue from 'vue'
  Vue.use(AlertPlugin);
  import DateFormat from "../utils/DateFormat.js"

  export default{
    components: {
      Swiper,
      SwiperItem,
      Confirm
    },
    data(){
      return {
        goods: {},
        user:{},
        auctionStatusDesc:"",
        countdown:false,
        countdownDesc:"03天10时18分43秒",
        formattedTime:"",
        registeredRemindTypes:[],
        tipCashDeposit:false
      }
    },
    mounted:function(){
      this.$http.get("/goods/"+this.$route.params.goodsId).then(this.renderGoods)
          .then(this.$http.get("/reminders/allRegisteredType/goodsId/"+this.$route.params.goodsId).then(this.renderRemind));
    },
    methods: {
      renderGoods(response){
        this.goods = response.body;
        if(this.goods.status == 0){
          this.auctionStatusDesc = "即将开始";
          var startTime = DateFormat.parseDate(this.goods.startTime,"yyyy-MM-dd hh:mm:ss");
          this.formattedTime = DateFormat.format(startTime, 'MM月dd日 HH:mm 开始');
        }else if(this.goods.status == 1){
          this.auctionStatusDesc = "正在拍卖";
          var endTime = DateFormat.parseDate(this.goods.endTime,"yyyy-MM-dd hh:mm:ss");
          this.formattedTime = DateFormat.format(endTime, 'MM月dd日 HH:mm 结束');
        }else{
          this.auctionStatusDesc = "已结束";
        }
      },
      renderRemind(response){
        this.registeredRemindTypes = response.body.items;
      },
      remind(){
        var remindType = null;
        if (this.goods.status == 0) {
          if(this.registeredRemindTypes.indexOf(0) != -1){
            this.registerRemindSuccess();
          }
          remindType = 0;
        } else if (this.goods.status == 1) {
          if(this.registeredRemindTypes.indexOf(1) != -1){
            this.registerRemindSuccess();
          }
          remindType = 1;
        }

        if (remindType != null) {
          this.$http.post("/reminders/goodsId/" + this.$route.params.goodsId,remindType).then(this.registerRemindSuccess)
        }
      },
      registerRemindSuccess(){
        this.$http.get("/reminders/allRegisteredType/goodsId/"+this.$route.params.goodsId).then(this.renderRemind);
        this.$vux.alert.show({
          title: '提示',
          content: '订阅提醒成功！'
        });
      },
      goToAuction(){
        this.$http.get("/users/currentUser")
            .then(response=>{return response.body})
            .then(this.chooseWhereToGo)
      },
      chooseWhereToGo(user){
        this.user = user;
        if(user && !user.phoneNumber){
          //用户未注册，获取用户微信昵称等信息，再重定向到注册页面
          window.location.href = "/wx/redirectToWxOauthEx/index-register-" + this.goods.id;
        }else if("black_list" == user.role){
          //黑名单用户提示
          this.$vux.alert.show({
            title: '错误',
            content: '请联系客服开通购买权限。客服联系方式：xxxxx'
          });
        }else if("normal" == user.role && 0 != this.goods.cashDeposit){
          //已注册的用户，判断是否要交保证金
          //普通用户拍卖需要保证金的商品需要缴纳保证金
          this.tipCashDeposit = true;
        }else{
          //不需要交保证金，则前往拍卖大厅
          this.$router.push({path:"/auctionMall/"+this.goods.id});
        }
      },
      seeCashDepositDesc(){
        this.$router.push({path:"/cashDepositDesc"});
      }
    }
  }
</script>

<style>
  @import "../assets/css/goods_detail.css";
</style>
<style>
  html {
    font-size: 37.5px !important;
  }

  body {
    font-size: 14.0625px
  }
</style>
