// NOTE nodeServer alag hai, ye website alag hai TODO so we have to connect this website to nodeServer 

const socket = io('http://localhost:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

// emit a event when user joins 
const name = prompt("Enter your name to join iChat");

socket.emit('new-user-joined', name);

const audio = new Audio('../media/ting.mp3');

const append = (message, position) => {

    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    // left/right in messageContainer
    messageElement.classList.add(position);

    messageContainer.append(messageElement);

    if (position == 'left') {
        audio.play();
    }

}

// NOTE server jo events emit krra, listen them here
socket.on('user-joined', val => {
    append(`${val} joined the chat`, 'right');
});

form.addEventListener('submit', (e) => {

    e.preventDefault();

    // input se value, use clean krdo for next msg 
    let message = messageInput.value;
    messageInput.value = '';

    // apne me right, uske me left me 
    append(`You : ${message}`, 'right');
    socket.emit('send', message);

});

socket.on('receive', data => {
    append(`${data.name} : ${data.message}`, 'left');
});

socket.on('left', name => {
    append(`${name} left the chat`, 'left');
})

