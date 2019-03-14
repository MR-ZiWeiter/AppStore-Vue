<template>
  <div class="empty-head"></div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import store from 'src/store/'
import { getGameToken } from 'src/service/getData'
export default {
  data() {
    return {
      origin_transparent: this.transparent,
      open: false
    }
  },
  destroyed() {
    store.commit('SET_HEADER', { visible: false })
  },
  updated() {},
  mounted() {
    this.$nextTick(function() {
      store.commit('SET_HEADER', {
        visible: true,
        signinUp: this.signinUp,
        headTitle: this.headTitle,
        goBack: this.goBack,
        ori_transparent: this.transparent,
        transparent: this.transparent,
        textcolor: this.textcolor,
        borderBottom: this.borderBottom,
        rightAction: this.rightAction,
        rightIcon: this.rightIcon,
        rightMenu:this.rightMenu,
        customRight: this.customRight,
        rightTitle:this.rightTitle
      })
    })
  },
  props: {
    background: String,
    signinUp: Object,
    headTitle: String,
    rightTitle: String,
    goBack: Boolean,
    transparent: Boolean,
    textcolor: String,
    borderBottom: Boolean,
    rightAction: Function,
    rightIcon: String,
    rightMenu:Boolean,
    customRight: Boolean
  },
  computed: {
    //...mapState(['userInfo'])
  },
  methods: {
    ...mapMutations(['SET_HEADER'])
    //...mapActions(['getUserInfo'])
  }
}
</script>
<style>
.empty-head + div {
  padding-top: 0.9rem;
}
</style>
