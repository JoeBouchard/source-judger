from flask import Flask, request, render_template
import json
import driver

app = Flask(__name__)
@app.route('/')
def input():
    return render_template('input.html')

@app.route('/updator.js')
def updatorjs():
    with open("templates/updator.js") as f:
        return f.read()
    
@app.route('/data', methods=['POST'])
def process():
    jdata = request.get_json(force=True)
    text = jdata['Input Text']
    freqs = driver.makeFreqs(text)
    freq2, words = driver.processFreqs(freqs)
    toDisp = driver.percentMaker(freq2, words)
    page = listMaker(toDisp)
    return json.dumps({'text':page})#, 'freqs':freq2})

@app.route('/freqData', methods=['POST'])
def processFreqs():
    jdata = request.get_json(force=True)
    freq2, words = driver.processFreqs(jdata)
    toDisp = driver.percentMaker(freq2, words)
    page = listMaker(toDisp)
    return json.dumps({'text':page})#, 'freqs':freq2})

def combiner(freq1, freq2):
    for key in freq1.keys():
        freq1[key]+=freq2[key]
    return freq1

def listMaker(toDisp):
    links = {'Simple Wikipedia': 'simple.wikipedia.org',
             'Standard Wikipedia': 'en.wikipedia.org',
             'Fanfiction.net': 'fanfiction.net',
             'GroupMe': 'groupme.com'
             }
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
    #print(page)
    if page == '<ol></ol>':
        page = "<b>No Valid Words Given</b>"
    return page#json.dumps({'text':page})

if __name__ == '__main__':
    app.run(threaded=True, port=5000)
