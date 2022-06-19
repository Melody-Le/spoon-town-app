//NOTE: CLASS COMPONENT:
class Restaurant {
  constructor() {
    id = this.id;
    restaurantName = this.name;
    imageUrl = this.image_url;
    link = this.url;
    reviewCount = this.review_count;
    catogeries = this.categories[1].alias;
    rating = this.rating;
    address = this.location;
    phone = this.phone;
    distance = this.distance;
  }

  renderRestaurantFilter(parentElm) {
    const html = `        
    <div class="card">
    <div class="card-body">
      <img
      src=${this.imageUrl}
      class="card-img-top restaurant-image"
      alt=" restaurant-image"
    />
      <h5 class="card-title restaurant-name">${this.restaurantName}</h5>
      <p class="card-text cotent">${this.catogeries}</p>
      <p class="card-text review">${this.rating}</p>
    </div>
  </div>`;
    parentElm.insertAdjacentHTML('beforeend', html);
  }
  renderRestaurantPage(parentElm) {
    const html = `        
    <div class="card">
    <div class="card-body">
      <img
      src=${this.imageUrl}
      class="card-img-top restaurant-image"
      alt=" restaurant-image"
    />
      <h5 class="card-title restaurant-name">${this.restaurantName}</h5>
      <p class="card-text cotent">${this.catogeries}</p>
      <p class="card-text review">${this.rating}</p>
    </div>
  </div>`;
    parentElm.insertAdjacentHTML('beforeend', html);
  }
}
class Review {
  constructor() {
    id = this.id;
    url = this.url;
    text = this.text;
    rating = this.rating;
    timeCreate = this.time_created;
    user = this.user;
  }
  getUser() {
    userId = this.user.id;
    profileUrl = this.user.profile_url;
    userImg = this.user.image_url;
    userName = this.user.name;
  }
  showReview(parentElm) {
    const html = ``;
    parentElm.insertAdjacentHTML('beforeend', html);
  }
}

//CREATE DATA OBJECT AFTER FETCH URL:
const createRestaurantObj = function (data) {
  const { businesses } = data;
};

// document.getElementById('button').addEventListener('click', async () =>
//   const result = await callApi(urlAllSushi)
//   console.log(result);

// });
