import pandas as pd
import numpy as np
import pandas_datareader.data as web


def rsi(data, time):
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
    pass


def sma(data, window):
    weights = np.repeat(1.0, window)/ window
    smas = np.convolve(data, weights, 'valid')
    return smas
    pass


def macd(data):
    exp1 = data.ewm(span=12, adjust=False).mean()
    exp2 = data.ewm(span=26, adjust=False).mean()
    macd = exp1 - exp2
    exp3 = macd.ewm(span=9, adjust=False).mean()
    return macd
    pass
