import os

import subprocess

app = ""

try:
    
    import flask_cors
    
    from flask_cors import CORS, cross_origin

    from flask import Flask, render_template, request

    app = Flask(__name__)
    
    CORS(app, resources={r'*': {'origins': '*'}})

except ModuleNotFoundError:

    os.system('pip install flask')

    os.system('pip install flask[async]')
    
    os.system('pip install flask_cors')
    
    import flask_cors
    
    from flask_cors import CORS, cross_origin

    from flask import Flask, render_template, request

    app = Flask(__name__)
    
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

def get_playlist(playlists):

    urls = []
    titles = []

    for playlist in playlists:

        playlist_urls = Playlist(playlist)
        
        for url in playlist_urls:

            urls.append(url.split("v=")[1])
       
    
    return urls

# search_results = ytmusic.search("이세계아이돌", "albums")

# print(search_results)

@app.route('/')

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

#국내 탑 100
@app.route('/api/top100')
def get_top_100():

    playlist = ['https://www.youtube.com/playlist?list=PL4fGSI1pDJn6jXS_Tv_N9B8Z0HTRVJE0m']

    pl_urls = get_playlist(playlist)

    return pl_urls

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
    birthday = request.form['birthday']
    phone = request.form['phone']
    nickname = request.form['nickname']
    name = request.form['name']
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
        'Birthday':birthday,
        'Phone':phone,
        'Id':id,
        'Nickname':nickname,
        'Name':name,
        'Created_At':str(now),
        'Last_Login_At':str(now)
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
    phone = request.form['phone']
    email = request.form['email']


    json1 = {
        'id':id,
        'phone':phone,
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

#보안 암호화된 영상 가져오기 (Pytube)
@app.route('/api/music/get_secure_music', methods=['POST'])
def secure_music():
    url = request.form['url']
    video = YouTube("https://www.youtube.com/watch?v="+url)
    stream = video.streams.filter(type="audio").desc().first().url
    return str(stream)

#특정 채널의 영상목록을 모두 받아온다
@app.route('/api/channel/getvideos', methods=['POST'])
def get_channels_videos():
    
    channelid = request.form['channel']
    videos = scrapetube.get_channel(channelid)
    
    res = []
    for video in videos:
        res.append(video)
    
    
    return res

#국내 최신음악 탑 100
@app.route('/api/new100')
def get_new_song():

    playlist = ['https://www.youtube.com/playlist?list=RDCLAK5uy_mVBAam6Saaqa_DeJRxGkawqqxwPTBrGXM']

    pl_urls = get_playlist(playlist)

    return pl_urls

#유튜브 영상 아이디로 유튜브 영상의 간단한 정보 
@app.route('/api/musicinfo', methods=['POST'])
def get_musicinfo():
    url = request.form['id']
    video = YouTube("https://www.youtube.com/watch?v="+url)
    res = {
            "title":video.title,
            "thumbnail":video.thumbnail_url,
            "author":video.author,
            "authorid":video.channel_id,
            "vid":url
            }
    
    return res
  

#재생목록 (K-힛 리스트: 국내 인기 음악)    
@app.route('/api/list/k-hit')
def k_hit():
    
    playlist = ['https://www.youtube.com/playlist?list=RDCLAK5uy_l7wbVbkC-dG5fyEQQsBfjm_z3dLAhYyvo']
    
    pl_urls = get_playlist(playlist)
    
    return pl_urls

#가사 불러오는 백엔드
@app.route('/api/lyrcis', methods=['POST'])
def get_lyrcis():

    video_id = request.form['video_id']

    cclist = YouTubeTranscriptApi.list_transcripts(video_id)

    try:

        cclist.find_manually_created_transcript(['ko'])

        cc = YouTubeTranscriptApi.get_transcript(video_id, ['ko'])

        lyrcis = []

        for i in cc:

            lyrcis.append(i)

        return lyrcis

    except (youtube_transcript_api.NoTranscriptFound, youtube_transcript_api._errors.TranscriptsDisabled):

        return [{'duration': 'infinity', 'start': '0', 'text': '등록된 가사가 없습니다.'}]

    except :

        return [{'duration': 'infinity', 'start': '0', 'text': '등록된 가사가 없습니다.'}]
    

#구버전 보안영상 링크 추출 ( 현재 미사용 )
@app.route('/api/getsong', methods=['POST'])
def getsong():

    vid = request.form['vid']

    uri = "https://www.youtube.com/watch?v="+vid

    callres = subprocess.run(["python3","youtube.py","-u",uri], stdout=subprocess.PIPE, text=True)

    res = str(callres.stdout).replace("횞","x").split("\n\n")

    for data in res:

        if data != "":

            rawdata = data

            type = rawdata.split(";")[0].split(" ")[1]

            if type == "audio/webm":

                audiodata = rawdata.split("; ")[1]

                quality = audiodata.split("Quality ")[1].split(",")[0]

                if quality == "AUDIO_QUALITY_MEDIUM":


                    return audiodata.split("\n")[1]

    return None

#노래 검색
@app.route('/api/search', methods=['POST'])
def search_video():

    search_keyword = request.form['keyword']

    videos = []

    search = uyts.Search(search_keyword, language="ko-kr", minResults=50)

    res = []

    for result in search.results:

        if result.resultType == "video":

            res.append(result.ToJSON())

    return res

"""    videosSearch = VideosSearch(search_keyword, region= 'KR')

    amount = len(videosSearch.result()['result'])

    for data in videosSearch.result()['result']:

        if data['type'] == "video":

            video = {

                'id': data['id'],

                'title': data['title'],

                'desc': data['descriptionSnippet'],

                'channel': data['channel'],

                'thumbnails': data['thumbnails'],

                'duration': data['duration']

            }

            videos.append(video)

    result = {

        'videos': videos,

        'amount': amount

    }

    """

if __name__ == '__main__':

    app.run('0.0.0.0', port=81, debug=True)
