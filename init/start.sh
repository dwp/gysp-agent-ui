#!/bin/sh

# Copy certificates
rm -rf ./certs
cp -rf /etc/ssl/certs/ ./certs
cd ./certs
count=0
for file in $( ls -1 | sort -r ); do
    let count=count+1
    mv $file "cert_$count.pem"
done
cd ../

# Genarate .env for Docker
rm .env
echo 'AWS_ACCESS_KEY_ID='$(./init/scripts/get-aws-profile.sh --key) >> .env
echo 'AWS_SECRET_ACCESS_KEY='$(./init/scripts/get-aws-profile.sh --secret) >> .env
echo 'NODE_EXTRA_CA_CERTS=./certs/cert_1.pem' >> .env
