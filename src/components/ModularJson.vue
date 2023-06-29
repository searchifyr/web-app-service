<template>
  <div class="modularJson" ref="json">
    <!-- Transition Group will handle the animations for the table -->
    <TransitionGroup name="list">
      <!-- Renders every Line that was build in "expandedList" Object -->
      <span v-for="item in expandedList" :key="item.index" :class="['modularJson_line', item.class]" :style="item.style" @click="changeisExpanded(item)">
        <span class="modularJson_triangle" v-if="item.isExpanded != null">
          <TriangleIcon class="modularJson_triangle_icon" :style="item.isExpanded ? 'transform: rotate(90deg);' : ''" />
        </span>
        <span class="modularJson_text">
          <!-- Just shows the text and put the "JSON stuff" around the text for a better "copy experience" -->
          <p :class="item.type === 'text' ? 'modularJson_text_quotes' : 'modularJson_text_quotes_nonText'">"</p>
          <p class="modularJson_text_main">
            {{ item.value }}
          </p>
          <p :class="item.type === 'text' ? 'modularJson_text_quotes' : 'modularJson_text_quotes_nonText'">
            "{{ item.type === "text" ? (!item.closingTag ? "," : "") : ":" }}
            {{ item.type === "object" || item.type === "name" ? "{" : item.type === "array" ? "[" : "" }}
            {{ !item.isExpanded ? (item.type === "array" ? "]," : item.type === "object" ? "}," : "") : "" }}
          </p>
        </span>
      </span>
    </TransitionGroup>
    <div class="modularJson_buttons">
      <button v-if="showButtons" @click="copyAllToClip">Copy all to clipboard</button>
    </div>
  </div>
</template>

<script>
import TriangleIcon from "@/assets/Icons/TriangleIcon.vue";

export default {
  name: "ModularJson",
  components: {
    TriangleIcon,
  },
  props: {
    json: { type: Object, default: () => {} },
    showButtons: { type: Boolean, default: true },
  },
  data() {
    return {
      isExpanded: [0],
      list: [],
      refinedList: [],
    };
  },
  methods: {
    changeisExpanded(item) {
      let isExpanded = new Set(this.isExpanded);
      let lvl = this.refinedList[item.index].level;
      let i = 0;
      const isExpaneded = this.refinedList[item.index].isExpanded;

      if (item.isExpanded != null) {
        if (isExpaneded) {
          i = 1;
          while (this.refinedList[item.index + i]?.level > lvl) {
            isExpanded.delete(item.index + i);
            this.refinedList[item.index + i].isExpanded = false;
            i++;
          }
          this.refinedList[item.index].isExpanded = false;
        } else {
          do {
            if (this.refinedList[item.index + i]?.level <= lvl + 1) isExpanded.add(item.index + i);
            i++;
          } while (this.refinedList[item.index + i]?.level > lvl);
          this.refinedList[item.index].isExpanded = true;
        }
      }
      this.isExpanded = Array.from(isExpanded).sort((a, b) => a - b);
    },
    
    /* The magic of this Component will start here */
    refineList() {
      this.list = [];
      /* This funktion will build the tree from the Object */
      const json = JSON.parse(JSON.stringify(this.json));
      this.buildTree(json);

      let refinedList = [];
      let indexs = [];
      let needClosingTag = 0;
      this.list.forEach((item) => {
        /* Will handle the Elemnt after the index needs to be raised again */
         while (indexs[indexs.length - 1] <= 0) {
          indexs[indexs.length - 2] -= 1;
          indexs.splice(indexs.length - 1, indexs.length);
        }

        /* Sets HTML content */
        if (item.length) {
          needClosingTag = item.length;
        } else needClosingTag -= 1;

        /* The next condtions will handle the typs and set them */
        if (item.type === "array") {
          indexs.push(item.length);
          refinedList.push({
            value: `${item.name}`,
            class: ["modularJson_arr"],
            style: `margin-left: ${(indexs.length + 3) * 10}px`,
            level: indexs.length,
            isExpanded: false,
            type: "array",
            closingTag: null,
          });
        } else if (item.type === "object") {
          indexs.push(item.length);
          refinedList.push({
            value: `${item.name}`,
            class: ["modularJson_obj"],
            style: `margin-left: ${(indexs.length + 3) * 10}px`,
            level: indexs.length,
            isExpanded: false,
            type: "object",
            closingTag: null,
          });
        } else {
          indexs[indexs.length - 1] -= 1;
          if (!item.name.match(/[0-9]/))
            refinedList.push({
              value: `${item.name}`,
              class: ["modularJson_obj"],
              style: `margin-left: ${(indexs.length + 4) * 10}px`,
              level: indexs.length + 1,
              isExpanded: null,
              type: "name",
              closingTag: null,
            });

          refinedList.push({
            value: `${item.value}`,
            class: ["modularJson_text"],
            style: `margin-left: ${(indexs.length + 5) * 10}px`,
            level: indexs.length + 1,
            isExpanded: null,
            type: "text",
            closingTag: needClosingTag === 0 ? "]" : "",
          });
        }
      });

      /* Handels the expansion of Objects and Arrays */
      refinedList.forEach((item, i) => {
        item.index = i;
        if (item.level === 1) {
          this.isExpanded.push(i);
        }
      });

      this.refinedList = refinedList;
    },

    /* This is a rekursiv funktion wich yields all a key and values */
    buildTree(json) {
      Object.keys(json).forEach((item) => {
        /* These Values get checked */
        this.getSupTree(json[item], item);
      });
    },
    
    /* Depending on the Type of the value an elemtn will be pushed into a list or gets build again */
    getSupTree(item, name) {
      if (this.isArray(item)) {
        this.list.push({ type: "array", length: item.length, name: name });
        this.buildTree(item);
      } else if (this.isObject(item)) {
        this.list.push({ type: "object", length: Object.keys(item).length, name: name });
        this.buildTree(item);
      } else this.list.push({ value: item, name: name });
    },

    /* just simple Type checks for the TreeBuilder */
    isArray(a) {
      return !!a && a.constructor === Array;
    },
    isObject(a) {
      return !!a && a.constructor === Object;
    },

    copyAllToClip() {
      navigator.clipboard.writeText(JSON.stringify(this.json));
    },
  },
  computed: {
    /* Prints the Expanded List */
    expandedList() {
      const json = JSON.parse(JSON.stringify(this.refinedList));
      return json.filter((item) => this.isExpanded.indexOf(item.index) >= 0);
    },
  },
  mounted() {
    this.refineList();
  },
  watch: {
    json() {
      this.refineList();
    },
  },
};
</script>

<style lang="scss">
.modularJson {
  position: relative;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;

  &_line {
    position: relative;
  }

  &_text {
    text-align: left;
    display: flex;

    &_main {
      margin: 0;
    }

    &_quotes {
      margin: 0;

      &_nonText {
        margin: 0;
        color: white;
      }
    }
  }

  &_arr {
    cursor: pointer;
    color: #1b1bab;

    &::after {
      content: "[]";
      position: absolute;
      top: 0;
      left: -9px;
      font-size: 0.7rem;
      text-align: center;
      line-height: 1rem;
      color: $text_grey;
    }
  }

  &_obj {
    cursor: pointer;
    color: #d50a0a;

    &::after {
      content: "{}";
      position: absolute;
      top: 0;
      left: -9px;
      font-size: 0.7rem;
      text-align: center;
      line-height: 1rem;
      color: $text_grey;
    }
  }

  &_buttons {
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 20px;
    margin: 20px 0;
    padding: 0 50px;
  }

  &_triangle {
    position: absolute;
    top: 0;
    left: -20px;
    width: 24px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    &_icon {
      width: 10px;
      transition: 0.05s all;
    }
  }
}

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.05s ease;
  position: relative;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-to {
  opacity: 0;
}

.list-leave-active {
  opacity: 0;
  position: absolute;
}
</style>
