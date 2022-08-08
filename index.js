const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

app.use(express.static("assets"));
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile( __dirname + "/assets/index.html");
});

io.on("connection", async (socket) => {
    socket.emit("clear");
    const db = await open({filename: "./database/base.db", driver: sqlite3.Database});
    (await db.all("SELECT * FROM messages"))?.forEach((element) => {
        socket.emit("message-response", {
            message: element.message,
            userName: element.userName
        });
    });
    await db.close();

    socket.on("message-send", async (data) => {
        const db = await open({filename: "./database/base.db", driver: sqlite3.Database});
        await db.run(`INSERT INTO messages (userName, message) VALUES (?, ?)`, [data.userName, data.message]);
        console.log(data.userName);
        await db.close();
        io.emit("message-response", {
            message: data.message,
            userName: data.userName
        });
    });
});

server.listen(3000);