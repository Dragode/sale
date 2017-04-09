<template>
  <div>
    <box gap="10px 10px">
      <x-button type="primary" @click.native="choosePictureToUpload(1)">上传首页招牌图片</x-button>

      <loading v-model="showWxJsSdkLoading" :text="'正在初始化'"></loading>
      <loading v-model="showUploadPictureLoading" :text="'正在上传图片'"></loading>
    </box>
  </div>
</template>

<script>
  import { Box, XButton , Loading  } from 'vux'
  import Vue from 'vue'
  import  { AlertPlugin } from 'vux'
  Vue.use(AlertPlugin);

  const wx = require('weixin-js-sdk')

  export default {
    components: {
      Box,
      XButton,
      Loading
    },
    data () {
      return {
        showWxJsSdkLoading: true,
        showUploadPictureLoading: false
      }
    },
    mounted: function () {
      this.$http.get('/wx/jssdk/config').then(
        function (response) {
          wx.config({
            appId: response.body.appId,
            timestamp: response.body.timestamp,
            nonceStr: response.body.nonceStr,
            signature: response.body.signature,
            jsApiList: ["chooseImage", "uploadImage"]
          });
          wx.ready(this.wxJsSdkInitialized);
          wx.error(function (res) {
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
        function () {
          this.$vux.alert.show({
            title: '错误',
            content: '初始化失败！',
            onHide () {
              window.history.back();
            }
          });
        });
    },
    methods: {
      wxJsSdkInitialized(){
        this.showWxJsSdkLoading = false;
      },
      choosePictureToUpload(count){
        wx.chooseImage({
          count: count, // 默认9
          sizeType: ['original'],
          //sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: this.uploadChoosedPicturesToWx
        });
      },
      uploadChoosedPicturesToWx(res){
        this.showUploadPictureLoading = true;
        wx.uploadImage({
          localId: res.localIds[0],
          isShowProgressTips: 0,
          success: this.uploadPicturesToOurselfServer
        });
      },
      uploadPicturesToOurselfServer(res){
        this.$http.post('/systemConfigs/homeBanner', res.serverId).then(
          function (response) {
            this.showUploadPictureLoading = false;
            if (response && response.body.id) {
              this.$vux.alert.show({
                title: '提示',
                content: '上传图片成功！'
              });
            } else {
              this.$vux.alert.show({
                title: '错误',
                content: '上传图片失败！'
              });
            }
          },
          function () {
            this.$vux.alert.show({
              title: '错误',
              content: '上传图片失败！'
            });
          }
        )
      }
    }
  }
</script>

<style>
</style>
