const api = {
  hostname: 'http://127.0.0.1:3000',
  getProducts(category, paging) {
    return fetch(`${this.hostname}/products/${category}?paging=${paging}`).then(
      (response) => response.json()
    );
  },
  getCampaigns() {
    return fetch(`${this.hostname}/marketing/campaigns`).then((response) =>
      response.json()
    );
  },
  searchProducts(keyword, paging) {
    return fetch(
      `${this.hostname}/products/search?keyword=${keyword}&paging=${paging}`
    ).then((response) => response.json());
  },
  getProduct(id) {
    return fetch(`${this.hostname}/products/details?id=${id}`).then(
      (response) => response.json()
    );
  },
  checkout(data, jwtToken) {
    return fetch(`${this.hostname}/order/checkout`, {
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      }),
      method: 'POST',
    }).then((response) => response.json());
  },
  signin(data) {
    return fetch(`${this.hostname}/user/signin`, {
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      method: 'POST',
    }).then((response) => response.json());
  },
  signup(data) {
    return fetch(`${this.hostname}/user/signup`, {
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      method: 'POST',
    }).then((response) => response.json());
  },
  comment(data) {
    return fetch(`${this.hostname}/products/addcomment`, {
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      method: 'POST',
    }).then((response) => response.json());
  },
  getcomment(id) {
    return fetch(`${this.hostname}/products/user/getcomment?id=${id}`).then(
      (response) => response.json()
    );
  },
  getstar(id) {
    return fetch(`${this.hostname}/products/user/getstar?id=${id}`).then(
      (response) => response.json()
    );
  },
  getProfile(jwtToken) {
    return fetch(`${this.hostname}/user/profile`, {
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      }),
    }).then((response) => response.json());
  },
  getCollection(email) {
    return fetch(`${this.hostname}/user/collection/${email}`).then(
      (response) => response.json()
    );
  },
  deleteCollection(email,product_id) {
    return fetch(`${this.hostname}/user/collection/${email}/delete?pid=${product_id}`).then(
      (response) => response.json()
    );
  },
  addCollection(email,product_id) {
    return fetch(`${this.hostname}/user/collection/${email}/add?pid=${product_id}`).then(
      (response) => response.json()
    );
  },
  getDiscount(email) {
    return fetch(`${this.hostname}/user/discount/${email}`).then(
      (response) => response.json()
    );
  },
  searchDiscount(code) {
    return fetch(`${this.hostname}/user/search/discount/${code}`).then(
      (response) => response.json()
    );
  },
  deleteUsedDiscount(d_id) {
    return fetch(`${this.hostname}/user/delete/discount/delete?did=${d_id}`).then(
      (response) => response.json()
    );
  },
  sendEmail(email){
    return fetch(`${this.hostname}/user/sendResetPwdEmail`, {
      body: JSON.stringify(email),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      method: 'POST',
    }).then((response) => response.json());
  },
  resetPassword(password, jwt) {
    return fetch(`${this.hostname}/user/resetPassword/${jwt}`, {
      body: JSON.stringify({ password: password }),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      method: 'PUT',
    }).then((response) => response.json());
  },
  getLotteryResult(jwtToken) {
    return fetch(`${this.hostname}/marketing/lottery`,
      {
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        }),
      }).then(
        (response) => response.json());
  },
  updateDiscount(subtype, jwtToken) {
    return fetch(`${this.hostname}/marketing/updateLotteryEarned`,
      {
        body: JSON.stringify({ subtype: subtype }),
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        }),
        method: 'POST',
      }).then(
        (response) => response.json());
  },
};
