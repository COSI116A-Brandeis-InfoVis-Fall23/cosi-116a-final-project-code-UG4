import requests
import json

def pull_data(start_date, end_date, tickers, freq, api_key):
    subdict = 'Time Series (Daily)' if freq == 'DAILY' else 'Weekly Time Series' if freq == 'WEEKLY' else 'Monthly Time Series'

    for ticker in tickers:
        url = f'https://www.alphavantage.co/query?function=TIME_SERIES_{freq}&symbol={ticker}&apikey={api_key}'
        data = requests.get(url).json()[subdict]

        new_data = []
        for key, value in data.items():
            append_dict = {}
            if (key > start_date) & (key < end_date):
                append_dict = {
                    'Date': key,
                    'Open': value['1. open'],
                    'High': value['2. high'],
                    'Low': value['3. low'],
                    'Close': value['4. close'],
                    'Adj Close':'',
                    'Volume': value['5. volume']
            }
            new_data.append(append_dict)

        with open(f'.\data_processing\OHLCV\{ticker}', mode='w', encoding='utf-8') as json_file:
            json_file.write(json.dumps(new_data, indent=4))

start_date = '2016-12-31'
end_date = '2021-1-1'

index_tickers = ['DJIA']
stock_tickers = ['AAPL']
api_key = 'QHQCAIV62SWPG39Z'

# freq: DAILY, WEEKLY, MONTHLY
pull_data(start_date, end_date, stock_tickers,'WEEKLY',api_key)