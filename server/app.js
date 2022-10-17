const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const port = 8080;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// 현재 접속되어 있는 클라이언트로부터의 메시지를 수신하기 위해서는 on 메소드를 사용한다.
// socket 객체 - 개별 클라이언트와의 interacting을 위한 기본적인 객체이다.
// io 객체 - 연결된 전체 클라이언트와의 interacting을 위한 객체이다.
// on에는 받을 이벤트 이름, emit에는 일으킬 이벤트 이름

// 클라이언트가 접속할 떄 connection이벤트 발생하고 + socket이 전달됨.
io.on("connection", (socket) => {
  console.log("user connected");

  // 접속한 클라이언트의 정보가 수신되면
  socket.on("login", (data) => {
    console.log(
      "Client logged-in:\n name:" + data.name + "\n userid: " + data.userid
    );

    // socket에 클라이언트 정보를 저장한다
    socket.name = data.name;
    socket.userid = data.userid;

    // 접속된 모든 클라이언트에게 메시지를 전송한다
    io.emit("login", data.name);
  });

  socket.on("message", (data) => {
    console.log(data.message);

    const responseMsg = {
      msg: data.msg,
    };

    // 접속된 모든 클라이언트에게 메시지를 전송한다
    io.emit("message", responseMsg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(port, () => {
  console.log(`서버가 실행됩니다. http://localhost:${port}`);
});
