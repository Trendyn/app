Template.login.events({
  'click #at-facebook': function(event) {
    Meteor.loginWithFacebook({}, function(err){
      if (err) {
        throw new Meteor.Error("Facebook login failed");
      }
    });
  },

  'click #logout': function(event) {
    Meteor.logout(function(err){
      if (err) {
        throw new Meteor.Error("Logout failed");
      }
    })
  }
});