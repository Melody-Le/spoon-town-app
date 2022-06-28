async function callApi(url) {
  const cors = "https://melodycors.herokuapp.com/";
  const apiKey =
    "XbwVX7w36FwIoJR-cLgnNHErUzWI0SBOAUJYoe0PTjpGuofzTpk0xDrogIA-zx4Q2cUClcg4AjVSe8o7khBxTumGTf5_co2YKzbgeHfGi9i9pbiL8zR6sqjZDJalYnYx";
  const response = await fetch(cors + url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
  const data = await response.json();
  return data;
}

class Review {
  // #reviewId;
  #reviewUrl;
  #comment;
  #userRating;
  #commentTime;
  #userId;
  #userProfileUrl;
  #userProfilePhoto;
  #userName;
  constructor(reviewApi) {
    const { id, profile_url, image_url, name } = reviewApi.user;
    // this.#reviewId = reviewApi.id;
    this.#reviewUrl = reviewApi.url;
    this.#comment = reviewApi.text;
    this.#userRating = reviewApi.rating;
    this.#commentTime = reviewApi.time_created;
    this.#userId = id;
    this.#userProfileUrl = profile_url;
    this.#userProfilePhoto = image_url;
    this.#userName = name;
  }
  getUserReview(user) {
    return {
      userId: user.id,
      userRating: user.rating,
      userText: user.text,
      commentTime: user.time_created,
    };
  }
  showReview(parentElm) {
    const html = `
      <div class="review-container container">
      <hr class="m-3 my-5">
      <div class="review row p-3 bg-light my-3">
        <div class="col-lg-2 col-sm-2 user-identify">
          <img class="user-image" src="${this.#userProfilePhoto}" alt="profile-picture-${this.#userId}">
          <h6 class="user-name text-center mt-md-5">${this.#userName}</h6>
        </div> 
        <div class="col-md-10 ms-auto">
          <p class="user-rating">Rating: ${this.#userRating}</p>
          <p class="user-comment">${this.#comment}</p>
          <p class="comment-time">review time: ${this.#commentTime}</p>
          <li class="userProfile"><a href="${this.#reviewUrl}">Click here for more Review</a></li>
          <li class="userProfile"><a href="${this.#userProfileUrl}">User Profile</a></li>
        </div>
      </div>
    `;
    parentElm.insertAdjacentHTML("beforeend", html);
  }
}

class Restaurant {
  #idRestaurantApi;
  #restaurantName;
  #photo1;
  #photo2;
  #photo3;
  #sourceUrl;
  #rating;
  #price;
  #phone;
  #address;
  #cuisine;
  constructor(restaurantApi) {
    const address = Object.values(restaurantApi.location.display_address).toString(" ");
    const title = restaurantApi.categories.map((item) => item.title).join(", ");
    const [photo1, photo2, photo3] = restaurantApi.photos;
    this.#idRestaurantApi = restaurantApi.id;
    this.#restaurantName = restaurantApi.name;
    this.#photo1 = photo1;
    this.#photo2 = photo2;
    this.#photo3 = photo3;
    this.#sourceUrl = restaurantApi.url;
    this.#rating = restaurantApi.rating;
    this.#price = restaurantApi.price;
    this.#phone = restaurantApi.phone;
    this.#address = address;
    this.#cuisine = title;
  }

  showRestaurantCard(parentElm) {
    const html = `
      <h1 class="restaurant-name my-3">${this.#restaurantName}</h1>
      <div class="row">
        <div class="row g-2">
          <img class="restaurant-image col-md-4" src="${this.#photo2}" alt="restaurant-image-${this.#idRestaurantApi}">
          <img class="restaurant-image col-md-4" src="${this.#photo1}" alt="restaurant-image-${this.#idRestaurantApi}">
          <img class="restaurant-image col-md-4" src="${this.#photo3}" alt="restaurant-image-${this.#idRestaurantApi}">
        </div>
        <div class="row gy-3 gx-2">
          <div class="detail-restaurant col-lg-6">
            <h3>Detail</h3>
            <p>Rating: ${this.#rating}</p>
            <p>Adress: ${this.#address}</p>
            <p>Price: ${this.#price}</p>
            <p>Phone: ${this.#phone}</p>
            <p>Cuisine: ${this.#cuisine}</p>
            <div class="other-button">
              <li class="btn p-2">
                <a class="page-url" href="${this.#sourceUrl}">MAKE A RESERVATION</a>
              </li>
              <button class="btn p-2">SHARE</button>
              <button class="btn p-2">♥️</button>
              <button class="btn p-2">📌</button>
            </div>
          </div>
          <div class="map-location col-lg-6">
            I AM API MAP TO SHOW LOCATION OF THIS RESTAURANT.
          </div>
        </div>
      </div>
    `;
    parentElm.insertAdjacentHTML("beforeend", html);
  }
}

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

const renderReview = async function (restaurantId) {
  const reviewContainer = document.querySelector(".review-container");
  const { reviews } = await callApi(`https://api.yelp.com/v3/businesses/${restaurantId}/reviews`);
  reviews.forEach((reviewCard) => {
    const reviewUser = new Review(reviewCard);
    reviewUser.showReview(reviewContainer);
  });
};

const renderRestaurant = async function (idRestaurant) {
  const restaurantContainer = document.querySelector(".restaurant-container");
  const restaurantApi = await callApi(`https://api.yelp.com/v3/businesses/${idRestaurant}`);
  const restaurant = new Restaurant(restaurantApi);
  restaurant.showRestaurantCard(restaurantContainer);
};

const init = () => {
  const restaurantId = params.id;
  renderRestaurant(restaurantId);
  renderReview(restaurantId);
};
init();
