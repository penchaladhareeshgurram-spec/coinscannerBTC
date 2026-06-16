export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: null;
  last_updated: string;
  sparkline_in_7d?: {
    price: number[];
  };
}

export interface CoinDetail extends Coin {
  description: {
    en: string;
  };
  links: {
    homepage: string[];
    whitepaper: string;
    blockchain_site: string[];
    official_forum_url: string[];
    chat_url: string[];
    announcement_url: string[];
    twitter_screen_name: string;
    facebook_username: string;
    bitcointalk_thread_identifier: null;
    telegram_channel_identifier: string;
    subreddit_url: string;
    repos_url: {
      github: string[];
      bitbucket: string[];
    };
  };
}

export interface ChartData {
  prices: [number, number][]; // [timestamp, price]
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export interface TickerData {
  [symbol: string]: {
    last_price: number;
    change_24h: number;
    high: number;
    low: number;
    volume: number;
    bid: number;
    ask: number;
  };
}

export interface Exchange {
  id: string;
  name: string;
  logo: string;
  about: string;
  fees: string;
  leverage: string;
  liquidity: string;
  volume: string;
  withdrawal: string;
  deposit: string;
  currencies: string;
  earning: string;
  mining: string;
  features: {
    spot: boolean;
    investment: boolean;
    derivatives_fno: boolean;
    p2p: boolean;
    inr_support: boolean;
  };
}

export interface GlobalStats {
  data: {
    active_cryptocurrencies: number;
    upcoming_icos: number;
    ongoing_icos: number;
    ended_icos: number;
    markets: number;
    total_market_cap: { [currency: string]: number };
    total_volume: { [currency: string]: number };
    market_cap_percentage: { [coin: string]: number };
    market_cap_change_percentage_24h_usd: number;
    updated_at: number;
  };
}
