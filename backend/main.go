package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"movie-recommender/utils"
	"net/http"
	"os"
	"path/filepath"

	"github.com/valyala/fasthttp"
	"github.com/valyala/fasthttp/fasthttpadaptor"
)

func main() {
	// Set up logging to file
	logFile, err := os.OpenFile("server.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		fmt.Printf("Error opening log file: %v\n", err)
		os.Exit(1)
	}
	defer logFile.Close()
	log.SetOutput(logFile)
	log.Println("Server logging initialized")

	// Define request handler
	requestHandler := func(ctx *fasthttp.RequestCtx) {
		path := string(ctx.Path())
		method := string(ctx.Method())

		switch {
		// API endpoints
		case path == "/api/recommend-movies" && method == "POST":
			handleMovieRecommendation(ctx)
		case path == "/api/recommend-tvshows" && method == "POST":
			handleTVShowRecommendation(ctx)
		case path == "/api/recommend-by-genre" && method == "POST":
			handleGenreRecommendation(ctx)
		case path == "/api/recommend-by-description" && method == "POST":
			handleDescriptionRecommendation(ctx)
		case path == "/api/find-movie" && method == "POST":
			handleMovieFinder(ctx)
		case path == "/api/search-by-image" && method == "POST":
			handleImageSearch(ctx)
		default:
			// Serve static files
			fsHandler := fasthttpadaptor.NewFastHTTPHandler(http.FileServer(http.Dir("../frontend")))
			fsHandler(ctx)
		}
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	addr := ":" + port
	fmt.Printf("Server starting on port %s...\n", port)
	log.Printf("Server starting on port %s...\n", port)

	if err := fasthttp.ListenAndServe(addr, requestHandler); err != nil {
		log.Fatalf("Error in ListenAndServe: %v", err)
	}
}

// Feature 1: Movie recommendations by name
func handleMovieRecommendation(ctx *fasthttp.RequestCtx) {
	var request struct {
		MovieName string `json:"movieName"`
	}

	// Parse query parameters
	var queryParams map[string]string = utils.GetURLParams(ctx, string(ctx.QueryArgs().String()))
	movieName, ok := queryParams["movieName"]

	// If not in query parameters, try to parse from JSON body
	if !ok {
		if err := json.Unmarshal(ctx.PostBody(), &request); err != nil {
			ctx.SetStatusCode(fasthttp.StatusBadRequest)
			ctx.SetBodyString("Invalid request body")
			return
		}
		movieName = request.MovieName
	}

	if movieName == "" {
		ctx.SetStatusCode(fasthttp.StatusBadRequest)
		ctx.SetBodyString("Movie name is required")
		return
	}

	items, err := utils.GetMovieRecommendations(movieName)
	if err != nil {
		ctx.SetStatusCode(fasthttp.StatusInternalServerError)
		ctx.SetBodyString("Failed to get recommendations")
		return
	}

	response := struct {
		Items []string `json:"items"`
	}{
		Items: items,
	}

	jsonResponse, err := json.Marshal(response)
	if err != nil {
		ctx.SetStatusCode(fasthttp.StatusInternalServerError)
		ctx.SetBodyString("Error creating response")
		return
	}

	ctx.SetContentType("application/json")
	ctx.SetBody(jsonResponse)
}

// Feature 2: TV show recommendations by name
func handleTVShowRecommendation(ctx *fasthttp.RequestCtx) {
	var request struct {
		TVShowName string `json:"tvShowName"`
	}

	// Parse query parameters
	var queryParams map[string]string = utils.GetURLParams(ctx, string(ctx.QueryArgs().String()))
	tvShowName, ok := queryParams["tvShowName"]

	// If not in query parameters, try to parse from JSON body
	if !ok {
		if err := json.Unmarshal(ctx.PostBody(), &request); err != nil {
			ctx.SetStatusCode(fasthttp.StatusBadRequest)
			ctx.SetBodyString("Invalid request body")
			return
		}
		tvShowName = request.TVShowName
	}

	if tvShowName == "" {
		ctx.SetStatusCode(fasthttp.StatusBadRequest)
		ctx.SetBodyString("TV show name is required")
		return
	}

	items, err := utils.GetTVShowRecommendations(tvShowName)
	if err != nil {
		ctx.SetStatusCode(fasthttp.StatusInternalServerError)
		ctx.SetBodyString("Failed to get recommendations")
		return
	}

	response := struct {
		Items []string `json:"items"`
	}{
		Items: items,
	}

	jsonResponse, err := json.Marshal(response)
	if err != nil {
		ctx.SetStatusCode(fasthttp.StatusInternalServerError)
		ctx.SetBodyString("Error creating response")
		return
	}

	ctx.SetContentType("application/json")
	ctx.SetBody(jsonResponse)
}

// Feature 3: Genre recommendations
func handleGenreRecommendation(ctx *fasthttp.RequestCtx) {
	var request struct {
		Genre string `json:"genre"`
	}

	// Parse query parameters
	var queryParams map[string]string = utils.GetURLParams(ctx, string(ctx.QueryArgs().String()))
	genre, ok := queryParams["genre"]

	// If not in query parameters, try to parse from JSON body
	if !ok {
		if err := json.Unmarshal(ctx.PostBody(), &request); err != nil {
			ctx.SetStatusCode(fasthttp.StatusBadRequest)
			ctx.SetBodyString("Invalid request body")
			return
		}
		genre = request.Genre
	}

	if genre == "" {
		ctx.SetStatusCode(fasthttp.StatusBadRequest)
		ctx.SetBodyString("Genre is required")
		return
	}

	items, err := utils.GetGenreRecommendations(genre)
	if err != nil {
		ctx.SetStatusCode(fasthttp.StatusInternalServerError)
		ctx.SetBodyString("Failed to get recommendations")
		return
	}

	response := struct {
		Items []string `json:"items"`
	}{
		Items: items,
	}

	jsonResponse, err := json.Marshal(response)
	if err != nil {
		ctx.SetStatusCode(fasthttp.StatusInternalServerError)
		ctx.SetBodyString("Error creating response")
		return
	}

	ctx.SetContentType("application/json")
	ctx.SetBody(jsonResponse)
}

// Feature 4: Description-based recommendations
func handleDescriptionRecommendation(ctx *fasthttp.RequestCtx) {
	var request struct {
		Description string `json:"description"`
	}

	// Parse query parameters
	var queryParams map[string]string = utils.GetURLParams(ctx, string(ctx.QueryArgs().String()))
	description, ok := queryParams["description"]

	// If not in query parameters, try to parse from JSON body
	if !ok {
		if err := json.Unmarshal(ctx.PostBody(), &request); err != nil {
			ctx.SetStatusCode(fasthttp.StatusBadRequest)
			ctx.SetBodyString("Invalid request body")
			return
		}
		description = request.Description
	}

	if description == "" {
		ctx.SetStatusCode(fasthttp.StatusBadRequest)
		ctx.SetBodyString("Description is required")
		return
	}

	items, err := utils.GetDescriptionRecommendations(description)
	if err != nil {
		ctx.SetStatusCode(fasthttp.StatusInternalServerError)
		ctx.SetBodyString("Failed to get recommendations")
		return
	}

	response := struct {
		Items []string `json:"items"`
	}{
		Items: items,
	}

	jsonResponse, err := json.Marshal(response)
	if err != nil {
		ctx.SetStatusCode(fasthttp.StatusInternalServerError)
		ctx.SetBodyString("Error creating response")
		return
	}

	ctx.SetContentType("application/json")
	ctx.SetBody(jsonResponse)
}

// Feature 5: Movie finder
func handleMovieFinder(ctx *fasthttp.RequestCtx) {
	var request struct {
		Description string `json:"description"`
	}

	// Parse query parameters
	var queryParams map[string]string = utils.GetURLParams(ctx, string(ctx.QueryArgs().String()))
	description, ok := queryParams["description"]

	// If not in query parameters, try to parse from JSON body
	if !ok {
		if err := json.Unmarshal(ctx.PostBody(), &request); err != nil {
			ctx.SetStatusCode(fasthttp.StatusBadRequest)
			ctx.SetBodyString("Invalid request body")
			return
		}
		description = request.Description
	}

	if description == "" {
		ctx.SetStatusCode(fasthttp.StatusBadRequest)
		ctx.SetBodyString("Description is required")
		return
	}

	items, err := utils.FindMovie(description)
	if err != nil {
		ctx.SetStatusCode(fasthttp.StatusInternalServerError)
		ctx.SetBodyString("Failed to find movie")
		return
	}

	response := struct {
		Items []string `json:"items"`
	}{
		Items: items,
	}

	jsonResponse, err := json.Marshal(response)
	if err != nil {
		ctx.SetStatusCode(fasthttp.StatusInternalServerError)
		ctx.SetBodyString("Error creating response")
		return
	}

	ctx.SetContentType("application/json")
	ctx.SetBody(jsonResponse)
}

// Feature 6: Image-based search
func handleImageSearch(ctx *fasthttp.RequestCtx) {
	// Parse multipart form
	form, err := ctx.MultipartForm()
	if err != nil {
		ctx.SetStatusCode(fasthttp.StatusBadRequest)
		ctx.SetBodyString("Error parsing multipart form: " + err.Error())
		return
	}

	// Get the uploaded file
	files := form.File["image"]
	if len(files) == 0 {
		ctx.SetStatusCode(fasthttp.StatusBadRequest)
		ctx.SetBodyString("No image file was uploaded")
		return
	}
	fileHeader := files[0]

	// Get file extension
	extension := ".png" // Default
	if fileHeader.Filename != "" {
		fileExt := filepath.Ext(fileHeader.Filename)
		if fileExt != "" {
			extension = fileExt
		}
	}

	// Log some details to help with debugging
	log.Printf("Received file: %s, size: %d bytes", fileHeader.Filename, fileHeader.Size)

	// Create a temporary file with correct extension
	tempFile, err := os.CreateTemp("", "upload-*"+extension)
	if err != nil {
		ctx.SetStatusCode(fasthttp.StatusInternalServerError)
		ctx.SetBodyString("Error creating temporary file: " + err.Error())
		return
	}
	defer os.Remove(tempFile.Name())
	defer tempFile.Close()

	// Open the uploaded file
	file, err := fileHeader.Open()
	if err != nil {
		ctx.SetStatusCode(fasthttp.StatusInternalServerError)
		ctx.SetBodyString("Error opening uploaded file: " + err.Error())
		return
	}
	defer file.Close()

	// Copy the uploaded file to the temporary file
	fileSize, err := io.Copy(tempFile, file)
	if err != nil {
		ctx.SetStatusCode(fasthttp.StatusInternalServerError)
		ctx.SetBodyString("Error copying file: " + err.Error())
		return
	}

	// Ensure the write is complete
	if err := tempFile.Sync(); err != nil {
		ctx.SetStatusCode(fasthttp.StatusInternalServerError)
		ctx.SetBodyString("Error writing file to disk: " + err.Error())
		return
	}

	// Log the path and size for debugging
	log.Printf("Saved file to %s, size: %d bytes", tempFile.Name(), fileSize)

	// Rewind the file for reading
	if _, err := tempFile.Seek(0, 0); err != nil {
		ctx.SetStatusCode(fasthttp.StatusInternalServerError)
		ctx.SetBodyString("Error preparing file for processing: " + err.Error())
		return
	}

	// Process the image
	items, err := utils.SearchByImage(tempFile.Name())
	if err != nil {
		log.Printf("Error processing image: %v", err)
		ctx.SetStatusCode(fasthttp.StatusInternalServerError)
		ctx.SetBodyString("Failed to process image: " + err.Error())
		return
	}

	// Get the image summary
	summary := utils.GetLatestImageSummary()

	response := struct {
		Items   []string `json:"items"`
		Summary string   `json:"summary"`
	}{
		Items:   items,
		Summary: summary,
	}

	jsonResponse, err := json.Marshal(response)
	if err != nil {
		ctx.SetStatusCode(fasthttp.StatusInternalServerError)
		ctx.SetBodyString("Error creating response")
		return
	}

	ctx.SetContentType("application/json")
	ctx.SetBody(jsonResponse)
}
