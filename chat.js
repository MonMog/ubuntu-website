const socket = io('ws://{DOMAIN}:PORT');


socket.on("userCountUpdate", (count) => {
  document.getElementById("userCount").innerText = count;
});


socket.on("newMessage", (message) => {
  const chatBox = document.getElementById("chatBox");
  const messageElement = document.createElement("div");
  messageElement.textContent = message;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight; 
});


document.getElementById("sendButton").addEventListener("click", () => {
  const messageInput = document.getElementById("messageInput");
  const message = messageInput.value.trim();
  if (message) {
    socket.emit("sendMessage", message);
    messageInput.value = ""; 
  }
});
