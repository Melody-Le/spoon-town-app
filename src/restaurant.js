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
  constructor(data) {
    const { id, profile_url, image_url, name } = data.user;
    this.reviewId = data.id;
    this.reviewUrl = data.url;
    this.comment = data.text;
    this.userRating = data.rating;
    this.commentTime = data.time_created;
    this.userId = id;
    this.userProfileUrl = profile_url;
    this.userProfilePhoto = image_url;
    this.userName = name;
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
          <img class="user-image" src="${this.userProfilePhoto}" alt="profile-picture-${this.userId}">
          <h6 class="user-name text-center mt-md-5">${this.userName}</h6>
        </div> 
        <div class="col-md-10 ms-auto">
          <p class="user-rating">Rating: ${this.userRating}</p>
          <p class="user-comment">${this.comment}</p>
          <p class="comment-time">review time: ${this.commentTime}</p>
          <li class="userProfile"><a href="${this.userProfileUrl}">User Profile</a></li>
        </div>
      </div>
    `;
    parentElm.insertAdjacentHTML("beforeend", html);
  }
}

export class Restaurant {
  constructor(data) {
    const address = Object.values(data.location.display_address).toString(" ");
    const title = data.categories.map((item) => item.title).join(", ");
    const { latitude, longitude } = data.coordinates;
    const [photo1, photo2, photo3] = data.photos;
    this.id = data.id;
    this.restaurantName = data.name;
    this.image = data.image_url;
    this.photo1 = photo1;
    this.photo2 = photo2;
    this.photo3 = photo3;
    this.sourceUrl = data.url;
    this.rating = data.rating;
    this.price = data.price;
    this.phone = data.phone;
    this.address = address;
    this.title = title;
    this.latitude = latitude;
    this.longitude = longitude;
  }

  showRestaurantCard(parentElm) {
    const html = `
      <h1 class="card-title restaurant-name my-lg-2">${this.restaurantName}</h1>
      <div class="row gy-3 m-y-5">
        <div class="row align-items-stretch g-2 mt-3">
        <img class="restaurant-image col-md-4" src="${this.photo2}" alt="restaurant-image-${this.id}">
        <img class="restaurant-image col-md-4" src="${this.photo1}" alt="restaurant-image-${this.id}">
        <img class="restaurant-image col-md-4" src="${this.photo3}" alt="restaurant-image-${this.id}">
        </div>
        <div class="restaurant-information row gy-3 gx-2 justify-content-between">
          <div class="detail-restaurant col-6">
            <h3>Detail</h3>
            <p class="card-text review">Rating: ${this.rating}</p>
            <p class="card-text review">Adress: ${this.address}</p>
            <p class="card-text review">Phone: ${this.phone}</p>
            <p class="card-text review">Cuisine: ${this.title}</p>
            <div class="other-button">
              <li class = "btn btn-go-page p-2">
                <a class="page-url" href="${this.sourceUrl}">MAKE A RESERVATION</a>
              </li>
              <button class="btn btn-share p-2">SHARE</button>
              <button class="btn btn-like p-2">♥️</button>
              <button class="btn btn-pin p-2">📌</button>
            </div>
          </div>
          <div class="see-map col-6">
            I AM MAP LOCATION - API MAP
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
  const { reviews: data } = await callApi(
    `https://api.yelp.com/v3/businesses/${restaurantId}/reviews`
  );
  data.forEach((reviewCard) => {
    const reviewUser = new Review(reviewCard);
    reviewUser.showReview(reviewContainer);
  });
};

const renderRestaurant = async function (idRestaurant) {
  const restaurantContent = document.querySelector(".restaurant-content");
  const data = await callApi(
    `https://api.yelp.com/v3/businesses/${idRestaurant}`
  );
  const restaurant = new Restaurant(data);
  restaurant.showRestaurantCard(restaurantContent);
};

const init = () => {
  const restaurantId = params.id;
  renderReview(restaurantId);
  renderRestaurant(restaurantId);
};
init();
