#!/usr/bin/env bash

DSP_API_KEY_DEFAULT="2c4262e3dc004e2f22c6d03de10ff0c06596edd3"
DSP_API_KEY_ENV=${DSP_API_KEY}
DSP_API_KEY=${DSP_API_KEY:-$DSP_API_KEY_DEFAULT}
# echo "DSP_API_KEY=$DSP_API_KEY"

# get token from api
result=$(curl -s POST --data "key=$DSP_API_KEY" "https://api.myspotlight.tv/token")
# empty out file
> ./.env.local
# write to local env file
echo "DSP_TOKEN=$result" >> ./.env.local
