const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const weightedRandom = (weights) => {
    const total = weights.reduce((a, b) => a + b);
    const threshold = Math.random() * total;
    
    let sum = 0;
    return weights.findIndex((weight) => {
      sum += weight;
      return sum >= threshold;
    });
  };
module.exports = { sleep,weightedRandom };