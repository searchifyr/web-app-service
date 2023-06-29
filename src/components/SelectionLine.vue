<template>
  <div class="line" :style="correctedPosition" v-if="!isSpaceLimited">
    <span class="line_marks"></span>
    <span class="line_connecter"></span>
  </div>
</template>

<script>
export default {
  name: "SelectionLine",
  props: {
    postion: { type: Object, default: () => ({ left: "0", top: "0" }) },
  },
  data() {
    return {
      isSpaceLimited: false,
    };
  },
  computed: {
    correctedPosition() {
      const keys = Object.keys(this.postion);
      let pos = "";
      keys.forEach((elm) => {
        pos += `${elm}: ${this.postion[elm]};`;
      });
      return pos;
    },
  },
  methods: {
    checkIfSpaceIsLimited() {
      if (window.innerWidth <= 768) this.isSpaceLimited = true;
      else this.isSpaceLimited = false;
    },
  },
  mounted() {
    this.checkIfSpaceIsLimited();
    addEventListener("resize", this.checkIfSpaceIsLimited);
  },
};
</script>

<style lang="scss">
.line {
  position: absolute;
  top: 0;
  left: 0;
  transition: all 0.2s;

  &_marks {
    &::after {
      content: "";
      position: absolute;
      top: 5px;
      left: 10px;
      width: 10px;
      height: 10px;
      border: 2px $linerider_grey;
      border-style: none solid solid none;
      transform: rotate(-45deg);
    }

    &::before {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 5px;
      height: calc(57px);
      border: 2px $linerider_grey;
      border-style: solid solid solid none;
      border-radius: 0 4px 4px 0;
    }
  }

  &_connecter {
    &::before {
      content: "";
      position: absolute;
      top: 10px;
      left: 10px;
      width: 7px;
      height: calc(100% - 45px);
      border: 2px $linerider_grey;
      border-style: solid none none none;
    }

    &::after {
      content: "";
      position: absolute;
      top: 10px;
      left: 5px;
      width: 5px;
      height: calc(100% - 45px);
      border: 2px $linerider_grey;
      border-style: none solid solid none;
    }
  }
}
</style>
