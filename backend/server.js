require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const User = require("./models/User");
const validator = require("validator");

const app = express();

/* =========================
   CONNECT DATABASE
========================= */
connectDB();

/* =========================
   MIDDLEWARE
========================= */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5174",
      "https://online-appointment-frontend.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"]
  })
);

/* ✅ IMPORTANT: Fixes CORS preflight error */
app.options("*", cors());

app.use(express.json());

/* =========================
   STATIC FILES
========================= */
app.use("/uploads", express.static("uploads"));

/* =========================
   ROUTES
========================= */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/appointments", require("./routes/appointment"));
app.use("/api/doctors", require("./routes/doctors"));
app.use("/api/admin", require("./routes/admin"));

/* =========================
   TEST ROUTES
========================= */
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Server is running!",
    database: "MongoDB Connected"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "OK",
    timestamp: new Date().toISOString()
  });
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);

  /* =========================
     CREATE DEFAULT ADMIN
  ========================= */
  try {
    const adminEmail = (
      process.env.DEFAULT_ADMIN_EMAIL || "rajalakshmi@gmail.com"
    )
      .trim()
      .toLowerCase();

    const adminPassword =
      process.env.DEFAULT_ADMIN_PASSWORD || "admin123";

    if (!validator.isEmail(adminEmail)) {
      throw new Error(`Invalid admin email: ${adminEmail}`);
    }

    let admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      admin = new User({
        name: "Admin",
        email: adminEmail,
        password: adminPassword,
        role: "admin"
      });
      await admin.save();
      console.log("✅ Default admin created:", adminEmail);
    } else {
      admin.password = adminPassword;
      admin.role = "admin";
      await admin.save();
      console.log("ℹ️ Admin updated with default password:", adminEmail);
    }
  } catch (error) {
    console.error("❌ Admin creation failed:", error.message);
  }
});
