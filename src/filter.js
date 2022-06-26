const callApi = async (url) => {
  const cors = "https://melodycors.herokuapp.com/";
  const apiKey =
    "XbwVX7w36FwIoJR-cLgnNHErUzWI0SBOAUJYoe0PTjpGuofzTpk0xDrogIA-zx4Q2cUClcg4AjVSe8o7khBxTumGTf5_co2YKzbgeHfGi9i9pbiL8zR6sqjZDJalYnYx";
  const response = await fetch(cors + url, {
    method: "GET",
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
      <a href="#" class="search-location search-top-pick">
        <img class="icon" src="./img/map-point-icon.svg" alt="icon-location">
        <p class="location-name">${this.locationName}</p>
      </a>
      </li>
    `;
    parentElm.insertAdjacentHTML("beforeend", htmlTopPick);
  }
  getPosition() {
    return {
      latitude: this.latitude,
      longitude: this.longitude,
    };
  }
}

class RestaurantFilter {
  constructor(data) {
    const title = data.categories.map((item) => item.title).join(", ");
    this.id = data.id;
    this.restaurantName = data.name;
    this.image = data.image_url;
    this.rating = data.rating;
    this.title = title;
  }
  showRestaurantCard() {
    return `
      <a class="restaurant-card my-2" id ="${this.id}" href="./restaurant.html?id=${this.id}">
        <div class="card border-0">
            <img
              src=${this.image}
              class="card-img-top restaurant-image rounded-4"
              alt="restaurant-image"
            />
            <h6 class="restaurant-name">${this.restaurantName}</h6>
            <p class="review"> Review: ${this.rating}</p>
        </div>
      </a>
    `;
  }
}

const areaList = () => {
  const orchard = new topPickPlace("Orchard", 1.304052, 103.831764);
  const sentosa = new topPickPlace("Sentosa", 1.249404, 103.830322);
  const novena = new topPickPlace("Novena", 1.3203434, 103.8406453);
  const hougang = new topPickPlace("Hougang", 1.3725948, 103.8915338);
  const areaList = [orchard, sentosa, novena, hougang];
  return areaList;
};

const showTopPickLocation = () => {
  const searchPlaceContainer = document.querySelector(".search-option-container");
  const placeList = areaList();
  placeList.forEach((place) => {
    place.showTopPickPlace(searchPlaceContainer);
  });
};

const getTopLickLocation = async (evnt) => {
  const placeList = areaList();
  const target = evnt.target;
  const userSelectPlace = target.textContent.toLowerCase();
  const getSelectedPlaceObj = placeList.find((place) => place.locationName.toLowerCase() === userSelectPlace);
  return getSelectedPlaceObj.getPosition();
};

const getUserCurrentPosition = () => {
  return new Promise((resolved, rejected) => navigator.geolocation.getCurrentPosition(resolved, rejected));
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

const selectedLocation = async () => {
  const selectedLocation = document.querySelector(".selected-location").innerHTML;
  if (selectedLocation === "Nearby") {
    const currentLocation = await getCurrentLocation();
    return currentLocation;
  }
  const topPickList = areaList();
  const [location] = topPickList.filter((place) => place.locationName === selectedLocation);
  return location;
};

const getRestaurantsByLocation = async (location) => {
  const { latitude, longitude } = location;
  const urlRestaurant = `https://api.yelp.com/v3/businesses/search?categories=restaurants&latitude=${latitude}&longitude=${longitude}`;
  const restaurantApi = await callApi(urlRestaurant);
  const { businesses } = restaurantApi;
  console.log(businesses);
  return businesses;
};

const getCategoriesByLocation = async (location) => {
  const restaurantObjList = await getRestaurantsByLocation(location);
  const restaurantCategories = restaurantObjList.map((obj) => obj.categories.map((category) => category.alias)).flat();
  return [...new Set(restaurantCategories)];
};

const showCategories = (categories) => {
  const filterCategoryContainer = document.querySelector(".filter-catogery-container");
  const categoriesStr = categories
    .map((category) => {
      return `
      <div class="search-option-item categories">
        <div class="search-categories text-center">
          ${category}
        </div>
      </div>
    `;
    })
    .join("");
  filterCategoryContainer.innerHTML = categoriesStr;
};

const onPlaceClicked = async () => {
  const location = await selectedLocation();
  const categories = await getCategoriesByLocation(location);
  showCategories(categories);
};

//RENDER FILTER PAGE:
const getSelectedCategories = () => {
  const selectedCategories = document.querySelectorAll(".selected-category");
  const selectedCategoryList = [];
  selectedCategories.forEach((item) => {
    selectedCategoryList.push(item.innerHTML.trim());
  });
  return selectedCategoryList;
};

const getFilterLink = async function (location) {
  const { latitude, longitude } = location;
  const categories = await getSelectedCategories();
  const selectedCategorytLink = categories?.reduce((acc, cur) => `${acc}&categories=${cur}`);
  console.log(selectedCategorytLink);
  return `https://api.yelp.com/v3/businesses/search?categories=restaurants&latitude=${latitude}&longitude=${longitude}&categories=${selectedCategorytLink}`;
};

const renderFilterPage = async function (location) {
  const restaurantCardContainer = document.querySelector(".container-card");
  const url = await getFilterLink(location);
  const resulf = await callApi(url);
  console.log(url);
  const { businesses: data } = resulf;
  const filterPageContent = data
    .map((resObj) => {
      const restaurantCard = new RestaurantFilter(resObj);
      return restaurantCard.showRestaurantCard();
    })
    .join("");
  restaurantCardContainer.innerHTML = filterPageContent;
};

const onCategoriesClick = async () => {
  const location = await selectedLocation();
  renderFilterPage(location);
};

const addEventListeners = () => {
  document.querySelector(".search-option-container").addEventListener("click", (evnt) => {
    const target = evnt.target;
    if (!target.classList.contains("location-name")) return;
    document.querySelector(".selected-location")?.classList?.remove("selected-location");
    target.classList.toggle("selected-location");
    onPlaceClicked();
  });
  document.querySelector(".filter-catogery-container").addEventListener("click", (evnt) => {
    const target = evnt.target;
    if (!target.classList.contains("search-categories")) return;
    target.classList.toggle("selected-category");
    onCategoriesClick(evnt);
  });
};

const init = () => {
  showTopPickLocation();
  addEventListeners();
};
init();
