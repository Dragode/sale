<template>
  <div class="m-pmchannel-auction">
    <div class="module-wrap">
      <div class="auction-container square-col1">
        <div class="auction-wrapper" v-for="order in orderList">
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
                      {{order.statusDesc}}
                    </span>
                  </div>
                </div>
                <!--<div class="button-section">
                  <b style="color:#970022;"></b>
                  <div class="button-desc">立即拍</div>
                </div>-->
              </div>
            </div>
            <div class="line"></div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default{
        data(){
            return{
              orderList:[],
              orderStatusDescMap:{
                "WAIT_FOR_PAY":"等待支付",
                "PAY_SUCCESS":"支付成功",
                "DILIVERED":"已发货",
                "FINISH":"已完成"
              }
            }
        },
        created:function(){
          this.getOrders();
        },
        methods:{
          getOrders(){
            var orderList = this.orderList;
            var orderStatusDescMap = this.orderStatusDescMap;

            this.$http.get("/orders").then(response => {
              response.body.items.forEach(order => {
                order.statusDesc = orderStatusDescMap[order.status];
                this.$http.get("/goods/"+order.goodsId).then(response => {
                  order.goods = response.body;
                  orderList.push(order);
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
    html {
        font-size: 37.5px !important;
    }

    body {
        font-size: 14.0625px
    }
</style>
