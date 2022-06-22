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

async function getRestaurantCatList() {
  const allCatList = await callApi('https://api.yelp.com/v3/categories');
  const { categories } = allCatList;
  const restaurantCatObj = categories.filter(item =>
    item.parent_aliases.includes('restaurants')
  );

  const restaurantCatList = restaurantCatObj.map(obj => obj.alias);
  console.log(restaurantCatList);
  restaurantCatList.forEach(categoryItem => {
    const filterHtml = `<p class="col-lg-2" >${categoryItem}</p>`;
    document
      .querySelector('.categories')
      .insertAdjacentHTML('beforeend', filterHtml);
  });
}

getRestaurantCatList();
