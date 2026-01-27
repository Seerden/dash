#!/bin/bash

# --- Set Defaults ---
SERVER_TAG="latest"
IMAGE_NAME="seerden/dash"
# Note: when we add more flags that end up as build env variables, 
#  add their defaults here

# parse flags
while [[ "$#" -gt 0 ]]; do
    case $1 in
        -t)
            # Check if the next argument ($2) is empty or missing
            if [[ -z "$2" ]]; then
                echo "Error: Option -t requires an argument." >&2
                exit 1
            fi
            SERVER_TAG="$2"
            shift # consumes '-t'
            shift # consumes the tag value
            ;;

        # more flags here
        # e.g., a flag to build a different service
        # -s|--service)
        #    BUILD_TARGET="$2"
        #    shift 2
        #    ;;

        *)
            echo "Unknown parameter passed: $1"
            exit 1
            ;;
    esac
done

# --- Run Build ---
export SERVER_TAG
echo "Building server with tag: $SERVER_TAG"

# TODO (DAS-55): we do not currently expose any environment variables on the
# client (the codebase has no VITE_ environment variables, and I don't have a
# client/.env yet), so the following line has no use (yet)
# export $(awk '!/^ *#/ && /./ {print $0}' ./client/.env) &&
export $(awk '!/^ *#/ && /./ {print $0}' ./server/.env) &&
cd ./docker && docker compose --file ./compose.build.yml build 

# --- Tag as 'latest' ---
# This is the new step.
# It only runs if you provided a specific tag (not 'latest').
if [ "$SERVER_TAG" != "latest" ]; then
    echo "Tagging ${IMAGE_NAME}:${SERVER_TAG} as ${IMAGE_NAME}:latest"
    docker tag "${IMAGE_NAME}:${SERVER_TAG}" "${IMAGE_NAME}:latest"
fi