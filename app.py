from flask import Flask, render_template,url_for,request
import datetime
import src.finance_data as stock_data
import json
##
app = Flask(__name__)


@app.route("/")
def index():
    try:
        if request.method == "GET" and request.args.get("stockName"):
            stock_name = request.args.get("stockName")
            # stock_name, stok_code:str, start_date:[int], end_date:[int]
            end_date = datetime.date.today()
            # three years ago
            start_date = end_date - datetime.timedelta(days=1095)
            My_stock = stock_data.stock(stock_name, stock_name, start_date, end_date)
            data = My_stock.stock_data()
            
            data = data.T.values.tolist()
            # print(data)
            # Need to return the json data 
            return render_template("index.html", data=json.dumps(data), stock_name =stock_name)

        else:
            return render_template("index.html")

    except Exception as e:
        print(e)

# @app.route("/stock",methods=["GET", "POST"])
# def stock():
#     try:
#         if request.method == "GET":
#             # print("here")
#             print(request)
#             stock_name = request.args.get("stockName")
#             # stock_name, stok_code:str, start_date:[int], end_date:[int]
#             end_date = datetime.date.today()
#             # three years ago
#             start_date = end_date - datetime.timedelta(days=1095)
#             My_stock = stock_data.stock(stock_name, stock_name, start_date, end_date)
#             data = My_stock.stock_data()
#             print(data)
#             data = data.T.values.tolist()
#             return render_template("index.html", data=json.dumps(data), stock_name =stock_name)
#     except Exception as e:
#         print(e)

# This route is only for debugging
# @app.route("/hello/<name>")
# def hello_there(name):
#     now = datetime.now()
#     formatted_now = now.strftime("%A, %d %B, %Y at %X")

#     # Filter the name argument to letters only using regular expressions. URL arguments
#     # can contain arbitrary text, so we restrict to safe characters only.
#     match_object = re.match("[a-zA-Z]+", name)

#     if match_object:
#         clean_name = match_object.group(0)
#     else:
#         clean_name = "Friend"

#     content = "Hello there, " + clean_name + "! It's " + formatted_now
#     return content

if __name__ == '__main__':
    app.run(debug=True, port=5000)

