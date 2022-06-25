createAutoComplete(
  {
    root: document.querySelector('.autocomplete'),
    renderOption(movie) {
      const imgSrc = movie.Poster == "N/A" ? "" : movie.Poster     // handeling exception if no image for any data 
      return `
    <img src = "${imgSrc}"/>
    <h1>${movie.Title} (${movie.Year})</h1> 
    `;
    },
    onOptionSelect(movie) {
      onMovieSelect(movie);
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
  });

// function to fetch more data once user select a movie
const onMovieSelect = async movie => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: "22720820",
      i: movie.imdbID
    }
  });
  console.log(response);
  document.querySelector("#summary").innerHTML = movieRender(response.data);
}

// Function to show the fetched movie details of selected movie
const movieRender = (movieData) => {
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
    <article class = "notification is-primary">
    <p class = "title">${movieData.Awards}</p>
    <p class = "subtitle">Awards</p>
    </article>

    <article class = "notification is-primary">
    <p class = "title">${movieData.BoxOffice}</p>
    <p class = "subtitle">Box Office </p>
    </article>

    <article class = "notification is-primary">
    <p class = "title">${movieData.Metascore}</p>
    <p class = "subtitle">Metascore</p>
    </article>

    <article class = "notification is-primary">
    <p class = "title">${movieData.imdbRating}</p>
    <p class = "subtitle">IMDB Rating</p>
    </article>

    <article class = "notification is-primary">
    <p class = "title">${movieData.imdbVotes}</p>
    <p class = "subtitle">IMDB votes</p>
    </article>
    `
}