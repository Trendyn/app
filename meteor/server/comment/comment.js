Comments = new Mongo.Collection("comments", {connection: null});

Meteor.methods({
  addComment: function(opinionId, comment) {
    var c = {
      comment_deleted: 0,
      comment: comment,
      comment_user_id: 1,
      comment_time: new Date(),
      opinion_id: opinionId
    };
    var q = "INSERT INTO comments(opinion_id, user_id, comment_text, dt, deleted) VALUES (" +
      c.opinion_id + "," +
      c.comment_user_id + "," +
      "'" + c.comment + "'," +
      "CURDATE()," +
      c.comment_deleted + ");";

    console.log(q);
    pool.query(q, function(err, rows, fields) {
        if (err) throw err;
      });
  }
});

var q = knex.select("c.id AS id",
                 "c.opinion_id AS opinion_id",
                 "c.comment_text AS comment",
                 "c.dt AS comment_time",
                 "cu.id AS comment_user_id",
                 "cu.name AS comment_user_name",
                 "cu.usrImgURL AS comment_user_img_url",
                 "deleted as comment_deleted,",
                 "o.poll_id as poll_id")
         .from("opinions AS o")
         .innerJoin("comments AS c", "o.id", "c.opinion_id")
         .innerJoin("users AS cu", "c.user_id", "cu.id")
         .where({"o.poll_id": "%d"})
         .toString();


  liveCache(q, "comments", Comments, "poll_id",
  [ { table: 'comments' },
    { table: 'users' } ]);
