<template>
  <div class="main-container">

    <div class="wrapper">
      <!--头部-->
      <div class="first-screen">
        <!--图片轮播-->
        <div class="rc-slide"></div>

        <!--拍卖状态-->
        <div class="rc-statusbar before"><!--TODO class 根据时间生产-->
          <div class="align-left">
            <span class="status-icon pm-iconfont">时</span>
            <span class="status-flag">正在拍卖</span>
            <span class="main">
              <div class="countdown" style="display:none;">
                <div>03天10时18分43秒</div>
              </div>
              <span class="time">
                 <span class="time"><p><b>03</b><span>月</span><b>22</b><span>日</span> <b>22:00</b> 开始</p></span>
              </span>
              <span class="time-desc"></span>
            </span>
          </div>
          <div class="rc-statusbar-shadow"></div>
        </div>

        <!--标题、价格-->
        <section class="pai-info pai-info-before"><!--TODO class 根据时间生产-->
          <div class="header">
            <p class="title">商品标题</p>
            <div class="rc-mobile-share pm-share">
              <div class="rc-mobile-share-wrap">
                <b class="icon pm-util-iconfont">空</b>提醒
              </div>
            </div>
          </div>
          <div class="basic-price">
            <div class="unit"><b>RMB</b><span>当前价</span></div>
            <div class="price-number">
              <span class="price-comma">
                  <em class="price-comma-price">888</em>
              </span>
            </div>
            <!--<div class="price-format">1300元</div>-->
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
                  <em class="price-comma-price">200</em>
                </span>
              </div>
            </dd>
            <dd class="twoColumn item">
              <div class="param-name">市场估价</div>
              <div class="param-value">
                <span class="price-comma">
                  <i class="price-comma-rmb">￥</i>
                  <em class="price-comma-price">888</em>
                </span>
              </div>
            </dd>
            <dd class="twoColumn item">
              <div class="param-name">加价幅度</div>
              <div class="param-value">
                <span class="price-comma">
                  <i class="price-comma-rmb">￥</i>
                  <em class="price-comma-price">5</em>
                </span>
              </div>
            </dd>
            <dd class="twoColumn item no-border">
              <div class="param-name">延时周期</div>
              <div class="param-value">5分/次</div>
            </dd>
            <dd class="twoColumn item no-border">
              <div class="param-name">品种</div>
              <div class="param-value">好品种</div>
            </dd>
            <dd class="twoColumn item no-border">
              <div class="param-name">规格</div>
              <div class="param-value">最高规格</div>
            </dd>
            <dd class="twoColumn item no-border">
              <div class="param-name">作者</div>
              <div class="param-value">知名作者</div>
            </dd>
          </dl>
        </div>
      </div>

      <!--商品详情-->
      <div class="second-screen inited">
        <div class="second-screen-wrap">
          <div class="rc-tabs rc-tabs-top" tabindex="0" style="min-height: 592px;">
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
                    <img class="J_LazyLoad" v-for="descPic in descPictures" :src="descPic">
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
                    藏品自本商城发货时间起7天内原件无损坏的情况          ，可以向本商城提出退货申请，联系管理员。本商城确认并通过申请后3天内，将藏品保持原样退回。本商城确认藏品无损坏后将全额退款。
                    <br>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--底部按钮-->
      <section class="main-op">
        <div class="main-btn">
          <div class="jiaobao">
            <p class="action">竞拍</p>
            <p class="foregift">
              (保证金金额<b>￥</b>1111)
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
  export default{
    components: {},
    data(){
      return {
        goods: {},
        descPictures: [
          "/exampleImg/goodsDescExample2.jpg",
          "/exampleImg/goodsDescExample3.jpg"
        ]
      }
    },
    methods: {}
  }
</script>

<style>
  /*@import "../assets/css/m-base_2.0.1_reset.css";
  @import "../assets/css/common.css";*/
  @import "../assets/css/p_detail_index.css";
</style>
<style>
  html {
    font-size: 37.5px !important;
  }

  body {
    font-size: 14.0625px
  }
</style>
