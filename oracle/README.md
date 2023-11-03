Need to run this commands
pip install --target ./python python-bitcoinlib/
pip install --target ./python requests

Zip the dir as lambda.zip and import in aws as both lambda function and layer
zip -r ../lambda.zip ./*

