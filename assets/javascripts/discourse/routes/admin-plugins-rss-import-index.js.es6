import Feed from '../models/feed';

export default Discourse.Route.extend({
  model() {
    return Feed.findAll();
  },

  setupController(controller, model) {
    controller.setProperties({ model });
  }
});