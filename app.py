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

@app.route('/api/music/errhand', methods=['POST'])

def err_hand():
    url = request.form['url']
    print("WORK START")
    print(url)
    res = requests.post("https://rr3---sn-3pm7kn7e.googlevideo.com/videoplayback?expire=1674392233&ei=SN7MY9yFOorm4ALOkKKYDA&ip=3.34.125.70&id=o-AKKnN-QrDGdtmagVUD7u9X6L6uqsyGz3uOc0D9IFZzhQ&itag=251&source=youtube&requiressl=yes&mh=ZF&mm=31%2C26&mn=sn-3pm7kn7e%2Csn-oguelnzr&ms=au%2Conr&mv=m&mvi=3&pl=22&initcwndbps=643750&vprv=1&mime=audio%2Fwebm&ns=rabO7K1QUYNW71iJXL8zGCMK&gir=yes&clen=3988637&dur=239.041&lmt=1640684268250083&mt=1674370166&fvip=1&keepalive=yes&fexp=24007246&c=WEB&txp=5532434&n=6PGmWh_F8ujPVVg&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cns%2Cgir%2Cclen%2Cdur%2Clmt&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRgIhAIvtraqQgiWUWwP5TJUnjSQb0DjLyeu6JaRcJL3sp5VVAiEApMheZBz7tlG0D4RbpArKo6fwRBTn9GfVO8Rl7yxnjDk%3D&alr=yes&sig=AOq0QJ8wRAIgbZ36lSlTSCaE9Vgp7K5cTdsv9rqHU2yatgj4a9dVqK8CIBLnc8jqf0IvEga4tt-UX8msldqLYxR9NMBhmwJorJ84")
    print(res.content)
    print(res.text)
    print("WORK DONE")
    return str(res.content)

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
