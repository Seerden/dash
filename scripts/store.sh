#!/bin/bash
source ./docker/.env
docker compose -f ./docker/compose.yml exec -it store redis-cli -a $REDIS_PASS