import { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { Socket } from "socket.io-client";

export interface IChatProps {
  username: string;
  room: string;
  socket: Socket;
}

export interface IMessageData{
  room: string,
  author: string,
  message: string,
  time: string
}

function Chat({room, username, socket}: IChatProps) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState<IMessageData[]>([]);

  const sendMessage = () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, []);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent:IMessageData, index) => {
            return (
              <div
                className="message"
                id={username === messageContent.author ? "you" : "other"}
                key={index}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}
export default Chat;
