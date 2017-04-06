import { ajax } from 'discourse/lib/ajax';

const RssFeed = Discourse.Model.extend(Ember.Copyable, {

  init: function() {
    this._super();
  }
});

var RssFeeds = Ember.ArrayProxy.extend({
  selectedItemChanged: function() {
    var selected = this.get('selectedItem');
    _.each(this.get('content'),function(i) {
      return i.set('selected', selected === i);
    });
  }.observes('selectedItem')
});

RssFeed.reopenClass({

  findAll: function() {
    var rssFeeds = RssFeeds.create({ content: [], loading: true });
    ajax('/rss-import').then(function(feeds) {
      if (feeds){
        _.each(feeds, function(feed){
            rssFeeds.pushObject(RssFeed.create({
            id: feed.id,
            url: feed.url,
            user_id: feed.user_id,
            username: feed.username,
            category: Discourse.Category.findById(feed.category_id),
            category_id: feed.category_id
          }));
        });
      };
      rssFeeds.set('loading', false);
    });
    return rssFeeds;
  },

  save: function(object, enabledOnly=false) {
    console.log(object);
    if (object.get('disableSave')) return;
    
    object.set('savingStatus', I18n.t('saving'));
    object.set('saving',true);

    var data = { enabled: object.enabled };

    if (object.id){
      data.id = object.id;
    }

    if (!object || !enabledOnly) {
      data.url = object.url;
      data.user_id = object.user.id;
      data.category_id = object.category_id;
    };
    
    return ajax("/rss-import", {
      data: JSON.stringify({"feed": data}),
      type: object.id ? 'PUT' : 'POST',
      dataType: 'json',
      contentType: 'application/json'
    }).then(function(result) {
      if(result.id) { object.set('id', result.id); }
      object.set('savingStatus', I18n.t('saved'));
      object.set('saving', false);
    });
  },

  destroy: function(object) {
    if (object.id) {
      var data = { id: object.id };
      return ajax("/rss-import", { 
        data: JSON.stringify({"feed": data }), 
        type: 'DELETE',
        dataType: 'json',
        contentType: 'application/json' });
    }
  }
});

export default RssFeed;