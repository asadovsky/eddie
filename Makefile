SHELL := /bin/bash -euo pipefail
PATH := node_modules/.bin:$(PATH)

define BROWSERIFY
	@mkdir -p $(dir $2)
	browserify $1 -d -o $2
endef

define BROWSERIFY_STANDALONE
	@mkdir -p $(dir $2)
	browserify $1 -s $3 -o $2
endef

.DELETE_ON_ERROR:

all: build

node_modules: package.json
	yarn install
	touch $@

.PHONY: build

build: dist/eddie.min.js
dist/eddie.min.js: index.js $(shell find . -name '*.js') node_modules
	$(call BROWSERIFY_STANDALONE,$<,$@,eddie)

########################################
# Test, clean, and lint

dist/test/eddie.min.js: test/eddie.js $(shell find . -name '*.js' -maxdepth 1) node_modules
	$(call BROWSERIFY,$<,$@)

# TODO: Use https://github.com/hughsk/smokestack or similar.
.PHONY: test
test: dist/test/eddie.min.js
	@cp test/eddie.html dist/test
	open file://$(shell pwd)/dist/test/eddie.html

.PHONY: clean
clean:
	rm -rf dist node_modules

.PHONY: lint
lint: node_modules
	jshint .
