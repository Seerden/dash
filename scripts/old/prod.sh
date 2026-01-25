#!/bin/bash
cd ./docker && docker-compose --file ./compose.prod.yml --env-file ../server/.env up --build --force-recreate --remove-orphans &> ../logs/prod.txt

