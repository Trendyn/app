ServiceConfiguration.configurations.remove({
  service: 'facebook'
});

ServiceConfiguration.configurations.insert({
  service: 'facebook',
  appId: Meteor.settings.facebook_app_id,
  secret: Meteor.settings.facebook_app_secret
});