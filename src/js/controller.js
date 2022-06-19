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
        <div id="card-1" class="card">
          <div class="card-body">
            <img
            src=${this.imageUrl}
            class="card-img-top place-image"
            alt=" restaurant-image"
          />
            <h5 class="card-title place-name">${this.restaurantName}</h5>
            <p class="card-text cotent">${this.catogeries}</p>
            <p class="card-text review">${this.reviewCount}</p>
          </div>
        </div>
    `;
    parentElm.insertAdjacentHTML('beforeend', html);
  }
  renderRestaurantPage(parentElm) {
    const html = `
    <div id="card-1" class="card">
          <div class="card-body">
            <img
            src=${this.imageUrl}
            class="card-img-top place-image"
            alt=" restaurant-image"
          />
            <h5 class="card-title place-name">${this.restaurantName}</h5>
            <p class="card-text cotent">${this.catogeries}</p>
            <p class="card-text review">${this.reviewCount}</p>
          </div>
        </div>
    `;
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

//FETCH DATA
const urlAllSushi = 'https://api.yelp.com/v3/businesses/search?location=singapore&categories=sushi, All';
const urlSuShiPlace = 'https://api.yelp.com/v3/businesses/XuxzGu2PEr59drHseZOVCg';

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
  // console.log(data.businesses);
  return data;
}
callApi(urlAllSushi);

// document.getElementById('button').addEventListener('click', async () => {
//   const result = await callApi(urlAllSushi)
//   console.log(result);

// });

async function getAllSushi() {
  const sushiList = await callApi(urlAllSushi);
  const { businesses } = sushiList;
  console.log(businesses);
  // sushiList.map(item => console.log(item));
}
getAllSushi();

// function handlePermission() {
//   navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
//     if (result.state == 'granted') {
//       report(result.state);
//       // geoBtn.style.display = 'none';
//     } else if (result.state == 'prompt') {
//       report(result.state);
//       geoBtn.style.display = 'none';
//       navigator.geolocation.getCurrentPosition(revealPosition, positionDenied, geoSettings);
//     } else if (result.state == 'denied') {
//       report(result.state);
//     }
//     result.addEventListener('change', function () {
//       report(result.state);
//     });
//   });
// }

// function report(state) {
//   console.log('Permission ' + state);
// }

// handlePermission();
