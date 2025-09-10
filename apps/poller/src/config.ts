import dotenv from "dotenv"
dotenv.config();

export const WS_URl = "wss://ws.backpack.exchange/"
export const assets = ["SOL_USDC,BTC_UDC,ETH_USDC"]
export const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379"