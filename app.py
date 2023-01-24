from flask import Flask
from PyYTMusic import PyYTMusic

app = Flask(__name__)
ytmusic = PyYTMusic()



@app.route('/')
def hello_world():  # put application's code here
    search = ytmusic.search("이세계 아이돌", ["songs"])
    print(search)
    return 'Hello World!'


if __name__ == '__main__':
    app.run()
