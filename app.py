import os

import subprocess

import requests

app = ""

try:

    from flask import Flask, render_template, request

    app = Flask(__name__)

except ModuleNotFoundError:

    os.system('pip install flask')

    os.system('pip install flask[async]')

    from flask import Flask, render_template, request

    app = Flask(__name__)

try:

    import youtube_transcript_api

 import uyts

    from youtubesearchpython import VideosSearch

    from ytmusicapi import YTMusic

    from pytube import Playlist

    from art import *

    from youtube_transcript_api import YouTubeTranscriptApi

except ModuleNotFoundError:

 os.system('pip install unlimited-youtube-search')

    os.system('pip install youtube-search-python')

    os.system('pip install ytmusicapi')

    os.system('pip install pytube')

    os.system('pip install art')

    os.system('pip install youtube-transcript-api')

import json

import urllib

def get_playlist(playlists):

    urls = []

    for playlist in playlists:

        playlist_urls = Playlist(playlist)

        for url in playlist_urls:

            url = url.split("v=")[1]

            urls.append(url)

    return urls

# search_results = ytmusic.search("이세계아이돌", "albums")

# print(search_results)

@app.route('/')

def hello_world():  # put application's code here

    # search = ytmusic.search("we're good", ["songs"], limit=2)

    # print(search)

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

            desc.append(data['descriptionSnippet'])

    print(id)

    print(title)

    return render_template("test.html")

@app.route('/api/top100')

def get_top_100():

    playlist = ['https://www.youtube.com/playlist?list=PL4fGSI1pDJn6jXS_Tv_N9B8Z0HTRVJE0m']

    pl_urls = get_playlist(playlist)

    return pl_urls

@app.route('/api/new100')

def get_new_song():

    playlist = ['https://www.youtube.com/playlist?list=RDCLAK5uy_mVBAam6Saaqa_DeJRxGkawqqxwPTBrGXM']

    pl_urls = get_playlist(playlist)

    return pl_urls

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

@app.route('/api/designature', methods=['POST'])

def desig():

    sig = request.form['sig']

@app.route('/api/getsong', methods=['POST'])

def getsong():

    vid = request.form['vid']

    uri = "https://www.youtube.com/watch?v="+vid

    callres = subprocess.run(["python","youtube.py","-u",uri], stdout=subprocess.PIPE, text=True)

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

    app.run('0.0.0.0', port=80, debug=True)