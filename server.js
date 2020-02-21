const http = require("http");
const pid = process.pid;

http
  .createServer((req, res) => {
    for (let i = 0; i < 1e7; i++); // simulate CPU work
    res.write(`Handled by prcess ${pid}\n`);
    res.end(`Users: ${usersCount}`);
  })
  .listen(8080, () => {
    console.log(`Started process ${pid}`);
  });

process.on("message", msg => {
  usersCount = msg.usersCount;
  // console.log(`Users: ${usersCount}`);
});

setTimeout(() => {
  process.exit(1); // death by random timeout
}, Math.random() * 10000);
