liveCache = function(query, name, collection, field, watch) {
  console.log("Opening live db connection");

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


  var cacheMap = {};
  console.log("Publishing %s", name);

  Meteor.publish(name, function (id) {
    console.log("published");
    check(id, Number);

    if(isEmptyObject(cacheMap)) {
      liveDb.select(util.format(query,id),[watch])
        .on('update', Meteor.bindEnvironment(function (diff, data) {

          console.log("Got data");
          console.log(diff);


          for (var i = 0; i < diff.added.length; i++) {
            var json = diff.added[i];

            if (cacheMap[json.id]) {
              console.log("Cache %s updated id = %d", name, json.id);
              collection.update({id: json.id}, json);
            }
            else {
              console.log("Cache %s added id = %d", name, json.id);
              collection.insert(json);
              cacheMap[json.id] = 1;
            }

          }
        }));
    }
    var obj = {};
    obj[field] = id;
    return collection.find(obj);
  });
};

