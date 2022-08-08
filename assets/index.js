const socket = io();

const userNameInput = document.querySelector(".user-name-input");
const messageInput = document.querySelector(".message-input");
const select = document.querySelector("select");
let previousChannel = 1;

socket.emit('get-history', select.options[ select.selectedIndex ].value);

document.querySelector("button").addEventListener("click", () => {
    socket.emit("message-send", { 
        message: messageInput.value, 
        userName: userNameInput.value
    });
});

select.addEventListener("change", () => {
    socket.emit("change-channel", {
        previousChannel: previousChannel,
        currentChannel: select.options[ select.selectedIndex ].value
    });
});

socket.on("message-response", (response) => {
    for (const data of response) {
        let tableRow = document.createElement("tr");
        let tableData = document.createElement("td");
        tableData.innerText = data.userName;
        tableRow.appendChild(tableData);
        tableData = document.createElement("td");
        tableData.innerText = data.message;
        tableRow.appendChild(tableData);
        document.querySelector("table").appendChild(tableRow);
    }
});