const socket = io();
const select = document.querySelector("select");

socket.emit("change-channel", { newChannel: 1 })

socket.emit('get-history', select.options[ select.selectedIndex ].value);
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

select.addEventListener("change", () => {
    document.querySelector("#chat").innerHTML = null;
    socket.emit("change-channel", {
        newChannel: select.options[ select.selectedIndex ].value
    });
    socket.emit('get-history', select.options[ select.selectedIndex ].value);
});


socket.on("message-response", (response) => {
    if (!response[0].history) {
        const audio = new Audio('./alert.wav');
        audio.volume = 0.5;
        audio.play();
    }
    for (const data of response) {
        const newMessage = document.createElement('div');
        newMessage.innerHTML = `<h2>${data.userName}</h2> <p>${data.message}</p>`;
        document.querySelector('#chat').appendChild(newMessage);
    }
    document.querySelector('#chat').scrollTop = document.querySelector('#chat').scrollHeight;
});