<template>
  <div class="main " :class="{on:isLoading}">
    <div id="nav">axios-test</div>
    <button @click="send">click</button>
    <button @click="send1">click1</button>
  </div>
</template>

<script>
import { register0, register01 } from "/src/utils/api/useApi";
import { useStore } from "vuex"
import {computed} from "vue"
export default {
  setup() {
    let store = useStore();
    console.log(store);
    let isLoading = computed(()=>{
      return store.state.isLoading
    })

    const send = () => {
      register0()
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const send1 = () => {
      register01()
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    return { send, send1,isLoading };
  },
};
</script>
<style lang='scss'>
.main {
  position: relative;
  &.on::after {
    content: "loading...";
    position: absolute;
    top: 0;
    right: 0;
    z-index: 99;
    width: 100vw;
    height: 100vh;
    background-color: rgba(255,255,255,1);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
