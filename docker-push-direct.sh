#!/bin/bash

for p in odp-provider odp-client-website odp-adapter-iglusport odp-aggregator; do

  echo "pushing $p..."

  docker save aljazerzen/$p | gzip | DOCKER_HOST=ssh://odp docker load

done