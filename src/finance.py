import pandas as pd
import numpy as np
import pandas_datareader.data as web
import datetime
start = datetime.datetime(2016,1,1)
end = datetime.date.today()


# stock_name, stok_code:str, start_date:[int], end_date:[int]
end_date = datetime.date.today()
# three years ago
start_date = end_date - datetime.timedelta(days=1095)

data = web.DataReader("AAPL", "yahoo", start_date, end_date)

data = pd.DataFrame(data)


def rsi(data, time):
    # input is data frame
    delta = data.diff().dropna()
    u = delta * 0
    d = u.copy()
    u[delta > 0] = delta[delta > 0]
    d[delta < 0] = - delta[delta < 0]
    u_ave = u.ewm(com=time-1, min_periods=time).mean()
    d_ave = d.ewm(com=time-1, min_periods=time).mean()
    rs = abs(u_ave/d_ave)
    rsi = 100 - (100/(1+rs))
    return rsi


data['RSI'] = rsi(data['Adj Close'], 14)
data['SMA_3'] = data.iloc[:,5].rolling(window=3).mean()
data['SMA_5'] = data.iloc[:,5].rolling(window=5).mean()
data['SMA_10'] = data.iloc[:,5].rolling(window=10).mean()


def macd(data):
    exp1 = data.ewm(span=12, adjust=False).mean()
    exp2 = data.ewm(span=26, adjust=False).mean()
    macd = exp1 - exp2
    exp3 = macd.ewm(span=9, adjust=False).mean()
    return macd


def macd_signal(data):
    exp1 = data.ewm(span=12, adjust=False).mean()
    exp2 = data.ewm(span=26, adjust=False).mean()
    macd = exp1 - exp2
    exp3 = macd.ewm(span=9, adjust=False).mean()
    return exp3


data['MACD'] = macd(data['Adj Close'])
data['MACD_signal'] = macd_signal(data['Adj Close'])
data['MACD_diff'] = data['MACD'] - data['MACD_signal']
print(data.head)
print(data.columns)

