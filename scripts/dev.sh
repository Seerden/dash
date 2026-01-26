#!/bin/bash
cd ./docker && docker-compose --file ./compose.yml --env-file ../server/.env up --build --no-deps --force-recreate --remove-orphans 