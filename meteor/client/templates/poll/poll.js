Opinions = new Mongo.Collection("opinions");

Meteor.subscribe("poll", 1);
Meteor.subscribe("opinions", 1);

Template.poll.helpers({
  poll: function (id) {
    return Poll.find({id: id});
  },
  opinions: function(id){
    return Opinions.find({poll_id: id});
  }
});
