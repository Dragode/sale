<template>
  <div class="m-pmchannel-auction">
    <div class="module-wrap">
      <div class="auction-container square-col1">
        <div class="auction-wrapper" v-for="goods in goodsList">
          <a href="" class="item" :class="{wait:goods.status==0,ing:goods.status==1,end:goods.status>=2}">
            <div class="img-wrapper">
              <img :src="goods.bannerUrl" style="width: 100%;">
            </div>
            <div class="info">
              <div class="title">{{goods.title}}</div>
              <div class="price-section">
                <div class="unit">
                  <div class="rmb">RMB</div>
                  <br>
                  <div class="desc">当前价</div>
                </div>
                <div class="price-number"><b>{{goods.currentPrice}}</b></div>
                <div class="quantity"></div>
              </div>
              <div class="footer">
                <div class="text-section">
                  <div class="looker">
                  </div>
                  <div class="time-status">
                    <span class="date-desc" :class="{wait:goods.status==0,ing:goods.status==1,end:goods.status>=2}">
                      {{formatDate(goods)}}
                    </span>
                  </div>
                </div>
                <div class="button-section">
                  <b style="color:#970022;"></b>
                  <div class="button-desc">立即拍</div>
                </div>
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
    import DateFormat from "../utils/DateFormat.js"
    export default{
        data(){
            return{
              goodsList:[]
            }
        },
        components:{
        },
        mounted:function(){
          this.$http.get("/goods/sessionId/"+this.$route.params.sessionId).then(this.renderGoodsList);
        },
        methods:{
          renderGoodsList(response){
            this.goodsList = response.body.items;
          },
          formatDate(goods){
            if(goods.status == 0){
                var startTime = DateFormat.parseDate(goods.startTime,"yyyy-MM-dd hh:mm:ss");
                return DateFormat.format(startTime,"MM月dd日 HH:mm 开始");
            }else if(goods.status == 1){
              var endTime = DateFormat.parseDate(goods.endTime,"yyyy-MM-dd hh:mm:ss");
              return DateFormat.format(endTime,"MM月dd日 HH:mm 结束");
            }else{
              return "已结束";
            }
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
