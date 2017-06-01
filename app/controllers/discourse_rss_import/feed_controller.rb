module DiscourseRssImport
  class FeedController < ApplicationController
    requires_plugin 'discourse-rss-import'

    def all
      feeds = PluginStore.get("discourse_rss_import", "feeds") || []
      feeds.each do |feed| 
        user = User.find_by(id: feed[:user_id])
        user.nil? ? (username = "system") : (username = user.username)
        if username == "system"
          feed[:user_id] = -1
        end
        feed[:username] = username
      end
      render_json_dump(feeds)
    end

    def create
      feeds = PluginStore.get("discourse_rss_import", "feeds") || []

      feeds.empty? ? (id = 1) : (id = feeds.last[:id] + 1)

      new_feed = {
        id: id,
        url: params[:feed][:url],
        user_id: params[:feed][:user_id],
        category_id: params[:feed][:category_id]
      }

      feeds.push(new_feed)
      PluginStore.set("discourse_rss_import", "feeds", feeds)

      render json: new_feed, root: false
    end

    def update
      feeds = PluginStore.get("discourse_rss_import", "feeds")

      feed = feeds.select{|feed| feed[:id] == params[:feed][:id]}

      feed[0][:url] = params[:feed][:url] if !params[:feed][:url].nil?
      feed[0][:user_id] = params[:feed][:user_id] if !params[:feed][:user_id].nil?
      feed[0][:category_id] = params[:feed][:category_id] if !params[:feed][:category_id].nil?

      PluginStore.set("discourse_rss_import", "feeds", feeds)

      render json: feed[0], root: false
    end

    def destroy
      feeds = PluginStore.get("discourse_rss_import", "feeds")

      feed = feeds.select{|feed| feed[:id] == params[:feed][:id]}

      feeds.delete(feed[0])

      PluginStore.set("discourse_rss_import", "feeds", feeds)

      render json: success_json
    end

  end
end