<template>
  <div>
    <NavBar left-arrow @click-left="onClickLeft" title="我的资产"></NavBar>
    <div style="height: calc(100% - 46px);overflow-y: scroll;overflow-x: hidden;background-color: #f0f0f0">
      <div style="padding: .3rem;background-color: #fff;margin-bottom: .2rem;box-sizing: border-box;box-sizing: -webkit-border-box;">
        <div style="height: 3.32rem;border-radius: .3rem;background-color: #fe728f;color: rgba(255,255,255,.6)">
          <h4 class="property_title">总资产</h4>
          <div class="property_group">
            <div class="property_group_item" @click="$router.push({name: 'ReturnsDetailed'})">
              <div class="title">收益 (元)</div>
              <div class="money">{{money}}</div>
            </div>
            <div class="property_group_item" @click="$router.push({name: 'VirtualCurrencyDetails'})">
              <div class="title">婚恋豆</div>
              <div class="money">{{virtualCurrencyCount}}</div>
            </div>
          </div>
        </div>
      </div>

       <CellGroup>
        <Cell title="银行卡" is-link @click="BankCard">
          <span slot="icon" class="bank"></span>
        </Cell>
        <Cell title="提现" is-link @click="withdrawal">
          <span slot="icon" class="withdraw"></span>
        </Cell>
        <Cell title="婚恋豆充值" is-link to="virtualCurrency">
          <span slot="icon" class="virtualCurrency"></span>
        </Cell>
        <Cell title="婚恋豆兑换" is-link @click="virtualCurrencyExchange(virtualCurrencyCount)">
          <span slot="icon" class="virtualCurrencyExchange"></span>
        </Cell>
      </CellGroup>
    </div>
  </div>
</template>
<script>
import { NavBar ,CellGroup ,Cell, Toast} from 'vant'
import {userWallet} from '@/assets/common/api'
export default {
  components: {
    NavBar,
    CellGroup,
    Cell
  },
  data () {
    return {
      money: 0,
      virtualCurrencyCount: 0
    }
  },
  methods: {
    onClickLeft () {
      this.$router.back();
      //this.Toast.clear()
    },
    BankCard () {
      window.BankCard()
    },
    withdrawal () {
      if(this.$store.state.IM.user.registerState !== '5') {
        Toast({
          message: '请先实名认证',
          duration: 1000
        })
        return false
      }
      window.withdrawal()
    },
    virtualCurrencyExchange (num) {
      this.$router.push({name: 'virtualCurrencyExchange', query:{defaultNum: num}})
    }
  },
  mounted () {
    userWallet({
      userId: this.$store.state.IM.user.id
    }).then(res => {
      this.money = res.data.useBalance;
      this.virtualCurrencyCount = res.data.virtualCurrencyCount;
    })
  }
}
</script>
<style scoped>
.bank{
  width: .4rem;
  background-image: url('../../assets/images/bank_icon.png');
  background-repeat: no-repeat;
  background-size: 100%;
  vertical-align: middle;
  margin-right: .2rem
}
.withdraw{
  width: .4rem;
  background-image: url('../../assets/images/withdrawal.png');
  background-repeat: no-repeat;
  background-size: 100%;
  vertical-align: middle;
  margin-right: .2rem
}
.virtualCurrency{
  width: .4rem;
  background-image: url('../../assets/images/recharge.png');
  background-repeat: no-repeat;
  background-size: 100%;
  vertical-align: middle;
  margin-right: .2rem
}

.virtualCurrencyExchange{
  width: .4rem;
  background-image: url('../../assets/images/exchange.png');
  background-repeat: no-repeat;
  background-size: 100%;
  vertical-align: middle;
  margin-right: .2rem
}

.property_title{
  margin: 0;
  font-size: .28rem;
  line-height: 1.04rem;
  text-align: left;
  padding: 0 .2rem;
  padding-top: .18rem;
  font-weight: 100;
}
.property_group{
  display: flex;
  display: -webkit-flex;
  display: box;
  display: -webkit-box;
}
.property_group .property_group_item{
  width: 50%;
}
.property_group .property_group_item:first-child{
  border-right: 1px solid;
}
.property_group_item .title{
  line-height: .48rem;
}
.property_group_item .money{
  font-size: .37rem;
  line-height: .81rem;
  color: #fff;
}
</style>
