#!/bin/bash
source ./server/.env
docker compose -f ./docker/compose.yml exec -it store redis-cli -a $REDIS_PASS