#!/bin/bash

for p in odp-provider odp-client-website odp-adapter-iglusport odp-aggregator; do

  echo "pushing $p..."

  docker push aljazerzen/$p

done