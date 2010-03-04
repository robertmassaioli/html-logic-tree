module Markup
	class MarkupNode < Array
		attr_accessor :name, :attributes, :content
		
		def initialize(name)
			@name = name
			@content = nil
			@attributes = {}
		end
		
		def to_html()
			result = ""
			if not @name.nil?
				result += "<#{@name}"
				for attribute in @attributes.keys
					result += " " + attribute.to_s + "=\"" + @attributes[attribute].to_s + "\""
				end
				result += ">"
			end
			
			if not @content.nil?
				result += @content
			end
			
			for child in self
				result += child.to_html
			end
			
			if not @name.nil?
				result += "</#{@name}>"
			end
			return result
		end
	end
end


