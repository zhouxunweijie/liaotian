<template>
  <div>
    <NavBar left-arrow title="报名人员" @click-left="onClickLeft"/>
    <div style="height: calc(100% - 46px);overflow-y: scroll;overflow-x: hidden;background-color: #fff;">
      <List
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      >
        <div style="height: .15rem;background-color: #f0f0f0;"></div>
        <div class="groupList_item S28" v-for="(el, index) in List" :key="index">
          <img :src="el.userHead" alt="">
          <span class="hint S24" v-if="el.levelCode - 0 > 0">{{el.levelName}}</span>
          <p>{{el.nickName}}</p>
          <span class="hint check S24" @click="$router.push({name: 'datum', query: {massSelectionId: massSelectionId , userId: el.userId}})">查看</span>
        </div>
      </List>
    </div>
  </div>
</template>
<script>
import { NavBar , List} from 'vant'
import { applyToJoinMassSelectionList } from '@/assets/common/api'
export default {
  components: {
    NavBar,
    List
  },
  computed: {
    massSelectionId () {
      return localStorage.getItem('massSelectionId')
    }
  },
  data () {
    return {
      loading: false,
      finished: false,
      pageCurrent: 0,
      pageSize: 10,
      List: []
    }
  },
  methods: {
    onLoad () {
      applyToJoinMassSelectionList({
        userId: this.$store.state.IM.user.id,
        massSelectionId: localStorage.getItem('massSelectionId'),
        pageCurrent: this.pageCurrent,
        pageSize: this.pageSize
      }).then(res => {
        if(res.data && res.data.list && res.data.list.length > 0 && (res.data.totalCount - 0) > this.List.length) {
          ++this.pageCurrent
          this.List.push(...res.data.list)
          this.loading = false
        } else {
          this.loading = false
          this.finished = true
        }
      })
    },
    onClickLeft () {
      this.$router.back()
    }
  }
}
</script>

<style scoped>
.groupList_title{
  height: .6rem;
  line-height: .6rem;
  color: #8b8b8b;
  padding: 0 .3rem;
  background-color: #f0f0f0;
  text-align: left
}
.groupList_item{
  height: 1.28rem;
  line-height: 1.28rem;
  background-color: #fff;
  padding: 0 .3rem;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
}
.groupList_item.noBorder{
  border-bottom: none
}

.groupList_item img{
  display: inline-block;
  width: .92rem;
  height: .92rem;
  border-radius: 50%;
  margin-right: .2rem;
  vertical-align: middle;
}

.groupList_item .hint{
  padding: .05rem .1rem;
  background-color: #ff7997;
  color: #fff;
  line-height: .24rem;
  margin-right: .2rem;
  border-radius: .02rem

}
.groupList_item p{
  display: inline-block;
  margin: 0;
  color: #8d8d8d;
}
.hint.check{
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(0 ,-50%);
  line-height: .28rem;
}
</style>
