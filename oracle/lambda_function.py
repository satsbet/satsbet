import json
import UTXOracle
import requests
from datetime import datetime, timedelta

def lambda_handler(event, context):

    # Get the current UTC date and time
    current_utc_datetime = datetime.utcnow()

    # Subtract one day to get the last UTC day
    last_utc_day = current_utc_datetime - timedelta(days=1)


    price = UTXOracle.Run_Oracle(last_utc_day.strftime("%Y-%m-%d"))

    # The API endpoint
    url = "https://satsbet.vercel.app/api/cron/oracle"

    requests.post(url, json = {'price': price * 100})

    return {
        'statusCode': 200,
        'body': json.dumps(price)
    }
