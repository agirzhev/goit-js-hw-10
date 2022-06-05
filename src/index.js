import '../src/css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce'

const DEBOUNCE_DELAY = 300;
let input = document.querySelector('#search-box')
let list = document.querySelector('.country-list')
let info = document.querySelector('.country-info')

function oneCountry(contries) {

  const objectLanguages = Object.entries(contries[0].languages);
  const objectFlags = Object.entries(contries[0].flags);

  let element = '<p class="contry-flag"><img src='+Object.values(objectFlags)[0][1]+' width="30" height="20" alt="flag">'+ '  ' +contries[0].name.common+'</p>'+
    '<p class="contry-capital">' + 'Capital: ' + contries[0].capital + '</p>' + 
    '<p class="contry-population">' + 'Population: ' + contries[0].population + '</p>' +
    '<p class="contry-languages">' + 'Languages: ' + Object.values(objectLanguages)[0][1] + '</p>';
  info.insertAdjacentHTML('beforeend', element);
    
}

function listCountries(contries) {
  
  contries.forEach(function callback(contry) {
    const objectFlags = Object.entries(contry.flags);
    console.log(objectFlags)
    let listInfo = '<p class="contry-flag"><img src='+Object.values(objectFlags)[0][1]+' width="30" height="20" alt="flag">'+ '  ' +contry.name.common+'</p>';
    list.insertAdjacentHTML('beforeend', listInfo);
  });

}

function clearCountries() {

  list.innerHTML = ''
  info.innerHTML = ''

}

input.addEventListener('input', debounce(userInput, DEBOUNCE_DELAY))
  
function userInput(event) {

  const userInputValue = event.target.value.trim()
  if (userInputValue === '') {
    clearCountries()
    return
  }
  
  fetchCountries(userInputValue)
    .then(contries => {

      if (contries.length === 1) {
        clearCountries()
        oneCountry(contries)
        
      } else if (contries.length > 10) {
        clearCountries()
        Notiflix.Notify.success('Too many matches found. Please enter a more specific name.')
      } else {
        clearCountries()
        listCountries(contries)
      } 
    })

    .catch(() => {
      console.log()
      Notiflix.Notify.failure('Oops, there is no country with that name');
    })    
  
  }
