from flask import Flask, Blueprint, request

import youtube_transcript_api
from pytube.extract import LiveStreamError
from pytube import YouTube
from youtube_transcript_api import YouTubeTranscriptApi
from pytube import Playlist
import requests
import scrapetube


api = Blueprint('deliapi', __name__)

def get_playlist(playlists):

    urls = []
    titles = []

    for playlist in playlists:

        playlist_urls = Playlist(playlist)

        for url in playlist_urls:

            urls.append(url.split("v=")[1])
       
    
    return urls


#보안 암호화된 영상 가져오기 (Pytube)
@api.route('/music/get_secure_music', methods=['POST'])
def secure_music():
    try:
        url = request.form['url']
        video = YouTube("https://www.youtube.com/watch?v="+url)
        stream = video.streams.filter(type="audio").desc().first().url
        return str(stream)
    except LiveStreamError:
        return "This Video is Live Stream"
    
@api.route('/music/get_secure_video', methods=['POST'])
def secure_video():
    try:
        url = request.form['url']
        video = YouTube("https://www.youtube.com/watch?v="+url)
        stream = video.streams.filter(progressive=True).desc().first().url        
        return str(stream)
    except LiveStreamError:
        return "This Video is Live Stream"

#특정 채널의 영상목록을 모두 받아온다
@api.route('/channel/getvideos', methods=['POST'])
def get_channels_videos():
    
    channelid = request.form['channel']
    videos = scrapetube.get_channel(channelid)
    
    res = []
    for video in videos:
        res.append(video)
    
    
    return res

#국내 최신음악 탑 100
@api.route('/new100')
def get_new_song():

    playlist = ['https://www.youtube.com/playlist?list=RDCLAK5uy_mVBAam6Saaqa_DeJRxGkawqqxwPTBrGXM']

    pl_urls = get_playlist(playlist)

    return pl_urls

#국내 인기 급상승 MV 20
@api.route('/surgevideo20')
def get_surge_video_20():

    playlist = ['https://www.youtube.com/playlist?list=PLmtapKaZsgZsjfcjrumAR4KVu5LDDeugN']

    pl_urls = get_playlist(playlist)

    return pl_urls

#유튜브 영상 아이디로 유튜브 영상의 간단한 정보 
@api.route('/musicinfo', methods=['POST'])
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
@api.route('/list/k-hit')
def k_hit():
    
    playlist = ['https://www.youtube.com/playlist?list=RDCLAK5uy_l7wbVbkC-dG5fyEQQsBfjm_z3dLAhYyvo']
    
    pl_urls = get_playlist(playlist)
    
    return pl_urls

#재생목록 (글로벌 인기곡 탑100)
@api.route('/list/global_top_100')
def global_top_100():

    playlist = ['https://www.youtube.com/playlist?list=PL4fGSI1pDJn6puJdseH2Rt9sMvt9E2M4i']

    pl_urls = get_playlist(playlist)

    return pl_urls

#가사 불러오는 백엔드
@api.route('/lyrcis', methods=['POST'])
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
@api.route('/getsong', methods=['POST'])
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
@api.route('/search', methods=['POST'])
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

@api.route('/top100')
def get_top_100():

    playlist = ['https://www.youtube.com/playlist?list=PL4fGSI1pDJn6jXS_Tv_N9B8Z0HTRVJE0m']

    pl_urls = get_playlist(playlist)

    return pl_urls