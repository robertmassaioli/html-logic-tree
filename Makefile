CC=gcc
CF=-Wall -Werror
minifier=jsmin
jsfiles= src/drawLogic-min.js test/tests-min.js
distDir=bin
project_name=html-logic-tree

all: $(jsfiles)
	rm -fr $(distDir)
	mkdir $(distDir)
	mv $(jsfiles) $(distDir)

dist: all
	zip -r $(project_name).zip $(distDir)/*

$(jsfiles): %-min.js: %.js
	$(minifier) < $< > $@

clean: tidy
	rm -fr $(jsfiles)

tidy:
	rm -f $(jsfiles)
