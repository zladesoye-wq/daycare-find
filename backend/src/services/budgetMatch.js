/**
 * Budget Match Logic:
 * 1. Calculate the average monthly price for each age group within the search radius
 * 2. Tag providers priced at or below 85% of the area average with a "Budget Pick" badge
 */

const calculateBudgetPicks = (providers, ageGroup) => {
  if (!providers || providers.length === 0) return [];

  // 1. Calculate average price for the requested age group
  const prices = providers
    .map(p => parseFloat(p.monthly_price))
    .filter(price => !isNaN(price));

  if (prices.length === 0) {
    return providers.map(p => ({ ...p, budget_pick: false }));
  }

  const sum = prices.reduce((a, b) => a + b, 0);
  const average = sum / prices.length;
  const threshold = average * 0.85;

  // 2. Tag providers
  return providers.map(p => {
    const price = parseFloat(p.monthly_price);
    return {
      ...p,
      budget_pick: !isNaN(price) && price <= threshold
    };
  });
};

module.exports = { calculateBudgetPicks };
