<template>
  <div class="successContent" :style="{'background-image': 'url(' + item.pairUserHead + ')'}">
    <div style="height: 100%;background-color: rgba(0,0,0,.7);">
      <NavBar left-arrow @click-left="onClickLeft" :border="false"/>
      <div style="height: calc(100% - 46px);overflow-y: scroll;overflow-x: hidden">
        <div class="img_group">
          <img :src="item.pairUserHead" alt="">
          <img :src="item.userHead" alt="">
        </div>
        <p class="success_title">{{title}}</p>
        <h3 class="success_hint" v-html="context"></h3>
      </div>
    </div>
  </div>
</template>
<script>
import { NavBar } from 'vant'
export default {
  components: {
    NavBar
  },
  data () {
    return {
      context: '',
      item: {},
      title: ''
    }
  },
  mounted () {
    this.context = this.$route.query.context;
    this.item = this.$route.query.el;
    this.title = this.$route.query.title;
  },
  methods: {
    onClickLeft () {
      this.$router.back()
    }
  }
}
</script>
<style scoped>
.success_title{
  margin-top: .7rem;
  margin-bottom: 0;
  font-size: .28rem;
  color: #fefefe;
  text-align: center
}
.success_hint{
  font-size: .86rem;
  color: #fc7093;
  margin-bottom: 0;
  margin-top: 1.66rem

}
.successContent{
  background-repeat: no-repeat;
  background-size: auto 100%
}

.van-nav-bar{
  background-color: transparent
}
.img_group {
  position: relative;
  margin-top: 1.12rem
}

.img_group img{
  width: 2.67rem;
  height: 2.67rem;
  border: 1px solid #fbfbfb;
  border-radius: 50%
}
.img_group img:nth-child(1){
  transform: translate(10%);
}
.img_group img:nth-child(2){
  transform: translate(-10%);
}
</style>
