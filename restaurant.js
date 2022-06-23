//NOTE: CLASS COMPONENT:
const reviewContainer = document.querySelector('.review-container');

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

  showReview(parentElm) {
    const html = `
      <div class="revew row p-3 bg-light rounded-5 my-3">
        <div class="col-1 user-identify">
          <img class="row user-image" src="${this.userImage}" alt="progile-picture">
          <h4 class = "row user-name">${this.userName}</h4>
        </div> 
       <div class="col-9 align-content-center">
          <p class="user-rating">${this.rating}</p>
          <p class = "user-comment">
          ${this.text}
          </p>
          <p class="comment-time">${this.commentTime}</p>
          <li class="userProfile"><a href="${this.userProfile}">User Profile</a></li>
        </div>
      </div>`;
    parentElm.insertAdjacentHTML('beforeend', html);
  }
}
