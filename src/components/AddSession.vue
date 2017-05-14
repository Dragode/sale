<template>
  <div>
    <box gap="10px 10px">
      <x-button type="primary" @click.native="choosePictureToUpload(1)">上传专场图片</x-button>
      <divider></divider>
      <x-input title="标题" v-model="session.title"></x-input>
      <datetime v-model="session.startTime" :placeholder="'请选择'" :min-year=2017 format="YYYY-MM-DD HH:mm:00" :title="'拍卖开始时间'"
                year-row="{value}年" month-row="{value}月" day-row="{value}日" hour-row="{value}点" minute-row="{value}分"
                confirm-text="完成" cancel-text="取消" clear-text="现在" @on-clear="setNow(session.startTime)"></datetime>
      <datetime v-model="session.endTime" :placeholder="'请选择'" :min-year=2017 format="YYYY-MM-DD HH:mm:00" :title="'拍卖结束时间'"
                year-row="{value}年" month-row="{value}月" day-row="{value}日" hour-row="{value}点" minute-row="{value}分"
                confirm-text="完成" cancel-text="取消" clear-text="现在" @on-clear="setNow(session.startTime)"></datetime>
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
               @on-confirm="submitSession">
        <p style="text-align:center;">确认新增专场？</p>
      </confirm>

      <loading v-model="showWxJsSdkLoading" :text="'正在初始化'"></loading>
      <loading v-model="showUploadPictureLoading" :text="'正在上传图片'"></loading>
      <loading v-model="showSubmitLoading" :text="'正在新增专场'"></loading>
    </box>
  </div>
</template>

<script>
    import { Box, XButton ,XInput , Divider , Flexbox , FlexboxItem , Datetime , Confirm , Loading , dateFormat } from 'vux'
    import Vue from 'vue'
    import  { AlertPlugin,ConfirmPlugin } from 'vux'
    Vue.use(AlertPlugin);
    Vue.use(ConfirmPlugin);
    const wx = require('weixin-js-sdk')

    var AddGoodsComponent = {
      components: {
        Box,
        XInput,
        XButton,
        Divider,
        Flexbox,
        FlexboxItem,
        Datetime,
        Confirm,
        Loading
      },
      mounted:function(){
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
            wx.error(this.wxJsSdkInitializeFail);
          }
          ,
          this.wxJsSdkInitializeFail);
      },
      data(){
        return{
          session:{
            bannerPictureWxServerId:'',
            title:'专场标题',
            startTime:'',
            endTime:''
          },
          showSubmitConfirm:false,
          showSubmitLoading:false,
          showWxJsSdkLoading:true,
          showUploadPictureLoading:false
        }
      },
      methods:{
        wxJsSdkInitialized(){
          this.showWxJsSdkLoading =false;
        },
        wxJsSdkInitializeFail(res){
          this.$vux.alert.show({
            title: '错误',
            content: '初始化失败！',
            onHide () {
              window.history.back();
            }
          });
        },
        choosePictureToUpload(count){
          wx.chooseImage({
            count: count, // 默认9
            //sizeType: ['original'],//原图
            sizeType: ['compressed'],//压缩图
            //sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: this.uploadChoosedPicturesToWx
          });
        },
        uploadChoosedPicturesToWx(res){
          this.showUploadPictureLoading = true;
          wx.uploadImage({
            localId: res.localIds[0],
            isShowProgressTips: 0,
            success: this.saveWxServerId
          });
        },
        saveWxServerId(res){
          this.session.bannerPictureWxServerId = res.serverId;
          this.showUploadPictureLoading = false;
          this.$vux.alert.show({
            title: '提示',
            content: '上传图片成功！'
          });
        },
        setNow (timeToSet) {
          timeToSet = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss');
        },
        submitSession(){
          this.showSubmitLoading = true;
          this.$http.post("/sessions",this.session).then(
            function(response){
              this.showSubmitLoading = false;
              this.$vux.confirm.show({
                title : '提示',
                content : '新增专场成功！',
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
                content: '新增专场失败！'
              });
            }
          )
        },
        backToHome(){
          window.history.back();
        }
      }
    };

    export default AddGoodsComponent;
</script>

<style>

</style>
