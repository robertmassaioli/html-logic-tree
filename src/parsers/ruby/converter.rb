#!/usr/bin/ruby

require 'tokeniser'
require 'treebuilder'

#logicString = "not not A and Not B "
logicString = "((A and D and G) or not (B and C)) and F"
#logicString = "bright and sunny"
evalHash = {
					"A" => true,
					"B" => false
			  }

step = 0

print "#{step = step.next}) The string to be parsed: #{logicString}\n\n"

tokens = Tokeniser.tokenise(logicString)
print "#{step = step.next}) The parsed tokens:\n"
p tokens
print "\n"

tokens = Tokeniser.toPolish(tokens)
print "#{step = step.next}) Tokens in polish notation:\n"
p tokens
print "\n"

tokens = Tokeniser.compressUnaryExpressions(tokens)
print "#{step = step.next}) Tokens with the unarys compressed:\n"
p tokens
print "\n"

print "#{step = step.next}) Those tokens in an espression tree:\n"
tree = TreeBuilder.buildTree(tokens)
tree.printTree
print "\n"

print "#{step = step.next}) Run DeMorgan's Law On the entire tree:\n"
TreeBuilder.recursiveDeMorgans!(tree)
tree.printTree
print "\n"

print "#{step = step.next}) Compress the tree:\n"
TreeBuilder.compressTree!(tree)
tree.printTree
print "\n"

print "#{step = step.next}) This is the hash to be evaluated:\n"
p evalHash
print "\n"

print "1 again) The string to be parsed: #{logicString}\n"
print "#{step = step.next}) Evaluating the tree:\n"
result = TreeBuilder.evaluateTree!(tree, evalHash)
print result
print "\n"

print "#{step = step.next}) Tree of HTML:\n"
print "Nothing yet..."
print "\n"
