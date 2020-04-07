from flask import Flask, render_template,url_for,request
from datetime import datetime

app = Flask(__name__)


@app.route("/", methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        pass
    else:
        return render_template("index.html")
    

# def home():
#     return "Hello, Flask!"
    