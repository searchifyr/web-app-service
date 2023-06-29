<template>
  <div class="response_wrapper">
    <div class="response_block">
      <h1>New API-Key</h1>
      <h5>The key will never be displayed outside of this message!</h5>
      <div class="response_block_selection">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ApiKeyResponse"
};
</script>

<style lang="scss">
.response {
  &_block {
    background-color: $company_light_blue;
    margin: auto;
    width: 500px;
    height: 300px;
    padding: 10px;
    box-shadow: 0 0 10px 10px #5858583a;
    border-radius: 10px;
    color: $light_company_blue;

    &_selection {
      display: inline;  
      flex-direction: column;
      align-items: center;
      margin-top: 50px;
      gap: 50px;

      button {        
        margin: 55px 50px 0 50px;
        font-size: 1rem;
        font-weight: 800;
        padding: 10px;
        width: 100px;
      }
      p {
        margin: 45px 0 0 0;
        padding: 5px 10px 15px 10px;
        border: 2px $light_company_blue;
        border-style: solid;
        height: 10px;
        font-size: 22px;
        font-weight: bold;
        text-decoration: none;
        color: white;
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
