// proxy server
const callApi = async (url) => {
  const cors = 'https://melodycors.herokuapp.com/';
  const apiKey =
    'XbwVX7w36FwIoJR-cLgnNHErUzWI0SBOAUJYoe0PTjpGuofzTpk0xDrogIA-zx4Q2cUClcg4AjVSe8o7khBxTumGTf5_co2YKzbgeHfGi9i9pbiL8zR6sqjZDJalYnYx';
  const response = await fetch(cors + url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
  return await response.json();
};
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
        <img class="icon" src="./img/map-point-icon.svg" alt="icon Nearby">
        <p class = "location-name">${this.locationName}</p>
      </a>
      </li>`;
    parentElm.insertAdjacentHTML('beforeend', htmlTopPick);
  }
  getPosition() {
    return {
      latitude: this.latitude,
      longitude: this.longitude,
    };
  }
}

const getTopPickPlaces = () => {
  const orchard = new topPickPlace('Ion Orchard', 1.304052, 103.831764);
  const sentosa = new topPickPlace('Sentosa, Singapore', 1.249404, 103.830322);
  const novena = new topPickPlace('Novena', 1.3203434, 103.8406453);
  const hougang = new topPickPlace('Hougang', 1.3725948, 103.8915338);
  console.log(orchard);
  const placeList = [orchard, sentosa, novena, hougang];
  return placeList;
};

const showTopPickLocation = () => {
  const searchPlaceContainer = document.querySelector(
    '.search-option-container'
  );
  const placeList = getTopPickPlaces();
  placeList.forEach((place) => {
    place.showTopPickPlace(searchPlaceContainer);
  });
};

const getTopLickLocation = async (evnt) => {
  const placeList = getTopPickPlaces(); //FIXME: I WANNA GET THE PLACELIST IN showTopPickLocation() funciton, but if I call it here, It will have error
  const target = evnt.target;
  const userSelectPlace = target.textContent.toLowerCase();
  const getSelectedPlaceObj = placeList.find(
    (place) => place.locationName.toLowerCase() === userSelectPlace
  );
  console.log(getSelectedPlaceObj.getPosition());
  return getSelectedPlaceObj.getPosition();
};

const getUserCurrentPosition = () => {
  return new Promise((resolved, rejected) =>
    navigator.geolocation.getCurrentPosition(resolved, rejected)
  );
};

const getCurrentLocation = async () => {
  try {
    const position = await getUserCurrentPosition();
    const { latitude, longitude } = position.coords;
    return { latitude, longitude };
  } catch (ex) {
    return {
      latitude: 1.2925005,
      longitude: 103.8547508,
    };
  }
};

const getRestaurantsByLocation = async (location) => {
  const { latitude, longitude } = location;
  const urlRestaurant = `https://api.yelp.com/v3/businesses/search?categories=restaurants&latitude=${latitude}&longitude=${longitude}`;
  const restaurantApi = await callApi(urlRestaurant);
  const { businesses } = restaurantApi;
  return businesses;
};

const getCategoriesByLocation = async (location) => {
  const restaurantObjList = await getRestaurantsByLocation(location);
  const restaurantCategories = restaurantObjList
    .map((obj) => obj.categories.map((category) => category.title))
    .flat();
  return [...new Set(restaurantCategories)];
};

const showCategories = (categories) => {
  const filterCategoryContainer = document.querySelector(
    '.filter-catogery-container'
  );
  categories.forEach((category) => {
    const filterHtml = `
      <li class="search-option-item">
        <a href="#" class="search-categories">
          ${category}
        </a>
      </li>
    `;
    filterCategoryContainer.insertAdjacentHTML('beforeend', filterHtml);
  });
};

const onNearByClicked = async () => {
  const currentUserLocation = await getCurrentLocation();
  const categories = await getCategoriesByLocation(currentUserLocation);
  showCategories(categories);
};

const onTopPickClicked = async (evnt) => {
  const selectedTopPickLocation = await getTopLickLocation(evnt);
  const categories = await getCategoriesByLocation(selectedTopPickLocation);
  showCategories(categories);
};

const addEventListeners = () => {
  document
    .querySelector('.search-option-container')
    .addEventListener('click', (evnt) => {
      const target = evnt.target;
      target.style.color = 'Red';

      if (!target.classList.contains('location-name')) return;
      if (target.classList.contains('near-by')) {
        onNearByClicked();
        return;
      }
      onTopPickClicked(evnt);
    });
};

const init = () => {
  showTopPickLocation();
  addEventListeners();
};
init();
