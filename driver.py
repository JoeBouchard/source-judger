import re
import pandas as pd
df = pd.read_csv("wordFreqs.csv")
df.set_index('WORD', inplace=True)

def parseText(text):
    cleanText = ''
    for i in text:
        if i.isalnum() or i.isspace():
            cleanText+=i
        if i == '-':
            cleanText += ' '
    tokens = re.split('\\s+?', cleanText)
    #print(tokens)
    while '' in tokens:
        tokens.remove('')
    freqCounter = {'TOTAL':0}
    wordMatch = {'NONE':[]}
    print("Working...")
    for t in tokens:
        if t != 'I':
            t = t.lower()
##        print(t)
        try:
            freqs = df.loc[t]
            found=True
        except KeyError:
            freqs = df.loc['a']
            found=False
        for f in freqs.keys():
            if found:
                if f not in freqCounter.keys():
                    freqCounter[f] = 0
                    wordMatch[f] = []
                freqCounter[f]+= 1 if freqs[f] > 0.6 else round(freqs[f], 3)
                if freqs[f] > 0.75 and t not in wordMatch[f]:
                    wordMatch[f].append(t)
            elif t not in wordMatch['NONE']:
                wordMatch['NONE'].append(t)
        if found:
            freqCounter['TOTAL']+=1
    return freqCounter, wordMatch

def percentMaker(freqs, words):
    toDisp = []
    for key in freqs.keys():
        if key != 'TOTAL':
            ratio = freqs[key]/freqs['TOTAL']
            percent = ratio*100
            rounded = round(percent, 3)
            toDisp.append((rounded, key, len(words[key])))
    toDisp.sort(reverse=True)
    
    for i in toDisp:
        print(i[1][0:5], i[0], "percent match with", i[2], 'distinct words', sep='\t')
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
