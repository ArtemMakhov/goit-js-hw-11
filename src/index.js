

import { fetchImages , resetPages} from "./js/fetch-images";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from "notiflix";



const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  scrollGuard:document.querySelector('.scroll-guard'),
}

refs.form.addEventListener('submit', onFormSubmit);


const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt', captionsDelay: 250,
})

let searchText = '';


async function onFormSubmit(e) {
    e.preventDefault();
    clearCardsContainer();
    resetPages();
    searchText = e.currentTarget.searchQuery.value.trim();
    
    const {totalHits,hits} = await fetchImages(searchText);
    
    e.target.reset();
 
  
  if (hits.length === 0) {
    
    imagesFoundFailure();
  } 
  else {
    
        imagesFoundSuccess(totalHits);
    }

    renderCards(hits);
    lightbox.refresh();
}




function createCardsMarkup(cards) {
    return cards.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => 
       `<div class="photo-card">
        <a href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>${likes}</b>
    </p>
    <p class="info-item">
      <b>Views${views}</b>
    </p>
    <p class="info-item">
      <b>Comments${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads${downloads}</b>
    </p>
  </div>
  </a>
</div>`
    ).join('');
}

function renderCards(cards) {
  refs.gallery.insertAdjacentHTML('beforeend', createCardsMarkup(cards));
}


function clearCardsContainer() {
    refs.gallery.innerHTML = '';
}

async function onLoadMoreImg() {
    const { hits } = await fetchImages(searchText);
    renderCards(hits);
    lightbox.refresh();
}


function imagesFoundFailure() {
  Notify.failure('Sorry, there are no images matching your search query. Please try again.');
}

function imagesFoundSuccess(hits) {
  Notify.success(`Hooray! We found ${hits} images.`);
}


const options = {
  rootMargin: "500px",
  threshold: 1.0,
};
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
   
   if (searchText === '') {
      return;
    }
   
    if (entry.isIntersecting) {
       onLoadMoreImg();
      }
  });
}, options);
 
observer.observe(refs.scrollGuard);

