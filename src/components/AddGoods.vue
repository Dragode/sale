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
    import { Box, XButton ,XInput  } from 'vux'
    const wx = require('weixin-js-sdk')

    var wxReady = false;
    var choosePictureIds = [];

    export default{
        components: {
          Box,
          XInput,
          XButton
        },
        mounted:function(){
          fetch("/wx/jssdk/config").then(function(res){
            res.json().then(function(data){
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

            })
          })
        },
        data(){
            return{
                title:'hello vue'
            }
        },
        methods:{
          uploadPic(){
            console.log("upload");
            while(!wxReady){
            };
            wx.chooseImage({
                //count: 9, // 默认9
                //sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                //sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    choosePictureIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    console.log("choose picture success.");
                    console.log("pic ids = " + choosePictureIds);
                }
            });
          }
        }
    }
</script>

<style>

</style>
