const btnFilter = document.querySelector('.btn-filter');
const filterContainer = document.querySelector('.search-filter-box');
const filterCatContainer = document.querySelector('.filter-catogery-container');

//FETCH DATA
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
function getLocation() {
  console.log('START GET LOCATION');
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      console.log('Getting coords');
      const { latitude, longitude } = position.coords;
      const coords = [latitude, longitude];
      // console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
      console.log(latitude, longitude);
      return coords;
    }, console.log('Cannot get coords'));
  }
}

async function search() {
  const restaurantByLocation = await urlRestaurant;
}

async function getRestaurantCatList() {
  const allCatList = await callApi(urlCat);
  const { categories } = allCatList;
  const restaurantCatObj = categories.filter(item => item.parent_aliases.includes('restaurants'));
  const restaurantBlackObj = restaurantCatObj.filter(item => item.country_blacklist.includes('SG'));
  const restaurantCatList = restaurantCatObj.map(obj => obj.alias);
  restaurantCatList.forEach(categoryItem => {
    const filterHtml = `
    <li class="search-option-item">
      <a href="#" class = "search-nearby">
        ${categoryItem}
      </a>
    </li>`;
    filterCatContainer.insertAdjacentHTML('beforeend', filterHtml);
  });
}
// getRestaurantCatList();

// async function getRestaurantBlackList() {
//   const allCatList = await callApi(urlCat);
//   const { categories } = allCatList;
//   const restaurantCatObj = categories.filter(item => item.parent_aliases.includes('restaurants'));
//   const restaurantBlackObj = restaurantCatObj.filter(item => item.country_blacklist.includes('SG'));
//   // const restaurantCatList = restaurantCatObj.map(obj => obj.alias);
//   console.log(restaurantBlackObj);
// }
// getRestaurantBlackList();

const showFilter = function () {
  btnFilter.classList.remove('hidden');
};
btnFilter.addEventListener('click', showFilter);

//NOTE: INIT
function init() {
  getRestaurantCatList();
  const coords = getLocation();
  console.log('COORDS got', coords);
  // step 1
  // step 2
  // step 3
}
init();
