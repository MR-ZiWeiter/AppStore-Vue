<template>
    <div id="transfer-point">
        <head-top :go-back='true' head-title="转账"></head-top>
        <div class="p-a-all">
            <div>
                <div class="weui-cells vux-no-group-title">
                    <div class="vux-x-input weui-cell">
                        <div class="weui-cell__hd">
                            <label for="vux-x-input-qm6vl" class="weui-label" style="width: 1.5rem;">转账数量:</label>
                        </div>
                        <div class="weui-cell__bd weui-cell__primary"><input id="vux-x-input-qm6vl" v-model="num" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" type="text" :placeholder="'请输入转账数量,最多可转'+point" class="weui-input">
                        </div>

                    </div>
                </div>
            </div>

            <group>
                <x-input label-width="1.5rem" title="对方账号:" required v-model="account" placeholder="请输入对方账号"></x-input>
            </group>
            <group>
                <x-input label-width="1.5rem" title="真实姓名:" required v-model="realname" placeholder="请输入真实姓名"></x-input>
            </group>
            <div class="btn" @click="check">确认转账</div>

        </div>
        <div v-transfer-dom>
            <popup v-model="paypwd_show" class="transfer-point">
                <popup-header :right-text="'取消'" title="请输入支付密码" :show-bottom-border="false" @on-click-right="paypwd_show = false"></popup-header>
                <pwd-box @input-ok="save"></pwd-box>
            </popup>
        </div>
    </div>
</template>
<script>
import pwdBox from "src/components/common/pwd";
import { transferAccounts } from "src/service/getData";
import headTop from "src/components/header/head";
export default {
  components: { headTop, pwdBox },
  data() {
    return {
      point: 0,
      num: "",
      realname: "",
      account: "",
      paypwd_show: false
    };
  },
  watch: {
    num(value) {
      if (!value) {
        this.num = "";
        return false;
      }
      let reg = /^\d+\.?\d{0,2}$/;
      if (!reg.test(value)) {
        this.num = parseInt(value);
      }
      value = parseInt(value);

      if (value < 0) {
        this.num = 0;
      }
      if (value > parseInt(this.point)) {
        this.num = parseInt(this.point);
      }
    }
  },
  beforeMount() {
    this.getInfo();
  },
  methods: {
    check() {
      if (!this.num || !this.account || !this.realname) {
        this.$vux.toast.text("表单不完整", "middle");
        return false;
      }
      this.paypwd_show = true;
    },
    async save(pwd) {
      this.paypwd_show = false;
      this.$vux.loading.show({ text: "提交中..." });
      let res = await transferAccounts(
        "tran",
        this.num,
        this.realname,
        this.account,
        pwd
      );
      this.$vux.loading.hide();
      this.$vux.toast.text(res.msg, "middle");
    },
    goto(url) {
      this.$router.push(url);
    },
    async getInfo() {
      this.$vux.loading.show({ text: "获取中..." });
      let res = await transferAccounts();
      this.$vux.loading.hide();
      if (res.code == 1) {
        if (!res.data.is_pay_pwd) {
          this.$vux.toast.text("请先设置支付密码!", "middle");
          setTimeout(() => {
            this.$router.push("/userinfo");
          }, 2000);
        }
        this.point = res.data.point;
      } else {
        this.$vux.toast.text(res.msg, "middle");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#transfer-point {
  .p-a-all {
    .btn {
      width: calc(100% - 0.6rem);
      margin: 0.3rem;
      padding: 0.2rem;
      background: #eec242;
      text-align: center;
      color: #fff;
      border-radius: 0.1rem;
    }
  }
}
</style>

<style lang="scss">
.transfer-point {
  .vux-popup-header-right {
    position: absolute;
    right: 15px;
  }
}
</style>
