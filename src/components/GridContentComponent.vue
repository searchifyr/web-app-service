<template>
  <div class="gridContent_wrapper">
    <p class="gridContent_titel">{{ name }}</p>
    <div class="gridContent">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "GridContentComponent",
  props: {
    name: { type: String, default: "" },
  },
};
</script>

<style lang="scss">
.gridContent {
  height: calc(100% - 60px);
  padding: 5px;
  border-radius: 10px;
  box-shadow: $dark_shadow;
  background-color: #ffffff;

  &_wrapper {
    display: flex;
    height: calc(100% - 20px);
    overflow-x: hidden;
    padding: 0 10px;
    flex-direction: column;
  }

  &_titel {
    text-align: left;
    font-weight: 700;
    margin: 0.5rem;
    font-size: 1.3rem;
    height: calc(1rem + 8px);
  }
}
</style>
