(function () {

  // Perhaps integrate into Chat page or store last messages in DB??

  /*****
    Sockets
  *****/
  chatInput.addEventListener('submit', (e) => {
    e.preventDefault();
    let user = document.getElementById('user').value;
    let messageElement = document.getElementById('message');
    let message = messageElement.value;
    if (message.length < 1) return;
    if (user && message && message !== "") {
      let newMessage = {
        user,
        message
      }
      socket.emit('message', newMessage);
    }
    messageElement.value = "";
    return false;
  })
  socket.on('newMessage', message => {
    let div = document.createElement('div');
    div.classList.add('chat-bubble');
    let header = document.createElement('div');
    header.classList.add('chat-header');
    header.textContent = message.user;
    let messageBody = document.createElement('div');
    messageBody.classList.add('chat-body');
    messageBody.textContent = message.message;
    div.appendChild(header);
    div.appendChild(messageBody);
    // let li = document.createElement('li');
    // li.textContent = message.message;
    messageList.appendChild(div);
    messageList.scrollTop = messageList.scrollHeight;
  })
})();
