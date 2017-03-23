<template>
  <div class="main-container">
    <div class="cell">
      <section class="item" v-for="order in orderList">
        <section class="left_box">
          <img class="img" :src="order.goods.bannerUrl">
        </section>
        <section class="right_box">
          <section class="top">{{order.goods.title}}</section>
          <section class="middle">
            <section>订单状态：</section>
            <section class="item_price item_time_wait">{{order.statusDesc}}</section>
          </section>
        </section>
      </section>
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
                order.statusDesc = orderStatusDescMap[order.status]
                this.$http.get("/goods/"+order.goodsId).then(response => {
                  order.goods = response.body;
                  orderList.push(order);
                });
              })
            });
          }
        }
    }

</script>

<style>

</style>
