HTML Logic Tree
================

Author: Robert Massaioli
Project Started: 22 Feb 2010

Purpose
-------

The purpose of this project is to create a suite where a programmer can type in a logical expression, 
made up purely of boolean values, and get a pretty image rendered to the screen.

Features
--------

This is a small list of the features of HTML Logic Tree (this may not be all there is)

+ All versions of HTML are supported (by OLDHTML module) with a reall nice (canvas based) version for HTML5.
+ Easily Extendable
+ Works in all major browsers (Chrome, Firefox, Opera, IE) *
+ Fast and Efficient (The entire test page runs in 40ms on my machine in google-chrome)
+ JSON data transfer - Uses JSON to transer the tree from server to client

(*) Please note that only one of the Old HTML or the HTML5 versions are garaunteed to 
work in any browser but the software can pick the right version for you automatically.

Online Example
--------------

I have [setup an online link][1] to the test page for you to view. You can also [read the wiki pages][2] to find out more.

Example in 30 Seconds
---------------------

So you want to see an example of this in thirty seconds? Then seeing the test data in action is what you want:

1.  Checkout html-logic-tree from GitHub.
2.  cd html-logic-tree
3.  Use the (supported) browser of your choice to open 'test.html'.
    For example:
    google-chrome test/test.html
4.  Win and Enjoy!

Supported Browsers
------------------

[Browser] - [Older HTML or HTML5]

+ [Google Chrome][3] - Both
+ [Firefox][4] - HTML5
+ Opera - Old HTML
+ IE - Old HTML

However, any browser that supports HTML5 canvas objects should be acceptable.

N.B. This README file is only valid for the commit that it was posted in; and maybe not even then.

  [1]: http://massaioli.homelinux.com/~robert/html-logic-tree/test/test.html
  [2]: http://wiki.github.com/robertmassaioli/html-logic-tree/
  [3]: http://www.google.com/chrome
  [4]: http://www.mozilla.com/en-US/firefox/firefox.html
