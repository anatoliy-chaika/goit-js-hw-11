import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
// https://pixabay.com/api/?key=32953731-49831efe322ba9b62a64ecdff&q=cat&image_type=photo&orientation=horizontal&safesearch=true

const formRef = document.querySelector('.search-form');
const loadBtn = document.querySelector('.load-more');
const divRef = document.querySelector('.gallery');
let page = 1;

loadBtn.hidden = true;

// console.log(formRef);

formRef.addEventListener('submit', getInfo);
const inputValue = formRef.elements.searchQuery.value;
function getInfo(e) {
  e.preventDefault();
  const {
    elements: { searchQuery },
  } = e.target;
  const inputValue = searchQuery.value;
  if (inputValue.trim() === '') {
    return;
  }
  divRef.innerHTML = '';
  getResp(inputValue, (page = 1))
    .then(data => {
      if (data.data.hits.length === 0) {
        loadBtn.hidden = true;
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      Notiflix.Notify.info(`Hooray! We found ${data.data.totalHits} images.`);
      createMarcup(data.data.hits);
      loadBtn.hidden = false;
    })
    .catch(error => console.log(error.message));
}

async function getResp(name, page) {
  const KEY = '32953731-49831efe322ba9b62a64ecdff';
  const response = await axios.get(
    `https://pixabay.com/api/?key=${KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
  );

  return response;
}

function createMarcup(array) {
  const markup = array
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
       ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div>`
    )
    .join('');
  divRef.insertAdjacentHTML('beforeend', markup);
}

loadBtn.addEventListener('click', loadMore);

function loadMore() {
  page += 1;

  getResp(formRef.elements.searchQuery.value, page)
    .then(data => {
      createMarcup(data.data.hits);

      if (divRef.children.length >= data.data.totalHits) {
        loadBtn.hidden = true;
        Notiflix.Notify.info(
          `We're sorry, but you've reached the end of search results.`
        );
      }
    })
    .catch(error => console.log(error.message));
}
