module Tokeniser
	EXPRESSIONS = ["and", "or", "xor"]
	UNARY_EXPRESSIONS = ["not"]

	class Token
		TOKEN_TYPES = [:val, :expr, :unary_expr, :paren, :none]
		
		attr_reader :type
      attr_accessor :unary_exprs, :value
		
		def initialize (t, v)
			raise ArgumentError, "The token #{t} must have a valid type." unless TOKEN_TYPES.include? t 
			@type = t
			@value = v
         @unary_exprs = nil
		end
	end

	# this function converts string into an array of tokens
	def Tokeniser.tokenise(stream)
		raise ArgumentError, "Stream must be a string not a #{stream.class}" unless stream.is_a? String
		words = stream.scan(/[a-zA-Z0-9_]+|[\(\)]/) 
		
		result = []
		for text in words
			if EXPRESSIONS.include? text.downcase
				result.push Token.new(:expr, text)
				next
			elsif UNARY_EXPRESSIONS.include? text.downcase
				result.push Token.new(:unary_expr, text)
				next
			elsif text =~ /[\(\)]/
				result.push Token.new(:paren, text)
				next
			end
			result.push Token.new(:val, text)
		end
		return result
	end
	
	# this function arranges the tokens in polist notation using the shunting-yard algorithm
	# and then reversing the result at the end
	def Tokeniser.toReversePolish(tokenList)
		output = []
		expressionStack = []
		unaryExpStack = []
		
		for token in tokenList
			case token.type
				when :expr
					expressionStack.push(token)
				when :unary_expr
					unaryExpStack.push(token) 
				when :val
					output.push(token)
					output.push(unaryExpStack.pop) while not unaryExpStack.empty?
				when :paren
					if (token.value == ")")
						output.push(expressionStack.pop) while not expressionStack.empty?
					else
						expressionStack.push(unaryExpStack.pop) while not unaryExpStack.empty?
					end
				else
			end
		end
		
		output.push(expressionStack.pop) while not expressionStack.empty?
		
		return output
	end
	
	def Tokeniser.toPolish(tokenList)
		return toReversePolish(tokenList).reverse
	end

   def Tokeniser.compressUnaryExpressions(revPolTokList)
      newList = []

      unarys = []
      until revPolTokList.empty?
         token = revPolTokList.shift
         case token.type
         when :unary_expr
            unarys.push(token)
         else
            token.unary_exprs = [] unless unarys.empty?
            token.unary_exprs.push(unarys.pop) until unarys.empty?
            newList.push(token)
         end
      end

      return newList
   end
end
