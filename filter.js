const btnFilter = document.querySelector('.btn-filter');
const filterContainer = document.querySelector('.search-filter-box');
const filterCatContainer = document.querySelector('.filter-catogery-container');

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

//NOTE: get Location, return Restaurant Object List:
async function getRestaurantObjListByLocation() {
  const [lat, long] = await getLocation();
  const urlRestaurant = `https://api.yelp.com/v3/businesses/search?categories=restaurants&latitude=${lat}&longitude=${long}`;
  // console.log(urlRestaurant);
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
class restaurant {
  constructor() {
    this.lat = lat;
    this.long = long;
  }
}
const selectedCat = ['Dim Sum', 'Seafood', 'Noodels'];
const resObj = {
  lat: '1.3485673',
  long: '103.8507789',
};

async function getRestaurantFilterLink() {
  const [lat, long] = await getLocation();
  const selectedCatLink = selectedCat.reduce((acc, cur) => `${acc}&categories=${cur}`);
  const updatedCatLink = `&categories=${selectedCatLink}`;
  const urlFilterLink = `https://api.yelp.com/v3/businesses/search?categories=restaurants&latitude=${lat}&longitude=${long}${updatedCatLink}`;
  console.log(urlFilterLink);
  return urlFilterLink;
}

const selectCategoriesList = function (e) {
  const selectCategoriesList = [];
  const catSelect = e.target;
  const catContent = catSelect?.textContent;
  selectCategoriesList.push(catContent.trim());
  console.log(selectCategoriesList);
  return selectCategoriesList;
};
function userAddCategories() {
  filterCatContainer.addEventListener('click', selectCategoriesList);
}

function init() {
  showCategoriesList();
  userAddCategories();
  // step 1
  // step 2
  // step 3
}
init();
