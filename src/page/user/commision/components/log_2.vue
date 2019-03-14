<template>
  <div id="commision-log-1" class="p-a-all" @scroll="handleScroll">
    <div v-if="list.length==0" style="text-align: center;padding-top:40%;">还没有记录</div>
    <div class="flex-box" v-for="(item,index) in list" :key="index" @click="goto(item.id)">
      <div>
        <p>{{item.bank_name}}({{item.account_number}})</p>
        <p class="font-size-13 text-color-999">{{item.ask_for_date}}</p>
      </div>
      <div>
        <p class="price" style="text-align:right">￥{{item.cash}}</p>
        <p class="price font-size-13 " style="text-align:right;">{{item.status?'已通过':'已申请(等待处理)'}}</p>
      </div>

    </div>
  </div>
</template>
<script>
import { ajaxUserCommissionWithdraw } from "src/service/getData";
export default {
  data() {
    return {
      list: [],
      page: 1,
      page_count: 1
    };
  },
  beforeMount() {
    this.getList();
  },
  methods: {
    goto(id){
      this.$router.push('withdraw_detail?type=commission&id='+id);
    },
    handleScroll() {
      let dom = this.$el;
      if (dom.scrollTop + dom.offsetHeight >= dom.scrollHeight) {
        this.page++;
        if (this.page <= this.page_count) {
          this.getList();
        }
      }
    },
    async getList() {
      this.$vux.loading.show({ text: "获取中..." });
      let res = await ajaxUserCommissionWithdraw(this.page);
      this.$vux.loading.hide();
      if (res.code == 1) {
        let that = this;
        for (let i in res.data.data) {
          that.list.push(res.data.data[i]);
        }
        this.page_count = res.data.page_count;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.flex-box {
  padding: 0.2rem 0.3rem;
  background: #fff;
  margin-bottom: 1px;
}
.p-a-all{
  top:1.7rem!important;
}
</style>
