import eyed3
import os

file_name = list((os.listdir("mp3/")))

data = []
for file in file_name:
	temp = []
	audiofile = eyed3.load("mp3/" + file)
	if audiofile.tag != None:
		if audiofile.tag.title != None:
			temp.append(audiofile.tag.title)
		else:
			temp.append(None)
		if audiofile.tag.artist != None:
			temp.append(audiofile.tag.artist)
		else:
			temp.append(None)
		if audiofile.tag.release_date != None:
			temp.append(audiofile.tag.release_date)
		else:
			temp.append(None)
		if audiofile.tag.album != None:
			temp.append(audiofile.tag.album)
		else:
			temp.append(None)
		if file != None:
			temp.append(file)
		

		data.append(temp)


import pandas as pd    
df = pd.DataFrame(data)

df.to_csv('music_data.csv', index=False)

# print(audiofile.tag.file_info)

