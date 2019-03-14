<template>
    <div id="set_pwd">
        <head-top :go-back='true' head-title="设置密码"></head-top>
        <div class="p-a-all">
            <group>
                <x-input type="password" label-width="1.5rem" title="当前密码:" required v-model="oldpassword" placeholder="当前密码"></x-input>
            </group>
            <group>
                <x-input type="password" label-width="1.5rem" title="新的密码:" required v-model="newpassword" placeholder="新的密码"></x-input>
            </group>
            <group>
                <x-input type="password" label-width="1.5rem" title="重复密码:" required v-model="password" placeholder="重复密码"></x-input>
            </group>
            <div class="btn" @click="save">保存</div>
        </div>
    </div>
</template>
<script>
import { editPassword } from "src/service/getData";
import headTop from "src/components/header/head";
export default {
  components: { headTop },
  data() {
    return {
      oldpassword: "",
      newpassword: "",
      password: ""
    };
  },
  methods: {
    goto(url) {
      this.$router.push(url);
    },
    async save() {
      if (this.newpassword&&this.newpassword != this.password) {
        this.$vux.toast.text("确认密码不正确", "middle");
        return false;
      }
      this.$vux.loading.show({ text: "获取中..." });
      let res = await editPassword(this.oldpassword,this.newpassword,this.password);
      this.$vux.loading.hide();
      this.$vux.toast.text(res.msg, "middle");
      if(res.code==1){
          setTimeout(()=>{
              this.$router.push('/login');
          },2000);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#set_pwd {
  .p-a-all {
    background: #eee;
    .item {
      padding: 0.3rem;
      margin-bottom: 1px;
      font-size: 0.3rem;
      background: #fafafa;
    }
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

