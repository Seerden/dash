#!/bin/bash
cd ./docker && docker-compose --file ./compose.yml --env-file ../server/.env up --force-recreate --remove-orphans 