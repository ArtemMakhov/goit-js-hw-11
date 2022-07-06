

import { fetchImages , resetPages} from "./js/fetch-images";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { showSuccessMessage } from "./js/messages";
import { showFailureMessage } from "./js/messages";



const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  scrollGuard:document.querySelector('.scroll-guard'),
}

refs.form.addEventListener('submit', onFormSubmit);


const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt', captionsDelay: 500,
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
    
    showFailureMessage();
  } 
  else {
    
        showSuccessMessage(totalHits);
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
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
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

