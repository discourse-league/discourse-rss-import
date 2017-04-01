export default {
  resource: 'admin.adminPlugins',
  path: '/plugins',
  map() {
    this.route('rss-import', function(){
      this.route('index', {path: '/'});
    });
  }
};