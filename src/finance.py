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


def rsi(data, time=14):
    # set default to 14 days
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


# Calculating MACD
def macd(data):
    # find 12-period EMA
    exp1 = data.ewm(span=12, adjust=False).mean()
    # find 26-period EMA
    exp2 = data.ewm(span=26, adjust=False).mean()
    macd = exp1 - exp2
    return macd


# find macd_signal value
def macd_signal(data):
    # Calculating DEA indicator with period of 9
    exp1 = data.ewm(span=12, adjust=False).mean()
    exp2 = data.ewm(span=26, adjust=False).mean()
    macd = exp1 - exp2
    exp3 = macd.ewm(span=9, adjust=False).mean()
    return exp3


# add RSI indicator of each day to 7th column
data['RSI'] = rsi(data['Adj Close'])

# change value of window in .rolling to change period of SMA
# change value of data.iloc[:,n] to change column used to calculate
# data.iloc[:,3] is SMA using close price
# data.iloc[:,5] is adjusted close; [:,0] is high

# add three day moving average of adjust close to 8th column
data['SMA_3'] = data.iloc[:,5].rolling(window=3).mean()

# add five day moving average to 9th column
data['SMA_5'] = data.iloc[:,5].rolling(window=5).mean()

# add ten day moving average to 10th column
data['SMA_10'] = data.iloc[:,5].rolling(window=10).mean()

# add MACD indicator to 11th column
# this column indicate the MACD line in macd chart
data['MACD'] = macd(data['Adj Close'])

# add MACD_Signal indicator to 12th column for charting
# this column indicate the signal line in macd chart
data['MACD_signal'] = macd_signal(data['Adj Close'])

# add MACD_diff indicator to 13th column for charting
# this column indicate the histogram in macd chart
data['MACD_diff'] = data['MACD'] - data['MACD_signal']

print(data.head)
print(data.columns)

