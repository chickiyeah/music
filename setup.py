import os

try:
 from flask import Flask, render_template
 app = Flask(__name__)
except ModuleNotFoundError:
 os.system('pip install flask')
 os.system('pip install flask[async]')

try:
    import youtube_transcript_api

    from youtubesearchpython import VideosSearch
    from ytmusicapi import YTMusic
    from pytube import Playlist
    from art import *
    from youtube_transcript_api import YouTubeTranscriptApi
 ytapimusic = YTMusic()
except ModuleNotFoundError:
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


@app.route('/rank')
def get_top_100():
    playlist = ['https://www.youtube.com/playlist?list=PL4fGSI1pDJn6jXS_Tv_N9B8Z0HTRVJE0m']
    pl_urls = get_playlist(playlist)
    return pl_urls

@app.route('/new')
def get_new_song():
    playlist = ['https://www.youtube.com/playlist?list=RDCLAK5uy_mVBAam6Saaqa_DeJRxGkawqqxwPTBrGXM']
    pl_urls = get_playlist(playlist)
    return pl_urls

@app.route('/lyrcis')
def get_lyrcis():
    id = "3GWscde8rM8"
    cclist = YouTubeTranscriptApi.list_transcripts(id)
    try:
        cclist.find_manually_created_transcript(['ko'])
        cc = YouTubeTranscriptApi.get_transcript(id, ['ko'])
        lyrcis = []
        for i in cc:
            lyrcis.append(i["text"])

        return lyrcis
    except youtube_transcript_api._errors.NoTranscriptFound:
        return ['등록된 가사가 없습니다.']





if __name__ == '__main__':
    app.run('0.0.0.0', port=80, debug=True)
