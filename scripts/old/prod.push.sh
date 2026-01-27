#!/bin/bash
cd ./docker && docker-compose --file ./compose.prod.yml push &> ../logs/prod.push.txt