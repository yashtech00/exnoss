import express from "express"

import AuthRoute from "./routes/v1/index.js"

const app = express();

const PORT = process.env.PORT ||8080

app.use("api/v1/auth",AuthRoute)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
})

