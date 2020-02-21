const cluster = require("cluster");
const os = require("os");

const numberOfUsersInDB = function() {
  this.count = this.count || 5;
  this.count = this.count * this.count;
  return this.count;
};

if (cluster.isMaster) {
  const cpus = os.cpus().length;

  console.log(`Forking for ${cpus} CPUs`);
  for (let i = 0; i < cpus; i++) {
    // After the first time this is run, the isMaster
    // flag is set to false and isWorker is set to true
    cluster.fork();
  }

  // Handle a crash gracefully
  cluster.on("exit", (worker, code, signal) => {
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      console.log(`Worker ${worker.id} crashed. ` + "Starting a new worker...");
      cluster.fork();
    }
  });

  const updateWorkers = () => {
    const usersCount = numberOfUsersInDB();
    Object.values(cluster.workers).forEach(worker => {
      worker.send({ usersCount });
    });
  };

  updateWorkers();
  setInterval(updateWorkers, 10000);

  //   // Send message to each worker
  //   Object.values(cluster.workers).forEach(worker => {
  //     worker.send(`Hello Worker ${worker.id}`);
  //   });
} else {
  require("./server"); // on each fork, the server is loaded and run
}
