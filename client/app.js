// HTML reference

const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

// socket listeners

const socket = io()
socket.on('message', ({ author, content }) => addMessage(author, content));
socket.on('join', ({ name }) => addUser(name));

// global variable

let userName = '';

// first form

function login(event) {
  event.preventDefault();
  if (userNameInput.value === '') {
    alert('User name field can not be empty!');
  } else {
    userName = userNameInput.value;
    socket.emit('join', { name: userName });
    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
  }
}

loginForm.addEventListener('submit', login);

// second form

function addMessage(author, content) {
  const message = document.createElement('li');
  message.classList.add('message');
  message.classList.add('message--received');
  if (author === userName) message.classList.add('message--self');
  message.innerHTML = `
    <h3 class="message__author">${userName === author ? 'You' : author }</h3>
    <div class="message__content">
      ${content}
    </div>  
  `;
  messagesList.appendChild(message);
};

function sendMessage(event) {
  event.preventDefault();
  let messageContent = messageContentInput.value;
  if (messageContent === '') {
    alert('Field message can not be empty!');
  } else {
    addMessage(userName, messageContent);
    socket.emit('message', { author: userName, content: messageContent })
    messageContentInput.value = '';
  }
};

addMessageForm.addEventListener('submit', sendMessage);