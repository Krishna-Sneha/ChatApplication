// import reader from 'index.html'
// import reader from './index.html'

const express = require('express');
const app = express();
const http = require('http');
const bodyParser = require('body-parser');
const server = http.createServer(app);

const {Server} = require('socket.io');
const io = new Server(server);

const users = {}; 

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.sendFile(__dirname+'/index.html');
});

let userNameLog;
let userMailLog;
let avatar;

app.post('/', (req, res) => {
  userNameLog = req.body.Uname;
  userMailLog = req.body.Umail;
  userProfileLog = req.body.imgPassed;

  avatar = `https://api.dicebear.com/5.x/adventurer/svg?seed=${userMailLog}`;

  console.log("User name "+userNameLog);
  console.log("User mail "+userMailLog);
  console.log("User profile "+avatar);

  if(res.statusCode === 200)
    res.sendFile(__dirname+'/chat.html')
})


app.use(express.static('public'));

io.on('connection', (socket) => 
  {
    // socket.on('new-user-joined', (userName)=>
    // {
    //   users[socket.id] = userNameLog;
    //   console.log("New User",userName);
    //   socket.broadcast.emit('user-joined', userName);
    // })

    users[socket.id] = userNameLog;
    
    // const Imgsrc = userPic.src;
    socket.emit('profile-create', {userProfile:avatar, userName: userNameLog, userMail: userMailLog})

    socket.broadcast.emit('user-joined', userNameLog);

    socket.on('send', (message)=>
    {
      socket.broadcast.emit('recieve', {message: message, name: users[socket.id]});
    })

    socket.on('disconnect', ()=>
    {
      console.log(`${users[socket.id]} disconnected!`)
      socket.broadcast.emit('left', users[socket.id]);
      console.log(users);
    })

  });



server.listen(3000, () => {
  console.log('listening on *:3000');
});