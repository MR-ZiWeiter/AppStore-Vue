<template>
    <div id="withdraw_log">
        <head-top :go-back='true' head-title="提现记录" :rightMenu="true"></head-top>
        <div class="p-a-all" @scroll="handleScroll">
            <div v-if="list.length==0" style="text-align: center;padding-top:20%;">还没有记录</div>
            <div @click="goto(item.id)" class="item flex-box" v-for="(item,index) in list" :key="index">
                <div>
                    <p>{{item.bank_name}}({{item.account_number}})</p>
                    <p class="font-size-13 text-color-999">{{item.ask_for_date|date}}</p>
                </div>
                <div>
                    <p class="price">￥{{item.cash}}</p>
                    <p class="font-size-13 text-color-666">{{item.status}}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import headTop from "src/components/header/head";
import { balancewithdraw } from "src/service/getData";
import { dateFormat } from "vux";
export default {
  components: { headTop },
  data() {
    return {
      page: 1,
      page_count: 1,
      list: []
    };
  },
  filters: {
    date(time) {
      return dateFormat(time * 1000, "YYYY-MM-DD HH:mm:ss");
    }
  },
  beforeMount() {
    this.getList();
  },
  methods: {
    handleScroll() {
      let dom = this.$el.children[1];
      if (dom.scrollTop + dom.offsetHeight >= dom.scrollHeight) {
        this.page++;
        if (this.page>=this.page_count) {
          this.getList();
        }
      }
    },
    goto(id) {
      this.$router.push("/withdraw_detail?type=balance&id=" + id);
    },
    async getList() {
      this.$vux.loading.show({ text: "正在获取中......" });
      this.$vux.loading.hide();
      let res = await balancewithdraw(this.page);
      if (res.code == 1) {
        let that = this;
        this.page_count = res.data.page_count;
        for (let i in res.data.data) {
          that.list.push(res.data.data[i]);
        }
      } else {
        this.$vux.toast.text(res.msg, "middle");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#withdraw_log {
  .item {
    width: 100%;
    padding: 0.2rem;
    background: #fff;
    font-size: 0.3rem;
    margin-bottom: 0.05rem;
  }
}
</style>
