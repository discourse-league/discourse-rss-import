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
            
          end

        end
      end

    end

  end
end