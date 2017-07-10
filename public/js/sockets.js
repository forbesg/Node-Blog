(function () {

  // Perhaps integrate into Chat page or store last messages in DB??

  /*****
    Sockets
  *****/
  function Sockets() {
    const messageList = document.querySelector('.message-list');
    const commentForm = document.querySelector('#comment-form');
    const socket = io();
    if (commentForm) {
      commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let user = document.getElementById('user').value;
        let postId = document.getElementById('post-id').value;
        let messageElement = document.getElementById('message');
        let comment = messageElement.value;
        if (comment.length < 1) return;
        if (user && comment && comment !== "") {
          let newComment = {
            user,
            comment,
            postId
          }
          socket.emit('comment', newComment);
        }
        messageElement.value = "";
        return false;
      })
    }
    socket.on('newComment', comment => {
      let div = document.createElement('div');
      div.classList.add('comment-bubble');
      let header = document.createElement('div');
      header.classList.add('comment-header');
      header.textContent = comment.user;
      let messageBody = document.createElement('div');
      messageBody.classList.add('comment-body');
      messageBody.textContent = comment.comment;
      div.appendChild(header);
      div.appendChild(messageBody);
      messageList.appendChild(div);
      messageList.scrollTop = messageList.scrollHeight;
    })
  }

  window.onload = Sockets;

})();
