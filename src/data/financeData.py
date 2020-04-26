
#===================== Import packages =====================
import pandas as pd
import pandas_datareader.data as web   
import datetime
import matplotlib.pyplot as plt 
import plotly.offline as po
import plotly.graph_objs as go


# ===================== Main functions =====================
def stockData(stokCode:str, startDate:[int]) -> pd.Dataframe:
    """
    Start Date : [year, month, day]
    """
    try:
        start = datetime.datetime(startDate[0],startDate[1],startDate[2])
        end = datetime.date.today()
        stock = web.DataReader(stokCode, "yahoo", start, end)

        if not stock:
            raise ValueError("%s not Found." %stokCode)

        return stock
    except:
        return False
      

def plotStock(stock:pd.DataFrame, stockName:str) -> bool:
    try:
        trace = go.Candlestick(x=stock.index,
                            open=stock['Open'],
                            high=stock['High'],
                            low=stock['Low'],
                            close=stock['Close'])
        data = [trace]
        layout = {'title': stockName}
        fig = dict(data=data, layout=layout)
        po.plot(fig, filename='../templates/stock.html')
        return True
    except:
        return False
