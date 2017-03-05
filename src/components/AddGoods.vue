<template>
    <div>
      <divider>上传拍品</divider>
      <box gap="10px 10px">
        <x-button type="primary" @click.native="uploadPic">上传图片</x-button>
        <x-input title="名称" v-model="title" ></x-input>
      </box>
    </div>
</template>

<script>
    import { Box, XButton ,XInput,Divider} from 'vux'

    import Vue from 'vue'
    var VueResource = require('vue-resource');

    Vue.use(VueResource);

    const wx = require('weixin-js-sdk')

    var wxReady = false;
    var choosePictureIds = [];

    var serverIds = [];

    var currentUploadPictureIndex = 0;
    function uploadChoosePictures(){
      var choosePictureId = choosePictureIds[currentUploadPictureIndex];
      wx.uploadImage({
          localId: choosePictureId, // 需要上传的图片的本地ID，由chooseImage接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: function (res) {
              var serverId = res.serverId; // 返回图片的服务器端ID
              alert("serverId="+serverId);
              serverIds.push(serverId);
              currentUploadPictureIndex++;
              uploadChoosePictures();
          }
      });

    }

    export default{
        components: {
          Box,
          XInput,
          XButton,
          Divider
        },
        mounted:function(){
          alert("mounted")

          Vue.http.get('/wx/jssdk/config').then(
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
                title:'hello vue',
            }
        },
        methods:{
          uploadPic(){
            if(!wxReady){
              alert("还没准备好")
              return
            }
            wx.chooseImage({
                //count: 9, // 默认9
                //sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                //sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    choosePictureIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    uploadChoosePictures();
                }
            });
          }
        }
    }
</script>

<style>

</style>
