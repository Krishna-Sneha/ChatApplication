var socket = io();

const form = document.getElementById('send-info');
const inputMsg = document.getElementById('msgInput');
const chatBox = document.getElementById('chat-start');
const contacts = document.getElementById('contact-list');
const audio = new Audio('/audio/ting.mp3');

const append = (userName)=>
{
    const msgElement = document.createElement('div');
    msgElement.innerText = `${userName} has joined the chat`;
    msgElement.classList.add('center');
    msgElement.classList.add('msg');
    msgElement.classList.add('space-msg')
    chatBox.append(msgElement);
}

const appendMsgR = (msgInput)=>
{
    const msgElement = document.createElement('div');
    msgElement.innerHTML = `<p><span style="font-weight:bold;">You</span>: ${msgInput}</p>`;
    // msgElement.innerText = `<h1>You</h1>: ${msgInput}`;
    msgElement.classList.add('right');
    msgElement.classList.add('msg');
    chatBox.append(msgElement);
}

const appendMsgL = (data)=>
{
    const msgElement = document.createElement('div');
    msgElement.innerHTML = `<p><span style="font-weight:bold;">${data.name}</span>: ${data.message}</p>`;
    // msgElement.innerText = `${data.name}: ${data.message}`;
    msgElement.classList.add('left');
    msgElement.classList.add('msg');
    chatBox.append(msgElement);
    audio.play();
}

const appendMsgLeft = (userName)=>
{
    const msgElement = document.createElement('div');
    msgElement.innerText = `${userName} has left the chat`;
    msgElement.classList.add('center');
    msgElement.classList.add('msg');
    chatBox.append(msgElement);
}

// const newContact = (userName)=>
// {
//     const contactElement = document.createElement('div');
//     contactElement.innerText = userName;
//     contactElement.classList.add('contact-styling')
//     contacts.append(contactElement);
// }

const setProfile = (data)=>
{
    document.getElementById('profileImg').innerHTML = `<img src=${data.userProfile} alt='myPic'/>`
    document.getElementById('profileName').innerHTML = data.userName
    document.getElementById('profileEmail').innerHTML = data.userMail
}

form.addEventListener('submit', (event)=>{
    event.preventDefault();
    const messageInp = msgInput.value;
    if(messageInp != '')
        appendMsgR(messageInp);
    socket.emit('send', messageInp);
    msgInput.value = '';
})

socket.on('profile-create', (data)=>
{
    setProfile(data);
})

socket.on('user-joined', (userName)=>{
    append(userName);
    // newContact(userName);
});

socket.on('recieve', (data)=>
{
    appendMsgL(data);
})

socket.on('left', (userName)=>
{
    appendMsgLeft(userName);
})