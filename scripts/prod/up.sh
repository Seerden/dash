#!/bin/bash

# defaults
SERVER_TAG="latest"

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
            shift # Consume '-t'
            shift # Consume the tag value
            ;;
        *)
            echo "Unknown parameter passed: $1"
            exit 1
            ;;
    esac
done

export SERVER_TAG

cd ./docker && docker compose \
    --file ./compose.prod.yml \
    --env-file ../docker/.env \
    up \
    --force-recreate \
    --no-build \
    --remove-orphans \
    -d