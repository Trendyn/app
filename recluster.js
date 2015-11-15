/**
 * Recluster module.
 * Implements master/worker server model.
 * @author opinioncurrent.com.
 */

var recluster = require('recluster');
var path      = require('path');

var cluster = recluster(path.join(__dirname, 'server.js'), { args: ["--start"] });
cluster.run();

process.on('SIGUSR2', function() {
  console.log('Got SIGUSR2, reloading cluster...');
  cluster.reload();
});

console.log("spawned cluster, kill -s SIGUSR2", process.pid, "to reload");