import WebSocket from "ws";
import { assets, WS_URl } from "./config.js";
import { decimals, latestPrices } from "./store.js";
import { redis } from "./redis.js";

const wss = new WebSocket(WS_URl);

let Id = 1;

wss.on("open", () => {
    console.log("connected to backpack ws");

    assets.forEach((asset) => {
        const SubscribeMessage = [
            {
                method: "SUBSCRIBE",
                params: [`bookTicker.${asset}`],
                id: Id++
            },

        ]
        SubscribeMessage.forEach((msg) => {
            wss.send(JSON.stringify(msg));
        })
        console.log("Subscribe", SubscribeMessage);
        
    })
    
});

wss.on("message", (msg) => {
    try {
        const parsedData = JSON.parse(msg.toString());
        if (parsedData?.data?.e === "bookTicker") {
            const symbol = parsedData.data.s;
            const ask = parseFloat(parsedData.data.a);
            const bid = parseFloat(parsedData.data.b);
            const price = (ask + bid) / 2;

            latestPrices[symbol] = {
                price,
                decimal: decimals[symbol]!
            }
        }
    } catch (e) {
        console.error("ws parsed data error: ", e);
        
    }
});

wss.on("error", (err) => {
    console.error("ws error:",err);
    
})

wss.on("close", (code,reason) => {
     console.error("WS closed:", code, reason.toString());
})

setInterval(async() => {
    const updates = Object.entries(latestPrices).map(([SymbolName, data]) => ({
        asset: SymbolName.split("_",)[0],
        price: Math.round(data.price * 10 ** data.decimal),
        decimals:data.decimal
    }))

    if (updates.length > 0) {
        const payload = { price_updates: updates };
        console.log("Price update pushing to Redis:", payload); 
        await redis.xadd('price_stream', 'MAXLEN', '~', '10000', '*', 'data', JSON.stringify(payload))
    }  
})