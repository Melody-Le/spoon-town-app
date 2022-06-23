//NOTE: CLASS COMPONENT:

class Review {
  constructor(data) {
    const { userId, userProfile, userImage, userName } = data.user;
    this.id = data.id;
    this.url = data.url;
    this.text = data.text;
    this.rating = data.rating;
    this.commentTime = data.time_created;
    this.userId = userId;
    this.userProfile = userProfile;
    this.userImage = userImage;
    this.userName = userName;
  }
  getUser() {
    userId = this.user.id;
    userProfile = this.user.profile_url;
    userImg = this.user.image_url;
    userName = this.user.name;
  }
  showReview(parentElm) {
    const html = ``;
    parentElm.insertAdjacentHTML('beforeend', html);
  }
}

const dataTest = {
  reviews: [
    {
      id: 'Mh787g_t95qFmfR1M0bLUw',
      url: 'https://www.yelp.com/biz/aoki-singapore?adjust_creative=rbeSuo_ANxoxRloALca3mA&hrid=Mh787g_t95qFmfR1M0bLUw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_reviews&utm_source=rbeSuo_ANxoxRloALca3mA',
      text: 'This is our favourite omakase sushi place in Singapore.\n\nThe counter seating is great and comfortable. With a good view of the chefs. We always have the...',
      rating: 5,
      time_created: '2021-07-06 03:54:08',
      user: {
        id: 'LNIHMh56lLl1dBGFCZShHQ',
        profile_url:
          'https://www.yelp.com/user_details?userid=LNIHMh56lLl1dBGFCZShHQ',
        image_url:
          'https://s3-media1.fl.yelpcdn.com/photo/rApRUDDXB1fy1r8WpHwwig/o.jpg',
        name: 'Michael H.',
      },
    },
    {
      id: 'x31DmKYo7KRNdCUrtrDKlw',
      url: 'https://www.yelp.com/biz/aoki-singapore?adjust_creative=rbeSuo_ANxoxRloALca3mA&hrid=x31DmKYo7KRNdCUrtrDKlw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_reviews&utm_source=rbeSuo_ANxoxRloALca3mA',
      text: "I came here for lunch recently and had a bougie time. The restaurant itself is intimate and quiet, and you'll feel pretty zen as you rest your wrists on the...",
      rating: 3,
      time_created: '2019-12-02 23:12:23',
      user: {
        id: 'cP4hNTBDlUTuWJlJGCtlhQ',
        profile_url:
          'https://www.yelp.com/user_details?userid=cP4hNTBDlUTuWJlJGCtlhQ',
        image_url:
          'https://s3-media4.fl.yelpcdn.com/photo/suMLURk5j7VSRUJwgmcqGA/o.jpg',
        name: 'Kirstin H.',
      },
    },
    {
      id: 'hTslxjWwwMY8dasCdwkvkg',
      url: 'https://www.yelp.com/biz/aoki-singapore?adjust_creative=rbeSuo_ANxoxRloALca3mA&hrid=hTslxjWwwMY8dasCdwkvkg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_reviews&utm_source=rbeSuo_ANxoxRloALca3mA',
      text: 'Had a solo lunch here, and got the Taian Bento ($88++), which came with sashimi, nimono, veggie tempura, sushi, miso soup, and dessert.\n\nI was really...',
      rating: 5,
      time_created: '2016-10-25 23:39:09',
      user: {
        id: 'SBVNVima7JWeA-6TXVvJbw',
        profile_url:
          'https://www.yelp.com/user_details?userid=SBVNVima7JWeA-6TXVvJbw',
        image_url:
          'https://s3-media3.fl.yelpcdn.com/photo/wpM5IU5eSnTJWvMZaKlAFA/o.jpg',
        name: 'Natalie H.',
      },
    },
  ],
  total: 27,
  possible_languages: ['en'],
};
