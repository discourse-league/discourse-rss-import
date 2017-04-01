import computed from 'ember-addons/ember-computed-decorators';
import { popupAjaxError } from 'discourse/lib/ajax-error';

export default Ember.Controller.extend({
  baseFeed: function() {
    var a = [];
    a.set('url', 'example.com');
    a.set('username', 'system');
    a.set('category', 'Uncategorized');
    a.set('import_existing', false);
    a.set('editing', true);
    return a;
  }.property('model.@each.id'),

  actions: {
    addFeed() {
      const newFeed = [];
      newFeed.set('url', 'example.com');
      newFeed.set('username', 'system');
      newFeed.set('category', 'Uncategorized');
      newFeed.set('import_existing', false);
      newFeed.set('editing', true);
      console.log(newFeed);
      this.get('model').pushObject(newFeed);
    }
  }
});