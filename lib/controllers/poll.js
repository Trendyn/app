/**
 * Poll module,
 * Abstracts Poll module, provide functions for handling polls
 * @author opinioncurrent.com
 */

var util  = require('util');
var db    = require('./db');
var ok    = require('okay');
var utils = require('../../common/utils');

/*=====================================================
 *   MySQL Stored procedure queries.
 * ===================================================*/
var GetWorldVotesSP            = "CALL GetWorldVotes            ('%d');";
var GetCountryVotesSP          = "CALL GetCountryVotes          ('%d', '%s');";
var GetStateVotesSP            = "CALL GetStateVotes            ('%d', '%s', '%d');";
var postVoteSP                 = "CALL PostVote                 ('%d', '%d', '%d');";
var createPollSP               = "CALL CreatePoll               ('%d', '%s');";
var getCommentsSP              = "CALL GetComments              ('%d');";
var postOpinionCommentSP       = "CALL CreateComment            ('%d', '%d', '%s');";
var getPollsSP                 = "CALL GetPolls                 ();";
var getOpinionsSP              = "CALL GetOpinions              ('%d');";
var postOpinionSP              = "CALL CreateOpinion            ('%d', '%d', '%s');";
var postOpinionLikeSP          = "CALL PostOpinionLike          ('%d', '%d');";

function mergeVotes (votes) {
  var result = {};
  var totalcount = {};

  for (var idx in votes) {
    if (utils.isInteger(parseInt(idx))) {
      var feature = votes[idx];

      if (totalcount[feature.id] == undefined) {
        totalcount[feature.id] = feature.count;
      } else {
        totalcount[feature.id] += feature.count;
      }
      feature.options = [{ 'id': feature.option_id ,'option': feature.optionstr, 'color' : feature.color, 'count' : feature.count }];

      delete feature.optionstr;
      delete feature.option_id;
      delete feature.color;
      delete feature.count;

      result[feature.id] = utils.mergeObjs(result[feature.id], feature);
      result[feature.id].totalcount = totalcount[feature.id];
    }
  }

  return result;
}

function mergePolls (polls) {
  var arr = [];
  var result = {};
  var idx = 0;

  for (idx in polls) {
    var poll  = polls[idx];

    poll.options = [ { 'id': poll.option_id ,'option': poll.optionstr, 'color' : poll.color} ];
    delete poll.optionstr;
    delete poll.option_id;
    delete poll.color;

    result[poll.poll_id] = utils.mergeObjs(result[poll.poll_id], poll);

  }

  for (idx = 1; idx <= Object.keys(result).length; idx++)
  {
    arr.push(result[idx]);
  }

  return arr;
}

var Poll = {

  /*=====================================================
   *    Local create poll stored procedure call
   * ===================================================*/
  createPoll: function(user_id,
                       question,
                       callback) {

    var query = util.format(createPollSP,
                            user_id,
                            question);
    console.log(query);
    db.getConnection(
      ok(callback, function(conn) {
        conn.query(query,
          ok(callback, function (rows) {
            conn.release();
            return callback(null, rows[0][0]);
          })
        );
      })
    );
  },

  /*=====================================================
   *    Get World votes stored procedure call
   * ===================================================*/
  getWorldVotes: function(poll_id,
                          callback) {

    var query = util.format(GetWorldVotesSP,
                            poll_id);
    console.log(query);
    db.getConnection(
      ok(callback, function(conn) {
        conn.query(query,
          ok(callback, function (rows) {
            conn.release();
            var result = mergeVotes(rows[0]);
            return callback(null, result);
          })
        );
      })
    );
  },

  /*=====================================================
   *    Get Country votes stored procedure call
   * ===================================================*/
  getCountryVotes: function(poll_id,
                            country_code,
                            callback) {

    var query = util.format(GetCountryVotesSP,
                            poll_id,
                            country_code);
    console.log(query);
    db.getConnection(
      ok(callback, function(conn) {
        conn.query(query,
          ok(callback, function (rows) {
            conn.release();
            var result = mergeVotes(rows[0]);
            return callback(null, result);
          })
        );
      })
    );
  },

  /*=====================================================
   *    Get State votes stored procedure call
   * ===================================================*/
  getStateVotes: function(poll_id,
                         country_code,
                         state_code,
                         callback) {

    var query = util.format(GetStateVotesSP,
                            poll_id,
                            country_code,
                            state_code);
    console.log(query);
    db.getConnection(
      ok(callback, function(conn) {
        conn.query(query,
          ok(callback, function (rows) {
            conn.release();
            var result = mergeVotes(rows[0]);
            return callback(null, result);
          })
        );
      })
    );
  },

  /*=====================================================
   *    Post vote stored procedure call
   * ===================================================*/
  postVote: function(poll_id,
                     user_id,
                     option_id,
                     callback) {

    var query = util.format(postVoteSP,
      poll_id,
      user_id,
      option_id);
    console.log(query);
    db.getConnection(
      ok(callback, function(conn) {
        conn.query(query,
          ok(callback, function (rows) {
            conn.release();
            return callback(null, rows[0][0]);
          })
        );
      })
    );
  },

  /*=====================================================
   *    Local get polls stored procedure call
   * ===================================================*/
  getPolls: function(callback) {

    var query = util.format(getPollsSP);
    console.log(query);
    db.getConnection(
      ok(callback, function(conn) {
        conn.query(query,
          ok(callback, function (rows) {
            conn.release();
            var result = mergePolls(rows[0]);
            return callback(null, result);
          })
        );
      })
    );
  },

  /*=====================================================
   *    Local get poll comments stored procedure call
   * ===================================================*/
  getComments: function(opinion_id,
                        callback) {

    var query = util.format(getCommentsSP, opinion_id);
    console.log(query);
    db.getConnection(
      ok(callback, function(conn) {
        conn.query(query,
          ok(callback, function (rows) {
            conn.release();
            return callback(null, rows[0]);
          })
        );
      })
    );
  },

  /*=====================================================
   *    Local post opinion comment stored procedure call
   * ===================================================*/
  postOpinionComment: function(opinion_id, user_id, comment, callback) {

    var query = util.format(postOpinionCommentSP,
      opinion_id,
      user_id,
      comment);

    console.log(query);
    db.getConnection(
      ok(callback, function(conn) {
        conn.query(query,
          ok(callback, function (rows) {
            conn.release();
            return callback(null, rows[0]);
          })
        );
      })
    );
  },

  /*=====================================================
   *    Local get opinions stored procedure call
   * ===================================================*/
  getOpinions: function(poll_id, callback) {

    var query = util.format(getOpinionsSP, poll_id);
    console.log(query);
    db.getConnection(
      ok(callback, function(conn) {
        conn.query(query,
          ok(callback, function (rows) {
            conn.release();
            return callback(null, rows[0]);
          })
        );
      })
    );
  },

  /*=====================================================
   *    Local post opinion like stored procedure call
   * ===================================================*/
  postOpinion: function(poll_id, user_id, opinion, callback) {

    var query = util.format(postOpinionSP,
      poll_id,
      user_id,
      opinion);

    console.log(query);
    db.getConnection(
      ok(callback, function(conn) {
        conn.query(query,
          ok(callback, function (rows) {
            conn.release();
            return callback(null, rows[0]);
          })
        );
      })
    );
  },

  /*=====================================================
   *    Local post opinion like stored procedure call
   * ===================================================*/
  postOpinionLike: function(opinion_id, user_id, callback) {

    var query = util.format(postOpinionLikeSP,
      opinion_id,
      user_id);

    console.log(query);
    db.getConnection(
      ok(callback, function(conn) {
        conn.query(query,
          ok(callback, function (rows) {
            conn.release();
            return callback(null, rows[0]);
          })
        );
      })
    );
  }
};

function init() {

}

function installRoutes(app, ensureAuthenticated) {

  app.get('/getpolls', ensureAuthenticated,
    function(req, res, next) {
      Poll.getPolls (
        ok(next, function (rows) {
          var polls = [];

          for(var key in rows) {
            var entry = rows[key];
            var item = {};

            item.user = {};
            item.user.id = entry.user_id;
            item.user.name = entry.name;
            item.user.imgurl = entry.usrImgURL;
            item.user.url = "http://0.0.0.0:9000/user";
            item.time = entry.date;
            item.options = entry.options;
            item.poll = entry.poll;
            item.poll_id = entry.poll_id;

            polls.push(item);
          }

          return res.jsonp(polls);
        }));
    }
  );

  app.get('/pollcomments/:id', ensureAuthenticated,
    function(req, res, next) {
      Poll.getComments(req.params.id,
        ok(next, function (rows) {
          var resp = {};
          resp.comments = {};
          resp.comments.list = [];

          resp.count = rows.length;

          rows.forEach(function(entry) {
            var item = {};
            item.user = {};

            item.user.id = "bnilson";
            item.user.name = entry.name;
            item.user.imgurl = entry.usrImgURL;
            item.user.url = "http://0.0.0.0:9000/user";
            item.time = entry.dt;
            item.text = entry.comment_text;

            resp.comments.list.push(item);
          });

          return res.jsonp(resp);
        }));

    }
  );

  app.post('/pollcomments/:id', ensureAuthenticated,
    function(req, res, next) {

      /* Pass Opinion ID, User ID, Comment text */
      Poll.postOpinionComment(req.body.id, req.session.passport.user.id, req.body.comment,
        ok(next, function (cmnt) {
          if (!cmnt) {
            //todo: is the failure handling correct?
            req.session.messages =  [info.message];
            return res.send("failure");
          }
          var item = {};
          item.dt = cmnt[0].dt;
          return res.send(item);
        }));
    }
  );

  app.get('/getworldvotes/:id', ensureAuthenticated,
    function(req, res, next) {
      Poll.getWorldVotes(req.params.id,
        ok(next, function (rows) {
          return res.jsonp(rows);
        }));

    }
  );

  app.get('/getcountryvotes/:id/:country_code', ensureAuthenticated,
    function(req, res, next) {
      Poll.getCountryVotes(req.params.id,
                         req.params.country_code,
        ok(next, function (rows) {
          return res.jsonp(rows);
        }));

    }
  );

  app.get('/getstatevotes/:id/:country_code/:state_id', ensureAuthenticated,
    function(req, res, next) {
      Poll.getStateVotes(req.params.id,
                           req.params.country_code,
                           req.params.state_id,
        ok(next, function (rows) {
          return res.jsonp(rows);
        }));

    }
  );

  app.post('/votes', ensureAuthenticated,
    function(req, res, next) {
      /* Pass Poll ID, User ID & Vote */
      Poll.postVote(req.body.id, req.session.passport.user.id, req.body.optionId,
        ok(next, function (vote) {
          if (!vote) {
            //todo: is the failure handling correct?
            req.session.messages =  [info.message];
            return res.send("failure");
          }
          return res.send("success");
        }));
    }
  );

  app.get('/opinions/:id', ensureAuthenticated,
    function(req, res, next) {
      Poll.getOpinions(req.params.id,
        ok(next, function (rows) {
          var opinions = [];

          rows.forEach(function(entry) {
            var item = {};
            item.user = {};

            item.id = entry.id;
            item.user.id = "bnilson";
            item.user.name = entry.name;
            item.user.imgurl = entry.usrImgURL;
            item.user.url = "http://0.0.0.0:9000/user";
            item.time     = entry.dt;
            item.opinion  = entry.opinion;
            item.poll     = entry.question;

            opinions.push(item);
          });

          return res.jsonp(opinions);
        }));
    }
  );

  app.post('/opinions', ensureAuthenticated,
    function(req, res, next) {

      /* Pass Poll ID, User ID, Opinion text */
      Poll.postOpinion(req.body.pollid, req.session.passport.user.id, req.body.opinion,
        ok(next, function (opn) {
          var item = {};

          if (!opn) {
            //todo: is the failure handling correct?
            req.session.messages =  [info.message];
            return res.send("failure");
          }

          item.id = opn[0].id;
          item.dt = opn[0].dt;
          return res.jsonp(item);
        }));
    }
  );

  app.post('/opinionlike', ensureAuthenticated,
    function(req, res, next) {
      /* Pass Opinion ID, User ID */
      Poll.postOpinionLike(req.body.id, req.session.passport.user.id,
        ok(next, function (like) {
          if (!like) {
            //todo: is the failure handling correct?
            req.session.messages =  [info.message];
            return res.send("failure");
          }
          return res.send("success");
        }));
    }
  );
}

module.exports = Poll;
module.exports.init = init;
module.exports.installRoutes = installRoutes;
