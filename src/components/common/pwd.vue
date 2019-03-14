<template>
  <div id="pwd-box">
    <div class="top">
      <span v-for="(item,index) in pwd" :key="index">{{item?'*':''}}</span>
      <div class="forget-box">
        <div class="forget" @click="goto('/forgetpaypwd')">忘记密码</div>
      </div>

    </div>
    <div class="input-box">
      <span @click="play(item)" v-for="(item,index) in input" :key="index" :class="{gray:!reg.test(item)}" v-html="item"></span>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      pwd: ["", "", "", "", "", ""],
      input: [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        "C",
        0,
        '<i class="iconfont icon-shanchu1"></i>'
      ],
      reg: /^\d+$/
    };
  },
  mounted() {
    console.log("pwd");
  },
  watch: {
    pwd: {
      handler(value) {
        var flag = true;
        let pwd = "";
        for (let i in value) {
          pwd += value[i];
          if (!value[i]) {
            flag = false;
            return false;
          }
        }
        if (flag) {
          this.$emit("input-ok", pwd);
        }
      },
      deep: true
    }
  },
  methods: {
    goto(url){
      this.$router.push(url);
    },
    clear() {
      this.pwd = ["", "", "", "", "", ""];
    },
    play(key) {
      let that = this;
      if (this.reg.test(key)) {
        for (let i in that.pwd) {
          if (!that.pwd[i]) {
            that.$set(that.pwd, i, "" + key);
            return false;
          }
        }
        return false;
      }
      if (key == "C") {
        this.pwd = ["", "", "", "", "", ""];
      } else {
        for (let i = that.pwd.length - 1; i >= 0; i--) {
          if (that.pwd[i]) {
            that.$set(that.pwd, i, "");
            return false;
          }
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#pwd-box {
  height: 6.75rem;
  background: #eee;

  .top {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem 0;
    position: relative;
    .forget-box {
      position: absolute;
      width: 4.5rem;
      .forget {
        position: absolute;
        right: 0;
        margin-top: 0.65rem;
        font-size: 0.24rem;
        color: #4997f3;
      }
    }

    span {
      background: #fff;
      display: inline-block;
      width: 0.75rem;
      height: 0.75rem;
      border-top: 1px solid #aaa;
      border-bottom: 1px solid #aaa;
      border-left: 1px solid #aaa;
      text-align: center;
      line-height: 0.75rem;
      font-size: 0.5rem;
    }
    span:last-child {
      border-right: 1px solid #aaa;
    }
  }
  .input-box {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    span {
      border-right: 1px solid #aaa;
      border-top: 1px solid #aaa;
      font-size: 0.4rem;
      text-align: center;
      width: 33.3333%;
      height: 1rem;
      line-height: 1rem;
      background: #fff;
      display: inline-block;
    }
    span:nth-child(3n + 0) {
      border-right: 0;
    }
    .gray {
      background: #eee;
    }
  }
}
</style>
