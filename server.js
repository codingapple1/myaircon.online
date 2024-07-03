const fastify = require("fastify");
const path = require('path')

const {RateLimiterMemory} = require('rate-limiter-flexible');
const rateLimiter = new RateLimiterMemory(
    {
      points: 15, // 초당 x회 limit
      duration: 1,
    }
);

const temperatures = {
  min: 20,
  now: 20,
  max: 30
}

const app = fastify();
app.register(require("fastify-socket.io"), {});

app.register(require('@fastify/static'), {
  root: path.join(__dirname, 'public'),
  // prefix: '/public/', 
})

app.listen({port: 8080});

app.get("/", (req, reply) => {
  return reply.sendFile('index.html')
});

// app.get("/getTemp", (req, reply) => {
//   return reply.send(temp)
// });

app.ready((err) => {
  if (err) {
    throw err;
  }
  console.log('http://localhost:8080')

  app.io.on("connect", (socket) => {
    // console.log('connected', socket.id)
    socket.emit("init", temperatures.min);

    socket.on('disconnect', function () {
    });

    socket.on("plus", async (arg) => {
      try {
        await rateLimiter.consume(socket.handshake.headers['x-real-ip']);
        if (temperatures.now < temperatures.max) {
          temperatures.now++;
        }
        app.io.emit('tempChange',
            {temp: temperatures.now, username: arg.substring(0, 9)})
      } catch (err) {
        socket.emit('blocked', '너무 잦은 요청');
      }
    })

    socket.on("minus", async (arg) => {
      try {
        await rateLimiter.consume(socket.handshake.address);
        if (temperatures.now > temperatures.min) {
          temperatures.now--;
        }
        app.io.emit('tempChange',
            {temp: temperatures.now, username: arg.substring(0, 9)})
      } catch (err) {
        socket.emit('blocked', '너무 잦은 요청');
      }
    })
  });
});
