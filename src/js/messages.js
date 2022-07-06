import { Notify } from "notiflix";



export function showFailureMessage() {
  Notify.failure('Sorry, there are no images matching your search query. Please try again.');
}

export function showSuccessMessage(hits) {
  Notify.success(`Hooray! We found ${hits} images.`);
}

export function showInfoMessage() {
  Notify.info(`We're sorry, but you've reached the end of search results.`);
}