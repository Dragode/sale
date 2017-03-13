<template>
    <div>
      <div v-for="user in userList">
        <form-preview :header-label="'用户手机号'" :header-value="user.phoneNumber" :body-items="user.fields" :footer-buttons="getButton(user)"></form-preview>
        <br>
      </div>
    </div>
</template>

<script>
    import { FormPreview , AlertPlugin } from 'vux'
    import Vue from 'vue'
    Vue.use(AlertPlugin)

    var test = "test";

    export default{
      components: {
        FormPreview
      },
      data(){
        return{
          userList:[
          ]
        }
      },
      mounted:function(){
        var userList = this.userList;
        var vux = this.$vux;
        var httpClient = this.$http;
        this.$http.get('/users').then(
          function(response){
            var response = response.body;
            if("0" == response.resultCode){
              response.items.forEach(function(user){
                var roleDesc;
                if("normal" == user.role){
                  roleDesc = "普通用户";
                }
                if("member" == user.role){
                  roleDesc = "会员";
                }
                user.fields = [
                  {
                    label: '当前角色',
                    value: roleDesc
                  }
                ];

                userList.push(user);
              })
            }else{
              vux.alert.show({
                title: '提示',
                content: '获取用户失败！',
                onHide () {
                    window.history.back();
                }
              });
            }
          },
          function(){
            vux.alert.show({
              title: '提示',
              content: '获取用户失败！',
              onHide () {
                  window.history.back();
              }
            });
          }
        )
      },
      methods:{
        getButton(user){
          var button = {
            style: 'default',
            text:"",
            onButtonClick: function() {
            }
          }

          var httpClient = this.$http;
          var vux = this.$vux;
          if("normal" == user.role){
            button.style = "primary";
            button.text = "升级成会员";

            button.onButtonClick = function () {
              httpClient.post('/users/action/promotionToMember/userId/'+user.id,{}).then(
                function(response){
                   if("0" == response.body.resultCode){
                     vux.alert.show({
                       title: '提示',
                       content: '操作成功！',
                       onHide () {
                          window.location.reload();
                       }
                     });
                   }else{
                     vux.alert.show({
                       title: '提示',
                       content: '操作失败！'
                     });
                   }
                },
                function(){
                   vux.alert.show({
                     title: '提示',
                     content: '操作失败！'
                   });
                }
              )
            }
          }
          if("member" == user.role){
            button.style = "primary";
            button.text = "降级成普通会员";
            button.onButtonClick =function() {
              button.onButtonClick = function () {
                httpClient.post('/users/action/demotionToNormal/userId/'+user.id,{}).then(
                  function(response){
                     if("0" == response.body.resultCode){
                       vux.alert.show({
                         title: '提示',
                         content: '操作成功！',
                         onHide () {
                            window.location.reload();
                         }
                       });
                     }else{
                       vux.alert.show({
                         title: '提示',
                         content: '操作失败！'
                       });
                     }
                  },
                  function(){
                     vux.alert.show({
                       title: '提示',
                       content: '操作失败！'
                     });
                  }
                )
              }
            }
          }
          return [button]
        }
      }
    }
</script>

<style>

</style>
