import { addToCart, Restaurant, restaurantContent } from './restaurant.js';
addToCart('chicken', 2);

//select element:
const btnFilter = document.querySelector('.btn-filter');
const filterContainer = document.querySelector('.search-filter-box');
const filterCategoryContainer = document.querySelector(
  '.filter-catogery-container'
);
const searchPlaceContainer = document.querySelector('.search-option-container');
const restaurantCardContainer = document.querySelector('.container-card');
const errorContainer = document.querySelector('.error-container');
const changePage = document.querySelector('.change-page');
const selectedCard = document.querySelector('.card-body');

let selectedPlace;
const selectedCategories = [];
let selectedRestaurantId;

class RestaurantFilter {
  constructor(data) {
    const address = Object.values(data.location).toString();
    const title = data.categories.map(item => item.title).join(', ');
    this.id = data.id;
    this.restaurantName = data.name;
    this.image = data.image_url;
    this.sourceUrl = data.url;
    this.rating = data.rating;
    this.price = data.price;
    this.phone = data.phone;
    this.address = address;
    this.title = title;
  }

  showRestaurantCard(parentElm) {
    const html = `
    <div class="col-md-4 restaurant-card" id = "${this.id}">
      <div class="card" >
        <div class="card-body" id = "${this.id}">
          <img
          src=${this.image}
          class="card-img-top restaurant-image"
          alt=" restaurant-image"
          />
          <h5 class="card-title restaurant-name">${this.restaurantName}</h5>
          <p class="card-text review"> Review: ${this.rating}</p>
          <p class="card-text review"> ID: ${this.id}</p>
          <li class = "btn bg-warning">
            <a  href="#">READ MORE</a>
          </li>
          <button class = "change-page" id = "${this.id}">Go restaurant</button>
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
      <a href="#" class = " search-location search-top-pick">
        <img class="icon" src="./src/img/map-point-icon.svg" alt="icon Nearby">
        <p class = "location-name">${this.locationName}</p>
      </a>
      </li>`;
    parentElm.insertAdjacentHTML('beforeend', htmlTopPick);
  }
  getPosition() {
    const coords = [this.latitude, this.longitude];
    return coords;
  }
}

const renderError = () => {
  const html = `<p class = "text-center p-lg-4 bg-warning" id = "error">Please allow access your location to have better suggestion restaurant. <br> In the meantime, we will set your current Location is in Singapore </p>`;
  errorContainer.insertAdjacentHTML('beforeend', html);
  setTimeout(() => {
    const errorMessage = document.querySelector('#error');
    errorMessage.parentElement.removeChild(errorMessage);
  }, 3000);
};

const getLocation = async () => {
  await navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;
    const coords = [latitude, longitude];
    return coords;
  }, error());
};

const getCurrentLocaiton = async function () {
  try {
    const location = await getLocation();
    return location;
  } catch {
    renderError();
    const location = [1.2925005, 103.8547508];
    return location;
  }
};

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

const orchard = new topPickPlace('Ion Orchard', 1.304052, 103.831764);
const sentosa = new topPickPlace('Sentosa, Singapore', 1.249404, 103.830322);
const novena = new topPickPlace('Novena', 1.3203434, 103.8406453);
const hougang = new topPickPlace('Hougang', 1.3725948, 103.8915338);

const placeList = [orchard, sentosa, novena, hougang];

const renderTopPickSearch = () => {
  placeList.forEach(item => {
    item.showTopPickPlace(searchPlaceContainer);
  });
};

const setLocationNearby = async () => {
  const nearByLocation = await getCurrentLocaiton();
  selectedPlace = nearByLocation;
  showCategories(selectedPlace);
};

const setLocationTopPick = async e => {
  const userSelectPlace = e.target.textContent.toLowerCase();
  const getSelectedPlaceObj = placeList.find(
    place => place.locationName.toLowerCase() === userSelectPlace
  );
  const topPickLocation = getSelectedPlaceObj.getPosition();
  selectedPlace = topPickLocation;
  showCategories(selectedPlace);
};

const setLocation = async e => {
  e.target.style.color = 'Red';
  if (!e.target.classList.contains('location-name')) return;
  if (e.target.classList.contains('near-by')) {
    setLocationNearby();
    return;
  }
  setLocationTopPick(e);
};

const userSelectPlace = () => {
  searchPlaceContainer.addEventListener('click', setLocation);
};

const getRestaurantObjListByLocation = async function (location) {
  const [lat, long] = location;
  const urlRestaurant = `https://api.yelp.com/v3/businesses/search?categories=restaurants&latitude=${lat}&longitude=${long}`;
  const restaurantAPI = await callApi(urlRestaurant);
  const { businesses: restaurantObjList } = restaurantAPI;
  return restaurantObjList;
};

//NOTE: CATOGERIES:

const getCategories = async function (location) {
  const restaurantObjList = await getRestaurantObjListByLocation(location);
  const restaurantCategories = restaurantObjList
    .map(obj => obj.categories)
    .flat()
    .map(item => item.title);
  const catogeries = [...new Set(restaurantCategories)];
  return catogeries;
};

const showCategories = async function (location) {
  const categoriesList = await getCategories(location);
  categoriesList.forEach(categoryItem => {
    const filterHtml = `
      <li class="search-option-item">
        <a href="#" class = "search-categories">
          ${categoryItem}
        </a>
      </li>`;
    filterCategoryContainer.insertAdjacentHTML('beforeend', filterHtml);
  });
};

// Render Page:
const getFilterLink = async function (location, selectedCatogeriesList) {
  const [lat, long] = location;
  console.log(location);
  const selectedCategorytLink = selectedCatogeriesList?.reduce(
    (acc, cur) => `${acc}&categories=${cur}`
  );
  const updatedCategoryLink = `&categories=${selectedCategorytLink}`;
  const urlFilterLink = `https://api.yelp.com/v3/businesses/search?categories=restaurants&latitude=${lat}&longitude=${long}${updatedCategoryLink}`;
  return urlFilterLink;
};

const renderFilterPage = async function (filterLink) {
  const url = await getFilterLink(selectedPlace, filterLink);
  console.log(url);
  const resulf = await callApi(url);
  const { businesses: data } = resulf;
  console.log(data);
  data.forEach(resObj => {
    const restaurantCard = new RestaurantFilter(resObj);
    restaurantCard.showRestaurantCard(restaurantCardContainer);
  });
};

const userSelecCategoryList = e => {
  e.target.style.color = 'Red';
  if (!e.target.classList.contains('search-categories')) return;
  const catogeriesContent = e.target.textContent;
  selectedCategories.push(catogeriesContent.trim());
  renderFilterPage(selectedCategories);
};

const userAddCategories = () => {
  filterCategoryContainer.addEventListener('click', userSelecCategoryList);
};

//
// const getURL = e => {
//   console.log(e.target);
// };
// changePage.addEventListener('click', getURL);

const init = function () {
  // step 1: Window Load:
  renderTopPickSearch();
  // step 2
  userSelectPlace();

  // step 3
  userAddCategories();
};
init();

const renderRestaurant = async function (id) {
  const data = await callApi(`https://api.yelp.com/v3/businesses/${id}`);
  const restaurant = new Restaurant(data);
  restaurant.showRestaurantCard(restaurantContent);
};
// window.addEventListener('load', renderRestaurant(idRestaurant));
// const goRestaurant = () => {
//   window.location.href = 'https://www.pinterest.com/pin/304133781096232663/';
// };
// changePage.addEventListener('click', goRestaurant);

restaurantCardContainer.addEventListener('click', e => {
  const selectedRestaurant = e.target.closest('.restaurant-card');
  const id = selectedRestaurant?.getAttribute('id');
  selectedRestaurantId = id;
  renderRestaurant(id);
});

console.log(window.location.pathname);
