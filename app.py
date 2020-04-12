from flask import Flask, render_template,url_for,request
from datetime import datetime

## =================== Search function ===================



## =================== Get data function ===================

##
app = Flask(__name__)


@app.route("/", methods=['GET', 'POST'])
def index():
    try:
        # if request.method == "GET":
        #     search = request.form["search-form"]
        #     print(search)
        #     # Use request to get stock code

        #     # use code get the stock data

        #     # rerender the page by passing the stock data into view
        #     # return render_template("view.html", stockData = data)
        #     return render_template("index.html")
        # else:
        return render_template("index.html")

    except Exception as e:
        print(e)

if __name__ == '__main__':
    app.run(debug=True, port=5000)