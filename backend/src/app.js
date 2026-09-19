import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express from "express";
import { createServer } from "node:http";
import mongoose from "mongoose";
import cors from "cors";

import { connectToSocket } from "./controllers/socketManager.js";
import userRoutes from "./routes/users.routes.js";

const app = express();
const server = createServer(app);

// Socket.IO
connectToSocket(server);

// Port
app.set("port", process.env.PORT || 8000);

// Middleware
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

// Routes
app.use("/api/v1/users", userRoutes);

// Start server
const start = async () => {
    try {
        const connectionDb = await mongoose.connect(process.env.MONGO_URI)

        console.log(
            `MONGO Connected DB Host: ${connectionDb.connection.host}`
        );

        server.listen(app.get("port"), () => {
            console.log(`SERVER RUNNING ON PORT ${app.get("port")}`);
        });

    } catch (error) {
        console.error("MONGODB CONNECTION FAILED:");
        console.error(error.message);
        process.exit(1);
    }
};

start();