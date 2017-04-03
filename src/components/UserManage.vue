<template>
  <div>
    <div v-for="user in userList">
      <form-preview
        :header-label="'用户手机号'" :header-value="user.phoneNumber"
        :body-items="user.fields"
        :footer-buttons="getButton(user)">
      </form-preview>
      <br>
    </div>
  </div>
</template>

<script>
  import { FormPreview , AlertPlugin } from 'vux'
  import Vue from 'vue'
  Vue.use(AlertPlugin);

  export default{
    components: {
      FormPreview
    },
    data(){
      return {
        userList: []
      }
    },
    created: function () {
      var userList = this.userList;
      var vux = this.$vux;

      this.$http.get('/users').then(
        function (response) {
          var response = response.body;
          if ("0" == response.resultCode) {
            response.items.forEach(function (user) {
              var roleDesc;
              if ("normal" == user.role) {
                roleDesc = "普通用户";
              }
              if ("member" == user.role) {
                roleDesc = "会员";
              }
              if ("administrator" == user.role) {
                roleDesc = "管理员";
              }
              if ("black_list" == user.role) {
                roleDesc = "黑名单用户";
              }
              user.fields = [
                {
                  label: '当前角色',
                  value: roleDesc
                },
                {
                  label: '微信昵称',
                  value: user.nickname
                }
              ];

              if(!user.phoneNumber){
                user.phoneNumber = "未注册";
              }
              userList.push(user);
            })
          } else {
            vux.alert.show({
              title: '提示',
              content: '获取用户失败！',
              onHide () {
                window.history.back();
              }
            });
          }
        },
        function () {
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
    methods: {
      getButton(user){
        var httpClient = this.$http;
        var vux = this.$vux;

        var leftButton = {
          style: "primary"
        };
        var leftNextUser = JSON.parse(JSON.stringify(user));
        var rightButton = {
          style: "primary"
        };
        var rightNextUser = JSON.parse(JSON.stringify(user));


        if ("normal" == user.role) {
          leftButton.text = "加入黑名单";
          leftNextUser.role = "black_list";
          rightButton.text = "升级成会员";
          rightNextUser.role = "member";
        }
        if ("member" == user.role) {
          leftButton.text = "加入黑名单";
          leftNextUser.role = "black_list";
          rightButton.text = "降级成普通用户";
          rightNextUser.role = "normal";
        }
        if ("black_list" == user.role) {
          leftButton.text = "取消黑名单";
          leftNextUser.role = "normal";
          rightButton.text = "直升会员";
          rightNextUser.role = "member";
        }
        if ("administrator" == user.role) {
          leftButton.text = "无操作";
          leftNextUser.role = "administrator";
          rightButton.text = "无操作";
          rightNextUser.role = "administrator";
        }

        leftButton.onButtonClick = function () {
          httpClient.put('/users', leftNextUser).then(
            function (response) {
              if ("0" == response.body.resultCode) {
                vux.alert.show({
                  title: '提示',
                  content: '操作成功！',
                  onHide () {
                    window.location.reload();
                  }
                });
              } else {
                vux.alert.show({
                  title: '提示',
                  content: '操作失败！'
                });
              }
            },
            function () {
              vux.alert.show({
                title: '提示',
                content: '操作失败！'
              });
            }
          )
        };

        rightButton.onButtonClick = function () {
          httpClient.put('/users', rightNextUser).then(
            function (response) {
              if ("0" == response.body.resultCode) {
                vux.alert.show({
                  title: '提示',
                  content: '操作成功！',
                  onHide () {
                    window.location.reload();
                  }
                });
              } else {
                vux.alert.show({
                  title: '提示',
                  content: '操作失败！'
                });
              }
            },
            function () {
              vux.alert.show({
                title: '提示',
                content: '操作失败！'
              });
            }
          )
        };
        return [leftButton,rightButton]
      },
      tipFail(){
        this.$vux.alert.show({
          title: '提示',
          content: '操作失败！'
        });
      }
    }
  }
</script>

<style>

</style>
