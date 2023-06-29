<template>
  <TableComponent :data="tableData" :isActive="selectedRow" @onElementClick="onElementClick"> </TableComponent>
</template>

<script>
import TableComponent from "@/components/TableComponent.vue";

export default {
  name: "MenuSelection",
  components: {
    TableComponent,
  },
  data() {
    return {
      selectedRow: -1,
    };
  },
  computed: {
    tableData() {
      let body = [];
      let header = [];

      header = [{ name: "Name", isFilterable: true, key: "name" }];
      body = [{ name: "Searchtypes" }, { name: "Searchfields" }, { name: "Threshold" }];

      return {
        header: header,
        body: body,
      };
    },
  },
  methods: {
    onElementClick(e) {
      this.$store.commit("setSettingId", e.row);
      this.selectedRow = e.row;
    },
  },
  mounted() {
    this.selectedRow = 0;
  },
};
</script>
