export function formatCurrencyINR(value) {
  const amount = Number(value || 0);
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
}

export default formatCurrencyINR;

