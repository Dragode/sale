<template>
  <div>
    <div class="vux-demo">
      <img class="logo" src="../assets/img/vux_logo.png">
      <h1> </h1>
    </div>
    <group>
      <cell title="新增专场" is-link link="/addSession"></cell>
      <cell title="新增拍品" is-link link="/addGoods"></cell>
      <cell title="订单管理" is-link link="/orderManage"></cell>
      <cell title="会员管理" is-link link="/userManage"></cell>
      <cell title="其他设置" is-link link="/setSystemConfig"></cell>
    </group>
  </div>
</template>

<script>
import { Group, Cell } from 'vux'

export default {
  components: {
    Group,
    Cell
  },
  data () {
    return {
    }
  }
}
</script>

<style>
.vux-demo {
  text-align: center;
}
.logo {
  width: 100px;
  height: 100px
}
</style>
