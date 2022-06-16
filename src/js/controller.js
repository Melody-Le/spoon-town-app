const url = 'https://api.yelp.com/v3/businesses/search?location=singapore&categories=sushi, All';
const apiKey =
  'XbwVX7w36FwIoJR-cLgnNHErUzWI0SBOAUJYoe0PTjpGuofzTpk0xDrogIA-zx4Q2cUClcg4AjVSe8o7khBxTumGTf5_co2YKzbgeHfGi9i9pbiL8zR6sqjZDJalYnYx';

async function fetchData(url) {
  const response = await fetch(url, {
    method: 'GET',
    // headers: {
    //   'Content-Type': 'application/json',
    //   'x-requested-with': 'xmlhttprequest',
    //   'Access-Control-Allow-Origin': '*',
    //   Authorization:
    //     'Bearer XbwVX7w36FwIoJR-cLgnNHErUzWI0SBOAUJYoe0PTjpGuofzTpk0xDrogIA-zx4Q2cUClcg4AjVSe8o7khBxTumGTf5_co2YKzbgeHfGi9i9pbiL8zR6sqjZDJalYnYx',
    // },

    headers: {
      accept: 'application/json',
      'x-requested-with': 'xmlhttprequest',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${apiKey}`,
    },
    data: {
      term: 'Bar',
      location: 'los angeles',
    },
  });
  const data = await response.json();
  console.log(data);
}
fetchData(url);
