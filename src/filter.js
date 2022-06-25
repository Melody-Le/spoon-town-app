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
}

const getUserCurrentPosition = () => {
  return new Promise((resolved, rejected) =>
    navigator.geolocation.getCurrentPosition(resolved, rejected)
  );
}

const getCurrentLocation = async () => {
  try {
    const position = await getUserCurrentPosition();
    const { latitude, longitude } = position.coords;
    return { latitude, longitude };
  } catch(ex) {
    return {
      latitude: 1.2925005,
      longitude: 103.8547508
    }
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
    .map(obj => obj.categories.map(category => category.title))
    .flat();
  return [...new Set(restaurantCategories)];
};

const showCategories = (categories) => {
  const filterCategoryContainer = document.querySelector('.filter-catogery-container');
  categories.forEach(category => {
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
}

const addEventListeners = () => {
  document.querySelector('.search-option-container').addEventListener('click', (evnt) => {
    const target = evnt.target;
    target.style.color = 'Red';

    if (!target.classList.contains('location-name')) return;
    if (target.classList.contains('near-by')) {
      onNearByClicked();
      return;
    }
  })
}

const init = () => {
  addEventListeners()
};
init();
