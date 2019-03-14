<template>
  <swipeout>
    <swipeout-item transition-mode="follow">
      <div slot="right-menu">
        <swipeout-button :width="120" type="primary">修改</swipeout-button>
        <swipeout-button :width="120" @click.native="delAddress" type="warn">删除</swipeout-button>
      </div>

      <div slot="content" class="address flex-box">
        <i v-if="address.IsDefault" class="iconfont icon-web-icon- default"></i>
        <div>
          <div class="font-size-12 text-color-666">
            <span class="font-size-15 font-bold">{{address.Name}}</span> {{address.Sex == 1? '先生' : '女士'}} {{address.MobilePhone}}
          </div>
          <div class="font-size-12">
            <span class="label">{{address.Say}}</span> {{address.Address}}({{address.AddressDetail}})
          </div>
        </div>
        <div class="icon-box">
          <i v-if="!address.IsDefault" @click="setDefault" class="iconfont icon-moren"></i>
        </div>
      </div>
    </swipeout-item>
  </swipeout>
</template>
<script>
import { SetDefault } from 'src/service/getData'
import { Swipeout, SwipeoutItem, SwipeoutButton } from 'vux'

export default {
  props: ['isDefault', 'address'],
  components: {
    Swipeout,
    SwipeoutItem,
    SwipeoutButton
  },
  data() {
    return {
      show: false
    }
  },
  methods: {
    async setDefault() {
      this.$emit('setDefaultAddress', this.address.Id)
    },
    delAddress() {
      let _self = this
      this.$vux.confirm.show({
        title: '提示',
        content: '是否删除该地址？',
        onCancel() {},
        onConfirm() {
          _self.$emit('delAddress', _self.address.Id)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.default {
  position: absolute;
  left: -0.1rem;
  top: -0.13rem;
  font-size: 0.8rem;
  color: #ff4444;
  transform: rotate(270deg);
}
.icon-box i {
  font-size: 0.4rem;
  margin-left: 0.2rem;
}

.address {
  padding: 0.2rem 0.3rem;
  background: #fafafa;
  margin-bottom: 1px;
  position: relative;
}
.label {
  color: #fff;
  background: #ff4444;
  font-size: 0.2rem;
  padding: 0.02rem 0.1rem;
  border-radius: 0.1rem;
}
</style>
