var toClass = {}.toString;

Meteor.methods({
  addComment: function(pollId, opinionId, commentText) {
    var polls = Opinions.find({"id": pollId}).fetch();
    polls[0].opinions[opinionId].comments.push({
      comment_deleted: 0,
      comment_text: commentText,
      comment_user_id: userId,
      comment_time: new Date()
    });
    Opinions.update({"id": opinionId}, polls[0]);

  }
});

function isEmptyObject(obj) {
  for(var prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }
  return true;
}

/* Convert mysql result in mongoDB style object using provided schema */
function sqlToMongo(data, schema) {
  var json = {};

  for(var key in schema) {
    if (toClass.call(schema[key]) === "[object Array]") {
      var arr = sqlToMongo(data, schema[key][0]);
      if(arr)
        json[key] = [].concat(arr);
    }
    else if (toClass.call(schema[key]) === "[object Object]") {
      json[key] = sqlToMongo(data, schema[key]);
    }
    else if (toClass.call(schema[key]) === "[object String]") {

      if (data[key] != null || data[key] != undefined) {
        if(schema[key] != "")
          json[schema[key]] = data[key];
        else
          json[key] = data[key];
      }
    }
  }

  return isEmptyObject(json) ? null : json;
}

/* Add or update the document in the collection array */
function mergeDoc(collection, obj) {
  var found = false;

  for(var doc in collection) {
    if (collection[doc].id == obj.id) {
      for (var key in obj) {
        if (toClass.call(obj[key]) === "[object Array]") {
          for(var idx in obj[key]) {
            if(!collection[doc][key])
              collection[doc][key] = [];
            collection[doc][key] = mergeDoc(collection[doc][key], obj[key][idx]);
          }
        } else {
          collection[doc][key] = obj[key];
        }
      }
      found = true;
    }
  }

  if (!found) {
    if (collection)
      collection.push(obj);
    else
      collection = [].push(obj);
  }

  return collection;
}
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

Meteor.publish("opinions", function (id) {
  var self = this;
  check(id, Number);
  var pollCollection = [];
  var initializing = true;

  liveDb.select(
      'SELECT p.id AS poll_id, p.question, pu.name AS poll_user_name, pu.usrImgURL AS poll_user_img_url, ' +
        'o.id AS opinion_id, o.opinion AS opinion, o.dt AS opinion_time, ou.id AS opinion_user_id, ' +
        'ou.name AS opinion_user_name, ou.usrImgURL AS opinion_user_img_url, c.id AS comment_id, c.comment_text, ' +
        'c.dt AS comment_time, c.deleted AS comment_deleted, cu.id AS comment_user_id, ' +
        'cu.name AS comment_user_name, cu.usrImgURL AS comment_user_img_url ' +
      'FROM polls AS p ' +
      'INNER JOIN users AS pu ' +
        ' ON p.user_id = pu.id ' +
      'LEFT OUTER JOIN opinions AS o ' +
      ' ON p.id=o.poll_id ' +
      'INNER JOIN users AS ou ' +
      ' ON o.user_id = ou.id ' +
      'LEFT OUTER JOIN comments as c ' +
      'ON o.id = c.opinion_id ' +
      'LEFT OUTER JOIN users as cu ' +
      'ON c.user_id = cu.id ' +
      ' WHERE p.id = ' + id + ';',
    [ { table: 'opinions' },
      { table: 'users' },
      { table: 'polls' },
      { table: 'comments' } ]
  ).on('update', function(diff, data) {


      for(var i=0 ; i < diff.added.length; i++) {

        var json = sqlToMongo(diff.added[i], {
          "poll_id" : "id",
          "question" : "",
          "poll_user_name": "",
          "poll_user_img_url": "",
          "opinions" : [
            {
              "opinion_id" : "id",
              "opinion" : "",
              "opinion_user_id" : "",
              "opinion_user_name" : "",
              "opinion_user_img_url": "",
              "opinion_time": "",
              "comments" : [
                {
                  "comment_deleted": "",
                  "comment_id": "id",
                  "comment_text" : "",
                  "comment_user_id" : "",
                  "comment_user_name" : "",
                  "comment_user_img_url": "",
                  "comment_time" : ""
                }
              ]
            }
          ]
        });

        pollCollection = mergeDoc(pollCollection, json);

        if(!initializing)
          self.changed("polls", id, pollCollection[0]);
      }
    });

  self.added("polls", id, pollCollection[0]);
  initializing = false;
  self.ready();
});

