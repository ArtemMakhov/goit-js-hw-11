

import { fetchImages , resetPages} from "./js/fetch-images";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

form.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click',onClickLoadMoreBtn);
const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt', captionsDelay: 250,
})
let searchText = '';
async function onFormSubmit(e) {
    e.preventDefault();
    clearCardsContainer();
    resetPages();
    searchText = e.currentTarget.searchQuery.value.trim();
    console.log(searchText);
    const {hits} = await fetchImages(searchText);
    
    e.target.reset();
    if (hits.length === 0) {
        console.log("dsfd")
    }

    renderCards(hits);
    lightbox.refresh();
}


function renderCards(cards) {
    gallery.insertAdjacentElement('beforeend',createCardsMarkup(cards))
}

function createCardsMarkup(cards) {
    return cards.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `<div class="photo-card">
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
    }).join('');
}


function clearCardsContainer() {
    gallery.innerHTML = '';
}

async function onClickLoadMoreBtn() {
    const { hits } = await fetchImages(searchText);
    renderCards(hits);
    lightbox.refresh();
}


