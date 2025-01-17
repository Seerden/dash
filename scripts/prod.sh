#!/bin/bash
cd ./docker && docker-compose --file ./compose.prod.yml up --build --force-recreate --remove-orphans &> logs/prod.txt

