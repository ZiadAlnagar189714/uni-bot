const express = require("express")
const session = require("express-session")
const { Liquid } = require("liquidjs")
const cors = require("cors")
const MongoStore = require("connect-mongo")
const parser = require("body-parser")
const http = require("http")
const socketio = require("socket.io")

const db = require("./config/db");
const glob = require("./config/globals");

db();
const mode = glob("mode");
const port = glob("port") || 3000;
const app = express();
const engine = new Liquid();
const server = http.createServer(app);
const io = socketio(server);

app.engine("liquid", engine.express());
app.set("views", ["./pages/partials", "./pages/views"]);
app.set("view engine", "liquid");

app.use(cors());
app.listen(port, (err) => {
    if (err) throw err;
    console.log(
        `Server running in ${mode} mode on port ${port} ${
            !err ? ", and no errors found" : err
        }`
    );
});
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));
// cookies, mmm yummy
app.set("trust proxy", 1);
app.use(
    session({
        secret: "imgroot",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: glob("db") }),
        cookie: { maxAge: 30 * 24 * 60 * 60 * 1000, secure: false },
    })
);

app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});

// socket.io
const formatMessage = require("./controllers/message");

const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
} = require("./controllers/user");
const botName = "UNIChat Bot";

// Run when client connects
io.on("connection", (socket) => {
    socket.on("joinRoom", ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // Welcome current user
        socket.emit(
            "message",
            formatMessage(botName, "Welcome to UNIChat Bot!")
        );

        // Broadcast when a user connects
        socket.broadcast
            .to(user.room)
            .emit(
                "message",
                formatMessage(botName, `${user.username} has joined the chat`)
            );

        // Send users and room info
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room),
        });
    });

    // Listen for chatMessage
    socket.on("chatMessage", (msg) => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit("message", formatMessage(user.username, msg));
    });

    // Runs when client disconnects
    socket.on("disconnect", () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit(
                "message",
                formatMessage(botName, `${user.username} has left the chat`)
            );

            // Send users and room info
            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getRoomUsers(user.room),
            });
        }
    });
});

// Webhook
const token = "kimochi";
app.get("/webhook", (req, res) => {
    // check if verification token is correct
    if (req.query.token !== token) {
        return res.sendStatus(401);
    }

    // return challenge
    return res.end(req.query.challenge);
});
app.post("/webhook", (req, res) => {
    // check if verification token is correct
    if (req.query.token !== token) {
        return res.sendStatus(401);
    }
    // print request body
    console.log( "worked" + req.body);

    // return a text response
    const data = {
        type: "quickReplies",
        title: "foo bar baz",
        buttons: [
            {
                type: "postback",
                title: "foo",
                value: "bar",
            },
            {
                type: "postback",
                title: "baz",
                value: "qux",
            },
        ],
    };
    res.json(data);
});

app.use("/", require("./routes/routes"));
app.use(express.static("public"));
