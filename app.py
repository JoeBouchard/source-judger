from flask import Flask, request, render_template
import json
import driver

app = Flask(__name__)
@app.route('/')
def input():
    return render_template('input.html')

@app.route('/data', methods=['POST'])
def process():
    text = request.get_json(force=True)['Input Text']
    print(text)
    freqs, words = driver.parseText(text)
    toDisp = driver.percentMaker(freqs, words)
    page = "<ol>"
    for i in toDisp:
        page+='<li>'
        page+=str(i[1][0:5])+'\t'
        page+=str(i[0])
        page+="\tpercent match with\t"
        page+=str(i[2])
        page+="\tdistinct words</li>"
        #print(page)
    page+='</ol>'
    print(page)
    return json.dumps({'text':page})

if __name__ == '__main__':
    app.run(threaded=True, port=5000)
