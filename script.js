const popup = document.querySelector(".popup");
const popupClose = document.querySelector("span");
const popIMG = document.querySelector(".popimg");

popupClose.addEventListener("click", (event) => {
    event.preventDefault();
    document.body.classList.toggle("body-overlay");
    popup.style.display = "none";
})


const searchForm = document.querySelector("#searchForm");
searchForm.addEventListener("submit",
    async event => {
        event.preventDefault();
        removePreviousSearch();
        let search = document.querySelector("#search").value;
        cardsData = await getMoviesFromAPI(search);

        const arrayOfMovies = [];
        for (const card of cardsData) {
            arrayOfMovies.push(createCard(card));
        }

        const moviesList = document.querySelectorAll(".movie");
        moviesList.forEach((movie, index) => {
            movie.addEventListener("click", (event) => {
                event.preventDefault();
                const img = document.querySelector(".movieIMG");
                const overview = document.querySelector('#movieInfo');
                overview.innerText = arrayOfMovies[index].overview;
                img.src = arrayOfMovies[index].image;
                document.body.classList.toggle("body-overlay");
                popup.style.display = "flex";
            })
        })
        document.querySelector("#search").value = "";
    }
)

//helper functions//

async function getMoviesFromAPI(search) {
    let searchQuery = "";
    for (let val of search) {
        if (val === " ") {
            val = "%20"
        }
        searchQuery += val;
    }
    const url = 'https://api.themoviedb.org/3/search/movie?';
    const apiKey = 'api_key=' + '7089ffc2411c8144a9189516735032c3';
    const query = '&query=' + searchQuery;
    const request = await fetch(`${url+apiKey+query}`);
    const data = await request.json();
    return data.results;
}

const createCard = (card) => {
    const movies = document.querySelector('#movies');
    const movieDiv = document.createElement("div");
    movieDiv.classList.add("movie");
    const movieIMG = document.createElement("img");
    movieIMG.classList.add("poster");
    if (card.poster_path) {
        movieIMG.src = "https://image.tmdb.org/t/p/original/" + card.poster_path;
    } else {
        movieIMG.src = "image.png"
    }
    movieIMG.alt = card.original_title
    const movieH4 = document.createElement("h4");
    movieH4.classList.add("movieTitle");
    movieH4.innerText = card.original_title;
    const movieGenre = document.createElement("p");
    //movieGenre.classList.add("genre");
    //movieGenre.innerText = card.genre_ids;
    movieDiv.append(movieIMG, movieH4, movieGenre);
    movies.appendChild(movieDiv);

    return {
        title: card.original_title,
        image: movieIMG.src,
        imageAlt: movieIMG.alt,
        genre: card.genre_ids,
        overview: card.overview
    }
}

function removePreviousSearch() {
    const movies = document.querySelectorAll(".movie");
    for (const movie of movies) {
        movie.remove();
    }
}