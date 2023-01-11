from flask import Flask, render_template
from youtubesearchpython import VideosSearch
import json
import urllib

app = Flask(__name__)

#search_results = ytmusic.search("이세계아이돌", "albums")
#print(search_results)


@app.route('/')
def hello_world():  # put application's code here
    #search = ytmusic.search("we're good", ["songs"], limit=2)
    #print(search)
    title = []
    id = []
    channel = []
    thumbnail = []
    duration = []
    desc = []

    videosSearch = VideosSearch('오르막길')
    amount = len(videosSearch.result()['result'])
    for data in videosSearch.result()['result']:
        if(data['type'] == "video"):
            title.append(data['title'])
            id.append(data['id'])
            channel.append(data['channel'])
            thumbnail.append(data['thumbnails'])
            duration.append(data['duration'])
            desc.append(data['descriptionSnippet'])

    print(id)
    return render_template("test.html")


if __name__ == '__main__':
   app.run('0.0.0.0', port=80, debug=True)

