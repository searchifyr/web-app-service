<template>
  <div class="content-layout">
    <h1>Welcome to Searchify</h1>
    <div class="homeview_loginbox" @click="gitHubLogin">
      <img class="homeview_loginbox_logo" src="@/assets/github_logo.png" />
      <p>Login with Github</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeView",
  computed: {
    githubUrl() {
      return `${process.env.VUE_APP_REDIRECT}/oauth2/authorization/github`;
    },
  },
  methods: {
    gitHubLogin() {
      window.location.href = this.githubUrl;
    },
  },
};
</script>

<style lang="scss">
.homeview {
  &_loginbox {
    box-shadow: $dark_shadow;
    width: 225px;
    margin: auto;
    display: flex;
    border-radius: 10px;
    background-color: $company_blue;
    cursor: pointer;
    transition: all 0.3s;

    &_logo {
      width: 80px;
      height: 80px;
      padding: 10px 10px 10px;
      filter: invert(1);
    }

    p {
      text-align: center;
      margin: auto 10px;
      font-weight: 700;
      text-decoration: none;
      color: white;
    }

    &:hover {
      background-color: $company_light_blue;
      box-shadow: $darker_shadow;
    }
  }
}
</style>
