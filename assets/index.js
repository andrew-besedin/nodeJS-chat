const socket = io();
socket.emit('get-history');
if (localStorage.getItem('name')) document.querySelector(".user-name-input").value = localStorage.getItem('name');

document.querySelector("button").addEventListener("click", () => {
    const userNameInput = document.querySelector(".user-name-input");
    const messageInput = document.querySelector(".message-input");
    if (!messageInput.value || !userNameInput.value) return;
    localStorage.setItem('name', userNameInput.value);

    socket.emit("message-send", { 
        message: messageInput.value, 
        userName: userNameInput.value
    });
});

socket.on("message-response", (response) => {
    for (const data of response) {
        const newMessage = document.createElement('div');
        newMessage.innerHTML = `<h2>${data.userName}</h2> <p>${data.message}</p>`;
        document.querySelector('#chat').appendChild(newMessage);
    }
    document.querySelector('#chat').scrollTop = document.querySelector('#chat').scrollHeight;
});