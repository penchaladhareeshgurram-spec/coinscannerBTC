import { Exchange } from "./types";

export const EXCHANGES: Exchange[] = [
  {
    id: "coindcx",
    name: "CoinDCX",
    logo: "https://logo.clearbit.com/coindcx.com",
    about: "CoinDCX is India's largest and safest cryptocurrency exchange. Established in 2018.",
    fees: "0.2% - 0.5%",
    leverage: "Up to 20x",
    liquidity: "High",
    volume: "High",
    withdrawal: "Min 1000 INR",
    deposit: "Min 100 INR",
    currencies: "500+",
    earning: "Staking, Lending",
    mining: "-",
    features: { spot: true, investment: true, derivatives_fno: true, p2p: false, inr_support: true }
  },
  {
    id: "wazirx",
    name: "WazirX",
    logo: "https://logo.clearbit.com/wazirx.com",
    about: "India's most trusted Bitcoin & cryptocurrency exchange.",
    fees: "0.2%",
    leverage: "-",
    liquidity: "Medium",
    volume: "Medium",
    withdrawal: "Min 1000 INR",
    deposit: "Min 100 INR",
    currencies: "250+",
    earning: "-",
    mining: "-",
    features: { spot: true, investment: false, derivatives_fno: false, p2p: true, inr_support: true }
  },
  {
    id: "binance",
    name: "Binance",
    logo: "https://logo.clearbit.com/binance.com",
    about: "Global cryptocurrency exchange that provides a platform for trading various cryptocurrencies.",
    fees: "Up to 0.1%",
    leverage: "Up to 125x",
    liquidity: "Very High",
    volume: "Very High",
    withdrawal: "Varies",
    deposit: "Varies",
    currencies: "600+",
    earning: "Earn, Staking",
    mining: "Pool",
    features: { spot: true, investment: true, derivatives_fno: true, p2p: true, inr_support: false }
  },
  {
    id: "coinbase",
    name: "Coinbase",
    logo: "https://logo.clearbit.com/coinbase.com",
    about: "Secure online platform for buying, selling, transferring, and storing digital currency.",
    fees: "0.5% - 4.5%",
    leverage: "-",
    liquidity: "High",
    volume: "High",
    withdrawal: "Varies",
    deposit: "Varies",
    currencies: "200+",
    earning: "Earn",
    mining: "-",
    features: { spot: true, investment: true, derivatives_fno: false, p2p: false, inr_support: false }
  }
];

export const COINGECKO_TO_DCX: Record<string, string> = {
  "bitcoin": "BTC",
  "ethereum": "ETH",
  "tether": "USDT",
  "binancecoin": "BNB",
  "solana": "SOL",
  "usd-coin": "USDC",
  "ripple": "XRP",
  "cardano": "ADA",
  "avalanche-2": "AVAX",
  "dogecoin": "DOGE",
  "polkadot": "DOT",
  "tron": "TRX",
  "chainlink": "LINK",
  "matic-network": "MATIC",
  "shiba-inu": "SHIB"
};
