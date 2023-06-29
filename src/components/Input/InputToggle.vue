<template>
  <div class="toggle_container">
    <div :class="['toggle_box', { toggle_box_enable: toggleValue }]">
      <div :class="['toggle_box_circle', { toggle_box_circle_move: toggleValue }]"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "InputToggle",
  props: {
    toggleValue: {
      default: false,
    },
  },
};
</script>

<style lang="scss">
.toggle {

  &_box {
    width: 45px;
    height: 17px;
    background-color: $icon_base_grey;
    border-radius: 15px;
    padding: 5px;
    transition: all 200ms ease-in-out;

    &_circle {
      width: 35%;
      height: 100%;

      background: #fff;
      border-radius: 50%;
      transition: all 200ms ease-in-out;

      &_move {
        margin-left: 65%;
      }
    }

    &_enable {
      background: $company_blue;
    }
  }
}
</style>
