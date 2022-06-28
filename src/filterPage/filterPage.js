// Ok
const callApi = async (url) => {
  const cors = "https://melodycors.herokuapp.com/";
  const apiKey =
    "XbwVX7w36FwIoJR-cLgnNHErUzWI0SBOAUJYoe0PTjpGuofzTpk0xDrogIA-zx4Q2cUClcg4AjVSe8o7khBxTumGTf5_co2YKzbgeHfGi9i9pbiL8zR6sqjZDJalYnYx";
  const response = await fetch(`${cors}${url}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
  return await response.json();
};

// Ok
class TopPickPlace {
  #locationName;
  #latitude;
  #longitude;
  constructor(locationName, latitude, longitude) {
    this.#locationName = locationName;
    this.#latitude = latitude;
    this.#longitude = longitude;
  }
  showTopPickPlace(parentElm) {
    const htmlTopPick = `
      <div class="location mb-2">
          <img class="location-icon" src="../img/map-point-icon.svg" alt="icon-location">
          <p class="location-name mb-0">${this.#locationName}</p>
      </div>
    `;
    parentElm.insertAdjacentHTML("beforeend", htmlTopPick);
  }
  getPosition() {
    return {
      latitude: this.#latitude,
      longitude: this.#longitude,
    };
  }
  getLocation() {
    return this.#locationName;
  }
}

// Ok
class RestaurantFilter {
  #id;
  #restaurantName;
  #imageUrl;
  #rating;
  constructor(restaurant) {
    this.#id = restaurant.id;
    this.#restaurantName = restaurant.name;
    this.#imageUrl = restaurant.image_url;
    this.#rating = restaurant.rating;
  }
  showRestaurantCard() {
    return `
      <a class="restaurant-card my-2 border-0" id ="${this.#id}" href="../restaurantPage/restaurantPage.html?id=${this.#id}">
            <img
              src=${this.#imageUrl}
              class="card-img-top restaurant-image rounded-4"
              alt="restaurant-image"
            />
            <h6 class="restaurant-card-name mb-0 mt-1">${this.#restaurantName}</h6>
            <p class="restaurant-card-review mb-0"> Review: ${this.#rating}</p>
      </a>
    `;
  }
}

// Ok
const getTopPickPlaces = () => {
  const orchard = new TopPickPlace("Orchard", 1.304052, 103.831764);
  const sentosa = new TopPickPlace("Sentosa", 1.249404, 103.830322);
  const novena = new TopPickPlace("Novena", 1.3203434, 103.8406453);
  const hougang = new TopPickPlace("Hougang", 1.3725948, 103.8915338);
  return [orchard, sentosa, novena, hougang];
};

// Ok
const showTopPickLocation = (places) => {
  const searchPlaceContainer = document.querySelector(".location-container");
  places.forEach((place) => place.showTopPickPlace(searchPlaceContainer));
};

const getUserCurrentPosition = () => {
  return new Promise((resolved, rejected) => navigator.geolocation.getCurrentPosition(resolved, rejected));
};

// Ok
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

// Ok
const selectedLocation = async (topPickPlaces) => {
  const selectedLocationDom = document.querySelector(".selected-location").textContent;
  if (selectedLocationDom === "Nearby") {
    return await getCurrentLocation();
  }
  const { latitude, longitude } =
    topPickPlaces?.find((place) => place.getLocation() === selectedLocationDom)?.getPosition() || {};
  return { latitude, longitude }; // This is to ensure this function return same data format as in line 115
};

// Ok
const getRestaurantsByLocation = async (location) => {
  const { latitude, longitude } = location;
  const urlRestaurant = `https://api.yelp.com/v3/businesses/search?categories=restaurants&latitude=${latitude}&longitude=${longitude}`;
  const { businesses } = await callApi(urlRestaurant);
  return businesses;
};

// Ok
const getCategoriesByLocation = async (location) => {
  const restaurantObjList = await getRestaurantsByLocation(location);
  const restaurantCategories = restaurantObjList.map((obj) => obj.categories.map((category) => category.alias)).flat();
  return [...new Set(restaurantCategories)];
};

// Ok
const showCategories = (categories) => {
  const filterCategoryContainer = document.querySelector(".category-list");
  filterCategoryContainer.innerHTML =
    categories
      .map(
        (category) => `
          <div class="categories text-capitalize">
              ${category}
          </div>
        `
      )
      .join("") || "";
};

// Ok
const onPlaceClicked = async (topPickPlaces) => {
  const location = await selectedLocation(topPickPlaces);
  const categories = await getCategoriesByLocation(location);
  showCategories(categories);
};

// Ok
const getSelectedCategories = () => {
  return [...document.querySelectorAll(".selected-category")].map((categoryDom) => categoryDom.textContent.trim());
};

const getFilterLink = async function (location) {
  try {
    const { latitude, longitude } = location;
    const categories = await getSelectedCategories();
    const selectedCategorytLink = categories?.reduce((acc, cur) => `${acc}&categories=${cur}`);
    return `https://api.yelp.com/v3/businesses/search?categories=restaurants&latitude=${latitude}&longitude=${longitude}&term=${selectedCategorytLink}`;
  } catch (error) {
    console.log("Error is:", error);
  }
};

const renderFilterPage = async function (location) {
  const restaurantCardContainer = document.querySelector(".container-card");
  try {
    const url = await getFilterLink(location);
    const { businesses } = await callApi(url);
    const filterPageContent = businesses.map((resObj) => new RestaurantFilter(resObj).showRestaurantCard()).join("");

    restaurantCardContainer.insertAdjacentHTML("afterbegin", filterPageContent);
  } catch {
    restaurantCardContainer.innerHTML = "";
  }
};

// Ok
const onCategoriesClick = async (topPickPlaces) => {
  const location = await selectedLocation(topPickPlaces);
  renderFilterPage(location);
};

//FIXME: can you help me, how to clean code for 2 funciton below: toggleLocationCOntainer and closeLocationContainer.
const toggleLocationContainer = () => {
  const locationContainer = document.querySelector(".location-container");
  const overlayLayer = document.querySelector(".overlay");
  [locationContainer, overlayLayer].forEach((event) => {
    event.classList?.toggle("hidden");
  });
};

const closeLocationContainer = () => {
  const locationContainer = document.querySelector(".location-container");
  const overlayLayer = document.querySelector(".overlay");
  [locationContainer, overlayLayer].forEach((event) => {
    event.classList?.add("hidden");
  });
};

// Ok
const addEventListeners = (topPickPlaces) => {
  document.querySelector(".search-location").addEventListener("click", toggleLocationContainer);
  document.addEventListener("keydown", (evnt) => {
    if (evnt.key === "Escape") closeLocationContainer();
  });
  document.querySelector(".overlay").addEventListener("click", closeLocationContainer);

  document.querySelector(".location-container").addEventListener("click", (evnt) => {
    const target = evnt.target;

    if (!target.classList.contains("location-name")) return;

    document.querySelector(".selected-location")?.classList?.remove("selected-location");
    target.classList.toggle("selected-location");
    onPlaceClicked(topPickPlaces);

    closeLocationContainer();
    document.querySelector(".category-title").classList.remove("hidden");
  });

  document.querySelector(".category-list").addEventListener("click", (evnt) => {
    const target = evnt.target;
    if (!target.classList.contains("categories")) return;

    target.classList.toggle("selected-category");

    onCategoriesClick(topPickPlaces);
  });
};

const init = () => {
  const topPickPlaces = getTopPickPlaces();
  showTopPickLocation(topPickPlaces);
  addEventListeners(topPickPlaces);
};
init();
