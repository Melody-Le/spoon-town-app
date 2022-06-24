export const restaurantContent = document.querySelector('.restaurant-content');
const reviewContainer = document.querySelector('.review-container');
// console.log(restaurantContent.innerHTML);
// console.log(reviewContainer.innerHTML);

async function callApi(url) {
  const cors = 'https://melodycors.herokuapp.com/';
  const apiKey =
    'XbwVX7w36FwIoJR-cLgnNHErUzWI0SBOAUJYoe0PTjpGuofzTpk0xDrogIA-zx4Q2cUClcg4AjVSe8o7khBxTumGTf5_co2YKzbgeHfGi9i9pbiL8zR6sqjZDJalYnYx';
  const response = await fetch(cors + url, {
    method: 'GET',
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
      <div class="revew row p-3 bg-light rounded-5 my-3">
        <div class="col-2 user-identify">
          <img class="row user-image" src="${this.userProfilePhoto}" alt="progile-picture">
          <h4 class = "row user-name">${this.userName}</h4>
        </div> 
       <div class="col-9 align-content-center">
          <p class="user-rating">${this.userRating}</p>
          <p class = "user-comment">
          ${this.comment}
          </p>
          <p class="comment-time">${this.commentTime}</p>
          <li class="userProfile"><a href="${this.userProfileUrl}">User Profile</a></li>
        </div>
      </div>`;
    parentElm.insertAdjacentHTML('beforeend', html);
  }
}

export class Restaurant {
  constructor(data) {
    const address = Object.values(data.location.display_address).toString(' ');
    const title = data.categories.map(item => item.title).join(', ');
    const { latitude, longitude } = data.coordinates;
    const [photo1, photo2, photo3] = data.photos;
    //see the opening hourse later.
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
    <div class=" row g-3 p-1  justify-content-start">
        <div class="col-lg-6 ">
         <img class="restaurant-image" src="${this.photo2}" alt="restaurant-image-${this.id}">
        </div>
        <div class="col-lg-6">
          <img class="restaurant-image col-lg-2" src="${this.photo1}" alt="restaurant-image-${this.id}">
          <img class="restaurant-image col-lg-3" src="${this.photo3}" alt="restaurant-image-${this.id}">
          <h5 class="card-title restaurant-name">${this.restaurantName}</h5>
          <p class="card-text review"> Rating: ${this.rating}</p>
          <p class="card-text review"> Adress: ${this.address}</p>
          <p class="card-text review"> Phone: ${this.phone}</p>
          <li class = "btn bg-warning">
            <a href="${this.sourceUrl}">Click here for Table reservation</a>
          </li>
          <button class="btn btn-share bg-warning p-2 ">SHARE</button>
          <button class="btn btn-like bg-warning p-2">♥️</button>
          <button class="btn btn-pin  bg-warning p-2">📌</button>
        </div>
      </div>
      <div class="see-location text-center row-cols-lg-6">
        I AM MAP LOCATION - API MAP
      </div>`;
    parentElm.insertAdjacentHTML('beforeend', html);
  }
}

const idRestaurant = 'vVqxGrqt5ALxQjJGnntpKQ';

const renderReview = async function (idRestaurant) {
  const { reviews: data } = await callApi(
    `https://api.yelp.com/v3/businesses/${idRestaurant}/reviews`
  );
  // console.log(data.reviews);
  data.forEach(reviewCard => {
    const reviewUser = new Review(reviewCard);
    console.log(reviewUser);
    reviewUser.showReview(reviewContainer);
  });
};
renderReview(idRestaurant);
