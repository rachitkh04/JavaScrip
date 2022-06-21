// Making API call
const fetchData = async searchTerm => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: "22720820",
      s: searchTerm
    }
  });

  // If no input match found, return empty array
  if (response.data.Error){
    return [];
  }

  //Return array of matched data
  return response.data.Search;
};

// creating basic structure for autocomplete 
const root = document.querySelector('.autocomplete');
root.innerHTML=`
<label><b>Search for a movie</b></label>
<input class="input" />
<div class = "dropdown">
  <div class = "dropdown-menu">
    <div class = "dropdown-content">
      
    </div>
  </div>
</div>
`;

// selecting elements
const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown')
const result = document.querySelector('.dropdown-content')


const onInput = async event => {
  const movies = await fetchData(event.target.value);
  
  // closing dropdown if no data returned
  if (movies.length == 0){
    dropdown.classList.remove('is-active');
    return;
  }

  // resetting dropdown
  result.innerHTML = ``;

  // opening dropdown and adding data 
  dropdown.classList.add('is-active');
  for(let movie of movies){
    const anchor = document.createElement('a');
    anchor.classList.add('dropdown-item');
    const imgSrc = movie.Poster == "N/A" ? "" : movie.Poster     // handeling exception if no image for any data
    anchor.innerHTML = `
    <img src = "${imgSrc}"/>
    <h1>${movie.Title}</h1>
    `;
    result.appendChild(anchor);
  }
  console.log(movies)  // testing 
};

// closing dropdown if user clicks outside dropdown
document.addEventListener('click', event =>{
  if (!root.contains(event.target))
  {
    dropdown.classList.remove('is-active')
  }
})

// adding delay in hitting the API
input.addEventListener('input', debounce(onInput, 500));
