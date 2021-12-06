export const currencyNumber = (number: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(number);
};

export const currencyMarketCap = (num: number) => {
  if (num > 999999999 && num < 1000000000000)
    return (num / 1000000000).toFixed(1) + "MLN";
  if (num >= 1000000000000) return (num / 1000000000000).toFixed(1) + "MLD";
};

export const pctNumber = (number: string) => {
  return (+parseFloat(number) * 100).toFixed(2);
};
