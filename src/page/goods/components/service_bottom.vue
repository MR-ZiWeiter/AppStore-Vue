<template>
    <div class="btn" @click="buy">立即购买</div>
</template>
<script>
export default {
    methods:{
        buy(){
            this.$emit("bottom", "good");
        }
    }
};
</script>
<style lang="scss" scoped>
.btn{
    width: 100%;
    text-align: center;
    background: #ff4444;
    color:#fff;
    height: 1rem;
    line-height: 1rem;
}
</style>
