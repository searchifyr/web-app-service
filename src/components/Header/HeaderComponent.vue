<template>
  <div class="header_wrapper">
    <div class="header">
      <div class="header_leftSelection">
        <SearchifyrIcon @click="$router.push('/dashboard')" class="header_leftSelection_icon" />
        <h1>Searchifyr</h1>
        <select v-if="isActivated && showSelection">
          <option value="SP_1">SP 1</option>
          <option value="SP_2">SP 2</option>
          <option value="SP_3">SP 3</option>
        </select>
        <div class="header_menu_selection" v-if="isActivated">
          <span v-if="$route.name != 'home'" class="header_menu">
            <span class="header_menu_active" :style="markerPos.value"></span>
            <div :class="['header_menu_entry', { header_menu_entry_active: markerPos.id == 1 }]" @click="setApplicationScope(false)">My Applications</div>
            <div :class="['header_menu_entry', { header_menu_entry_active: markerPos.id == 2 }]" @click="setApplicationScope(true)">Other Applications</div>
            <div v-if="userData?.admin" :class="['header_menu_entry', { header_menu_entry_active: markerPos.id == 3 }]" @click="setApplicationScope(null)">Admin Settings</div>
          </span>
          <div class="previousSearchProfile">
            <span v-if="$route.name != 'home'" :class="{ previousSearchProfile_lowResWrapper: isSpaceLimited }">
              <TransitionGroup name="previousSearchProfile-list">
                <div
                  v-for="(item, index) in previousSearchprofiles"
                  :key="item.profileId"
                  :class="['previousSearchProfile_item', index == previousSearchprofiles.length - 1 && isViewSearchprofile ? 'previousSearchProfile_item_active' : '']"
                  @click="pushRoute(item.profileId, index)"
                >
                  {{ item?.name }}
                </div>
              </TransitionGroup>
            </span>
          </div>
        </div>
      </div>
      <div v-if="$route.name != 'home'" class="header_userIcon_wrapper">
        <p :class="['header_userIcon', isUserSettingOpen ? 'header_userIcon_active' : 'header_userIcon_inactive']" v-if="$route.name != 'home'" @click.stop="setUserSettingOpen">
          <img :src="userData?.pictureLink" />
        </p>
        <p class="header_userIcon_name">{{ userData?.userName }}</p>
        <Transition name="popup-left">
          <PopUp v-if="isUserSettingOpen" pos="bottom: 0; left: 0;" bounds="height: 95px; width: 250px;">
            <UserComponent />
          </PopUp>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/apiService.js";
import UserComponent from "@/components/Header/UserComponent.vue";
import PopUp from "@/components/PopUp.vue";
import { mapState } from "vuex";

import SearchifyrIcon from "@/assets/Icons/SearchifyrIcon.vue";

export default {
  name: "HeaderComponent",
  components: {
    UserComponent,
    SearchifyrIcon,
    PopUp
  },
  props: {
    showSelection: { type: Boolean, default: true }
  },
  data() {
    return {
      previousSPplace: 0,
      isSpaceLimited: false
    };
  },
  computed: {
    markerPos() {
      const baseHeight = 112;
      if (this.isViewSearchprofile) return { value: `top: calc(100% - ${baseHeight - 12.5}px);`, id: 0 };
      else if (this.$route.name === "adminscreen") return { value: `top:${baseHeight * 2 - 15}px;`, id: 3 };
      else if (!this.isGlobal) return { value: `top:${12.5}px;`, id: 1 };
      else if (this.isGlobal) return { value: `top: ${baseHeight * 1}px;`, id: 2 };
      return null;
    },
    
    isViewSearchprofile() {
      return this.$route.name == "searchprofile";
    },

    ...mapState({
      userData: (state) => state.userData,
      isUserSettingOpen: (state) => state.isUserSettingOpen,
      isGlobal: (state) => state.isGlobal,
      previousSearchprofiles: (state) => state.previousSearchprofiles,
      currentApplication: (state) => state.currentApplication,
      isActivated: (state) => state.isActivated
    })
  },
  methods: {
    logout() {
      api.post("logout");
      this.$router.push("/");
    },

    setUserSettingOpen() {
      this.$store.commit("setUserSettingOpen", !this.isUserSettingOpen);
    },

    setApplicationScope(value) {
      if (value === null) this.$router.push("/adminscreen");
      else {
        this.$router.push("/dashboard");
        this.$store.commit("setApplicationScope", value);
        this.$store.commit("setCurrentApplication", {});
      }
    },
    setPreviousSP() {
      let json;

      // Check if the item got set correctly
      try {
        json = JSON.parse(localStorage.getItem("previousSearchprofiles"));
      } catch (e) {
        localStorage.removeItem("previousSearchprofiles");
      }

      if (json) {
        this.$store.commit("setPreviousSearchprofiles", json.data);
      }
    },
    isSpaceForOneElementInPreviousSearchProfiles() {
      if (window.innerHeight <= 740) this.isSpaceLimited = true;
      else this.isSpaceLimited = false;
    },

    async pushRoute(id, place) {
      this.previousSPplace = this.previousSearchprofiles.length - 1 - place;
      if (await this.checkSearchProfile(id))
        this.$router.push({
          name: "searchprofile",
          params: { searchprofile: id }
        });
      else {
        this.$store.commit("removePreviousSearchprofiles", id);
      }
    },

    // if the SP isent reachable it will be removed
    async checkSearchProfile(id) {
      const res = await api.get(`api/v1/searchprofiles/${id}`);
      return res;
    },

    async getUserData() {
      if (this.userData) {
        const request = api.get("api/v1/users/login/status");
        const status = { ...(await request) };
        this.$store.commit("setIsAuthenticated", status.authenticated);
        this.$store.commit("setUserData", status);

        if (status.authenticated) {
          if (status.activated) {
            this.$store.commit("setIsActivatedTrue");
            if (this.$route.name == "userIsNotActivatedView") this.$router.push("/dashboard");
          } else {
            this.$router.push("/userIsNotActivatedView");
          }
        } else {
          this.$router.push("/");
        }
      }
    }
  },
  mounted() {
    this.setPreviousSP();
    this.getUserData();
    this.isSpaceForOneElementInPreviousSearchProfiles();
    addEventListener("resize", this.isSpaceForOneElementInPreviousSearchProfiles);
  }
};
</script>

<style lang="scss">
.header {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100% - 2vh);
  padding: 1vh 25px;
  color: $ligth_font_color;
  font-weight: bold;

  &_wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 150px;
    height: 100vh;
    background-color: $company_blue;
    box-shadow: $darker_shadow;
    z-index: 10;
  }

  &_leftSelection {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 15px;
    height: 100%;

    &_icon {
      min-height: 50px;
    }

    h1 {
      margin: 0;
      color: #fffffffb;
      font-weight: bold;
      font-size: 1.6rem;
    }

    select {
      margin: auto;
      height: 50px;
      width: 500px;
    }

    img {
      width: 100%;
    }
  }

  &_menu {
    &_selection {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
    }

    &_entry {
      margin: 15px 0;
      height: 36px;
      padding: 20px 10px;
      border: 3px #ffffff00;
      border-radius: 3px;
      border-style: solid none;
      font-size: 0.8rem;
      font-weight: bolder;
      transition: all 0.1s;

      &_active {
        background-color: $active_light_company_blue;
        box-shadow: none;
        border: 3px #ffffff00;
        border-radius: 3px;
        border-style: solid none;
        color: $dark_font_color;
      }

      &:hover {
        border: 3px $light_company_blue;
        border-radius: 3px;
        border-style: solid none;
      }
    }

    &_active {
      position: absolute;
      left: -25px;
      width: calc(100% + 50px);
      height: 86px;
      background-color: $active_light_company_blue;
      color: $dark_font_color;
      transition: all 0.3s;
      z-index: -1;

      &::after {
        content: ">";
        position: absolute;
        top: 0;
        right: 5px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-weight: bolder;
        font-size: 1.2rem;
      }
    }
  }

  &_userIcon {
    cursor: pointer;
    user-select: none;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
    font-size: 2rem;
    transition: 0.5s all;
    z-index: 9;

    img {
      width: 40px;
      height: 40px;
      border-radius: 5px;
    }

    &_wrapper {
      margin: 0 auto;
    }

    &_active {
      background-color: #e4e4e400;
      border-radius: 0;
      box-shadow: none;
      transform: translateX(175px);

      &:hover {
        background-color: #e4e4e400;
        box-shadow: none;
      }
    }

    &_inactive {
      border-radius: 7px;

      &:hover {
        background-color: #e4e4e48f;
        box-shadow: 0 0 4px 4px #e4e4e452;
      }
    }

    &_name {
      margin-top: 40px;
      font-size: 0.8rem;
    }

    &_wrapper {
      position: relative;
      width: 75px;
    }
  }
}

.previousSearchProfile {
  display: flex;
  flex-direction: column;

  &_lowResWrapper {
    > div:not(:last-child) {
      display: none;
    }
  }

  &_item {
    margin: 15px 0;
    height: 36px;
    padding: 20px 10px;
    border: 3px #ffffff00;
    border-radius: 3px;
    border-style: solid none;
    font-size: 0.8rem;
    font-weight: bolder;
    transition: all 0.1s;

    &_active {
      background-color: $active_light_company_blue;
      box-shadow: none;
      border: 3px #ffffff00;
      border-radius: 3px;
      border-style: solid none;
      color: $dark_font_color;
    }

    &:hover {
      border: 3px $light_company_blue;
      border-radius: 3px;
      border-style: solid none;
    }
  }
}

.previousSearchProfile-list-move,
.previousSearchProfile-list-enter-active,
.previousSearchProfile-list-leave-active {
  transition: all 0.5s ease;
}

.previousSearchProfile-list-enter-from,
.previousSearchProfile-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.previousSearchProfile-list-leave-active {
  position: absolute;
}
</style>
