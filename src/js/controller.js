const urlSushi = 'https://api.yelp.com/v3/businesses/search?location=singapore&categories=sushi, All';

async function fetchData(url) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        // 'Content-Type': 'application/json',
        // 'x-requested-with': 'xmlhttprequest',
        // 'Access-Control-Allow-Origin': '*',
        Authorization:
          'Bearer XbwVX7w36FwIoJR-cLgnNHErUzWI0SBOAUJYoe0PTjpGuofzTpk0xDrogIA-zx4Q2cUClcg4AjVSe8o7khBxTumGTf5_co2YKzbgeHfGi9i9pbiL8zR6sqjZDJalYnYx',
      },
    });
    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.log(`Hey man! This city is not exist in my planet. Please choose again! 👽`);
  }
}
fetchData('https://cors-anywhere.herokuapp.com/' + urlSushi);
