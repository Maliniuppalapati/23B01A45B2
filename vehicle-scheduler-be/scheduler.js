function solveKnapsack(vehicles, capacity) {
  const n = vehicles.length;
  const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const item = vehicles[i - 1];
    const duration = item.Duration;
    const impact = item.Impact;

    for (let w = 0; w <= capacity; w++) {
      if (duration <= w) {
        dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - duration] + impact);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  const selectedVehicles = [];
  const unselectedVehicles = [];
  let w = capacity;

  for (let i = n; i > 0; i--) {
    const item = vehicles[i - 1];
    const duration = item.Duration;
    
    if (dp[i][w] !== dp[i - 1][w]) {
      selectedVehicles.push(item);
      w -= duration;
    } else {
      unselectedVehicles.push(item);
    }
  }

  selectedVehicles.reverse();
  unselectedVehicles.reverse();

  const totalImpact = dp[n][capacity];
  const totalDuration = capacity - w;

  return {
    selectedVehicles,
    unselectedVehicles,
    totalImpact,
    totalDuration
  };
}

module.exports = {
  solveKnapsack
};
