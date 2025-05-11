# FlixFinder AI
**🔗 [Live Demo](https://flixfinder-ai.onrender.com)**  
This is an AI-powered movie and TV show recommendation system with a Netflix-style UI that uses the Gemini AI API to provide intelligent recommendations based on various inputs.

## Features

- **Movie Recommendations**: Find similar movies based on a movie you love
- **TV Show Recommendations**: Discover TV shows similar to one you enjoyed
- **Genre-Based Recommendations**: Explore top movies and TV shows in your favorite genre
- **Description-Based Discovery**: Find content based on themes, plots, or vibes you describe
- **Movie Finder**: Identify a movie when you can only remember parts of it
- **Image-Based Search**: Find movies and TV shows visually similar to an uploaded image
- **Netflix-Style UI**: Intuitive card-based interface with responsive design
- **Powered by Google's Gemini AI**: Advanced AI-based recommendations

## Prerequisites

- Go 1.16 or higher
- A modern web browser
- Internet connection

## Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd flixfinder-ai
```

2. Navigate to the backend directory and install dependencies:
```bash
cd backend
go mod tidy
```

## Running the Application

1. Start the backend server:
```bash
cd backend
go run main.go
```

2. Open your web browser and navigate to:
```
http://localhost:8080
```

## How to Use

### Movie Recommendations
1. In the "Movies Like This" card, enter a movie name
2. Click "Search" or press Enter
3. View the list of similar movies recommended by the AI

### TV Show Recommendations
1. In the "TV Shows Like This" card, enter a TV show name
2. Click "Search"
3. View the list of similar TV shows recommended by the AI

### Genre-Based Recommendations
1. In the "By Genre" card, enter a genre (e.g., "sci-fi", "romance", "thriller")
2. Click "Search"
3. View the list of top movies and TV shows in that genre

### Description-Based Discovery
1. In the "By Description" card, describe the type of content you're looking for
2. Click "Search"
3. View movies and TV shows that match your description

### Movie Finder
1. In the "Movie Finder" card, describe a movie you're trying to identify
2. Click "Find It"
3. View potential matches with brief explanations

### Image-Based Search
1. In the "Search by Image" card, upload an image related to a movie or TV show
2. Click "Search"
3. View visually or thematically similar content

## Technical Details

- Backend: Go with FastHTTP for high-performance HTTP handling
- Frontend: HTML, CSS, and vanilla JavaScript
- AI: Google's Gemini AI API for both text and image processing
- Image Processing: Base64 encoding for secure image transmission

## Note

The application uses the Gemini AI API. The API key is included in the code for demonstration purposes. In a production environment, you should move this to a secure environment variable. 
