import datetime
import os

import subprocess

from pytube.extract import LiveStreamError
from ytapi import api

app = ""

try:
    
    import flask_cors
    
    from flask_cors import CORS, cross_origin
    from flask import Flask, render_template, request
    
    #from flask_restx import Api, Resource, reqparse

    app = Flask(__name__)
    app.register_blueprint(api, url_prefix='/api')
    #api = Api(app, version='1.0', title='API 문서', description="DELIMUSIC API 문서", doc="/api/docs")
    
    #user_api = api.namespace('user', description='유저 API')
    CORS(app, resources={r'*': {'origins': '*'}})

except ModuleNotFoundError:

    os.system('pip install flask')
    os.system('pip install flask[async]')
    os.system('pip install flask_cors')
    os.system('pip install flask_restx')
    
    import flask_cors
    
    from flask_cors import CORS, cross_origin

    from flask import Flask, render_template, request

    app = Flask(__name__)
    app.register_blueprint(api, url_prefix='/api')
    
    CORS(app, resources={r'*': {'origins': '*'}})

try:
    
    import firebase_admin
    from firebase_admin import auth
    from firebase_admin import credentials
    from firebase_admin import storage
    from firebase import Firebase

    import requests
    
    import scrapetube
    
    import youtube_transcript_api

    import uyts
    
    from pytube import YouTube
    
    from pytube import Channel

    from youtubesearchpython import VideosSearch

    from ytmusicapi import YTMusic

    from pytube import Playlist

    from art import *

    from youtube_transcript_api import YouTubeTranscriptApi
    
    firebaseConfig = {
      "apiKey": "AIzaSyCAPx_GfSFjGtWo08nuaPEd0RmWL-ar_-Y",
      "authDomain": "dely-music.firebaseapp.com",
      "projectId": "dely-music",
      "storageBucket": "dely-music.appspot.com",
      "messagingSenderId": "247613470910",
      "appId": "1:247613470910:web:d570f395749ef1da95c6ef",
      "measurementId": "G-2J7WX0YP24",
      "databaseURL": "https://dely-music-default-rtdb.firebaseio.com/"
    };
    
    #파이어베이스 서비스 세팅
    cred = credentials.Certificate('./cert/firebase-service-account.json')
    default_app = firebase_admin.initialize_app(cred, {"databaseURL": "https://dely-music-default-rtdb.firebaseio.com/"})

    Auth = Firebase(firebaseConfig).auth()
    Storage = Firebase(firebaseConfig).storage()

except ModuleNotFoundError:

    os.system('pip install unlimited-youtube-search')

    os.system('pip install youtube-search-python')

    os.system('pip install ytmusicapi')

    os.system('pip install pytube')

    os.system('pip install art')

    os.system('pip install youtube-transcript-api')
    
    os.system('pip install scrapetube')
    
    os.system('pip install firebase')
    
    os.system('pip install firebase_admin')

import json

import urllib

# search_results = ytmusic.search("뉴진스", "albums")

# print(search_results)

#HTLM 뿌리는곳
@app.route('/player')
def player():
    return render_template("player.html")

@app.route('/index')
def index():
    return render_template("index.html")

@app.route('/')
def main():
    return render_template("main.html")

@app.route('/Register')
def join():
    return render_template("join.html")

@app.route('/list/khot')
def khot():
    return render_template("khot.html")

@app.route('/Login')
def login():
    return render_template("login.html")

@app.route('/Profile')
def profile():
    return render_template("profile.html")

@app.route('/Search')
def search():
    return render_template("search.html")

@app.route('/detail')
def detail():
    return render_template("detail.html")

@app.route("/test")
def hello_world():  # put application's code here

    """search = ytmusic.search("we're good", ["songs"], limit=2)

     print(search)

    title = []

    id = []

    channel = []

    thumbnail = []

    duration = []

    desc = []

    videosSearch = VideosSearch('오르막길')

    amount = len(videosSearch.result()['result'])

    for data in videosSearch.result()['result']:

        if (data['type'] == "video"):

            title.append(data['title'])

            id.append(data['id'])

           channel.append(data['channel'])
           thumbnail.append(data['thumbnails'])

            duration.append(data['duration'])

            desc.append(data['descriptionSnippet'])"""

    return render_template("test.html")
# HTML 뿌리는곳 끝

#유저 관리구역 시작

#로그인
@app.route("/User/Login", methods=["POST"])
async def user_login():
    email = request.form['email']
    password = request.form['password']
    try:
        Auth.sign_in_with_email_and_password(email, password)
    except requests.exceptions.HTTPError as erra:
        #HTTP 에러가 발생한 경우
        #오류 가져오기 json.loads(str(erra).split("]")[1].split('"errors": [\n')[1])['message']
        return json.loads(str(erra).split("]")[1].split('"errors": [\n')[1])['message']

    currentuser = Auth.current_user
    user = requests.get(
        url='https://2gseogdrb1.execute-api.ap-northeast-2.amazonaws.com/default2/user',
        json={'Id':currentuser['localId']}
    )
    user.encoding = "UTF-8"
    return json.loads(user.text)['id']

#
@app.route("/User/Register", methods=["POST"])
async def user_create():
    now = datetime.now()
    email = request.form['email']
    password = request.form['password']
    nickname = request.form['nickname']
    #이메일이 공란이면
    if(len(email) == 0):
        return "MISSING_EMAIL"

    #비번이 공란이면
    if(len(password) == 0):
        return "MISSING_PASSWORD"
    else:
        #비번이 6자리 이하이면
        if(len(password) <= 6):
            return "PASSWORD_TOO_SHORT"
        else:
            #비번에 4글자이상 중복되는 글자가 있으면
            if(re.search('(([a-zA-Z0-9])\\2{5,})', password)):
                return "TOO_MANY_DUPICATE"


    #닉네임이 공란이면
    if(len(nickname) == 0):
        return "MISSING_NICKNAME"



    try:
        #파이어베이스의 유저만드는거 사용
        a = Auth.create_user_with_email_and_password(email, password)
    except requests.exceptions.HTTPError as erra:
        #HTTP 에러가 발생한 경우
        #오류 가져오기 json.loads(str(erra).split("]")[1].split('"errors": [\n')[1])['message']
        return json.loads(str(erra).split("]")[1].split('"errors": [\n')[1])['message']

    #유저의 고유 아이디 (UniqueID)
    id = a['localId']
    data = {
        'email':email,
        'Id':id,
        'Nickname':nickname,
        'Created_At':str(now)
    }
    try:
        c = requests.post(
            url = 'https://2gseogdrb1.execute-api.ap-northeast-2.amazonaws.com/default2/user',
            json=data
        )._content
    except requests.exceptions.RequestException as erra:
        print( erra)
        return erra
    

    if(str(c).split("\"")[1].split("\"")[0] == "Status Code : 200 | OK : Successfully added data "):
        return "OK"
    
    print(c)
    return c['errorMessage']

#유저 정보 
@app.route("/User", methods=["POST"])
async def get_user():
    id = request.form['id']
    user = requests.get(
        url='https://2gseogdrb1.execute-api.ap-northeast-2.amazonaws.com/default2/user',
        json={'Id':id}
    )
    user.encoding = "UTF-8"
    return json.loads(user.text)

#아이디 조회
@app.route("/User/FindID", methods=["POST"])
async def FindID():
    name = request.form['name']
    phone = request.form['phone']
    birthday = request.form['birthday']

    json1 = {
        'name' : name,
        'phone' : phone,
        'birthday' : birthday
    }

    ID = requests.get(
        url='https://2gseogdrb1.execute-api.ap-northeast-2.amazonaws.com/default2/user/findid',
        json=json1
    )
    ID.encoding = "UTF-8"
    
    return json.loads(ID.text)

#비번 초기화 이메일 보내기
@app.route("/User/ResetPW", methods=["POST"])
async def RSTPW():
    email = request.form['email']


    try:
        Auth.send_password_reset_email(email)
    except requests.exceptions.HTTPError as err:
        #print(json.loads(str(err).split("]")[1].split('"errors": [\n')[1])['message'])
        return json.loads(str(err).split("]")[1].split('"errors": [\n')[1])['message']



    return "DONE"

#유저 삭제
@app.route("/User", methods=["DELETE"])
async def deleteuser():
    id = request.form['id']
    email = request.form['email']


    json1 = {
        'id':id,
        'email':email
    }
    try:
        res = requests.delete(
            url='https://2gseogdrb1.execute-api.ap-northeast-2.amazonaws.com/default2/user',
            json=json1
        )
    except requests.exceptions.RequestException as error:
        return error

    auth.delete_user(id)
    return "OK"

#유저 관리 끝



if __name__ == '__main__':

    app.run('0.0.0.0', port=81, debug=True)
