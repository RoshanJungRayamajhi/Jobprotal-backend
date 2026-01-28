const express = require("express")
const cookieparsers = require("cookie-parser")
const app = express();
const cors = require("cors");
require("dotenv").config();


const allowedOrigins = [
  "http://localhost:5173",
  "https://jobprotal.netlify.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (Postman, server-side)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

const ConnnectDB = require("./config/db-config");





// Routes Required
const authRoutes = require("./Routes/authRoutes")
const companyRoutes = require("./Routes/companyRoutes")
const jobRoutes = require("./Routes/jobRoutes")
const applicationRoutes = require("./Routes/applicationRoutes")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieparsers())


app.use("/api/auth", authRoutes)
app.use("/api/company", companyRoutes)
app.use("/api/job", jobRoutes)
app.use("/api/application", applicationRoutes)



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
    ConnnectDB();
});