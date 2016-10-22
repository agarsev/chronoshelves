SRC:=$(wildcard src/*.js)
LIB:=$(SRC:src/%.js=out/%.js)
MAIN:=main.js
ALL:=out/bundle.js out/style.css

AGES:=ages.yaml

all: $(ALL)

out/bundle.js: $(LIB) out/ages.js
	rollup out/$(MAIN) >$@

out/ages.js: $(AGES)
	@mkdir -p $(@D)
	./generateData.js $< >$@

out/%.js: src/%.js
	@mkdir -p $(@D)
	babel $< >$@

out/%.css: src/%.less
	@mkdir -p $(@D)
	lessc $< --autoprefix="last 2 versions" >$@

out/dist.zip: $(ALL)
	zip -r $@ index.html LICENSE res $(ALL)

.PHONY: clean dist

clean:
	rm -rf out

dist: out/dist.zip

.DELETE_ON_ERROR:
