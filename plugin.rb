# name: discourse-rss-import
# about: Adds the ability to create new topics from an rss feed.
# version: 0.1
# author: Joe Buhlig joebuhlig.com
# url: https://www.github.com/joebuhlig/discourse-rss-import

enabled_site_setting :rss_import_enabled

add_admin_route 'rss_import.title', 'rss-import'

register_asset "stylesheets/discourse-rss-import.scss"

Discourse::Application.routes.append do
	get '/admin/plugins/rss-import' => 'admin/plugins#index', constraints: StaffConstraint.new
end

load File.expand_path('../lib/discourse_rss_import/engine.rb', __FILE__)