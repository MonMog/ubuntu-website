const socket = io('ws://{DOMAIN}:PORT', {
  query: { username: sessionStorage.getItem("username") || "" }
});

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

socket.on("userListUpdate", (userList) => {
  const userListContainer = document.getElementById("userList");
  userListContainer.innerHTML = "";
  userList.forEach((user) => {
    const userElement = document.createElement("li");
    userElement.textContent = user;
    userElement.dataset.username = user;
    userElement.classList.add("user-list-item");
    userListContainer.appendChild(userElement);
  });
});

document.getElementById("sendButton").addEventListener("click", () => {
  const messageInput = document.getElementById("messageInput");
  const message = messageInput.value.trim();
  if (message) {
    socket.emit("sendMessage", message);
    messageInput.value = ""; 
  }
});
