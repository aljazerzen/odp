#!/bin/bash

mkdir -p logs

for p in odp-provider odp-client-website odp-adapter-iglusport odp-aggregator; do

  cd $p

  echo "building $p..."

  docker build -t aljazerzen/$p . > ../logs/out.$p.log
  cd ..

done