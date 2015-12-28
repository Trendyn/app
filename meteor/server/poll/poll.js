/* Live connection to database */
var liveDb = new LiveMysql({
  host     : Meteor.settings.db_host,
  port     : Meteor.settings.db_port,
  user     : Meteor.settings.db_user,
  password : Meteor.settings.db_password,
  database : Meteor.settings.db
});

var closeAndExit = function() {
  liveDb.end();
  process.exit();
};
// Close connections on hot code push
process.on('SIGTERM', closeAndExit);
// Close connections on exit (ctrl + c)
process.on('SIGINT', closeAndExit);

Meteor.publish("poll", function (id) {
  var self = this;
  check(id, Number);
  var pollCollection = [];
  var initializing = true;

  liveDb.select(
      'SELECT p.id AS poll_id, p.question, pu.name AS poll_user_name, pu.usrImgURL AS poll_user_img_url ' +
      'FROM polls AS p ' +
      'INNER JOIN users AS pu ' +
      ' ON p.user_id = pu.id ' +
      ' WHERE p.id = ' + id + ';',
    [ { table: 'users' },
      { table: 'polls' } ]
  ).on('update', function(diff, data) {

      for(var i=0 ; i < diff.added.length; i++) {

        var json = sqlToMongo(diff.added[i], {
          "poll_id" : "id",
          "question" : "",
          "poll_user_name": "",
          "poll_user_img_url": ""
        });

        pollCollection = mergeDoc(pollCollection, json);

        if(!initializing)
          self.changed("poll", id, pollCollection[0]);
      }
    });

  self.added("poll", id, pollCollection[0]);
  initializing = false;
  self.ready();
});

