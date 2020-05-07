def buy_sell(self):
    buy = 0
    sell = 0
    print(self.data.iloc[-1, 6])
    if self.data.iloc[-1, 6] >= 70:
        return 'This stock is overbought'
    elif self.data.iloc[-1, 6] <= 30:
        return 'This stock is oversold'
    elif self.data.iloc[-1, 6] >= 65:
        return 'We suggest to sell'
    elif self.data.iloc[-1, 6] <= 35:
        return 'We suggest to buy'

    else:
        a = ''
        for j in range(1, 11):
            if self.data.iloc[-j, 12] == 0 and self.data.iloc[-j - 1, 12] > 0:
                a = 'recent Bearish confirmed %d days ago' % j
                break
            elif self.data.iloc[-j, 12] == 0 and self.data.iloc[-j - 1, 12] < 0:
                a = 'recent Bullish confirmed %d days ago' % j
                break
        for i in range(1, 6):
            if self.data.iloc[-i, 6] > self.data.iloc[-i - 1:, 6]:
                sell = sell + 1
            elif self.data.iloc[-i, 6] < self.data.iloc[-i - 1:, 6]:
                buy = buy + 1
            elif min(self.data.iloc[-20:-1, 6]) == self.data.iloc[-1, 6]:
                sell = 0
            elif max(self.data.iloc[-20:-1, 6]) == self.data.iloc[-1, 6]:
                buy = 0

        suggest = buy - sell
        if suggest >= 3:
            return a + 'We strongly recommend to buy'
        elif suggest <= -3:
            return a + 'We strongly recommend to sell'
        elif suggest > 0:
            return a + 'You can consider buy it'
        elif suggest < 0:
            return a + 'You can consider sell it'