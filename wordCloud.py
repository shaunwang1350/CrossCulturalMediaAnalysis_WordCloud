import multidict as multidict
import os
from os import path
from wordcloud import WordCloud
import matplotlib.pyplot as plt

font_path = d + 'cca/static/fonts/SourceHanSerif/SourceHanSerifK-Light.otf'

def transfromTxtToDict(str):
    
    fullTermsDict = multidict.MultiDict()
    
    splitString = str.replace(",", " ").split()
    entries = dict([(x, y) for x, y in zip(splitString[::2], splitString[1::2])])
    
    for key in entries:
        fullTermsDict.add(key, int(entries[key]))
    
    return fullTermsDict

def new_color_func(word, font_size, position, orientation, random_state=None,
                    **kwargs):
    return "hsl(30, 100%%, %d%%)" % random.randint(0, 100)

def makeImage(text):

    wc = WordCloud(font_path=font_path, background_color="white", max_words=50)
    wc.generate_from_frequencies(text)
    plt.imshow(wc.recolor(color_func=new_color_func, random_state=3),
           interpolation="bilinear")
    plt.axis("off")
    plt.show()
    
d = path.dirname(__file__) if "__file__" in locals() else os.getcwd()

text = open(path.join(d, 'cca/static/Kmeans/KmeansFre.txt'), encoding='utf-8')
text = text.read()

makeImage(transfromTxtToDict(text))