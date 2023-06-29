<template>
  <div class="createApplication_inputWrapper">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "CreateContentComponent"
};
</script>

<style lang="scss">
.createApplication {
  &_inputWrapper {
    display: flex;
    flex-direction: column;
    row-gap: 20px;
  }
}
</style>
