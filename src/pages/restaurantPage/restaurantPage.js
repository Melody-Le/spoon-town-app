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
  return await response.json();
}

class Review {
  #reviewUrl;
  #comment;
  #rating;
  #commentTime;
  #userId;
  #userProfileUrl;
  #userProfilePhoto;
  #userName;
  constructor(reviewApi) {
    const { id, profile_url, image_url, name } = reviewApi.user;
    this.reviewId = reviewApi.id;
    this.#reviewUrl = reviewApi.url;
    this.#comment = reviewApi.text;
    this.#rating = reviewApi.rating;
    this.#commentTime = reviewApi.time_created;
    this.#userId = id;
    this.#userProfileUrl = profile_url;
    this.#userProfilePhoto = image_url;
    this.#userName = name;
  }
  showReview(parentElm) {
    const starPercentage = `${(this.#rating / 5) * 100}%`;
    const html = `
      <div class="review-container container">
        <div class="review row p-1 bg-light my-3">
          <div class="col-lg-2 col-md-2 user-identify ">
            <li class="userProfile">
              <a href="${this.#userProfileUrl}">
                <img class="user-image" src="${this.#userProfilePhoto}" alt="profile-picture-${this.#userId}" />
              </a>
            </li>
            <h6 class="user-name text-center">${this.#userName}</h6>
          </div>
          <div class="col-md-9 col-md-10 ms-auto py-2">
            <div class="user-rating">
              <div class="stars-outer">
                <div class="stars-inner" style="width:${starPercentage}"></div>
              </div>
              <p class="comment-time mx-3">${this.#commentTime}</p>
            </div>
            <p class="user-comment">${this.#comment}</p>
          </div>
        </div>
      </div>
    `;
    parentElm.insertAdjacentHTML("beforeend", html);
  }
}

class Restaurant {
  #idRestaurantApi;
  #rating;
  #restaurantName;
  #photo1;
  #photo2;
  #photo3;
  #sourceUrl;
  #phone;
  #address;
  #cuisine;
  #reviewCount;
  #latitude;
  #longitude;
  #isOpen;
  #isOpenNow;
  constructor(restaurantApi) {
    const address = Object.values(restaurantApi.location.display_address).join(", ");
    const title = restaurantApi.categories.map((item) => item.title).join(", ");
    const [photo1, photo2, photo3] = restaurantApi.photos;
    const { latitude, longitude } = restaurantApi.coordinates;
    const { is_open_now } = restaurantApi.hours[0];

    this.#idRestaurantApi = restaurantApi.id;
    this.#restaurantName = restaurantApi.name;
    this.#photo1 = photo1;
    this.#photo2 = photo2;
    this.#photo3 = photo3;
    this.#sourceUrl = restaurantApi.url;
    this.#rating = restaurantApi.rating;
    this.#phone = restaurantApi.phone;
    this.#address = address;
    this.#cuisine = title;
    this.#reviewCount = restaurantApi.review_count;
    this.#latitude = latitude;
    this.#longitude = longitude;
    this.#isOpen = is_open_now;
    this.#isOpenNow = this.#isOpen ? "Open now" : "Closed";
  }

  showRestaurantCard(parentElm) {
    const starPercentage = `${(this.#rating / 5) * 100}%`;
    const html = `
      <div class="my-4">
        <h2 class="restaurant-name">${this.#restaurantName}</h2>
        <div class="restaurant-review-information">
          <div class="user-rating">
            <div class="stars-outer">
              <div class="stars-inner" style="width:${starPercentage}"></div>
            </div>
          </div>
          <h6>${this.#reviewCount} review</h6>
        </div>
      </div>
      <div class="restaurant-image-container">
        <figure class="restaurant-image image-active">
          <img src="${this.#photo2}" alt="restaurant-image-${this.#idRestaurantApi}" />
        </figure>
        <figure class="restaurant-image">
          <img src="${this.#photo1}" alt="restaurant-image-${this.#idRestaurantApi}" />
        </figure>
        <figure class="restaurant-image">
          <img src="${this.#photo3}" alt="restaurant-image-${this.#idRestaurantApi}" />
        </figure>
      </div>
      <h3 class="mt-4">Detail</h3>
      <div class="row gy-3 gx-2">
        <div class="detail-restaurant col-lg-6">
          <div class="information">
            <img class="location-icon detail-icon" src="/src/img/icon-location-orange.png" alt="icon-location">
            <p class="my-auto">${this.#address}</p>
          </div>
          <div class="information">
            <img class="phone-icon detail-icon" src="/src/img/phone-icon.png" alt="icon-location">
            <p class="my-auto">${this.#phone}</p>
          </div>
          <div class="information">
            <img class="cuisine-icon detail-icon" src="/src/img/favicon.png" alt="icon-location">
            <p class="my-auto">Cuisine: ${this.#cuisine}</p>
          </div>
          <div class="information">
            <img class="open-now-icon detail-icon" src="/src/img/open-now-icon.png" alt="icon-location">
            <p class="my-auto">${this.#isOpenNow}</p>
          </div>
          <div class="other-button">
            <li class="btn btn-reservation">
              <a class="page-url" href="${this.#sourceUrl}">MAKE A RESERVATION</a>
            </li>
            <button class="btn btn-share"><i class="fas fa-share"></i></button>
            <button class="btn btn-like">&hearts;</button>
          </div>
        </div>
        <div class="col-lg-6" id="map">
        </div>
      </div>
    `;
    parentElm.insertAdjacentHTML("beforeend", html);
  }

  showMap() {
    const map = L.map("map").setView([this.#latitude, this.#longitude], 17);

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker([this.#latitude, this.#longitude])
      .addTo(map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          className: "leaflet-popup",
        })
      )
      .setPopupContent(`${this.#restaurantName}`)
      .openPopup();
  }
}

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

const renderReview = async (restaurantId) => {
  const reviewContainer = document.querySelector(".review-container");
  const { reviews } = await callApi(`https://api.yelp.com/v3/businesses/${restaurantId}/reviews`);
  reviews.forEach((reviewCard) => {
    const reviewUser = new Review(reviewCard);
    reviewUser.showReview(reviewContainer);
  });
};
const addEventListener = () => {
  document.querySelector(".restaurant-image-container").addEventListener("click", (evnt) => {
    const target = evnt.target;
    const oldActive = document.querySelector(".image-active");
    oldActive.classList.remove("image-active");
    target.parentElement.classList.add("image-active");
  });
  document.querySelector(".btn-like").addEventListener("click", (evnt) => {
    const target = evnt.target;
    target.classList.toggle("like");
  });
};

const renderRestaurant = async (restaurantId) => {
  const restaurantContainer = document.querySelector(".restaurant-container");
  const restaurantApi = await callApi(`https://api.yelp.com/v3/businesses/${restaurantId}`);
  const restaurant = new Restaurant(restaurantApi);
  restaurant.showRestaurantCard(restaurantContainer);
  addEventListener();
  restaurant.showMap();
};

const init = () => {
  const restaurantId = params.id;
  renderRestaurant(restaurantId);
  renderReview(restaurantId);
};
init();
