Opinions = new Mongo.Collection('opinions', {connection: null});

var q = knex.select("o.id AS id",
  "o.poll_id AS poll_id",
  "o.opinion AS opinion",
  "o.dt AS opinion_time",
  "ou.id AS opinion_user_id",
  "ou.name AS opinion_user_name",
  "ou.usrImgURL AS opinion_user_img_url")
  .from("opinions AS o")
  .innerJoin("users AS ou", "o.user_id", "ou.id")
  .where({"o.poll_id": "%d"})
  .toString();


liveCache(q, "opinions", Opinions, "poll_id",
  [ { table: 'opinions' },
    { table: 'users' } ]);
