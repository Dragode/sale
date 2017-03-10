<template>
  <div>
    <divider>上传拍品</divider>
    <box gap="10px 10px">

      <x-button type="primary" @click.native="uploadPicture(1,'banner')">上传封面图片</x-button>
      <divider>{{uploadBannerLabel}}</divider>
      <x-input title="标题" v-model="goods.title"></x-input>
      <x-input title="起拍价" v-model="goods.startingPrice"></x-input>
      <x-input title="加价幅度" v-model="goods.bidIncrement"></x-input>
      <x-input title="保证金（0不用保证金）" v-model="goods.cashDeposit"></x-input>
      <x-input title="延迟周期(分钟)" v-model="goods.delayCycle"></x-input>
      <datetime v-model="goods.startTime" :placeholder="'请选择'" :min-year=2017 format="YYYY-MM-DD HH:mm:00" :title="'拍卖开始时间'"
                year-row="{value}年" month-row="{value}月" day-row="{value}日" hour-row="{value}点" minute-row="{value}分"
                confirm-text="完成" cancel-text="取消" clear-text="现在" @on-clear="setNow('start')"></datetime>
      <datetime v-model="goods.endTime" :placeholder="'请选择'" :min-year=2017 format="YYYY-MM-DD HH:mm:00" :title="'拍卖结束时间'"
                year-row="{value}年" month-row="{value}月" day-row="{value}日" hour-row="{value}点" minute-row="{value}分"
                confirm-text="完成" cancel-text="取消" clear-text="现在" @on-clear="setNow('end')"></datetime>
      <divider></divider>
      <x-button type="primary" @click.native="uploadPicture(1,'auction')">上传竞拍大厅图片</x-button>
      <divider>{{uploadAuctionLabel}}</divider>
      <x-button type="primary" @click.native="uploadPicture(9,'show')">上传商品详情页顶部图片</x-button>
      <divider>{{uploadShowLabel}}</divider>
      <x-button type="primary" @click.native="uploadPicture(9,'desc')">上传商品详情页详情图片</x-button>
      <divider>{{uploadDescLabel}}</divider>

      <divider></divider>
      <flexbox>
        <flexbox-item>
          <x-button type="primary" @click.native="showSubmitConfirm = true">提交</x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button type="warn" @click.native="backToHome">取消</x-button>
        </flexbox-item>
      </flexbox>

      <confirm v-model="showSubmitConfirm" :title="'提示'"
               @on-cancel="showSubmitConfirm = false"
               @on-confirm="submitGoods">
        <p style="text-align:center;">确认上传拍品？</p>
      </confirm>

      <loading v-model="showSubmitLoading" :text="'正在新增拍品'"></loading>
      <alert v-model="showSubmitSuccessTip" :title="'提示'">新增拍品成功</alert>
      <alert v-model="showSubmitFailTip" :title="'提示'">新增拍品失败</alert>
    </box>
  </div>
</template>

<script>
    import { Box, XButton ,XInput , Divider , Flexbox , FlexboxItem , Datetime , Confirm , Loading , Alert , dateFormat } from 'vux'

    const wx = require('weixin-js-sdk')

    var wxReady = false;

    var goods = {
      bannerPictureWxServerId:'',
      title:'拍品标题',
      startingPrice:0,
      bidIncrement:0,
      cashDeposit:0,
      delayCycle:0,
      startTime:'',
      endTime:'',
      auctionPictureWxServerId:'',
      showPicturesWxServerId:[],
      descPicturesWxServerId:[]
    };

    //TODO 抽取上传图片服务
    //上传图片到微信服务器
    var serverIds = [];
    var choosePictureIds = [];
    var currentUploadPictureIndex = 0;
    function uploadChoosePictures(){
      var choosePictureId = choosePictureIds[currentUploadPictureIndex];
      wx.uploadImage({
          localId: choosePictureId, // 需要上传的图片的本地ID，由chooseImage接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: function (res) {
              serverIds.push(res.serverId);
              currentUploadPictureIndex++;
              if(currentUploadPictureIndex >= choosePictureIds.length){
                currentUploadPictureIndex = 0;
                savePicture();
              }else{
                uploadChoosePictures();
              }
          }
      });
    }

    //TODO refactor
    //保存微信服务器图片ID到要提交的变量
    var globalPictureUsage = "";
    function savePicture(){
      alert("globalPictureUsage="+globalPictureUsage);
      if("banner" == globalPictureUsage){
        goods.bannerPictureWxServerId = serverIds[0];
        uploadBannerLabel = '已上传封面图片';
      }

      if("auction" == globalPictureUsage){
        goods.auctionPictureWxServerId = serverIds[0];
        uploadAuctionLabel = '已上传竞拍大厅图片';
      }

      if("show" == globalPictureUsage){
        goods.showPicturesWxServerId.concat(serverIds);
        uploadShowLabel = '已上传' + showPicturesWxServerId.length + '张商品详情页顶部图片';
      }

      if("desc" == globalPictureUsage){
        goods.descPicturesWxServerId.concat(serverIds);
        uploadDescLabel = '已上传' + descPicturesWxServerId.length + '张上传商品详情页详情图片';
      }
    }



    export default{
        components: {
          Box,
          XInput,
          XButton,
          Divider,
          Flexbox,
          FlexboxItem,
          Datetime,
          Confirm,
          Loading,
          Alert
        },
        mounted:function(){
          this.$http.get('/wx/jssdk/config').then(
          	function(response){
          		var data = response.body;
          		var config = {
          			appId : data.appId,
          			timestamp : data.timestamp,
          			nonceStr : data.nonceStr,
          			signature : data.signature,
          			jsApiList : ["chooseImage","uploadImage"]
          		};
          		wx.config(config);
          		wx.ready(function(){
          			wxReady = true;
          		})
          		wx.error(function(res){
          			alert("error info:"+res)
          		})
          	}
          	,
          	function(){
          		console.log("error")
          	});
        },
        data(){
            return{
                goods:goods,
                uploadBannerLabel:'请上传封面图片',
                uploadAuctionLabel:'请上传竞拍大厅图片',
                uploadShowLabel:'请上传商品详情页顶部图片',
                uploadDescLabel:'请上传商品详情页详情图片',
                showSubmitConfirm:false,
                showSubmitLoading:false,
                showSubmitSuccessTip:false,
                showSubmitFailTip:false
            }
        },
        methods:{
          uploadPicture(count,pictureUsage){
            if(!wxReady){
              alert("还没准备好")
              return
            }
            globalPictureUsage = pictureUsage;
            wx.chooseImage({
                count: count, // 默认9
                //sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                //sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    choosePictureIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    uploadChoosePictures();
                }
            });
          },
          setNow (timeType) {
            //TODO refactor
            if('start' == timeType){
              this.goods.startTime = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss');
            }
            if('end' == timeType){
              this.goods.endTime = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss');
            }
          },
          submitGoods(){
            this.showSubmitLoading = true;
            this.$http.post("/goods",goods).then(
              function(response){
                this.showSubmitLoading = false;
                this.showSubmitSuccessTip = true;
              },
              function(){
                this.showSubmitLoading = false;
                this.showSubmitFailTip = true;
              }
            )
          },
          backToHome(){
            window.history.back();
          }
        }
    }

</script>

<style>

</style>
