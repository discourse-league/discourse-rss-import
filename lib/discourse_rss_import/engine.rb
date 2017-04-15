require 'rss'

module DiscourseRssImport
  class Engine < ::Rails::Engine
    isolate_namespace DiscourseRssImport

    config.after_initialize do
  		Discourse::Application.routes.append do
  			mount ::DiscourseRssImport::Engine, at: "/rss-import"
  		end

      module ::Jobs
        class PollRssFeeds < Jobs::Scheduled
          every 1.hours

          def execute(args)
            feeds = PluginStore.get("discourse_rss_import", "feeds") || []

            if !feeds.empty?
              feeds.each do |feed|

                rss = RSS::Parser.parse(feed[:url], false)
                last_polled = feed[:last_polled] || 20.years.ago
                build_date = rss.channel.lastBuildDate || rss.channel.pubDate

                if !rss.nil? && build_date > last_polled
                  guids = PluginStore.get("discourse_rss_import", "feed_guids_" + feed[:id].to_s) || []
                  case rss.feed_type
                    when 'rss'
                      rss.items.each do |item|
                        guid = guids.select{|guid| guid == item.guid.content}
                        if guid.empty?
                          feed_user = User.find_by(id: feed[:user_id])
                          raw = item.description.strip + "\n\n[" + I18n.t('rss_import.read_more') + "](" + item.link + ")"
                          topic = PostCreator.create(
                            feed_user,
                            title: item.title,
                            category: feed[:category_id],
                            raw: raw
                          )
                          if topic
                            guids.push(item.guid.content)
                            PluginStore.set("discourse_rss_import", "feed_guids_" + feed[:id].to_s, guids)
                          end
                        end
                      end
                    when 'atom'
                      rss.items.each { |item| puts item.title.content }
                  end
                end
                feed[:last_polled] = Time.now

              end
            end

            PluginStore.set("discourse_rss_import", "feeds", feeds)

          end

        end
      end

    end

  end
end