<template>
  <div id="recharge">
    <head-top :go-back='true' head-title="充值" :customRight="true" :rightAction="goto" rightTitle="记录" ></head-top>
    <div class="box">
      <div class="title">充值金额</div>
      <div style="display:flex;margin-top:0.3rem;">
        <span style="font-size:0.6rem" class="">￥</span><input v-model="money" style="font-size:0.6rem;" placeholder="请输入充值金额" type="text"></div>
    </div>

    <div style="padding:0.5rem" @click="pay">
      <x-button style="color:#fff;font-size:0.3rem;margin-top:0.5rem;background:#ff4444" text="立即充值"></x-button>
    </div>

  </div>
</template>
<script>
import headTop from "src/components/header/head";
import { createRechargeOrder } from "src/service/getData";
export default {
  components: { headTop },
  data() {
    return {
      money: ""
    };
  },
  watch: {
    money(value) {
      if (!value) {
        this.money = "";
        return false;
      }
      let reg = /^\d+$/;
      if (!reg.test(value)) {
        this.money = parseFloat(value);
      }
      value = parseFloat(value);

      if (value < 0) {
        this.money = 0;
      }
    }
  },
  methods: {
    goto(){
      this.$router.push('/recharge_list');
    },
    async pay() {
      if (!this.money) {
        this.$vux.toast.text("金额错误", "middle");
        return false;
      }
      this.$vux.loading.show({
        text: "正在提交..."
      });
      let res = await createRechargeOrder(this.money);
      this.$vux.loading.hide();
      this.$vux.toast.text(res.msg, "middle");
      if (res.code == 1) {
        this.$router.push("/pay?id=" + res.data);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#recharge {
  background: #eeeeee;
  position: absolute;
  top: 0.9rem;
  bottom: 0;
  left: 0;
  right: 0;
  .box {
    position: relative;
    top: 1px;
    background: #fafafa;
    width: 100%;
    font-size: 0.3rem;
    padding: 0.32rem;
    margin-bottom: 0.2rem;
    color: #666666;
    .flex-box {
      padding: 0.3rem 0 0.1rem 0;
      i {
        font-size: 0.5rem;
        color: #ccc;
      }
      i.check {
        color: #4cd964;
      }
    }
    input {
      outline: none;
      background: #fafafa;
      width: 80%;
      color: #696969;
    }
    input::-webkit-input-placeholder {
      color: #ccc;
    }
    img {
      width: 0.8rem;
      height: 0.8rem;
      margin-right: 0.2rem;
    }
  }
}
</style>
<style>
#recharge .mu-button {
  width: calc(100% - 1rem);
}
</style>

<style lang="scss">
#recharge {
  .mu-button {
    margin: 1rem 0.5rem 0 0.5rem;
    border-radius: 0.1rem;
  }
  .mu-button-wrapper {
    font-size: 0.3rem;
    color: #fff;
  }
  .mu-input-label {
    font-size: 0.4rem;
    line-height: 0.4rem;
  }
  .mu-input.has-label {
    padding-top: 0.6rem;
  }
  .mu-input-prefix-text {
    color: #333;
  }
  .mu-input-prefix-text,
  .mu-text-field-input {
    font-size: 0.6rem;
  }
  .mu-text-field-input {
    height: 0.6rem;
  }
  input::-webkit-input-placeholder {
    color: #ccc;
  }
}
</style>

