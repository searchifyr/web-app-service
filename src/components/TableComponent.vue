<template>
  <div class="tableContainer">
    <p class="filter_header">Filter</p>
    <div class="filter_table_wrapper">
      <table class="filter_table">
        <thead>
          <tr>
            <!-- Prints the Header Array -->
            <td v-for="(headerItem, i) in data.header" :key="i">
              <InputComponent v-if="headerItem.isFilterable" :text="headerItem.name" :offset="i == 0 ? 'filter' : ''" @input="changeFilter($event.target.value, i)" />
              <p v-else>{{ headerItem.name }}</p>
            </td>
          </tr>
        </thead>

        <tbody>
          <!-- If a Input is needed as first Row -->
          <tr v-if="data?.misc?.hasInput">
            <td colspan="2">
              <span class="filter_table_input">
                <InputComponent :text="'New Application'" @change="setToCreatename" @enter="createNew" @blur="createNew" />
                <button @click="createNew">+</button>
              </span>
            </td>
          </tr>
          <!-- Prints the body Array in Rows and Columns -->
          <tr v-for="tableRow in filterdBody" :key="tableRow.index" :class="isActive === tableRow.index ? 'filter_table_activeRow' : ''" :ref="`table-select_${tableRow.index}`">
            <td v-for="(tableColumn, column) in tableRow.data" :key="tableRow.index + '-' + column" @click="$emit('onElementClick', { row: tableRow.index, column: column, data: data.body[tableRow.index] })">
              <slot :name="data.header[column].name" :value="tableColumn" :row="tableRow.index" :column="column" @click="$emit('onElementClick', { row: tableRow.index, column: column, data: data.body[tableRow.index] })">
                <p>
                  {{ tableColumn }}
                </p>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import InputComponent from "@/components/Input/InputComponent.vue";

export default {
  name: "TableComponent",
  components: {
    InputComponent,
  },
  emits: ["onElementClick", "onCreateClick"],

  /* This Propberty has to be parsed as an Object with Object Array as Header and a Object Array as body */
  /* Will default to emtpy Arrays as Failsafe */
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          header: [{}],
          body: [[]],
          toCreateName: "",
        };
      },
    },
    isActive: { type: Number, default: -1 },
  },
  data() {
    return {
      /* Prints Empty array to avoid null errors*/
      filter: new Array(this.data.body.length).fill(""),
    };
  },
  computed: {
    indexedData() {
      return this.tableData.map((data, index) => ({ data, index }));
    },

    /* Filter the every body row, if at least one cell has a match the row gets printed */
    /* The table is OR filterd */
    filterdBody() {
      return this.indexedData.filter((item) => this.filter.every((filter, filterIndex) => !filter.length || String(item.data[filterIndex]).toLowerCase().indexOf(filter.toLowerCase()) > -1));
    },
    tableData() {
      /* Simply builds the table */
      let finalBody = [];
      this.data.body.forEach((col, i) => {
        finalBody.push([]);

        this.data.header.forEach((row) => {
          let value = "";

          if (this.data.body[i] === undefined) {
            finalBody[i].push("-");
          } else {
            if (row.key === null) finalBody[i].push(null);
            else {
              value = this.data.body[i][row.key];
              finalBody[i].push(value);
            }
          }
        });
      });
      return finalBody;
    },
  },
  methods: {
    changeFilter(value, i) {
      this.filter[i] = value;
    },
    setSelectionLine(i) {
      const elm = this.$refs[`table-select_${i}`];
      if (this.$route.name == "dashboard") {
        if (elm) this.$store.commit("setLine", { key: "overview_table", value: `${elm[0].offsetTop + 118}px` });
        else this.$store.commit("setLine", { key: "overview_table", value: `55px` });
      } else if (this.$route.name == "searchprofile") {
        if (elm) this.$store.commit("setLine", { key: "searchprofile_table", value: `${elm[0].getBoundingClientRect().top + 42}px` });
        else this.$store.commit("setLine", { key: "searchprofile_table", value: `55px` });
      }
    },
    setToCreatename(e) {
      this.toCreateName = e;
    },
    createNew() {
      this.$emit("onCreateClick", { name: this.toCreateName });
    },
  },
  watch: {
    isActive(i) {
      this.$nextTick(function () {
        this.setSelectionLine(i);
      });
    },
    data() {
      this.filter = new Array(this.data.body.length).fill("");
    },
  },
  mounted() {
    this.setSelectionLine(this.isActive);
  },
};
</script>

<style lang="scss">
.filter {
  &_header {
    margin: 0;
    margin-left: 15px;
    padding: 0;
    text-align: start;
    font-weight: 600;
  }

  &_table {
    width: 100%;
    max-width: 100%;
    padding-top: 0;

    &_wrapper {
      height: calc(100% - 20px);
      overflow: scroll;
    }

    &_input {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      gap: 25px;
      padding: 5px 20px;

      button {
        height: 32px;
        width: 32px;
      }
    }

    table {
      max-width: 100%;
    }

    thead {
      position: sticky;
      top: 0;
      left: 0;
      background-color: rgb(255, 255, 255);

      td {
        text-align: left;
        margin-top: 0;
        padding-top: 0;
      }
    }

    tbody {
      overflow: scroll;

      tr {
        cursor: pointer;
        transition: 0.2s all;
      }

      tr:nth-child(even) {
        background-color: $light_company_blue;
      }

      td {
        text-align: left;
        padding: 5px 10px;
        max-width: 175px;
        min-width: 25px;
        min-height: 150px !important;

        h2 {
          margin: 0;
        }

        p {
          margin: 1rem;
          white-space: nowrap;
          max-height: 150px;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }
  }
}

.filter_table_activeRow {
  background-color: $company_blue !important;
  color: aliceblue;
}

.tableContainer {
  height: 100%;
  border-radius: 10px;
}
</style>
