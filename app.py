from flask import Flask, render_template,url_for,request
import datetime
import src.finance_data as stock_data
import json
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import src.finance as indicator
##
app = Flask(__name__)
limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["10 per minute"]
)
# =========================== Helper Function ===========================
def format_data(data) ->[] :
    res = []
    index = data.index.tolist()
    data = data.T.values.tolist()
    res.append(index)
    res = res + data
    return res

def date_converter(date):
    return "{}-{}-{}".format(date.year, date.month, date.day)

# =========================== Main Function ===========================
@app.route("/")
def index():
    try:
        if request.method == "GET" and request.args.get("stockName"):
            stock_name = request.args.get("stockName")
            # stock_name, stok_code:str, start_date:[int], end_date:[int]
            end_date = datetime.date.today()
            # three years ago
            start_date = end_date - datetime.timedelta(days=1095)
            my_stock = stock_data.stock(stock_name, stock_name, start_date, end_date)
            data = my_stock.stock_data()
            my_indictor = indicator.Indicator(data)
            data_with_indicator, rsi_today, monthly_sma, macd_today = my_indictor.add_indicator()
            # print(data_with_indicator.shape)
            res = format_data(data_with_indicator)
            
            # print(date)
            # Need to return the json data 
            return json.dumps(res, default = date_converter)

        else:
            return render_template("index.html")

    except Exception as e:
        print(e)


@limiter.exempt
def ping():
    return "Please try after one minute"

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)

