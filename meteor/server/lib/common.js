knex = Meteor.npmRequire("knex")({
  client: "mysql"
});

var toClass = {}.toString;

isEmptyObject = function (obj) {
  for(var prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }
  return true;
};

/* Convert mysql result in mongoDB style object using provided schema */
sqlToMongo = function (data, schema) {
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
};

/* Add or update the document in the collection array */
mergeDoc = function (collection, obj) {
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
};

pool  = mysql.createPool({
  host     : Meteor.settings.db_host,
  port     : Meteor.settings.db_port,
  user     : Meteor.settings.db_user,
  password : Meteor.settings.db_password,
  database : Meteor.settings.db,
  connectionLimit : 10
});
