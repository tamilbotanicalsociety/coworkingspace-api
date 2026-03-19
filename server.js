const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const { xss } = require("express-xss-sanitizer");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB(); 

// Route files
const coworkingspace = require("./routes/coworkingspace"); 
const bookings = require("./routes/bookings");
const auth = require("./routes/auth");

const app = express();

// Body parser
app.use(express.json());
// Sanitize data
app.use(mongoSanitize());
// Set cookie parser
app.use(cookieParser());
// Set security headers
app.use(helmet());
// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Co-working Space API",
      version: "1.0.0",
      description: "Project 6 - Co-working Space Reservation Backend API",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}/api/v1`,
      },
    ],
  },
  apis: ["./routes/*.js"],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// Mount routers
app.use("/api/v1/coworkingspace", coworkingspace);
app.use("/api/v1/bookings", bookings);
app.use("/api/v1/auth", auth);

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(
    "Server running in",
    process.env.NODE_ENV,
    "mode on port",
    PORT
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});