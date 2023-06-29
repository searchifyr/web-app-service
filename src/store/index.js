import { createStore } from "vuex";
import api from "@/apiService.js";

export default createStore({
  state: {
    applicationData: [],
    searchProfilesData: {},
    currentApplication: {},
    notifications: [],
    isDashboardApplicationFocus: true,
    isAuthenticated: false,
    userData: {},
    isGlobal: false,
    isUserSettingOpen: false,
    sampleSearch: { status: "init" },
    isSampleSearchOpen: false,
    lines: {},
    previousSearchprofiles: [],
    settingId: 0,
    profile: {},
    isActivated: false,
  },
  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
  },
  mutations: {
    setApplications(state, payload) {
      state.applicationData = payload;
    },
    setSearchProfiles(state, payload) {
      state.searchProfilesData = payload;
    },
    setCurrentApplication(state, payload) {
      state.currentApplication = payload;
    },
    setDashboardApplicationFocus(state, payload) {
      state.isDashboardApplicationFocus = payload;
    },
    setIsAuthenticated(state, payload) {
      state.isAuthenticated = payload;
    },
    setUserData(state, payload) {
      state.userData = payload;
    },
    setSampleSearch(state, payload) {
      state.sampleSearch = payload;
    },
    setUserSettingOpen(state, payload) {
      state.isUserSettingOpen = payload;
    },
    isSampleSearchOpen(state, payload) {
      state.isSampleSearchOpen = payload;
    },
    closeAllPopups(state) {
      state.isUserSettingOpen = false;
      state.isSampleSearchOpen = false;
    },
    setApplicationScope(state, payload) {
      state.isGlobal = payload;
    },
    setLine(state, payload) {
      state.lines[payload.key] = payload.value;
    },
    setPreviousSearchprofiles(state, payload) {
      state.previousSearchprofiles = payload;
    },
    addPreviousSearchprofiles(state, payload) {
      if (payload) {
        const i = state.previousSearchprofiles.findIndex((item) => item?.profileId == payload.profileId)

        if (i > -1)
          state.previousSearchprofiles.splice(i, 1)

        if (state.previousSearchprofiles.length > 2)
          state.previousSearchprofiles.splice(0, 1)

        state.previousSearchprofiles.push(payload);
        const jsonData = { data: state.previousSearchprofiles }
        localStorage.setItem("previousSearchprofiles", JSON.stringify(jsonData))
      }
    },
    removePreviousSearchprofiles(state, payload) {
      const i = state.previousSearchprofiles.findIndex((item) => item?.profileId == payload)

      if (i > -1)
        state.previousSearchprofiles.splice(i, 1)
      const jsonData = { data: state.previousSearchprofiles }
      localStorage.setItem("previousSearchprofiles", JSON.stringify(jsonData))
    },
    setSettingId(state, payload) {
      state.settingId = payload;
    },
    setProfile(state, payload) {
      state.profile = payload;
    },
    setNotification(state, payload) {
      state.notifications.push({ id: Math.floor(Math.random() * 999999999999), ...payload });
    },
    setIsActivatedTrue(state) {
      state.isActivated = true
    },
    destroyNotification(state, payload) {
      const index = state.notifications.findIndex((item) => item.id === payload);
      state.notifications.splice(index, 1);
    },
  },
  actions: {
    /**
     * Fetches a list of applications and stores it w/ 'setApplications'
     * @param {{commit: Function}} options
     * @param {boolean} isGlobal if false, only owned applications will be fetched. Otherwise only
     * non-owned applications (that the user have access to) will be fetched
     */
    fetchApplications({ commit }, isGlobal = this.state.isGlobal) {
      api
        .get(`api/v1/applications?ownApplications=${!isGlobal}`)
        .then((data) => {
          commit('setApplications', data)
        })
        .catch((e) => {
          commit("setNotification", e)
        });
    },
    fetchcurrentApplication({ commit }, id = null) {
      api
        .get(`api/v1/applications/${id}`)
        .then((data) => {
          commit('setCurrentApplication', {}) // Force rerender
          commit('setCurrentApplication', data)
        })
        .catch((e) => {
          commit("setNotification", e)
        });
    },
    fetchSearchprofiles({ commit }, id = null) {
      if (id) {
        api
          .get(`api/v1/applications/${id}/searchprofiles`)
          .then((data) => {
            commit('setSearchProfiles', {}) // Force rerender
            commit('setSearchProfiles', data)
          })
          .catch((e) => {
            commit("setNotification", e)
          });
      }
    }
  },
  modules: {},
});
