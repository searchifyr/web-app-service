<template>
  <div class="confirmation_wrapper">
    <div class="confirmation_block">
      <h1>Are you sure?</h1>
      <h4>This operation cannot be undone.</h4>
      <div class="confirmation_block_selection">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ConfirmationOverlay",
};
</script>

<style lang="scss">
.confirmation {
  &_block {
    background-color: $delete-red;
    margin: auto;
    width: 500px;
    height: 300px;
    padding: 10px;
    box-shadow: 0 0 10px 10px #5858583a;
    border-radius: 10px;
    color: #ebe5e5d7;

    &_selection {
      display: flex;
      justify-content: center;
      margin-top: 100px;
      div,
      button {
        margin: 5px;
        font-size: 1rem;
        font-weight: 800;
        padding: 10px;
        width: 100px;
      }
    }
  }

  &_wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    background-color: #b1b1b14b;
    backdrop-filter: blur(4px);
    z-index: 99;
  }
}
</style>
