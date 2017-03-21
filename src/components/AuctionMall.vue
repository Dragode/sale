<template>
  <div>
    <div class="wrap">
      <div class="bid-components">
        <div class="rc-statusbar ing">
          <div class="align-center">
            <span class="status-icon pm-iconfont">时</span>
            <span class="status-flag">正在进行</span>
            <span class="main">
                <!--TODO 当时间接近结束的时候用，即时间小于一小时用-->
                <div class="countdown" style="display: none;">
                    <div>00天07时02分41秒</div>
                </div>
                <span class="time">{{formattedTime}}</span>
                <span class="time-desc"></span>
            </span>
          </div>
        </div>
        <div class="bid-item" style="height: 3.34375rem; opacity: 1;">
          <div class="bid-item-img">
            <img :src="goods.auctionPic">
          </div>
          <div class="bid-item-info">
            <h3>{{goods.title}}</h3>
            <div class="bid-item-price" style="opacity: 1;">
              <i class="desc">
                <s class="rmb">RMB</s>
                <s class="text">当前价</s>
              </i>
              <span class="price-comma">
                <em class="price-comma-price">{{goods.currentPrice}}</em>
              </span>
            </div>
          </div>
        </div>
        <div class="bid-action">
          <div class="input-number">
            <div class="input-number-handler-wrap">
              <div class="input-number-handler input-number-handler-up" @click="addBidPrice">
                <span class="input-number-handler-up-inner"></span>
              </div>
              <div class="input-number-handler input-number-handler-down" @click="reduceBidPrice">
                <span class="input-number-handler-down-inner"></span>
              </div>
            </div>
            <div class="input-number-input-wrap">
              <span class="price-comma">
                  <span class="price-comma-price">{{bidPrice}}</span>
              </span>
              <div class="price-format">您将出价{{bidPrice}}元</div>
              <input min="90100" max="Infinity" class="input-number-input" autocomplete="off" disabled=""
                     value="90100"></div>
          </div>

          <div class="bid-wrap" @click="showConfirm('auction')">
            <div class="bid bid">
              <div class="bid-text">立即出价</div>
            </div>
          </div>

          <div class="bid-wrap" @click="showConfirm('proxy')">
            <div class="bid bid">
              <div class="bid-text">设置代理价</div>
            </div>
          </div>

          <div class="bid-wrap" v-if="goods.buyoutPrice != 0" @click="showConfirm('buyout')">
            <div class="bid bid">
              <div class="bid-text">一口价</div>
            </div>
          </div>

          <!--确认框-->
          <div class="bid-wrap">
            <div class="pm-modal" :class="{'pm-modal-hidden':hideBidConfirm}">
              <div class="pm-modal-mask"></div>
              <div class="pm-modal-wrap" style="margin: 0px 8.75%; width: 82.5%;">
                <div class="pm-modal-content">
                  <div class="pm-modal-body">
                    <p class="title">是否确认出价？</p>
                    <p>您的出价
                      <span class="price-comma">
                        <i class="price-comma-rmb">￥</i>
                        <em class="price-comma-price">{{bidPrice}}</em>
                      </span>
                    </p>
                  </div>
                  <div class="pm-modal-footer">
                    <button type="button" class="pm-modal-btn btn-ok-half" @click="confirmOk">确 定</button>
                    <button type="button" class="pm-modal-btn btn-cancel-half" @click="confirmCancel">再想想</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!--提示框-->
          <div class="bid-wrap">
            <div class="pm-modal" :class="{'pm-modal-hidden':hideTip}">
              <div class="pm-modal-mask"></div>
              <div class="pm-modal-wrap" style="margin: 0px 8.75%; width: 82.5%;">
                <div class="pm-modal-content">
                  <div class="pm-modal-body">
                    <p class="title">{{tipTitle}}</p>
                    <p>{{tipContent}}</p>
                  </div>
                  <div class="pm-modal-footer">
                    <button type="button" class="pm-modal-btn btn-ok-half" @click="tipOk">确 定</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
              goods:{},
              bidPrice:0,
              formattedTime:"",
              bidType:"",
              tipTitle:"",
              tipContent:"",
              hideBidConfirm:true,
              hideTip:true
            }
        },
        created: function () {
          this.$http.get("/goods/"+this.$route.params.goodsId).then(this.renderGoods)
        },
        methods:{
          renderGoods(response){
            this.goods = response.body;
            var endTime = DateFormat.parseDate(this.goods.endTime,"yyyy-MM-dd hh:mm:ss");
            this.formattedTime = DateFormat.format(endTime, 'MM月dd日 HH:mm 结束');
            this.bidPrice = this.goods.currentPrice + this.goods.bidIncrement;
          },
          addBidPrice(){
            this.bidPrice = this.bidPrice +  this.goods.bidIncrement;
          },
          reduceBidPrice(){
            if (this.bidPrice - this.goods.bidIncrement > this.goods.currentPrice) {
                this.bidPrice -= this.goods.bidIncrement;
            }
          },
          showConfirm(bidType){
            this.bidType = bidType;
            if('buyout' == bidType){
              this.bidPrice = this.goods.buyoutPrice;
            }
            this.hideBidConfirm =false;
          },
          confirmOk(){
            var url = "";
            if("auction" == this.bidType){
              url = "/goods/action/auction/goodsId/"+this.goods.id+"/price/"+this.bidPrice;
            }
            if("proxy" == this.bidType){
              url = "/goods/action/proxyAuction/goodsId/"+this.goods.id+"/price/"+this.bidPrice;
            }
            this.$http.post(url,{}).then(this.handleAuctionResponse)
            this.hideBidConfirm =true;
          },
          confirmCancel(){
            this.hideBidConfirm =true;
          },
          handleAuctionResponse(response){
            var responseBody = response.body;
            if(responseBody && responseBody.code == 0){
              if('auction' == bidType){
                this.tipTitle = "竞价成功";
                this.tipContent = "您已竞价成功！您的出价为"+this.bidPrice+"元";
                this.hideTip = false;
                this.goods.currentPrice = this.bidPrice;
              }
              if('proxy' == bidType){
                this.tipTitle = "设置代理价成功";
                this.tipContent = "您已成功设置代理价！且您当前的出价为"+this.bidPrice+"元";
                this.hideTip = false;
                this.goods.currentPrice = this.goods.currentPrice + this.goods.bidIncrement;
              }
              if('buyout' == bidType){
                this.tipTitle = "";
                this.tipContent = "";
                this.hideTip = false;
                this.goods.currentPrice = this.goods.buyoutPrice;
              }
            }

            if(responseBody && responseBody.code == -1){
              this.tipTitle = "竞价失败";
              this.tipContent = "对不起，您竞价失败！已经有人出了比您更高的价格，出价为{{currentPrice}}元";
              this.hideTip = false;
            }
          },
          tipOk(){
            this.hideTip =true;
          }
        }
    }
</script>

<style>
  @import "../assets/css/auction_mall.css";

</style>

<style>
    html {
        font-size: 37.5px !important;
    }

    body {
        font-size: 14.0625px
    }
</style>
