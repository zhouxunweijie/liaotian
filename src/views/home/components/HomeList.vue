<template>
  <scroller :on-infinite="infinite"  :on-refresh="refresh" ref="scroller" :noDataText="noDataText">
    <NoticeBar
      text="当前处于无网络状态，请检查网络"
      v-show="State"
    />
    <NoticeBar
      text="没有根据您的筛选条件查询到用户"
      v-show="isData"
    />
    <ul class="home_list">
      <li v-for="(item, index) in columns" :key="index" @click="showDetail(item)">
        <div class="title">
          <img :src="item.userHead" alt="">
        </div>
        <div class="list_content">
          <div class="top">
            <div class="name S36">{{item.nickName}}
              <span class="S24 Tag" v-if="item.registerState === '1'">实名</span>
            </div>
            <div class="praise S36" @click.stop="link(item)" :class="{unlink:item.isLikeUser === 0}"><span></span>{{item.likeCount}}</div>
          </div>
          <div class="message S28">
            <p v-text="item.age ? `${item.age}岁` : '未填写'"></p>
            <i>|</i>
            <p v-text="item.height? `${item.height}cm` : '未填写'"></p>
            <i>|</i>
            <p v-text="item.education || '未填写'"></p>
            <i>|</i>
            <p v-text="income(item)"></p>
          </div>
          <ul class="tags" v-if="item.interestDictVoList && item.interestDictVoList.length > 0">
            <li v-for="(el, dex) in interestDictVoList(item.interestDictVoList)" :key="dex" v-text="el.label"></li>
          </ul>
          <div class="manifesto S28" v-text="`爱情宣言 :${item.personalIntroduction? item.personalIntroduction : '未填写' }`"></div>
        </div>
      </li>
    </ul>
  </scroller>
</template>
<script>
import { listUser, cancellikeUser, likeUser} from '@/assets/common/api'
import { mapMutations, mapState} from 'vuex'
import { NoticeBar } from 'vant'

export default {
  name: 'homeList',
  data () {
    return {
      columns: [],
      State: false,
      isData: false,
      noDataText: '没有更多的数据',
      pageCurrent: 1,
      pageSize: 10
      // index: 0, // 默认第一次下拉加载不请求
    }
  },
  mounted () {
    window['setState'] = (val) => {
      this.setState(val)
    }
  },
  computed: {
    ...mapState({
      fromData: state => state.common.fromData
    })
  },
  components: {
    NoticeBar
  },
  methods: {
    setState (val) {
      this.State = val
    },
    ...mapMutations([
      'setLoading'
    ]),
    transitionObj (fromData) {
      var obj = {}
      for ( var i in fromData){
        obj[i] = typeof fromData[i] === 'object' ? fromData[i].length > 0 ? fromData[i].map(el => el.code ? el.code : el.value.replace('不限','-1')).join(','):'' : fromData[i]  
      }
      return obj
    },
    // 过滤用户和列表中的共同的爱好
    interestDictVoList (item) {
      // 该方法需要重写，返回的三个爱好必须与当前登陆者相同
      if(!item){return []}
      return item.filter((a,i) => i <= 2)
    },
    income (item) {
      if(item.incomeMin === '' && item.incomeMax === ''){
        return '未填写'
      }
      if(item.incomeMin && item.incomeMax === '-1'){
        return item.incomeMin + '以上'
      }
      if(item.incomeMin === '-1' && item.incomeMax){
        return item.incomeMax + '以下'
      }
      if(item.incomeMin && item.incomeMax){
        return item.incomeMin + ' - ' + item.incomeMax
      }
    },
    link (item) {
      let link = null
     
      if(item.isLikeUser === 1){
        link = 0
        --item.likeCount
        this.columns.splice(this.columns.findIndex(el => el.userId === item.userId), 1, Object.assign(this.columns.find(el => el.userId === item.userId), {isLikeUser: link,likeCount: item.likeCount}))
        cancellikeUser({
          userId: this.$store.state.IM.user.id,
          likeUserId: item.userId
        })
      } else {
         link = 1
          ++item.likeCount
          this.columns.splice(this.columns.findIndex(el => el.userId === item.userId), 1, Object.assign(this.columns.find(el => el.userId === item.userId), {isLikeUser: link,likeCount: item.likeCount}))
        likeUser({
          userId: this.$store.state.IM.user.id,
          likeUserId: item.userId
        })
      }
    },
    showDetail (item) {
      this.$store.state.IM.friend = item
      this.$router.push({name: 'userDetail'})
    },
    infinite (fn) {
      let fromData  = this.fromData
      fromData.userId = this.$store.state.IM.user.id
      fromData.pageCurrent = this.pageCurrent
      fromData.pageSize = this.pageSize
      //if(this.index){
       listUser(this.transitionObj(fromData)).then((res) => {
         this.noDataText = '没有更多数据'
         if(res.code === 201){
           this.isData = true
           this.columns = res.data.list
           fn ? fn(true): this.$refs.scroller.finishPullToRefresh()
         } else {
           this.isData = false
            if(res.data.list){
              res.data.list.length < fromData.pageSize ? fn(true) :fn()
            if(res.data.count <= this.columns.length){
              return false
            } else {
              this.columns.push(...res.data.list)
            }
          } else {
            fn ? fn(true): this.$refs.scroller.finishPullToRefresh()
          }
         }
        if(this.$store.state.common.Loading){
          this.setLoading(false)
        }
       }).catch(() => fn ? fn(true): this.$refs.scroller.finishPullToRefresh())
        this.pageCurrent = Number(this.pageCurrent) + 1

      // } else {
      //   this.index = 1
      //   fn(true)
      // }
    },
    refresh (fn, fromData, pageSize) {
      var obj = Object.assign({}, fromData ? fromData : this.fromData, {
        pageSize: pageSize ? pageSize : this.columns.length || 10,
        pageCurrent: 1,
        userId: this.$store.state.IM.user.id
      })
      listUser(this.transitionObj(obj)).then((res) => {
        if(res.code === 201) {
          this.isData = true
        } else {
          this.isData = false
        }
        if(res.data.list){
          this.columns = res.data.list
        } else {
          this.columns = []
          this.noDataText = '没有找到符合条件的用户'
        }
        fn ? fn(true): this.$refs.scroller.finishPullToRefresh()
      }).catch(() => fn ? fn(true): this.$refs.scroller.finishPullToRefresh())
    }
  }
}
</script>

<style scoped lang="less">

.rad{
  color: @base-color;
  background-color: @base-white !important;
}
.home_list{
  display: block;
}
.home_list>li{
  margin-top: .1rem;
  padding:.35rem 0 .35rem .3rem;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  overflow: hidden;
  background-color: @base-white
}
.home_list li .title{
  float: left;
  width: 1.56rem;
  padding-top: .1rem;
}
.home_list li .title img{
  width: 100%;
  height: 1.56rem;
  border-radius: 50%;
  -webkit-border-radius: 50%;
  display: block
}
.list_content {
  float: left;
  width: calc(100% - 1.56rem);
  padding:0 .3rem;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  color:@base-gray;
  text-align: left
}
.list_content .top{
  height: .55rem;
}
.list_content .top .name{
  float: left;
  color: @base-black;
}
// .list_content .top .name span{
//   width: .54rem;
//   height: .3rem;
//   display: inline-block;
//   border-radius: .02rem;
//   -webkit-border-radius: .02rem;
//   background-color: @base-blue;
//   color: @base-white;
//   margin-left:.1rem;
//   text-align: center
// }
.list_content .top .praise{
  float: right;
  line-height: .3rem;
  color: @base-color;
  margin-top: .03rem;
}
.list_content .top .praise span{
  display: inline-block;
  width: .36rem;
  height:.36rem;
  background-image: url('../../../assets/images/like_btn.png');
  background-repeat: no-repeat;
  background-size: 100%;
  margin-right: .1rem;
  vertical-align: top;
}
.list_content .top .praise.unlink{
    color: @base-gray;
}
.list_content .top .praise.unlink span{
   background-image: url('../../../assets/images/unlike_btn.png');
}
.list_content .message{
  overflow: hidden;
  line-height: .34rem;
}
.list_content .message i, .list_content .message p{
  display: block;
  float: left;
  margin:0
}
.list_content .message i{
  display: inline-block;
  margin: 0 .1rem
}
.list_content .manifesto{
  margin-top: 0.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: calc(100% - .32rem)
}
.list_content .tags{
  color: @base-gray;
  margin-top: .2rem
}
.list_content .tags li{
  background-color: @base-gray;
  display: inline-block;
  padding: .04rem .1rem;
  margin-right: .1rem;
  border: 1px solid @base-gray;
  border-radius: .05rem;
  color: @base-white
}

</style>
