import "../styles/globals.css";
import io from "socket.io-client";
import { useEffect } from "react";

const socket = io("http://localhost:8080");

function MyApp({ Component, pageProps }) {
  const handleLogin = () => {
    socket.emit("login", {
      name: "yy2122",
      userid: "0",
    });
  };

  const handleSendMessage = (mes) => {
    socket.emit("message", { msg: mes });
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("SOCKET CONNECTED!", socket.id);
    });

    socket.on("login", (data) => {
      console.log(data);
    });

    socket.on("message", (data) => {
      console.log(data.msg);
    });

    socket.on("disconnect", () => {
      console.log("서버와 연결이 해제되었습니다.");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("login");
      socket.off("message");
    };
  }, []);

  return (
    <>
      <Component {...pageProps} />
      <button onClick={handleLogin}>로그인</button>
      <button
        onClick={() => {
          handleSendMessage("메세지!!");
        }}
      >
        메세지 전송
      </button>
    </>
  );
}

export default MyApp;
