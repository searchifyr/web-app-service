<template>
  <div :class="['notifications_component', `notifications_component_type_${type}`]">
    <div class="notifications_component_text">
      <p>{{ message }} {{ status }}</p>
    </div>
    <div class="notifications_component_info">
      <p>{{ date }}</p>
    </div>
    <div class="notifications_component_delete" @click="destroyNotificaiton">X</div>
  </div>
</template>

<script>
import dates from "@/helper/dates";

export default {
  name: "NotificationComponent",
  props: {
    notification: {
      type: Object,
      default: () => {
        return { message: "no text" };
      },
    },
  },
  computed: {
    message() {
      if (!this.notification.message) return "There was an unexpected error.";
      return this.notification.message;
    },
    status() {
      if (this.notification.status >= 400) return this.notification.status;
      return "";
    },
    date() {
      if (this.notification.date || this.notification.timestamp) return dates.dateToDDMMYYYYHHMM(this.notification.date || this.notification.timestamp);
      return "";
    },
    type() {
      if (this.notification.type === "info") return "info";
      return "error";
    },
  },
  data() {
    return {
      timeout: null,
    };
  },
  methods: {
    destroyNotificaiton() {
      this.$store.commit("destroyNotification", this.notification.id);
    },
  },
  mounted() {
    this.timeout = setTimeout(() => {
      this.destroyNotificaiton();
    }, 10000);
  },
  beforeUnmount() {
    clearTimeout(this.timeout);
  },
};
</script>

<style lang="scss">
.notifications {
  &_component {
    position: relative;
    margin: 10px 25px;
    padding: 5px 10px;
    border-radius: 5px;
    box-shadow: 0 0 15px 5px #3b3b3b70;
    display: flex;
    flex-direction: column;

    &_text {
      text-align: start;
      font-weight: 600;
      margin: 5px 0;
    }
    &_info {
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
    }

    &_delete {
      position: absolute;
      cursor: pointer;
      top: 10px;
      right: 10px;
    }

    &_type {
      &_error {
        background-color: $error-red;
      }
      &_info {
        background-color: $succes-green;
      }
    }

    p {
      margin: 0;
    }
  }
}
</style>
