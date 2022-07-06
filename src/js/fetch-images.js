import axios from 'axios';
import { showInfoMessage } from './messages';

export { fetchImages, resetPages }



axios.defaults.baseURL = 'https://pixabay.com/api/';


const KEY_API = '28371494-c5e29ef795b67968f0a2006d4';

let page = 1;

async function fetchImages(query) {
    
   try { const optionParam = new URLSearchParams({
        key: `${KEY_API}`,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesoarch: 'true',
        page: page,
        per_page: 40,
    });

    const{data} = await axios.get(
        `?${optionParam}`
    );
    
    page += 1;
    
    return data;
  
   } catch (error) {
       showInfoMessage()
     }
};

function resetPages() {
    page = 1;
};


