<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 23" class="ctc ctc_test" @click="ctc">
    <g stroke="none">
      <path class="ctc_clip" d="M4 6 4 19Q4 21 6 21L15 21Q17 21 17 19L17 6Q17 4 15 4L6 4Q4 4 4 6" />
      <path :class="['ctc_corner', { ctc_corner_active: isAnimationRunning }]" d="M10 1 4 1Q1 1 1 5L1 13" />
    </g>
  </svg>
</template>

<script>
export default {
  name: "CopyToClipIcon",
  data() {
    return {
      isAnimationRunning: false,
    };
  },
  methods: {
    ctc() {
      this.isAnimationRunning = true;
      this.$emit("ctc");

      setTimeout(() => {
        this.isAnimationRunning = false;
      }, 500);
    },
  },
};
</script>

<style lang="scss" scoped>
.ctc {
  &_clip,
  &_corner {
    stroke: $icon_base_grey;
    stroke-width: 2px;
    fill: none;
    transition: 0.3s all;

    &_active {
      animation: 0.5s clicked;
    }
  }

  &:hover .ctc_corner {
    stroke: $company_blue;
  }
}

@keyframes clicked {
  0% {
    d: path("M10 1 4 1Q1 1 1 5L1 13");
    stroke: $icon_base_grey;
  }
  50% {
    d: path("M10 3 5 3Q3 3 3 5L3 13");
    stroke: #38bb1e;
  }
  100% {
    d: path("M10 1 4 1Q1 1 1 5L1 13");
    stroke: $icon_base_grey;
  }
}
</style>
