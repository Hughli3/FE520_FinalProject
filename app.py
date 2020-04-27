from flask import Flask, render_template,url_for,request
from datetime import datetime

##
app = Flask(__name__)


@app.route("/")
def index():
    try:
        return render_template("index.html")
    except Exception as e:
        print(e)

@app.route("/stock",methods=["GET", "POST"])
def stock():
    try:
        if request.method == "GET":
            print(request)
            return render_template("stock.html")
    except Exception as e:
        print(e)

if __name__ == '__main__':
    app.run(debug=True, port=5000)