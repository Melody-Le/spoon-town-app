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

const locateCurentPosition = () =>
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

async function getLocation() {
  const [lat, long] = await locateCurentPosition();
  const urlRestaurant = `https://api.yelp.com/v3/businesses/search?categories=restaurants&latitude=${lat}&longitude=${long}`;
  console.log(urlRestaurant);
  const restaurantAPI = await callApi(urlRestaurant);
  const { businesses: restaurantObjList } = restaurantAPI;
  return restaurantObjList;
}
// getLocation().then(businesses => console.log(businesses));
async function getRestaurantCategories() {
  const restaurantObjList = await getLocation();
  // console.log(restaurantObjList);
  const restaurantCategories = restaurantObjList
    .map(obj => obj.categories)
    .flat()
    .map(item => item.title);
  restaurantCategories.forEach(categoryItem => {
    const filterHtml = `
      <li class="search-option-item">
        <a href="#" class = "search-nearby">
          ${categoryItem}
        </a>
      </li>`;
    filterCatContainer.insertAdjacentHTML('beforeend', filterHtml);
  });
}

function init() {
  getRestaurantCategories();
  getLocation();
  // const coords = getLocation();
  // console.log('COORDS got', coords);
  // step 1
  // step 2
  // step 3
}
init();
