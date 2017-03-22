<template>
  <div style="margin-top: 100px">
    <box gap="20px 20px">
      <divider></divider>
      <x-input title="手机号码" v-model="mobile" placeholder="请输入手机号码" keyboard="number" is-type="china-mobile"></x-input>
      <x-input title="发送验证码" v-model="validateCode" class="weui-vcode">
        <x-button slot="right" type="primary" v-if="!validateCodeSent" mini @click.native="sendValidateCode">{{sendValidateCodeLabel}}</x-button>
        <x-button slot="right" type="warn" v-if="validateCodeSent" mini @click.native="sendValidateCode">{{sendValidateCodeLabel}}</x-button>
      </x-input>
      <x-button type="primary" @click.native="checkValidateCode">注册</x-button>
    </box>
  </div>
</template>

<script>
  import { XInput,XButton,Box,Divider,AlertPlugin} from 'vux'
  import Vue from 'vue'
  Vue.use(AlertPlugin);

  export default {
    components: {
      XInput,
      XButton,
      Box,
      Divider
    },
    data () {
      return {
        mobile: "",
        validateCode: "",
        sendValidateCodeLabel:"发送验证码",
        validateCodeSent:false
      }
    },
    methods: {
      sendValidateCode(){
        if(this.validateCodeSent){
          return;
        }
        if(this.mobile == ""){
          return;
        }
        this.$http.post("/sms/sendVerificationCodeSms",this.mobile);
        this.sendValidateCodeLabel = "验证码已发送";
        this.validateCodeSent = true;
      },
      checkValidateCode(){
        this.$http.post("/sms/validateCheckCode",this.validateCode)
          .then(response=>{return response.body})
          .then(this.handleCheckValidateCodeResponse);
      },
      handleCheckValidateCodeResponse(responseBody){
        if(responseBody && responseBody.success){
          this.$vux.alert.show({
            title: '提示',
            content: '注册成功！',
            onHide:this.backToGoodsDetailView
          });

        }else{
          this.$vux.alert.show({
            title: '错误',
            content: '验证码错误！'
          });
        }
      },
      backToGoodsDetailView(){
        this.$router.push({path:"/goodsDetail/"+this.$route.params.goodsId});
      }
    }
  }
</script>

<style>
</style>
