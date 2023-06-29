<template>
  <div class="popup_wrapper" :style="pos + bounds" @click.stop="() => {}">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "PopUp",
  props: {
    pos: { type: String },
    bounds: { type: String },
  },
};
</script>

<style lang="scss">
.popup_wrapper {
  position: absolute;
  background-color: #ffffff;
  border-radius: 10px;
  z-index: 2;
  box-shadow: 0 0 10px 5px #44444438;
  overflow-y: scroll;
}

.popup-left-enter-active,
.popup-left-leave-active,
.popup-right-enter-active,
.popup-right-leave-active {
  transition: 0.5s ease;
}

.popup-left-enter-from,
.popup-left-leave-to {
  transform: translateX(calc(-100% - 50px));
}

.popup-right-enter-from,
.popup-right-leave-to {
  transform: translateX(calc(+100% + 50px));
}
</style>
