// Helper functions
function showElement(elementId) {
    document.getElementById(elementId).classList.remove('hidden');
}

function hideElement(elementId) {
    document.getElementById(elementId).classList.add('hidden');
}

function displayError(message) {
    hideElement('loading');
    hideElement('recommendations');
    hideElement('summaryContainer');
    showElement('error');
    document.getElementById('error').textContent = message;
}

function displayResults(results, listElementId) {
    hideElement('loading');
    hideElement('error');
    showElement('recommendations');
    
    const resultList = document.getElementById(listElementId);
    resultList.innerHTML = '';
    
    results.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        resultList.appendChild(li);
    });
}

// Movie Recommendations
function getMovieRecommendations() {
    const movieName = document.getElementById('movieInput').value.trim();
    
    if (!movieName) {
        displayError('Please enter a movie name');
        return;
    }
    
    // Show loading state
    hideElement('error');
    hideElement('recommendations');
    showElement('loading');
    
    // Make API request
    fetch('/api/recommend-movies', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movieName }),
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`Server error (${response.status}): ${text}`);
            });
        }
        return response.json();
    })
    .then(data => {
        if (!data.items || !Array.isArray(data.items)) {
            throw new Error('Invalid response format from server');
        }
        displayResults(data.items, 'movieList');
    })
    .catch(err => {
        console.error('Error fetching movie recommendations:', err);
        displayError(err.message);
    });
}

// TV Show Recommendations
function getTVShowRecommendations() {
    const tvShowName = document.getElementById('tvShowInput').value.trim();
    
    if (!tvShowName) {
        displayError('Please enter a TV show name');
        return;
    }
    
    // Show loading state
    hideElement('error');
    hideElement('recommendations');
    showElement('loading');
    
    // Make API request
    fetch('/api/recommend-tvshows', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tvShowName }),
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`Server error (${response.status}): ${text}`);
            });
        }
        return response.json();
    })
    .then(data => {
        if (!data.items || !Array.isArray(data.items)) {
            throw new Error('Invalid response format from server');
        }
        displayResults(data.items, 'tvShowList');
    })
    .catch(err => {
        console.error('Error fetching TV show recommendations:', err);
        displayError(err.message);
    });
}

// Genre Recommendations
function getGenreRecommendations() {
    const genre = document.getElementById('genreInput').value.trim();
    
    if (!genre) {
        displayError('Please enter a genre');
        return;
    }
    
    // Show loading state
    hideElement('error');
    hideElement('recommendations');
    showElement('loading');
    
    // Make API request
    fetch('/api/recommend-by-genre', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ genre }),
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`Server error (${response.status}): ${text}`);
            });
        }
        return response.json();
    })
    .then(data => {
        if (!data.items || !Array.isArray(data.items)) {
            throw new Error('Invalid response format from server');
        }
        displayResults(data.items, 'genreList');
    })
    .catch(err => {
        console.error('Error fetching genre recommendations:', err);
        displayError(err.message);
    });
}

// Description Recommendations
function getDescriptionRecommendations() {
    const description = document.getElementById('descriptionInput').value.trim();
    
    if (!description) {
        displayError('Please enter a description');
        return;
    }
    
    // Show loading state
    hideElement('error');
    hideElement('recommendations');
    showElement('loading');
    
    // Make API request
    fetch('/api/recommend-by-description', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`Server error (${response.status}): ${text}`);
            });
        }
        return response.json();
    })
    .then(data => {
        if (!data.items || !Array.isArray(data.items)) {
            throw new Error('Invalid response format from server');
        }
        displayResults(data.items, 'descriptionList');
    })
    .catch(err => {
        console.error('Error fetching description recommendations:', err);
        displayError(err.message);
    });
}

// Movie Finder
function findMovie() {
    const description = document.getElementById('movieFinderInput').value.trim();
    
    if (!description) {
        displayError('Please describe the movie you\'re looking for');
        return;
    }
    
    // Show loading state
    hideElement('error');
    hideElement('recommendations');
    showElement('loading');
    
    // Make API request
    fetch('/api/find-movie', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`Server error (${response.status}): ${text}`);
            });
        }
        return response.json();
    })
    .then(data => {
        if (!data.items || !Array.isArray(data.items)) {
            throw new Error('Invalid response format from server');
        }
        displayResults(data.items, 'movieFinderList');
    })
    .catch(err => {
        console.error('Error using movie finder:', err);
        displayError(err.message);
    });
}

// Image Search
function searchByImage() {
    const imageInput = document.getElementById('imageInput');
    
    if (!imageInput.files || !imageInput.files[0]) {
        displayError('Please select an image');
        return;
    }
    
    // Show loading state
    hideElement('error');
    hideElement('recommendations');
    showElement('loading');
    
    const formData = new FormData();
    formData.append('image', imageInput.files[0]);
    
    // Make API request
    fetch('/api/search-by-image', {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`Server error (${response.status}): ${text}`);
            });
        }
        return response.json();
    })
    .then(data => {
        if (!data.items || !Array.isArray(data.items)) {
            throw new Error('Invalid response format from server');
        }
        
        // Display the summary if available
        if (data.summary) {
            const summaryElement = document.getElementById('imageSummary');
            if (summaryElement) {
                summaryElement.textContent = data.summary;
                showElement('summaryContainer');
            }
        }
        
        displayResults(data.items, 'imageList');
    })
    .catch(err => {
        console.error('Error searching by image:', err);
        displayError(err.message);
    });
}

// Add event listeners for Enter key on inputs
document.addEventListener('DOMContentLoaded', function() {
    // Movie recommendations page
    const movieInput = document.getElementById('movieInput');
    if (movieInput) {
        movieInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                getMovieRecommendations();
            }
        });
    }
    
    // TV show recommendations page
    const tvShowInput = document.getElementById('tvShowInput');
    if (tvShowInput) {
        tvShowInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                getTVShowRecommendations();
            }
        });
    }
    
    // Genre search page
    const genreInput = document.getElementById('genreInput');
    if (genreInput) {
        genreInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                getGenreRecommendations();
            }
        });
    }
}); 