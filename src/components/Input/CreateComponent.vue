<template>
  <div v-show="show" class="create_wrapper" :style="`right: ${xOffset}px;`">
    <button class="create_button">{{ text }}</button>
  </div>
</template>

<script>
export default {
  name: "CreateComponent",
  props: {
    show: { type: Boolean, default: true },
    text: { type: String, default: "Create" },
    xOffset: { type: Number, default: 30 },
  },
};
</script>

<style lang="scss">
.create {
  &_wrapper {
    position: absolute;
    top: 7px;
  }

  &_button {
    margin-top: 10px;
    width: 150px;
    height: 33px;
    font-weight: 700;
    border-radius: 10px 10px 0 0;
    padding-top: 5px;
    letter-spacing: 1.5px;
    font-size: 1.1rem;
    box-shadow: $dark_shadow;
    background-color: $company_blue;
    color: #fafafa;
  }
}
</style>
