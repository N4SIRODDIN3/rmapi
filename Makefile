SHELL := /bin/bash

all: build fmt

build:
	@go build

fmt:
	@go fmt

run:
	@if [ -n "$$INSIDE_EMACS" ]; then \
	    go build; \
	else \
		go run main.go; \
	fi
