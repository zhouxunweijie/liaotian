<template>
<div class="member">
  <NavBar left-arrow @click-left="onClickLeft" title="会员服务"/>
 <div class="intention_item" @click="intantionClick(el)" v-for="(el, index) in mementList">
    <img :src="el.ico" alt="">
    <div class="item">
      <div>{{el.levelName}}</div>
      <p>{{el.introduce}}</p>
    </div>
    <div class="sanjiao">开通</div>
  </div>
</div>
</template>
<script>
import { NavBar } from 'vant'
import { getMemberLevelList } from '@/assets/common/api'
export default {
  data () {
    return {
      mementList: []
    }
  },
  methods: {
    intantionClick (item) {
      this.$store.state.common.member = item
      this.$router.push({name: 'memberDetails'})
    },
    onClickLeft () {
      this.$router.back()
    }
  },
  mounted () {
    getMemberLevelList({
      userId:this.$store.state.IM.user.id
    }).then((res) => {
      this.mementList = res.data
    })
  },
   components: {
    NavBar
  }
}
</script>

<style>
.member .intention_item {
    width: 100%;
    height: 1.12rem;
    background-color: #fff;
    text-align: left;
    font-size: 0.32rem;
    padding: 0.23rem 0.3rem;
    line-height: 0.66rem;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    overflow: hidden;
}
.member .intention_item img{
  width: .66rem;
  height: .66rem;
  border-radius: 50%;
  -webkit-border-radius: 50%;
  float: left;
}
.member .intention_item .item{
  float: left;
  margin-top: .05rem;
  margin-left: .18rem;
  line-height: 1;
}
.member .intention_item .item div{
  font-size: .28rem;
  color: #323232;
  margin-bottom: .1rem;
}
.member .intention_item .item p{
  margin: 0;
  font-size: .2rem;
  color: #8d8d8d;
}
.member .intention_item .sanjiao {
  font-size: 0.28rem;
  color: #ff7896;
  float: right;
}
.member .intention_item .sanjiao.hide::after{
  display:none !important;
}
.member .intention_item .sanjiao::after {
  content: "";
  display: inline-block;
  height: 0.15rem;
  width: 0.15rem;
  border: 1px solid #8e8e8e;
  border-left: transparent;
  border-top: transparent;
  transform: rotate(-45deg);
}
</style>
