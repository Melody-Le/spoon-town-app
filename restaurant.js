//NOTE: CLASS COMPONENT:
import RestaurantFilter from './filter.js';

console.log(RestaurantFilter);

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
