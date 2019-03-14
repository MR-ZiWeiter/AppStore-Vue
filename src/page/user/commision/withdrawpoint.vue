<template>
    <div id="withdraw">
        <head-top head-title="申请提现" :go-back='true' :rightMenu="true"></head-top>
        <div class="p-a-all">
            <input v-model="money" type="number" class="number" :placeholder="'最多可转'+parseInt(info.commission_cash)+'积分'">
            <div class="text-align-center" style="padding:0.2rem 0.3rem;">
                <div class="btn" @click="add">立即提取</div>
               <p>注:可提现金额为交易成功后7天且未提取的金额</p>
            </div>
        </div>
    </div>
</template>
<script>
import {UserAccountexchange,addAccountexchange} from "src/service/getData";
import headTop from "src/components/header/head";
export default {
  components: {
    headTop
  },
  data() {
    return {
      money:'',
      info:{},
      commission_cash:0
    };
  },
  watch:{
    money(value) {
      if (!value) {
        this.money = "";
        return false;
      }
     var reg = /^[0-9]+$/ ;
      if (!reg.test(value)) {
        this.money = parseInt(value);
      }
      value = parseInt(value);

      if (value < 0) {
        this.money = 0;
      }
      if (value > parseInt(this.info.commission_cash)) {
        this.money = parseInt(this.info.commission_cash);
      }
    }
  },
  beforeMount(){
    this.getInfo();
  },
  methods:{
    async add(){
      if(!this.money){
         this.$vux.toast.text('金额不正确','middle');
         return false;
      }
      this.$vux.loading.show({
        text: "正在提交..."
      });
      let res = await addAccountexchange(this.money);
      this.$vux.loading.hide();
      this.$vux.toast.text(res.msg,'middle');
    },
    async getInfo() {
      this.$vux.loading.show({
        text: "正在获取..."
      });
      let res = await UserAccountexchange();
      this.$vux.loading.hide();
      if (res.code == 1) {
        this.info = res.data;
      } else {
        this.$vux.toast.text(res.msg, "middle");
      }
    },
  }
};
</script>
<style lang="scss" scoped>
.btn{
    padding:0.2rem;
    background: #eec242;
    color:#fff;
    border-radius: 0.1rem;
    margin-bottom: 0.2rem;
}
.number {
  width: 100%;
  background: #fff;
  padding: 0.2rem 0.3rem;
  font-size: 0.3rem;
}
</style>
