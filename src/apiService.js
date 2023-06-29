import store from "./store";

const apiService = {
  async post(adress, payload) {
    const request = await fetch(process.env.VUE_APP_REDIRECT + `/${adress}`, {
      body: JSON.stringify(payload),
      method: "POST",
      credentials: "include",
      mode: "cors",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*=\s*([^;]*).*$)|^.*$/, "$1"),
      },
    });
    
    const response = await request.json();
    if (request.status >= 400) {
      console.log("throw error", response);
      this.setNotification(response);
    } else {
      return response;
    }
  },

  //temporary-workaround because backend-implimentation of api-key-request demands a different format
  async postString(adress, payload) {
    const request = await fetch(process.env.VUE_APP_REDIRECT + `/${adress}`, {
      body: payload,
      method: "POST",
      credentials: "include",
      mode: "cors",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "text/plain",
        "X-XSRF-TOKEN": document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*=\s*([^;]*).*$)|^.*$/, "$1"),
      },
    });
    
    const response = await request.json();
    if (request.status >= 400) {
      console.log("throw error", response);
      this.setNotification(response);
    } else {
      return response;
    }
  },
  
  async get(adress) {
    const request = await fetch(process.env.VUE_APP_REDIRECT + `/${adress}`, {
      method: "GET",
      credentials: "include",
    });
    const response = await request.json();
    if (request.status >= 400) {
      console.log("throw error", response);
      this.setNotification(response);
    } else {
      return response;
    }
  },
  async delete(adress) {
    const request = await fetch(process.env.VUE_APP_REDIRECT + `/${adress}`, {
      method: "DELETE",
      credentials: "include",
      mode: "cors",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*=\s*([^;]*).*$)|^.*$/, "$1"),
      },
    });
    const response = await request;
    if (request.status >= 400) {
      console.log("throw error", response);
      this.setNotification(response);
    } else {
      return response;
    }
  },
  async put(adress, payload) {
    const request = await fetch(process.env.VUE_APP_REDIRECT + `/${adress}`, {
      body: JSON.stringify(payload),
      method: "PUT",
      credentials: "include",
      mode: "cors",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*=\s*([^;]*).*$)|^.*$/, "$1"),
      },
    });
    const response = await request;
    if (request.status >= 400) {
      console.log("throw error", response);
      this.setNotification(response);
    } else {
      return response;
    }
  },


  setNotification(data) {
    store.commit("setNotification", data);
  },
};

export default apiService;
