
import { app } from "./app.js"
import { connectDB } from "./utils/db.js"


connectDB();
app.listen(process.env.PORT, () => {
    console.log(`LISTENING ON PORT ${process.env.PORT}`);
})