const natural = require('natural');
const mongoose = require('mongoose');
const {Movie} = require('../models/Schemas');
const { sleep } = require('../util/helpers');

class TFIDFService {
  constructor() {
    this.tfidf = new natural.TfIdf();
    this.movieVectors = new Map();
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;
    
    console.log('Initializing TF-IDF engine...');
    const movies = await Movie.find().lean();
    
    // Create weighted document vectors
    movies.forEach(movie => {
      const vector = [
        ...movie.genres.map(g => `${g}_genre`),          // Genre terms
        ...movie.directors.map(d => `${d}_director`),    // Director terms
        ...movie.cast.slice(0, 3).map(a => `${a}_cast`), // Top 3 cast members
        ...movie.keywords.map(k => `${k}_keyword`)       // Keywords
      ].join(' ');

      this.tfidf.addDocument(vector);
      this.movieVectors.set(movie._id.toString(), {
        index: this.tfidf.documents.length - 1,
        movie
      });
    });

    this.isInitialized = true;
    console.log(`TF-IDF initialized with ${movies.length} documents`);
  }

  async getSimilarMovies(movieId, limit = 10) {
    await this.initialize();
    
    const target = this.movieVectors.get(movieId.toString());
    if (!target) throw new Error('Movie not found in TF-IDF index');

    const similarities = [];
    
    // Calculate cosine similarities
    this.tfidf.tfidfs(target.index, (i, score) => {
      if (i !== target.index) {
        const movieEntry = Array.from(this.movieVectors.values())
          .find(entry => entry.index === i);
        
        if (movieEntry) {
          similarities.push({
            movie: movieEntry.movie,
            score: score + this.calculateBonusPoints(target.movie, movieEntry.movie)
          });
        }
      }
    });

    return similarities
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  calculateBonusPoints(targetMovie, compareMovie) {
    let bonus = 0;
    
    // Shared directors bonus
    const sharedDirectors = targetMovie.directors.filter(d => 
      compareMovie.directors.includes(d)
    ).length;
    bonus += sharedDirectors * 0.2;

    // Shared cast bonus
    const sharedCast = targetMovie.cast.filter(a => 
      compareMovie.cast.includes(a)
    ).length;
    bonus += sharedCast * 0.1;

    // Same year bonus
    if (targetMovie.release_date?.getFullYear() === 
        compareMovie.release_date?.getFullYear()) {
      bonus += 0.15;
    }

    return bonus;
  }
}

module.exports = new TFIDFService();