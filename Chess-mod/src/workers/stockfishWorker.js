// src/workers/stockfishWorker.js
self.importScripts('/stockfish/stockfish-nnue-16-single.js');

// Create a reference to the Stockfish engine
const stockfish = self.Stockfish();

// Initialize communication with the engine
stockfish.onmessage = function(event) {
  // Forward all Stockfish output to the main thread
  self.postMessage(event);
};

// Listen for messages from the main thread
self.onmessage = function(e) {
  // Forward commands to Stockfish engine
  stockfish.postMessage(e.data);
};