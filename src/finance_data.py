
#===================== Import packages =====================
import pandas as pd
import pandas_datareader.data as web   
import datetime
import matplotlib.pyplot as plt 
import plotly.offline as po
import plotly.graph_objs as go


# ===================== Main functions =====================
class stock:
    def __init__(self, stock_name, stok_code:str, start_date:datetime, end_date:datetime):
        self.stok_code = stok_code
        self.start_date = start_date
        self.end_date = end_date

    def stock_data(self)-> pd.DataFrame:
        """
        Start Date : [year, month, day]
        """
        try:
            # print("OK1")
            stock = web.DataReader(self.stok_code, "yahoo", self.start_date, self.end_date)
            # if not stock:
            #     raise ValueError("%s not Found." %self.stok_code)
            # print("OK2")
            Date = pd.DataFrame(stock.index)
            Date["Date"].apply(lambda x: x.strftime("%Y-%m-%d"))
            stock.index = Date["Date"]
            return stock
        except:
            return False
        

    # def plot_stock(self) -> bool:
    #     try:
    #         stock = self.stock_data()
    #         trace = go.Candlestick(x=stock.index,
    #                             open=stock['Open'],
    #                             high=stock['High'],
    #                             low=stock['Low'],
    #                             close=stock['Close'])
    #         data = [trace]
    #         layout = {'title': stock_name}
    #         fig = dict(data=data, layout=layout)
    #         po.plot(fig, filename='../templates/stock.html')
    #         print("I'm firing")
    #         return True
    #     except:
    #         return False
