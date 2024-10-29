const API_KEY = "a579d815";
const API_URL = "http://www.omdbapi.com/";

// Search and filter functionality
document.getElementById("search-button").addEventListener("click", async () => {
  const query = document.getElementById("search-input").value.trim();
  const year = document.getElementById("year-filter").value.trim();
  if (query) {
    const movies = await searchMovies(query, year);
    displayMovies(movies);
  }
});

async function searchMovies(query, year) {
  try {
    let url = `${API_URL}?s=${query}&apikey=${API_KEY}`;
    if (year) url += `&y=${year}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.Search || [];
  } catch (error) {
    console.error("Error searching movies:", error);
    return [];
  }
}

function displayMovies(movies) {
  const moviesContainer = document.querySelector(".movies-container");
  moviesContainer.innerHTML = "";

  movies.forEach((movie) => {
    const movieElement = document.createElement("div");
    movieElement.classList.add("movie");
    movieElement.innerHTML = `
            <img src="${
              movie.Poster === "N/A" ? "placeholder.jpg" : movie.Poster
            }" alt="${movie.Title}">
            <div class="movie-info">
                <h2 class="movie-title">${movie.Title}</h2>
                <p>Year: ${movie.Year}</p>
                <p>Type: ${movie.Type}</p>
                <button class="info-button" data-imdbID="${
                  movie.imdbID
                }">More Info</button>
            </div>
        `;
    moviesContainer.appendChild(movieElement);
  });
}

// Modal handling
async function fetchMovieDetails(imdbID) {
  try {
    const response = await fetch(`${API_URL}?i=${imdbID}&apikey=${API_KEY}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
}

document.addEventListener("click", async (event) => {
  if (event.target.classList.contains("info-button")) {
    const imdbID = event.target.dataset.imdbid;
    const movieDetails = await fetchMovieDetails(imdbID);
    if (movieDetails) {
      showModal(movieDetails);
    }
  }
});

function showModal(details) {
  document.getElementById(
    "modal-title"
  ).textContent = `Title: ${details.Title}`;
  document.getElementById("modal-year").textContent = `Year: ${details.Year}`;
  document.getElementById("modal-type").textContent = `Type: ${details.Type}`;
  document.getElementById(
    "modal-rating"
  ).textContent = `IMDb Rating: ${details.imdbRating}`;
  document.getElementById("modal-plot").textContent = `Plot: ${details.Plot}`;
  document.getElementById("movie-modal").style.display = "block";
}

document.querySelector(".close-button").addEventListener("click", () => {
  document.getElementById("movie-modal").style.display = "none";
});
