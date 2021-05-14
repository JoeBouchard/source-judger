from flask import Flask, request, render_template
import json
import driver

app = Flask(__name__)
@app.route('/')
def input():
    return render_template('input.html')

@app.route('/data', methods=['POST'])
def process():
    links = {'Simple Wikipedia': 'simple.wikipedia.org',
             'Standard Wikipedia': 'en.wikipedia.org',
             'Fanfiction.net': 'fanfiction.net',
             'GroupMe': 'groupme.com'
             }
    text = request.get_json(force=True)['Input Text']
    print(text)
    freqs, words = driver.parseText(text)
    toDisp = driver.percentMaker(freqs, words)
    page = "<ol>"
    for i in toDisp:
        page+='<li>'
        page += "<a href=https://"
        if "r/" in i[1]:
            page+="www.reddit.com/"+i[1]+" target=\"_blank\">"
        else:
            page+=links[i[1]]+" target=\"_blank\">"
        page+=str(i[1])
        page += "</a>"
        page+='\t'
        page+=str(i[0])
        page+="\tpercent match with\t"
        page+=str(i[2])
        page+="\tdistinct words</li>"
        #print(page)
    page+='</ol>'
    print(page)
    if page == '<ol></ol>':
        page = "<b>No Valid Words Given</b>"
    return json.dumps({'text':page})

if __name__ == '__main__':
    app.run(threaded=True, port=5000)
