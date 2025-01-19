#!/bin/bash
cd ./docker && docker-compose --file ./compose.yml --env-file ../server/.env up --build --force-recreate --remove-orphans &> ../logs/dev.txt
