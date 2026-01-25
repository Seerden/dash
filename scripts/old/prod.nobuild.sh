#!/bin/bash
cd ./docker && docker-compose --file ./compose.prod.yml --env-file ../server/.env up --force-recreate --remove-orphans &> ../logs/prod.nobuild.txt

