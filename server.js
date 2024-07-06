const fastify = require("fastify");
const path = require('path')

const { RateLimiterMemory } = require('rate-limiter-flexible');
const rateLimiter = new RateLimiterMemory(
  {
    points: 10, // 초당 x회 limit
    duration: 2,
  }
);



const app = fastify();
app.register(require("fastify-socket.io"), {
  transports : ['websocket']
});

app.register(require('@fastify/static'), {
  root: path.join(__dirname, 'public'),
  // prefix: '/public/', 
})

app.listen({ port: 8080 });


var temp = 18;

app.get("/", (req, reply) => {
  return reply.sendFile('index.html')
});

// app.get("/getTemp", (req, reply) => {
//   return reply.send(temp)
// });


app.ready((err) => {
  if (err) throw err;
  console.log('http://localhost:8080')

  app.io.on("connect", (socket) =>{
    // console.log('connected', socket.id)
    socket.emit("init", temp);

    socket.on('disconnect', function(){
    });
    
    socket.on("plus", async (arg) => {
      try {
        await rateLimiter.consume(socket.handshake.headers['x-forwarded-for']); 
        if (temp < 30) {
          temp++;
        }
        app.io.emit('tempChange', {temp : temp, username : arg.substring(0, 9)})
      } catch (err) {
        socket.emit('blocked', '너무 잦은 요청');
      }
    })

    socket.on("minus", async (arg) => {
      try {
        await rateLimiter.consume(socket.handshake.headers['x-forwarded-for']); 
        if (temp > 18) {
          temp--;
        }
        app.io.emit('tempChange', {temp : temp, username : arg.substring(0, 9)})
      } catch (err) {
        socket.emit('blocked', '너무 잦은 요청');
      }
    })

  });
});
