import pandas as pd
import numpy as np
import pandas_datareader.data as web
import datetime


class Indicator():
    def __init__(self, data):
        self.data = data

    def rsi(self, time=14):
        # set default to 14 days
        adj = self.data['Adj Close']
        delta = adj.diff().dropna()
        u = delta * 0
        d = u.copy()
        u[delta > 0] = delta[delta > 0]
        d[delta < 0] = - delta[delta < 0]
        u_ave = u.ewm(com=time-1, min_periods=time).mean()
        d_ave = d.ewm(com=time-1, min_periods=time).mean()
        rs = abs(u_ave/d_ave)
        rsi = 100 - (100/(1+rs))
        return rsi

    # calculating SMA, column = type(ex. AdjCLose, Close, High)
    # column default as 5 = Adjusted Close
    # period = time window of SMA (e.g. 5days sma = 5)
    def sma(self, column=5, period=5):
        sma = self.data.iloc[:, column].rolling(window=period).mean()
        return sma

    # Calculating MACD
    def macd(self):
        adj = self.data['Adj Close']
        # find 12-period EMA
        exp1 = adj.ewm(span=12, adjust=False).mean()
        # find 26-period EMA
        exp2 = adj.ewm(span=26, adjust=False).mean()
        macd = exp1 - exp2
        return macd

    # find macd_signal value
    def macd_signal(self):
        adj = self.data['Adj Close']
        # Calculating DEA indicator with period of 9
        exp1 = adj.ewm(span=12, adjust=False).mean()
        exp2 = adj.ewm(span=26, adjust=False).mean()
        macd = exp1 - exp2
        exp3 = macd.ewm(span=9, adjust=False).mean()
        return exp3

    def add_indicator(self):
        # add RSI indicator of each day to data
        self.data['RSI'] = self.rsi()

        self.data['SMA_10'] = self.sma(5,10)
        self.data['SMA_20'] = self.sma(5, 20)
        self.data['SMA_30'] = self.sma(5, 30)
        # add MACD indicator to data
        # this column indicate the MACD line in macd chart
        self.data['MACD'] = self.macd()

        # add MACD_Signal indicator to data
        # this column indicate the signal line in macd chart
        self.data['MACD_signal'] = self.macd_signal()

        # add MACD_diff indicator to data
        # this column indicate the histogram in macd chart
        self.data['MACD_diff'] = self.data['MACD'] - self.data['MACD_signal']
        self.data = round(self.data,2)
        rsi_today = self.data.iloc[-1,6]
        monthly_sma = self.data.iloc[-1,9]
        macd_today = self.data.iloc[-1,10]
        return self.data, rsi_today, monthly_sma, macd_today
