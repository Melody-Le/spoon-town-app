const btnFilter = document.querySelector('.btn-filter');
const filterContainer = document.querySelector('.search-filter-box');
const filterCatContainer = document.querySelector('.filter-catogery-container');
const searchPlaceContainer = document.querySelector('.search-option-container');
const restaurantCardContainer = document.querySelector('.container-card');

class RestaurantFilter {
  constructor(data) {
    const address = Object.values(data.location).toString();
    this.id = data.id;
    this.restaurantName = data.name;
    this.image = data.image_url;
    this.sourceUrl = data.url;
    this.rating = data.rating;
    this.price = data.price;
    this.phone = data.phone;
    this.address = address;
  }
  showRestaurantCard(parentElm) {
    const html = `
    <div class="col-md-4 ">
      <div class="card">
        <div class="card-body">
          <img
          src=${this.image}
          class="card-img-top restaurant-image"
          alt=" restaurant-image"
          />
          <h5 class="card-title restaurant-name">${this.restaurantName}</h5>
          <p class="card-text cotent">Address: ${this.address}</p>
          <p class="card-text review"> Review: ${this.rating}</p>
          
        </div>
      </div>
    </div>`;
    parentElm.insertAdjacentHTML('beforeend', html);
  }
}

class topPickPlace {
  constructor(locationName, latitude, longitude) {
    this.locationName = locationName;
    this.latitude = latitude;
    this.longitude = longitude;
  }
  showTopPickPlace(parentElm) {
    const htmlTopPick = `
      <li class="search-option-item">
      <a href="#" class = "search-top-pick">
        <img class="icon" src="./src/img/map-point-icon.svg" alt="icon Nearby">
        <p>${this.locationName}</p>
      </a>
      </li>`;
    parentElm.insertAdjacentHTML('beforeend', htmlTopPick);
  }
  getPosition(locationName) {
    const coords = [this.latitude, this.longitude];
    return coords;
  }
}
//get currentLocation:
const getLocation = () =>
  new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        const coords = [latitude, longitude];
        resolve(coords);
      },
      error => {
        console.log('Could not get your location, we will set location in Singapore');
        reject(error);
      }
    );
  });

//list of topPick Place:
// const nearBy =
const orchard = new topPickPlace('Ion Orchard', 1.304052, 103.831764);
const sentosa = new topPickPlace('Sentosa, Singapore', 1.249404, 103.830322);
const novena = new topPickPlace('Novena', 1.3203434, 103.8406453);
const hougang = new topPickPlace('Hougang', 1.3725948, 103.8915338);
const placeList = [orchard, sentosa, novena, hougang];

//show topPick list in filter box:
placeList.forEach(item => {
  item.showTopPickPlace(searchPlaceContainer);
});

// When user click topPick list => get the place name => get the Lat & long => put inside the APIlink
const getPlace = function () {
  searchPlaceContainer.addEventListener('click', e => {
    const placeName = e.target.textContent.toLowerCase();
    const selectedPlace = placeList.find(place => place.locationName.toLowerCase() === placeName);
    return selectedPlace;
  });
};
async function userSelectPlace() {
  const place = await getPlace();
  // console.log(place);
}

//NOTE: LINK API:
const urlAllSushi = 'https://api.yelp.com/v3/businesses/search?location=singapore&categories=sushi, All';
const urlSushiRestaurant = 'https://api.yelp.com/v3/businesses/XuxzGu2PEr59drHseZOVCg';
const urlCat = 'https://api.yelp.com/v3/categories';

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

//NOTE: get Location, return Restaurant Object List:
async function getRestaurantObjListByLocation() {
  const [lat, long] = await getLocation();
  // console.log(`https://www.google.com/maps/@${lat},${long}`);
  const urlRestaurant = `https://api.yelp.com/v3/businesses/search?categories=restaurants&latitude=${lat}&longitude=${long}`;
  const restaurantAPI = await callApi(urlRestaurant);
  const { businesses: restaurantObjList } = restaurantAPI;
  return restaurantObjList;
}

async function getCategories() {
  const restaurantObjList = await getRestaurantObjListByLocation();
  const restaurantCategories = restaurantObjList
    .map(obj => obj.categories)
    .flat()
    .map(item => item.title);
  const catogeries = [...new Set(restaurantCategories)];
  return catogeries;
}

async function showCategoriesList() {
  const categoriesList = await getCategories();
  categoriesList.forEach(categoryItem => {
    const filterHtml = `
      <li class="search-option-item">
        <a href="#" class = "search-nearby">
          ${categoryItem}
        </a>
      </li>`;
    filterCatContainer.insertAdjacentHTML('beforeend', filterHtml);
  });
}

const selectedCatList = [];
function selectCategoriesList(e) {
  const catSelect = e.target;
  const catContent = catSelect?.textContent;
  selectedCatList.push(catContent.trim());
  getRestaurantFilterLink(selectedCatList);
  renderFilterPage(selectedCatList);
}
function userAddCategories() {
  filterCatContainer.addEventListener('click', selectCategoriesList);
}

async function getRestaurantFilterLink(catLink) {
  const [lat, long] = await getLocation();
  const selectedCatLink = catLink?.reduce((acc, cur) => `${acc}&categories=${cur}`);
  const updatedCatLink = `&categories=${selectedCatLink}`;
  const urlFilterLink = `https://api.yelp.com/v3/businesses/search?categories=restaurants&latitude=${lat}&longitude=${long}${updatedCatLink}`;
  return urlFilterLink;
}

async function renderFilterPage(link) {
  const url = await getRestaurantFilterLink(link);
  const resulf = await callApi(url);
  const { businesses: data } = resulf;
  data.forEach(resObj => {
    const restaurantCard = new RestaurantFilter(resObj);
    restaurantCard.showRestaurantCard(restaurantCardContainer);
  });
}

function init() {
  // step 1
  userSelectPlace();
  showCategoriesList();
  // step 2
  userAddCategories();
  // renderFilterPage();
  // step 3
}
init();
