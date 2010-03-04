require 'tokeniser'
require 'tree'
require 'markup'

module TreeBuilder
	class Data
		EVAL_TYPES = [true, false, :maybe, :uknown]
	
		attr_reader :token
		attr_accessor :eval
		
		def initialize (token)
			@eval = :uknown
			@token = token
		end
	end
	
	# accpets a polish notation string of tokens and builds a tree
	def TreeBuilder.buildTree(tokens)
		nextToken = tokens.shift
		p nextToken
		#stupidly it requires a name
		tree = Tree::TreeNode.new(nextToken.value.dup << nextToken.hash.to_s, Data.new(nextToken))
		return tree if nextToken.type == :val
		
		if not Tokeniser::UNARY_EXPRESSIONS.include? nextToken.value.downcase
			tree.add(buildTree(tokens))
		end
		tree.add(buildTree(tokens))
		return tree
	end
	
	#this function returns true of false based on the true or false nature of the tree
	def TreeBuilder.evaluateTree!(tree, hash)
		thisToken = tree.content.token
		case thisToken.type
			when :val
				p thisToken.value
				if hash.include? thisToken.value
					tree.content.eval = hash[thisToken.value]
				else 
					tree.content.eval = :maybe
				end
			when :unary_expr
				raise StandardError, "No unary expressions are allowed to exist in the tree. They should be in the tokens."
			when :expr
				results = []
				maybeFound = false
				trueFound = false
				falseFound = false
				tree.children() do |node|
					temp = evaluateTree!(node, hash)
					maybeFound = true if temp == :maybe
					trueFound = true if temp
					falseFound = false if not temp
					results.push(temp)
				end
				p results
				expecting = :maybe
				if maybeFound
					# we might still be able to get a result
					case thisToken.value.downcase
						when "and"
							expecting = false if falseFound
						when "or"
							expecting = true if trueFound
						when "xor"
						else
					end
				else
					case thisToken.value.downcase
						when "and"
							expecting = true
							for r in results
								expecting &&= r
							end
						when "or"
							expecting = false
							for r in results
								expecting ||= r
							end
						when "xor"
						else
					end
				end
				tree.content.eval = expecting
			else
				raise ArgumentError, "Not a valid token type: #{thisToken.type}\n"
		end

      unless thisToken.unary_exprs.nil?
         #print "Number of unarys: #{thisToken.unary_exprs.size}\n"
         thisToken.unary_exprs.each do |token|
            if token.type == :unary_expr and token.value.downcase == "not" then
               tree.content.eval = !tree.content.eval if tree.content.eval.is_a?(TrueClass) || tree.content.eval.is_a?(FalseClass)
               #print "#{thisToken.value} is now #{tree.content.eval}\n"
            end
         end
      end
		
		return tree.content.eval
	end
	
	REVERSE = {"and" => "or", "or" => "and"}
	
	# this recursively applies deMorgans law such that unary expressions
	# are only performed on values
	def TreeBuilder.recursiveDeMorgans!(tree)
      thisToken = tree.content.token
      if thisToken.type == :expr
         notCount = 0
         unless thisToken.unary_exprs.nil?
            thisToken.unary_exprs.each do |ue|
               notCount += 1 if ue.type == :unary_expr and ue.value.downcase == "not"
            end
         end
         thisToken.unary_exprs = nil

         # perform demorgans if there is the right number of nots
         if notCount % 2 == 1
            thisToken.value = REVERSE[thisToken.value]

            tree.children.each do |cld|
               cld.content.token.unary_exprs = [] if cld.content.token.unary_exprs.nil?
               cld.content.token.unary_exprs.push(Tokeniser::Token.new(:unary_expr, "not"))
               #print "Added a not to #{cld.content.token.value} new len=#{cld.content.token.unary_exprs.size}\n"
            end
         end

         tree.children.each do |cld|
            recursiveDeMorgans!(cld)
         end
      end
	end
	
	#this function compresses the tree into something easier to draw nicely, not 
	#to mention that it takes up less space
	def TreeBuilder.compressTree!(tree)
		thisToken = tree.content.token
		if thisToken.type == :expr
			toRemove = []
			for child in tree.children
				compressTree!(child)
				if child.content.token.type == :expr and child.content.token.value == thisToken.value
					for gc in child.children 
						tree.add(gc)
					end
					toRemove.push(child) # needs to be removed eventually but cannot be removed here
				end
			end
			for rm in toRemove
				tree.remove!(rm)	# now it can be removed cause the loop does not depend on it
			end
		elsif thisToken.type == :unary_expr
			for child in tree.children
				compressTree!(child)
			end
		end
	end
	
end
