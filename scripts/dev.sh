#!/bin/bash
cd ./docker && docker-compose --file ./compose.yml up --build --force-recreate --remove-orphans &> dev.logs.txt
