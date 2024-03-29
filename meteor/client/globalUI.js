// Generated by CoffeeScript 1.10.0
(function() {
  this.GlobalUI = (function() {
    function GlobalUI() {}

    GlobalUI.dialog = {};

    GlobalUI.toast = function(text, className) {
      var toast;
      toast = $("[global-toast]")[0];
      toast.text = text;
      return toast.show();
    };

    GlobalUI.showDialog = function(opts) {
      this.dialog = $("[global-dialog]")[0];
      this.dialog.heading = opts.heading;
      Session.set("global.ui.dialogData", opts.data);
      Session.set("global.ui.dialogTemplate", opts.template);
      Session.set("global.ui.dialogFullOnMobile", opts.fullOnMobile != null);
      return Tracker.afterFlush((function(_this) {
        return function() {
          return _this.dialog.open();
        };
      })(this));
    };

    GlobalUI.closeDialog = function() {
      return this.dialog.close();
    };

    return GlobalUI;

  })();

  Template.globalLayout.helpers({
    globalDialogTemplate: function() {
      return Session.get("global.ui.dialogTemplate");
    },
    globalDialogData: function() {
      return Session.get("global.ui.dialogData");
    },
    globalDialogFullOnMobile: function() {
      return Session.get("global.ui.dialogFullOnMobile");
    }
  });

  Template.globalLayout.events({
    "core-overlay-close-completed [global-dialog]": function(e) {
      Session.set("global.ui.dialogTemplate", null);
      Session.set("global.ui.dialogData", null);
      return Session.set("global.ui.dialogFullOnMobile", null);
    },
    "click [data-open-dialog]": function(e) {
      var node;
      node = $(e.target);
      return GlobalUI.showDialog({
        heading: node.data("heading"),
        template: node.data("openDialog"),
        data: node.data("useContext") != null ? this : void 0,
        fullOnMobile: node.data("fullOnMobile")
      });
    },
    "click [data-action=sign-in]": function(evt) {
      return Router.go("accounts.signIn");
    },
    "click [data-action=sign-up]": function(evt) {
      return Router.go("accounts.signUp");
    },
    "click [data-action=about]": function(evt) {
      return Router.go("about");
    }
  });

}).call(this);
