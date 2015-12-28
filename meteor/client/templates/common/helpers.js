Template.registerHelper('time', function(date) {
    return moment(date).fromNow();
});