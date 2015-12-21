Meteor.subscribe("opinions", 1);

Template.onboarding.helpers({
  polls: function () {
    return Opinions.find();
  },
  time: function(date) {
    return moment(date).fromNow();
  }
});

Meteor.methods({
  addComment: function(pollId, opinionId, commentText) {
    var polls = Opinions.find({"id": opinionId}).fetch();
    polls[0].opinions[opinionId].comments.push({
      comment_deleted: 0,
      comment_text: commentText,
      comment_user_id: userId,
      comment_time: new Date()
    });
    Opinions.update({"id": opinionId}, polls[0]);

  }
});
