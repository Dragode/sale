<template>
    <div>
      <div v-for="order in orderList">
        <form-preview :header-label="'订单金额'" :header-value="order.price" :body-items="order.fields" :footer-buttons="getButton(order)"></form-preview>
        <br>
      </div>
    </div>
</template>

<script>
    import { FormPreview , AlertPlugin } from 'vux'
    import Vue from 'vue'
    Vue.use(AlertPlugin)

    var test = "test";

    export default{
      components: {
        FormPreview
      },
      data(){
        return{
          orderList:[
          ]
        }
      },
      mounted:function(){
        var orderList = this.orderList;
        var vux = this.$vux;
        var httpClient = this.$http;
        this.$http.get('/orders/all').then(
          function(response){
            var response = response.body;
            if("0" == response.resultCode){
              response.items.forEach(function(order){
                var goodsTitle;
                var userPhoneNumber;
                //TODO 改成Promise.all
                httpClient.get("/goods/"+order.goodsId).then(
                  function(response){
                    goodsTitle = response.body.title;
                  },
                  function(){
                    vux.alert.show({
                      title: '提示',
                      content: '获取订单失败！',
                      onHide () {
                          window.location.reload();
                      }
                    });
                  }
                ).then(()=>{
                  httpClient.get("/users/"+order.userId).then(
                    function(response){
                      userPhoneNumber = response.body.phoneNumber;

                      order.fields = [
                        {
                          label: '订单编号',
                          value: order.displayId
                        },
                        {
                          label: '用户手机号码',
                          value: userPhoneNumber
                        }, {
                          label: '商品名称',
                          value: goodsTitle
                        }
                      ];

                      order.price = "¥" + order.price + ".00";

                      orderList.push(order);
                    },
                    function(){
                      vux.alert.show({
                        title: '提示',
                        content: '获取订单失败！',
                        onHide () {
                            window.location.reload();
                        }
                      });
                    }
                  );
                  }
                )
              })
            }else{
              vux.alert.show({
                title: '提示',
                content: '获取订单失败！',
                onHide () {
                    window.history.back();
                }
              });
            }
          },
          function(){
            vux.alert.show({
              title: '提示',
              content: '获取订单失败！',
              onHide () {
                  window.history.back();
              }
            });

          }
        )
      },
      methods:{
        getButton(order){
          var button = {
            style: 'default',
            text:"订单已完成",
            onButtonClick: function() {
            }
          }

          var httpClient = this.$http;
          var vux = this.$vux;
          if("WAIT_FOR_PAY" == order.status){
            button.style = "primary";
            button.text = "点击确认收到用户付款";

            button.onButtonClick = function () {
              httpClient.post('/orders/action/userPayed/orderId/'+order.id,{}).then(
                function(response){
                   if("0" == response.body.resultCode){
                     vux.alert.show({
                       title: '提示',
                       content: '操作成功！',
                       onHide () {
                          window.location.reload();
                       }
                     });
                   }else{
                     vux.alert.show({
                       title: '提示',
                       content: '操作失败！'
                     });
                   }
                },
                function(){
                   vux.alert.show({
                     title: '提示',
                     content: '操作失败！'
                   });
                }
              )
            }
          }
          if("PAY_SUCCESS" == order.status){
            button.style = "primary";
            button.text = "点击发货";
            button.onButtonClick =function() {
              button.onButtonClick = function () {
                httpClient.post('/orders/action/deliverGoods/orderId/'+order.id,{}).then(
                  function(response){
                     if("0" == response.body.resultCode){
                       vux.alert.show({
                         title: '提示',
                         content: '操作成功！',
                         onHide () {
                            window.location.reload();
                         }
                       });
                     }else{
                       vux.alert.show({
                         title: '提示',
                         content: '操作失败！'
                       });
                     }
                  },
                  function(){
                     vux.alert.show({
                       title: '提示',
                       content: '操作失败！'
                     });
                  }
                )
              }
            }
          }
          if("DILIVERED" == order.status){
            button.style = "primary";
            button.text = "点击确认用户收到商品";
            button.onButtonClick =function() {
              button.onButtonClick = function () {
                httpClient.post('/orders/action/receiveGoods/orderId/'+order.id,{}).then(
                  function(response){
                     if("0" == response.body.resultCode){
                       vux.alert.show({
                         title: '提示',
                         content: '操作成功！',
                         onHide () {
                            window.location.reload();
                         }
                       });
                     }else{
                       vux.alert.show({
                         title: '提示',
                         content: '操作失败！'
                       });
                     }
                  },
                  function(){
                     vux.alert.show({
                       title: '提示',
                       content: '操作失败！'
                     });
                  }
                )
              }
            }
          }
          return [button]
        }
      }
    }
</script>

<style>

</style>
