import re, time
import pandas as pd
df = pd.read_csv("wordFreqs.csv")
df.set_index('WORD', inplace=True)

def makeFreqs(text):
    freqs = {}
    cleanText = ''
    for i in text:
        if i.isalnum() or i.isspace():
            cleanText+=i
        if i == '-':
            cleanText += ' '
    tokens = re.split('\\s+?', cleanText)
    #print(tokens)
    toRemove = ['', 'the', 'a', 'an', 'and', 'but', 'or']
    toRemove += ['of', 'for', 'from', 'by', 'with', 'in', 'out']
    for bad in toRemove:
        while bad in tokens:
            tokens.remove(bad)
    for t in tokens:
        if t != 'I':
            t = t.lower()
        if t not in freqs.keys():
            freqs[t] = 0
        freqs[t] += 1
    return freqs

def processFreqs(freqs):
    start = time.time()
    freqs = dict(sorted(freqs.items(), key=lambda item: item[1], reverse=True))
    print("Time to sort: ", time.time()-start)
    ignore = ['', 'the', 'a', 'an', 'and', 'but', 'or']
    ignore += ['of', 'for', 'from', 'by', 'with', 'in', 'out']
    freqCounter = {'TOTAL':0}
    wordMatch = {'NONE':[]}
    tokens = list(freqs.keys())
    #print(tokens)
    for t in tokens:
        if time.time()-start > 29:
            break
        found=True
        #print(freqs[t])
        if t not in ignore:
            if t != 'I':
                t = t.lower()
            try:
                vals = df.loc[t]
            except KeyError:
                vals = df.loc['a']
                found=False
            if found:
                for f in vals.keys():
                    if f not in freqCounter.keys():
                        #print(f)
                        freqCounter[f] = 0
                        wordMatch[f] = []
                    #print(vals)
                    val = (1 if vals[f] > 0.6 else round(vals[f], 3))
                    scaledVal = val*freqs[t]
                    freqCounter[f] += scaledVal
                    if vals[f] > 0.75 and t not in wordMatch[f]:
                        wordMatch[f].append(t)
                freqCounter['TOTAL']+=1*freqs[t]
            elif t not in wordMatch['NONE']:
                wordMatch['NONE'].append(t)
    return freqCounter, wordMatch

def percentMaker(freqs, words):
    toDisp = {}
    links = {'Simple Wikipedia': 'www.simple.wikipedia.org',
             'Standard Wikipedia': 'www.en.wikipedia.org',
             'Fanfiction.net': 'www.fanfiction.net',
             'GroupMe': 'www.groupme.com'
             }
    for key in freqs.keys():
        if key != 'TOTAL':
            if "r/" in key:
                link ="www.reddit.com/"+key#+" target=\"_blank\">"
            else:
                link =links[key]#+" target=\"_blank\">"
            ratio = freqs[key]/freqs['TOTAL']
            percent = ratio*100
            rounded = round(percent, 3)
            toDisp[key] = (rounded, len(words[key]), link)
    toDisp = dict(sorted(toDisp.items(), key=lambda item: item[1], reverse=True))

    
    #for i in toDisp:
    #    print(i[1][0:5], i[0], "percent match with", i[2], 'distinct words', sep='\t')
    return toDisp

def main():
    while True:
        text = ''
        print("Input your text:\n")
        while True:
            line=input()
            if line:
                twoSpaces = False
                text+=' '+line
            else:
                if twoSpaces:
                    break
                twoSpaces = True
        freqs, words = parseText(text)
        percentMaker(freqs, words)
##        for i in words.keys():
##            print(i, words[i])
##            print('\n\n\n')

#main()
