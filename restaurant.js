export const restaurantContent = document.querySelector('.restaurant-content');
const reviewContainer = document.querySelector('.review-container');

class Review {
  constructor(data) {
    const { userId, userProfile, userImage, userName } = data.review.user;
    this.id = data.id;
    this.url = data.url;
    this.text = data.text;
    this.userRating = data.rating;
    this.commentTime = data.time_created;
    this.userId = userId;
    this.userProfile = userProfile;
    this.userImage = userImage;
    this.userName = userName;
  }

  showReview(parentElm) {
    const html = `
      <div class="revew row p-3 bg-light rounded-5 my-3">
        <div class="col-1 user-identify">
          <img class="row user-image" src="${this.userImage}" alt="progile-picture">
          <h4 class = "row user-name">${this.userName}</h4>
        </div> 
       <div class="col-9 align-content-center">
          <p class="user-rating">${this.userRating}</p>
          <p class = "user-comment">
          ${this.text}
          </p>
          <p class="comment-time">${this.commentTime}</p>
          <li class="userProfile"><a href="${this.userProfile}">User Profile</a></li>
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

const idRestaurant = 'XuxzGu2PEr59drHseZOVCg';

const renderReview = async function (id) {
  const data = await callApi(
    `https://api.yelp.com/v3/businesses/${id}/reviews`
  );
  console.log(data.reviews);
  console.log(typeof data);
};
