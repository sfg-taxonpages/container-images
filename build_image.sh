#!/bin/sh

set -e

rm -rf tmp
git clone https://github.com/sfg-taxonpages/$1.git tmp
cd tmp 
git checkout main 
git checkout setup . 
rm config/router.yml 
cd .. 
cp Dockerfile .dockerignore tmp 
docker build -t sfg-taxonpages/$1 tmp 
rm -rf tmp

