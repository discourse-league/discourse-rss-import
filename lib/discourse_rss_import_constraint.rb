class DiscourseRssImportConstraint
	def matches?(request)
		SiteSetting.rss_import_enabled
	end
end