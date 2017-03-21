<template>
  <div>
    <box gap="10px 10px">
      <x-button type="primary" @click.native="uploadPicture(1,'banner')">{{uploadBannerButtonLabel}}</x-button>
      <divider></divider>
      <popup-picker title="所属专场" :data="sessionList" v-model="sessionSelected" @on-change="selectedSession" show-name></popup-picker>
      <x-input title="标题" v-model="goods.title"></x-input>
      <x-input title="起拍价" v-model="goods.startingPrice"></x-input>
      <x-input title="市场估价" v-model="goods.evaluate"></x-input>
      <x-input title="保证金（0不用保证金）" v-model="goods.cashDeposit"></x-input>
      <x-input title="一口价（0没有一口价）" v-model="goods.buyoutPrice"></x-input>
      <x-input title="加价幅度" v-model="goods.bidIncrement"></x-input>
      <x-input title="延迟周期(分钟)" v-model="goods.delayCycle"></x-input>
      <x-input title="品种" v-model="goods.breed"></x-input>
      <x-input title="规格" v-model="goods.standard"></x-input>
      <x-input title="作者" v-model="goods.author"></x-input>

      <divider></divider>
      <x-button type="primary" @click.native="uploadPicture(1,'auction')">{{uploadAuctionButtonLabel}}</x-button>
      <divider></divider>
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

      <loading v-model="showWxJsSdkLoading" :text="'正在初始化'"></loading>
      <loading v-model="showSubmitLoading" :text="'正在新增拍品'"></loading>
      <loading v-model="showUploadPictureLoading" :text="'正在上传图片'"></loading>
      <alert v-model="showSubmitSuccessTip" :title="'提示'">新增拍品成功</alert>
      <alert v-model="showSubmitFailTip" :title="'提示'">新增拍品失败</alert>
    </box>
  </div>
</template>

<script>
    import { Cell ,PopupPicker , Box, XButton ,XInput , Divider , Flexbox , FlexboxItem , Datetime , Confirm , Loading , Alert , dateFormat } from 'vux'
    import Vue from 'vue'
    import  { AlertPlugin } from 'vux'
    Vue.use(AlertPlugin);
    import  { ConfirmPlugin } from 'vux'
    Vue.use(ConfirmPlugin);
    const wx = require('weixin-js-sdk');

    var showWxJsSdkLoading = false;
    var showUploadPictureLoading =false;
    var uploadBannerButtonLabel = '上传封面图片';
    var uploadAuctionButtonLabel = '上传竞拍大厅图片';
    var uploadShowLabel = '已上传0张商品详情页顶部图片';
    var uploadDescLabel = '已上传0张商品详情页详情图片';

    var goods = {
      bannerPictureWxServerId:'',
      title:'拍品标题',
      startingPrice:'0',
      bidIncrement:'50',
      cashDeposit:'0',
      buyoutPrice:'0',
      delayCycle:'5',
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
                showUploadPictureLoading = false;
                savePicture();
              }else{
                uploadChoosePictures();
              }
          }
      });
    }

    //保存微信服务器图片ID到要提交的变量
    var globalPictureUsage = "";
    function savePicture(){
      if("banner" == globalPictureUsage){
        goods.bannerPictureWxServerId = serverIds[0];
        uploadBannerButtonLabel = '重新上传封面图片';
      }

      if("auction" == globalPictureUsage){
        goods.auctionPictureWxServerId = serverIds[0];
        uploadAuctionButtonLabel = '重新上传竞拍大厅图片';
      }

      if("show" == globalPictureUsage){
        goods.showPicturesWxServerId = goods.showPicturesWxServerId.concat(serverIds);
        uploadShowLabel = '已上传' + goods.showPicturesWxServerId.length + '张商品详情页顶部图片';
      }

      if("desc" == globalPictureUsage){
        goods.descPicturesWxServerId = goods.descPicturesWxServerId.concat(serverIds);
        uploadDescLabel = '已上传' + goods.descPicturesWxServerId.length + '张上传商品详情页详情图片';
      }
    }

    export default {
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
        Alert,
        PopupPicker,
        Cell
      },
      created:function(){
        this.$http.get('/wx/jssdk/config').then(
          function(response){
            wx.config({
              appId : response.body.appId,
              timestamp : response.body.timestamp,
              nonceStr : response.body.nonceStr,
              signature : response.body.signature,
              jsApiList : ["chooseImage","uploadImage"]
            });
            wx.ready(this.wxJsSdkInitialized);
            wx.error(function(res){
              this.$vux.alert.show({
                title: '错误',
                content: '初始化失败！',
                onHide () {
                  window.history.back();
                }
              });
            })
          }
          ,
          function(){
            this.$vux.alert.show({
              title: '错误',
              content: '初始化失败！',
              onHide () {
                window.history.back();
              }
            });
          });

        this.$http.get('/sessions')
          .then(this.setSessionList);
      },
      data(){
        return{
          goods:goods,
          uploadBannerButtonLabel:uploadBannerButtonLabel,
          uploadAuctionButtonLabel:uploadAuctionButtonLabel,
          uploadShowLabel:uploadShowLabel,
          uploadDescLabel:uploadDescLabel,
          showSubmitConfirm:false,
          showSubmitLoading:false,
          showSubmitSuccessTip:false,
          showSubmitFailTip:false,
          showWxJsSdkLoading:showWxJsSdkLoading,
          showUploadPictureLoading:showUploadPictureLoading,
          sessionList:[[
          ]],
          sessionSelected:[]
        }
      },
      methods:{
        setSessionList(response){
          var sessionList = response.body.items;
          sessionList.forEach(this.addSession);
        },
        addSession(session){
          this.sessionList[0].push({
            name: session.title,
            value: session.id.toString()
          });
        },
        selectedSession (selectedValue) {
          console.log(selectedValue);
          this.goods.sessionId = parseInt(selectedValue[0]);
          console.log(this.goods);
        },
        wxJsSdkInitialized(){
          this.showWxJsSdkLoading =false;
        },
        uploadPicture(count,pictureUsage){
          globalPictureUsage = pictureUsage;
          wx.chooseImage({
            count: count, // 默认9
            sizeType: ['original'],
            //sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
              currentUploadPictureIndex = 0;
              choosePictureIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
              serverIds = [];
              showUploadPictureLoading = true;
              uploadChoosePictures();
            }
          });
        },
        setNow (timeToSet) {
          timeToSet = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss');
        },
        submitGoods(){
          this.showSubmitLoading = true;
          console.log(JSON.stringify(goods));
          this.$http.post("/goods",goods).then(
            function(response){
              this.showSubmitLoading = false;
              this.$vux.confirm.show({
                title : '提示',
                content : '新增拍品成功！',
                confirmText : "继续新增",
                cancelText : "返回首页",
                onCancel () {
                  window.history.back();
                },
                onConfirm () {
                  window.location.reload();
                }
              });
            },
            function(){
              this.showSubmitLoading = false;
              this.$vux.alert.show({
                title: '错误',
                content: '新增拍品失败！'
              });
            }
          )
        },
        backToHome(){
          window.history.back();
        }
      }
    };
</script>

<style>

</style>
