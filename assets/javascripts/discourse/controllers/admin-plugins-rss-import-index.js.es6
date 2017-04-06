import Feed from '../models/feed';

export default Ember.Controller.extend({
  changed: function(){
    this.get('model').forEach(function(feed){
      if (feed.get('url') == '' || feed.get('username') == null || feed.get('category_id') == null){
        feed.set('disableSave', true);
      }
      else {
        feed.set('disableSave', false); 
      }
    });
  }.observes('model.@each.url', 'model.@each.username', 'model.@each.category_id'),

  actions: {
    addFeed() {
      const newFeed = [];
      newFeed.set('url', '');
      newFeed.set('category_id', -1);
      newFeed.set('import_existing', false);
      newFeed.set('disableSave', true);
      newFeed.set('editing', true);
      this.get('model').pushObject(newFeed);
    },

    saveFeed(feed) {
      const self = this;
      this.set('model.loading', true);
      feed.set('category', Discourse.Category.findById(feed.get('category_id')));
      Discourse.User.findByUsername(feed.get('username')).then(function(result){
        feed.set('user', result);
        Feed.save(feed);
        feed.set('editing', false);
        self.set('model.loading', false);
      });
    },

    editFeed(feed){
      feed.set('originals', 
        {
          url: feed.url,
          username: feed.username,
          category_id: feed.category_id
        }
      )
      feed.set('editing', true);
    },

    cancelEdit(feed){
      feed.set('editing', false);
      if (feed.get('id')){
        feed.set('url', feed.get('originals.url'));
        feed.set('category_id', feed.get('originals.category_id'));
        feed.set('username', feed.get('originals.username'));
      }
      else{
        this.get('model').removeObject(feed);
      }
    },

    deleteFeed(feed) {
      var self = this;
      return bootbox.confirm(I18n.t("admin.rss_import.delete_feed_confirmation"), I18n.t("no_value"), I18n.t("yes_value"), function(result) {
        if (result) {
          Feed.destroy(feed).then(function(){ self.get('model').removeObject(feed); });
        }
      });
    }

  }
});