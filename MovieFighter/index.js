// a configuration element that can be passed in createAutoComplete function
const autoCompleteConfig = {
  renderOption(movie) {
    const imgSrc = movie.Poster == "N/A" ? "" : movie.Poster     // handeling exception if no image for any data 
    return `
    <img src = "${imgSrc}"/>
    <h1>${movie.Title} (${movie.Year})</h1> 
    `;
  },
  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(searchTerm) {
    const response = await axios.get('http://www.omdbapi.com/', {
      params: {
        apikey: "22720820",
        s: searchTerm
      }
    });

    // If no input match found, return empty array
    if (response.data.Error) {
      return [];
    }

    //Return array of matched data
    console.log(response)
    return response.data.Search;
  }

}

// creating autoComplete using the reuseable function
// root is the division where the autocomlete needs to be created
//onOptionSelect is a helper function that tells what needs to be done once a item is selected
createAutoComplete(
  {
    ...autoCompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie) {
      document.querySelector(".tutorial").classList.add("is-hidden")
      onMovieSelect(movie, document.querySelector("#left-summary"), 'left');
    }
  });

createAutoComplete(
  {
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie) {
      document.querySelector(".tutorial").classList.add("is-hidden")
      onMovieSelect(movie, document.querySelector("#right-summary"), 'right');
    }
  });



let leftMovie;
let rightMovie;
// function to fetch more data once user select a movie
const onMovieSelect = async (movie, summaryTarget, side) => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: "22720820",
      i: movie.imdbID
    }
  });
  console.log(response);
  summaryTarget.innerHTML = movieRender(response.data);

  //assiginig data according to respective side 
  if (side == "left") {
    leftMovie = response.data;
    console.log(leftMovie)
  } else {
    rightMovie = response.data;
    console.log(rightMovie)
  }

  // comparing both side data
  if (leftMovie && rightMovie) {
    runComparision();
  }
};

//comparision function
const runComparision = () => {
  const leftSideStats = document.querySelectorAll('#left-summary .notification');
  const rightSideStats = document.querySelectorAll('#right-summary .notification');

  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];

    const leftSideValue = parseInt(leftStat.dataset.value);
    const rightSideValue = parseInt(rightStat.dataset.value);

    // changing the colour of feild to yellow
    if (leftSideValue > rightSideValue) {
      rightStat.classList.remove('is-primary');
      rightStat.classList.add('is-warning')
    } else {
      leftStat.classList.remove('is-primary');
      leftStat.classList.add('is-warning');
    }
  })

};

// Function to show the fetched movie details of selected movie
const movieRender = (movieData) => {

  //parsing the values that will be used while comparision and adding it in the DOM while it is created
  const dollars = parseInt(movieData.BoxOffice.replace(/\$/g, '').replace(/,/g, ''))
  const metascore = parseInt(movieData.Metascore);
  const imdbRating = parseFloat(movieData.imdbRating);
  const imdbVotes = parseInt(movieData.imdbVotes.replace(/,/g, ''));
  const awards = movieData.Awards.split(' ').reduce((prev, word) => {
    const value = parseInt(word);

    if (isNaN(value)) {
      return prev;
    }
    else {
      return prev + value;
    }
  }, 0);

  return `
    <article class = "media">
      <figure class = "media-left">
        <p class = "image">
            <img src = "${movieData.Poster}" />
        </p>
      </figure>
      <div class = "media-content">
        <h1>${movieData.Title}</h1>
        <h4>${movieData.Genre}</h4>
        <p>${movieData.Plot}</p>    
      </div>
    </article>
    <article data-value = ${awards} class = "notification is-primary">
    <p class = "title">${movieData.Awards}</p>
    <p class = "subtitle">Awards</p>
    </article>

    <article data-value = ${dollars} class = "notification is-primary">
    <p class = "title">${movieData.BoxOffice}</p>
    <p class = "subtitle">Box Office </p>
    </article>

    <article data-value = ${metascore} class = "notification is-primary">
    <p class = "title">${movieData.Metascore}</p>
    <p class = "subtitle">Metascore</p>
    </article>

    <article data-value = ${imdbRating} class = "notification is-primary">
    <p class = "title">${movieData.imdbRating}</p>
    <p class = "subtitle">IMDB Rating</p>
    </article>

    <article data-value = ${imdbVotes} class = "notification is-primary">
    <p class = "title">${movieData.imdbVotes}</p>
    <p class = "subtitle">IMDB votes</p>
    </article>
    `
}