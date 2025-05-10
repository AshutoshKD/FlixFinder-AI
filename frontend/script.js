// Helper functions
function showElement(element) {
    element.classList.remove('hidden');
}

function hideElement(element) {
    element.classList.add('hidden');
}

function handleResponse(cardId, data) {
    const card = document.getElementById(cardId);
    const loading = card.querySelector('.loading');
    const recommendations = card.querySelector('.recommendations');
    const resultList = card.querySelector('.result-list');

    hideElement(loading);
    showElement(recommendations);

    // Clear previous list
    resultList.innerHTML = '';
    
    // Check if data has items property
    if (!data.items || !Array.isArray(data.items)) {
        console.error('Invalid response format:', data);
        handleError(cardId, 'Invalid response format from server');
        return;
    }
    
    // Add each item to the list
    data.items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        resultList.appendChild(li);
    });
}

function handleError(cardId, errorMessage) {
    const card = document.getElementById(cardId);
    const loading = card.querySelector('.loading');
    const error = card.querySelector('.error');

    hideElement(loading);
    showElement(error);
    error.textContent = 'Error: ' + errorMessage;
    console.error('Error in card', cardId, ':', errorMessage);
}

function makeAPIRequest(endpoint, requestData, cardId) {
    const card = document.getElementById(cardId);
    const loading = card.querySelector('.loading');
    const error = card.querySelector('.error');
    const recommendations = card.querySelector('.recommendations');

    // Hide previous results and show loading
    hideElement(error);
    hideElement(recommendations);
    showElement(loading);

    console.log(`Making request to /api/${endpoint}`, requestData);
    
    fetch(`/api/${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    })
    .then(response => {
        console.log(`Response from /api/${endpoint}:`, response);
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`Server error (${response.status}): ${text}`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log(`Parsed data from /api/${endpoint}:`, data);
        handleResponse(cardId, data);
    })
    .catch(err => {
        console.error(`Error in request to /api/${endpoint}:`, err);
        handleError(cardId, err.message);
    });
}

// Feature 1: Movie Recommendations by Name
function getMovieRecommendations() {
    const movieInput = document.getElementById('movieInput');
    const movieName = movieInput.value.trim();
    
    if (!movieName) {
        handleError('movie-recommendation', 'Please enter a movie name');
        return;
    }

    makeAPIRequest('recommend-movies', { movieName }, 'movie-recommendation');
}

// Feature 2: TV Show Recommendations by Name
function getTVShowRecommendations() {
    const tvShowInput = document.getElementById('tvShowInput');
    const tvShowName = tvShowInput.value.trim();
    
    if (!tvShowName) {
        handleError('tvshow-recommendation', 'Please enter a TV show name');
        return;
    }

    makeAPIRequest('recommend-tvshows', { tvShowName }, 'tvshow-recommendation');
}

// Feature 3: Recommendations by Genre
function getGenreRecommendations() {
    const genreInput = document.getElementById('genreInput');
    const genre = genreInput.value.trim();
    
    if (!genre) {
        handleError('genre-recommendation', 'Please enter a genre');
        return;
    }

    makeAPIRequest('recommend-by-genre', { genre }, 'genre-recommendation');
}

// Feature 4: Recommendations by Description
function getDescriptionRecommendations() {
    const descriptionInput = document.getElementById('descriptionInput');
    const description = descriptionInput.value.trim();
    
    if (!description) {
        handleError('description-recommendation', 'Please enter a description');
        return;
    }

    makeAPIRequest('recommend-by-description', { description }, 'description-recommendation');
}

// Feature 5: Movie Finder
function findMovie() {
    const movieFinderInput = document.getElementById('movieFinderInput');
    const description = movieFinderInput.value.trim();
    
    if (!description) {
        handleError('movie-finder', 'Please describe the movie you\'re looking for');
        return;
    }

    makeAPIRequest('find-movie', { description }, 'movie-finder');
}

// Feature 6: Search by Image
function searchByImage() {
    const imageInput = document.getElementById('imageInput');
    const card = document.getElementById('image-search');
    const loading = card.querySelector('.loading');
    const error = card.querySelector('.error');
    const recommendations = card.querySelector('.recommendations');

    if (!imageInput.files || !imageInput.files[0]) {
        handleError('image-search', 'Please select an image');
        return;
    }

    // Hide previous results and show loading
    hideElement(error);
    hideElement(recommendations);
    showElement(loading);

    const formData = new FormData();
    formData.append('image', imageInput.files[0]);

    fetch('/api/search-by-image', {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        console.log('Response from /api/search-by-image:', response);
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`Server error (${response.status}): ${text}`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Parsed data from /api/search-by-image:', data);
        handleResponse('image-search', data);
    })
    .catch(err => {
        console.error('Error in request to /api/search-by-image:', err);
        handleError('image-search', err.message);
    });
}

// Add event listeners for Enter key on text inputs
document.getElementById('movieInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        getMovieRecommendations();
    }
});

document.getElementById('tvShowInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        getTVShowRecommendations();
    }
});

document.getElementById('genreInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        getGenreRecommendations();
    }
}); 