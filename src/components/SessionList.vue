<template>
  <div class="main-container">
    <section id="fframe_container">
      <section class="banner">
        <img :src="homeBanner">
      </section>

      <div class="home_banner_spliter"></div>

      <div class="cell" v-for="session in sessionList">
        <section class="album">
          <section class="imgdivClass">
            <img :src="session.bannerUr" class="bannerImg"/>
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
              <!--<span class="iconClock">&#xe60b</span>-->
              <span>{{session.auctionStatusDesc}}</span>
              <div class="cornertobe"></div>
            </section>
          </section>
        </section>
      </div>
    </section>
  </div>
</template>

<script>
    import DateFormat from "../utils/DateFormat.js"
    export default{
        data(){
            return{
              homeBanner:"",
              sessionList:[
              ]
            }
        },
        mounted:function(){
          var homeBanner = this.homeBanner;
          this.$http.get('/sessions/homeBanner').then(
            function(response){
              homeBanner = response.body.value;
            }
            ,
            function(){}
          )

          var sessionList = this.sessionList;
          this.$http.get('/sessions').then(
            function(response){
              var sessions = response.body.items;
              sessions.forEach(function(session){
                var startTime = DateFormat.parseDate(session.startTime,"yyyy-MM-dd HH:mm:ss");
                var endTime = DateFormat.parseDate(session.endTime,"yyyy-MM-dd HH:mm:ss");
                var now = new Date();

                var itemCountClass;
                var auctionStatusDesc;
                var bidTimeClass;
                var backgroundColorClass;
                if(now.getTime() < startTime.getTime()){
                  itemCountClass = "goldenColor";
                  auctionStatusDesc = DateFormat.format(startTime, "MM月dd日 hh:mm") + " 开始";
                  bidTimeClass = "bidTime";
                  backgroundColorClass = "goldenBackgroundColor";
                }else if(now.getTime() < endTime.getTime()){
                  itemCountClass = "redColor";
                  auctionStatusDesc = DateFormat.format(endTime, "MM月dd日 hh:mm") + " 结束";
                  bidTimeClass = "bidTime";
                  backgroundColorClass = "redBackgroundColor";
                }else{
                  itemCountClass = "grayColor";
                  auctionStatusDesc = "已结束";
                  bidTimeClass = "bidTime2";
                  backgroundColorClass = "grayBackgroundColor";
                }

                sessionList.push({
                  bannerUr : session.bannerUrl,
                  title : session.title,
                  numberOfGoods : session.numberOfGoods,
                  itemCountClass : itemCountClass,
                  auctionStatusDesc : auctionStatusDesc,
                  bidTimeClass : bidTimeClass,
                  backgroundColorClass : backgroundColorClass
                });
              });
            }
            ,
            function(){}
          )
        }
    }

</script>

<style>
  @import "../assets/css/pmp.css"

    html{
      font-size:37.5px!important;
    }
    body{
      font-size:14.0625px
    }

</style>
