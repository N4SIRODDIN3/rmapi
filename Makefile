SHELL := /bin/bash

all: build fmt

build:
	@go build

format:
	@gofmt -l -w .

RMAPI_CACHE_DIR ?= $(PWD)/.run-cache
run:
	@if [ -n "$$INSIDE_EMACS" ]; then \
	    go build; \
	else \
		RMAPI_CACHE_DIR=$(RMAPI_CACHE_DIR) go run main.go; \
	fi
