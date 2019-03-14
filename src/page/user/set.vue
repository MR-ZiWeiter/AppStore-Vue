<template>
    <div id="set">
        <head-top :go-back='true' head-title="设置"></head-top>
        <div class="p-a-all">
            <div class="item flex-box" @click="up">
                <span>检查更新</span>
                <i class="material-icons">
                    keyboard_arrow_right
                </i>
            </div>
            <div class="item flex-box" @click="goto('/article?title=关于我们')">
                <span>关于我们</span>
                <i class="material-icons">
                    keyboard_arrow_right
                </i>
            </div>
            <div style="padding:0 0.5rem" @click="logout_btn">
                <x-button>退出登陆</x-button>
            </div>
        </div>
    </div>
</template>
<script>
import { logout } from "src/service/getData";
import headTop from "src/components/header/head";
export default {
  components: { headTop },
  methods: {
    up(){
      this.$vux.toast.text('已是最新版本','middle');
    },
    goto(url) {
      this.$router.push(url);
    },
    async logout_btn() {
      this.$vux.loading.show({ text: "处理中..." });
      let res = await logout();
      this.$vux.loading.hide();
      this.$vux.toast.text(res.msg, "middle");
      if (res.code == 1) {
        setTimeout(() => {
          this.$router.push("/index");
        }, 2000);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#set {
  .p-a-all {
    background: #eee;
    .item {
      padding: 0.3rem;
      margin-bottom: 1px;
      font-size: 0.3rem;
      background: #fafafa;
    }
    button {
      height: 0.8rem;
      font-size: 0.3rem;
      color: #666;
      margin-top: 1rem;
    }
  }
}
</style>
 <style lang="scss">
#set {
  .material-icons {
    font-size: 0.4rem;
    color: #999;
  }
}
</style>

