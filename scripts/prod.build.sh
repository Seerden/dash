#!/bin/bash 
cd ./docker && docker-compose --file ./compose.prod.yml build --no-cache --progress=plain &> ../logs/prod.build.txt
