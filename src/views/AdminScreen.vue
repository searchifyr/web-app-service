<!--
* < Concept-Name: AdminScreen >
* This file contains the admin-settings page. It's only visible for as administrator flagged 
account and serves as page where admins activate and deactivate other user accounts. Deactivated
accounts are unable to see or use all other functions.

This page is accessable for admins via tab on the left side (header-component).
* @author: anonymous
* @version 1.1
* @since   2023-23-01
-->

<template>
  <div class="content-layout">
    <div class="adminScreen">
      <h3>User Settings</h3>
      <div class="adminScreen_selection_wrapper">
        <div class="adminScreen_selection">
          <label>Show activated user</label>
          <InputToggle :toggleValue="showActivatedUser" @click="toggleShowActivatedUser" />
        </div>
        <div class="adminScreen_selection">
          <label>Show not activated user</label>
          <InputToggle :toggleValue="showNonActivatedUser" @click="toggleShowNonActivatedUser" />
        </div>
      </div>
      <h6 style="text-align: left">Click the icon to toggle the active state</h6>
      <div class="adminScreen_table">
        <TableComponent :data="tableData" @onElementClick="onElementClick" />
      </div>
    </div>
  </div>
</template>


<!--
* The Table-Component and inputToggle are seperatly defined to ensure similar layouts throughout the project
* The functinoalilty of the page lies within the toggle-buttons as well as in the click-event linked with the
equally named method.

-->
<script>
import api from "@/apiService.js";
import TableComponent from "@/components/TableComponent.vue";
import InputToggle from "@/components/Input/InputToggle.vue";

export default {
  name: "adminscreenView",
  components: {
    TableComponent,
    InputToggle,
  },
  data() {
    return {
      ActiveUserList: [],
      NonActiveUserList: [],
      showActivatedUser: true,
      showNonActivatedUser: true,
    };
  },
  computed: {
    tableData() {
      const header = [
        { name: "Name", isFilterable: true, key: "name" },
        { name: "User Id", isFilterable: true, key: "userid" },
        { name: " ", isFilterable: false, key: "access" },
      ];
      const body = [];

      if (this.showActivatedUser)
        this.ActiveUserList.forEach((user) => {
          if (user.role == "ADMIN") body.push({ name: user.name, userid: user.userId, access: "User is Admin" });
          else body.push({ name: user.name, userid: user.userId, access: "✅ - Click to deny Access" });
        });

      if (this.showNonActivatedUser)
        this.NonActiveUserList.forEach((user) => {
          body.push({ name: user.name, userid: user.userId, access: "❌ - Click to grand Access " });
        });

      return {
        header: header,
        body: body,
      };
    },
  },
  methods: {
     // Handles (de-)activation function using data from the store (/store/index.js) and simply toggling related values.
    onElementClick(e) {
      if (e.column == 2 && (e.data.access == "✅ - Click to deny Access" || e.data.access == "❌ - Click to grand Access ")) {
        this.toggleuserStauts(e.data.userid, e.data.access == "✅ - Click to deny Access" ? false : true);
      }
    },

    // Following 2 methods take the data coming directly from the backend, are being stored in the store and used here for display.
    toggleShowActivatedUser() {
      this.showActivatedUser = !this.showActivatedUser;
    },

    toggleShowNonActivatedUser() {
      this.showNonActivatedUser = !this.showNonActivatedUser;
    },

    // Toggling users is done by API-call followed by a store based function call that reloads the user related data.
    async toggleuserStauts(userId, active) {
      await api.put(`api/v1/users/${userId}/activate?activate=${active}`);
      this.fetchUserData();
    },
    async fetchUserData() {
      this.ActiveUserList = await api.get(`api/v1/users?activated=true`);
      this.NonActiveUserList = await api.get(`api/v1/users?activated=false`);
    },
  },
  async mounted() {
    this.fetchUserData();
  },
};
</script>

<style lang="scss">
.adminScreen {
  padding: 10px;
  width: 750px !important;
  margin: 0 auto;
  height: 100vh;

  &_table {
    height: 100%;
    overflow: scroll;
  }

  &_selection {
    display: flex;
    flex-direction: column;
    text-align: left;
    margin: 20px 5px;

    &_wrapper {
      display: flex;
      justify-content: flex-start;
      gap: 25px;
    }
  }

  &_row {
    margin: 10px;

    p {
      margin: 0;
      padding: 2px;
    }
    :nth-child(2) {
      cursor: pointer;
    }
    :nth-child(2):hover {
      background-color: $light_company_blue;
      border-radius: 5px;
    }
  }

  h3 {
    border: 2px $company_blue;
    border-style: none none solid none;
  }
}
</style>
