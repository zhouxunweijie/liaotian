<template>
    <div class="right">
        <div class="nickName">{{item.nickName}}</div>
         <div class="right_img">
            <img :src="item.userHead" alt="">
        </div>
        <div class="right_content">
          <div v-html="Replace(item.context)"></div>
        </div>
    </div>
</template>
<script>
import utils from '@/assets/common/utils'
export default {
  props: ['item'],
  methods: {
    Replace (val) {
      return utils.uncodeUtf16(val.replace(/#[\u4E00-\u9FA5]{1,3};/gi, this.emotion))
    }
  }
}
</script>

<style scoped>
.nickName{
  margin-bottom: .1rem;
  color: #a8a8a8;
  display: inline-block
}
.right{
  width: 100%;
  overflow: hidden;
  text-align: right;
  padding: 0.2rem .3rem;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
}
.right .right_img{
  margin-left: .14rem;
  display: block;
  float: right;
}
.right .right_img img{
  width: 1rem;
  height: 1rem;
  display: block;
  border-radius: 50%;
  -webkit-border-radius: 50%;
}
.right .right_content>div{
  max-width:calc( 100% - 1.14rem);
  padding: .3rem;
  display: inline-block;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  background-color: #fff;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  font-size: .28rem;
  width: max-content;
}
</style>
