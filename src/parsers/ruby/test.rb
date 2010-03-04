#!/usr/bin/ruby
# This file is a test to show off some ruby features

# This specifically shows ranges in select cases
value = 3

case value
when 1
   print "One"
when (2..5)
   print("Two-Five")
else
   print("Something Else")
end

print "\n"
