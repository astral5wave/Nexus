const express = require("express");
require("dotenv").config();
const errorHandler = require("./middlewares/errorHandler");
const connectDb = require("./config/dbConnection");
const passport = require("./config/passport");
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

connectDb();
app.use(express.json());

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
        "Content-Type",
        "Authorization"
    ],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(passport.initialize());

app.use("/api/auth", require("./routes/authRouter"));
app.use("/api/user", require("./routes/userRouter"));
app.use("/api/contact", require("./routes/contactRouter"));
app.use("/api/demouser", require("./routes/demoUserRouter"))

const frontendPath = path.join(__dirname, "..", "frontend", "dist");
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(frontendPath, "index.html"));
  } else {
    res.status(404).json({ error: true, message: "API route not found" });
  }
});

app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server listening at port : ${PORT}`);
})
