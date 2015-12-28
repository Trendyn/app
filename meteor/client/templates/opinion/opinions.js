Comments = new Mongo.Collection("comments");
Meteor.subscribe("comments", 1);

Template.opinion.helpers({
  comments: function (id) {
   return Comments.find({opinion_id: id}, {limit: 5});
  }
});

Meteor.methods({
  addComment: function(opinionId, comment) {
  var c = {
    comment_deleted: 0,
    comment: comment,
    comment_user_id: 1,
    comment_time: new Date(),
    opinion_id: opinionId
  };
  Comments.insert(c);
  }
});
