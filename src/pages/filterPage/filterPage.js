const toggleLoader = () => {
  const dom = document.getElementById("loader-container");
  dom.classList?.toggle("hidden");
};

// Ok
const callApi = async (url) => {
  const cors = "https://melodycors.herokuapp.com/";
  const apiKey =
    "XbwVX7w36FwIoJR-cLgnNHErUzWI0SBOAUJYoe0PTjpGuofzTpk0xDrogIA-zx4Q2cUClcg4AjVSe8o7khBxTumGTf5_co2YKzbgeHfGi9i9pbiL8zR6sqjZDJalYnYx";

  toggleLoader();

  const response = await fetch(`${cors}${url}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
  const json = await response.json();

  toggleLoader();

  return json;
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
      <div class="location mb-2 mx-2">
          <img class="location-icon" src="/src/img/icon-locaiton-topPick-white.svg" alt="icon-location">
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
  #restaurantName;
  #imageUrl;
  #rating;
  constructor(restaurant) {
    this.id = restaurant.id;
    this.#restaurantName = restaurant.name;
    this.#imageUrl = restaurant.image_url;
    this.#rating = restaurant.rating;
  }

  showRestaurantCard() {
    const starPercentage = `${(this.#rating / 5) * 100}%`;
    const htmlCard = `
      <div class="card d-inline-block mb-4">
        <a class="restaurant-card my-2" href="../restaurantPage/restaurantPage.html?id=${this.id}">
          <img
            src=${this.#imageUrl}
            class="card-img-top restaurant-image"
            alt="restaurant-image"
          />
          <div class="mx-2">
            <h6 class="restaurant-card-name mb-0 mt-3 mx-1">${this.#restaurantName}</h6>
            <div class="user-rating">
              <div class="stars-outer">
                <div class="stars-inner" style="width:${starPercentage}"></div>
              </div>
            </div>
          </div>
        </a>
      </div>
    `;
    return htmlCard;
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

    const navbarHeight = document.querySelector(".navbar").clientHeight;
    const restaurantCardContainerTop = restaurantCardContainer.offsetTop;
    const top = restaurantCardContainerTop - navbarHeight;
    window.scrollTo?.({
      top,
      behavior: "smooth", // smooth doesn't work for safari
    });
  } catch {
    restaurantCardContainer.innerHTML = "";
  }
};

// Ok
const onCategoriesClick = async (topPickPlaces) => {
  const location = await selectedLocation(topPickPlaces);
  renderFilterPage(location);
};

const toggleLocationContainer = (isForceHidden = false) => {
  const locationContainer = document.querySelector(".location-container");
  const overlayLayer = document.querySelector(".overlay");
  [locationContainer, overlayLayer].forEach((dom) => {
    if (isForceHidden) {
      dom.classList?.add("hidden");
    } else {
      dom.classList?.toggle("hidden");
    }
  });
};

// Ok
const addEventListeners = (topPickPlaces) => {
  document.querySelector(".search-location").addEventListener("click", () => {
    toggleLocationContainer();
  });

  document.addEventListener("keydown", (evnt) => {
    if (evnt.key === "Escape") toggleLocationContainer(true);
  });

  document.querySelector(".overlay").addEventListener("click", () => {
    toggleLocationContainer(true);
  });

  document.querySelector(".location-container").addEventListener("click", (evnt) => {
    const target = evnt.target;

    if (!target.classList.contains("location-name")) return;

    document.querySelector(".selected-location")?.classList?.remove("selected-location");
    target.classList.toggle("selected-location");
    onPlaceClicked(topPickPlaces);

    toggleLocationContainer(true);
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
