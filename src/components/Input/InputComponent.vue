<template>
  <div class="Input" @keyup.enter="enter">
    <label :class="['Input_label', value != '' ? 'Input_label_up' : 'Input_label_down', offset == 'filter' && value != '' ? 'Input_label_up_offsetFilterSpace' : '']">{{ text }}</label>
    <input class="Input_input" type="text" v-model="value" @blur="blur" />
  </div>
</template>

<script>
export default {
  name: "InputComponent",
  emits: ["enter", "change", "blur"],
  props: {
    text: { type: String, default: "" },
    type: { type: String, default: "text" },
    offset: { type: String, default: "" },
    setValue: { type: String, default: "" },
    removeTextafterSoftProgress: { type: Boolean, default: false },
  },
  data() {
    return {
      value: "",
    };
  },
  methods: {
    enter(value) {
      this.$emit("enter", value.target.value);
      if (this.removeTextafterSoftProgress) this.value = "";
    },
    blur(value) {
      this.$emit("blur", value.target.value);
      if (this.removeTextafterSoftProgress) this.value = "";
    },
  },
  watch: {
    value() {
      this.$emit("change", this.value);
    },
    setValue() {
      this.value = this.setValue;
    },
  },
};
</script>

<style lang="scss">
.Input {
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 10px auto;
  padding: 10;
  margin-top: 0;
  padding-top: 0;
  width: calc(100% - 20px);
  height: 2rem;

  &_label {
    position: absolute;
    top: 0;
    left: 0;
    width: auto;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 5px;
    transition: all 0.5s;
    z-index: -11;

    &_up {
      left: 100%;
      transform: (translateX(-100%));
      color: #6d6d6d67;
      font-size: 0.8rem;

      &_offsetFilterSpace {
        margin-left: 0;
      }
    }

    &_down {
      color: rgb(117, 117, 117);
    }
  }

  &_input {
    height: 2rem;
    background-color: #ffffff59;
    box-shadow: 2px 2px 4px 2px rgba(50, 50, 10, 0.055);
    border: 1px solid #c5c4c4b2;
    border-radius: 8px;
  }
}
</style>
