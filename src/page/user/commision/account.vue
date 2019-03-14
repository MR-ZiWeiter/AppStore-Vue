<template>
  <div id="account">
    <head-top head-title="我的账户地址" :go-back='true' :rightMenu="true"></head-top>
    <div class="p-a-all">
      <div class="list">
        <div class="item" v-for="(item,index) in list" :key="index">
          <p>姓名 : {{item.realname}}</p>
          <p>手机号码 : {{item.mobile}}</p>
          <p>账号类型 : {{item.account_type_name}}</p>
          <p v-if="item.account_type==1">银行账号 : {{item.account_number}}</p>
          <p v-if="item.account_type==1">开 户 行 : {{item.branch_bank_name}}</p>
          <p v-if="item.account_type==3||item.account_type==2">提现 账号 : {{item.account_number}}</p>
          <div class="flex-box btnlist">
            <div class="v-center" v-if="item.is_default==1">
              <i class="iconfont icon-xuanzhong"></i>默认账户</div>
            <div @click="setDefault(item.id)" class="v-center" v-else>
              <i class="iconfont icon-iconzhenghe60">设为默认</i>
            </div>
            <div>
              <span @click="edit(item.id)">
                <i class="iconfont icon-bianji"></i>编辑</span>
              <span @click="del(item.id)">
                <i class="iconfont icon-del"></i>删除</span>
            </div>
          </div>
        </div>
      </div>
      <x-button link="/withdraw_account_add">新增账户</x-button>
    </div>
  </div>
</template>
<script>
import { UserAccount, defaultAccount, delAccount } from "src/service/getData";
import headTop from "src/components/header/head";
export default {
  components: {
    headTop
  },
  data() {
    return {
      list: []
    };
  },
  beforeMount() {
    this.getList();
  },
  methods: {
    edit(id){
      this.$router.push('/withdraw_account_add?id='+id);
    },
    async getList() {
      this.$vux.loading.show({ text: "获取中..." });
      let res = await UserAccount("get");
      this.$vux.loading.hide();
      if (res.code == 1) {
        this.list = res.data;
      } else {
        this.$vux.toast.text(res.msg, "middle");
      }
    },
    async setDefault(id) {
      this.$vux.loading.show({ text: "处理中..." });
      let res = await defaultAccount("set", id);
      this.$vux.loading.hide();
      if (res.code == 1) {
        this.getList();
      } else {
        this.$vux.toast.text(res.msg, "middle");
      }
    },
    async del(id, index) {
      this.$vux.loading.show({ text: "处理中..." });
      let res = await delAccount(id);
      this.$vux.loading.hide();
      if (res.code == 1) {
        this.getList();
      } else {
        this.$vux.toast.text(res.msg, "middle");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.v-center {
  display: flex;
  align-items: center;
}
#account {
  button {
    background: #eec242;
    color: #fff;
    font-size: 0.3rem;
    margin: 1rem 0.3rem 0.3rem;
    width: calc(100% - 0.6rem);
  }
  .list {
    .item {
      background: #fff;
      padding: 0.2rem 0.3rem;
      margin-bottom: 0.2rem;
      display: flex;
      flex-wrap: wrap;
      border-bottom: 1px solid #ccc;
      border-top: 1px solid #ccc;
      p {
        width: 100%;
        color: #333;
        border-bottom: 1px solid #ccc;
        padding: 0.15rem;
      }
      p:last-child {
        border-bottom: 0;
      }
      .btnlist {
        width: 100%;
        padding-top: 0.15rem;
      }
    }
  }
}
</style>
<style lang="scss">
#account {
  .iconfont {
    font-size: 0.3rem;
  }
}
</style>
