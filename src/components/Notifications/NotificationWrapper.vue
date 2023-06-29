<template>
  <div class="notifications_wrapper">
    <TransitionGroup name="notificationListAnimation">
      <NotificationComponent v-for="notification in notifications" :key="notification.id" :notification="notification" />
    </TransitionGroup>
  </div>
</template>

<script>
import { mapState } from "vuex";

import NotificationComponent from "@/components/Notifications/NotificationComponent.vue";

export default {
  name: "NotificationWrapper",
  components: {
    NotificationComponent,
  },
  computed: {
    ...mapState({
      notifications: (state) => state.notifications,
    }),
  },
};
</script>

<style lang="scss">
.notifications {
  &_wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 99;
    overflow: hidden;
    padding: 15px 0;
  }
}
.notificationListAnimation-move,
.notificationListAnimation-enter-active,
.notificationListAnimation-leave-active {
  transition: all 0.5s ease;
}

.notificationListAnimation-enter-from {
  opacity: 0;
  transform: translateY(110%);
}
.notificationListAnimation-leave-to {
  transform: translateX(110%);
  opacity: 0.75;
}
.notificationListAnimation-leave-active {
  position: absolute;
  width: 100%;
}
</style>
