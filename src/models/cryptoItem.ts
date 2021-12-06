class CryptoItem {
  id: string;
  rank: string;
  name: string;
  price: string;
  marketcap: string;
  volume: string;
  isFavorite: boolean;
  logo_url: string;
  symbol: string;
  price_change_pct: string;
  volume_change_pct: string;

  constructor(
    id: string,
    rank: string,
    name: string,
    price: string,
    marketcap: string,
    volume: string,
    isFavorite: false,
    logo_url: string,
    symbol: string,
    price_change_pct: string,
    volume_change_pct: string
  ) {
    this.id = id;
    this.rank = rank;
    this.name = name;
    this.price = price;
    this.marketcap = marketcap;
    this.volume = volume;
    this.isFavorite = isFavorite;
    this.logo_url = logo_url;
    this.symbol = symbol;
    this.price_change_pct = price_change_pct;
    this.volume_change_pct = volume_change_pct;
  }
}

export default CryptoItem;
