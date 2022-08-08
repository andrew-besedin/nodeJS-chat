const socket = io();

userNameInput = document.querySelector(".user-name-input");
messageInput = document.querySelector(".message-input");

document.querySelector("button").addEventListener("click", () => {
    socket.emit("message-send", { 
        message: messageInput.value, 
        userName: userNameInput.value
    });
});

socket.on("message-response", (data) => {
    let tableRow = document.createElement("tr");
    let tableData = document.createElement("td");
    tableData.innerText = data.userName;
    tableRow.appendChild(tableData);
    tableData = document.createElement("td");
    tableData.innerText = data.message;
    tableRow.appendChild(tableData);
    document.querySelector("table").appendChild(tableRow);
});