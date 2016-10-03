SRC:=$(wildcard src/*.js)
LIB:=$(SRC:src/%.js=out/%.js)
LESS:=$(wildcard src/*.less)
CSS:=$(LESS:src/%.less=out/%.css)
MAIN:=main.js

all: out/bundle.js

out/bundle.js: $(LIB) $(CSS)
	browserify out/$(MAIN) -o $@

out/%.js: src/%.js
	@mkdir -p $(@D)
	babel $< >$@

out/%.css: src/%.less
	@mkdir -p $(@D)
	lessc $< --autoprefix="last 2 versions" >$@

.PHONY: clean

clean:
	rm -rf out

.DELETE_ON_ERROR:
