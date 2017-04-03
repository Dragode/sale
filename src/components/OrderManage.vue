<template>
  <div class="m-pmchannel-auction">
    <div class="module-wrap">
      <div class="auction-container square-col1">
        <div v-for="order in orderList">
          <step v-model="order.step" background-color='#fbf9fe' gutter="20px" style="margin: 5px;">
            <step-item :title="'用户付款'"></step-item>
            <step-item :title="'商家发货'"></step-item>
            <step-item :title="'用户收货'"></step-item>
          </step>
          <div class="auction-wrapper">
            <a href="javascript:void(0);" class="item wait">
              <div class="img-wrapper">
                <img :src="order.goods.bannerUrl" style="width: 100%;">
              </div>
              <div class="info">
                <div class="title">{{order.goods.title}}</div>
                <div class="price-section">
                  <div class="unit">
                    <div class="rmb">RMB</div>
                    <br>
                    <div class="desc">成交价</div>
                  </div>
                  <div class="price-number"><b>{{order.goods.currentPrice}}</b></div>
                  <div class="quantity"></div>
                </div>
                <div class="footer">
                  <div class="text-section">
                    <div class="looker">
                    </div>
                    <div class="time-status">
                      <span class="date-desc wait">
                        微信：{{order.user.nickname}}
                      </span>
                      <br>
                      <br>
                      <span class="date-desc wait">
                        手机：{{order.user.phoneNumber}}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="line"></div>
            </a>
          </div>
          <div class="btn_wrap" style="margin: 5px;margin-bottom: 10px;">
            <x-button type="primary" @click.native="nextStep(order)">{{order.goToNextStatusDesc}}</x-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Step, StepItem, XButton, XHr } from 'vux'

  export default{
    components: {
      Step,
      StepItem,
      XButton,
      XHr
    },
    data(){
      return{
        orderList:[],
        orderStatusInfo:{
          WAIT_FOR_PAY:{
            desc:"等待支付",
            step:0,
            nextStatus:"PAY_SUCCESS",
            goToNextStatusDesc:"收到用户付款"
          },
          "PAY_SUCCESS":{
            desc:"支付成功",
            step:1,
            nextStatus:"DILIVERED",
            goToNextStatusDesc:"已发货给用户"
          },
          "DILIVERED":{
            desc:"已发货",
            step:2,
            nextStatus:"FINISH",
            goToNextStatusDesc:"用户收到商品"
          },
          "FINISH":{
            desc:"已完成",
            step:3,
            nextStatus:"",
            goToNextStatusDesc:""
          }
        }
      }
    },
    created:function(){
      this.getOrders();
    },
    methods:{
      nextStep(order){
        var nextStauts = this.orderStatusInfo[order.status].nextStatus;
        if(nextStauts && ""!=nextStauts){
          order.status = nextStauts;
          this.$http.put("/orders",order).then(response => {
            order.step ++;
          });
        }
      },
      getOrders(){
        var orderList = this.orderList;
        var orderStatusInfo = this.orderStatusInfo;

        this.$http.get("/orders/all").then(response => {
          response.body.items.forEach(order => {
            order.statusDesc = orderStatusInfo[order.status].desc;
            order.step = orderStatusInfo[order.status].step;
            var goToNextStatusDesc = orderStatusInfo[order.status].goToNextStatusDesc;
            if(!goToNextStatusDesc || "" == goToNextStatusDesc){
              goToNextStatusDesc = "无下一步操作";
            }
            order.goToNextStatusDesc = goToNextStatusDesc;
            this.$http.get("/goods/"+order.goodsId).then(response => {
              order.goods = response.body;
              this.$http.get("/users/"+order.userId).then(response => {
                order.user = response.body;
                orderList.push(order);
              });
            });
          });
        });
      }
    }
  }
</script>

<style>
  @import "../assets/css/goods_list.css";
</style>

<style>
.vux-step-item-title {
  font-size: .4rem !important;
}
</style>
