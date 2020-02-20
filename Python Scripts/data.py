import keras
import pandas as pd
import numpy as np
import os
from utils.src.audiomanip.audiomodels import ModelZoo
from utils.src.audiomanip.audioutils import AudioUtils
from utils.src.audiomanip.audioutils import MusicDataGenerator
import librosa
import matplotlib.pyplot as plot
from keras.models import load_model
from utils.src.audiomanip.audioutils import AudioUtils
from utils.src.audiomanip.audiostruct import AudioStruct
from keras.models import load_model
import mongo
import shutil


host=""
port=""
username=""
password=""
userid=""
#df_song_id=mongo_to_df()


def copy_data(df):
	for i in df['liked_songs']:
		song_path=df_song_id.loc[df_song_id['id'] == i, 'path']
		shutil.copy(song_path,'utils/dataset/liked/userid/'+userid)


#def genre_list(liked):
#	genrelist=[]
#	for i in liked:
#		genre=get_genre(i)
#		genrelist.append(genre)
#	return genrelist

def get_content(userid):
	cnn= load_model('model.h5')
	song_rep=AudioStruct("../Python Scripts/utils/dataset/liked/userid/"+userid)
	songs,genres=song_rep.getdata()
	print(len(songs))
	temp_X=[]
	pred=[]
	for song in songs:
		song_split=np.split(song,5)
		for s in song_split:
			temp_X.append(s)
		temp_X=np.array(temp_X)
		pred.append(cnn.predict(temp_X))
		temp_X=[]
	pred=np.array(pred)
	return pred


		#pred = np.argmax(cnn.predict(temp_X), axis = 1)
		#genre_list.append(pred[0])
	#return genre_list

def mongo_to_df():
	connection=mongo._connect_mongo(host,port,username,password,db)
	songid=read_mongo(db, collection, query, host, port, username, password, no_id)
	return songid


def getdistance():

	distance=[]
	#predall=get_content('id1/')
	predall=np.loadtxt('all161.txt')
	pred=get_content('')
	predall=np.array(predall)
	predall=np.reshape(predall,(161,5,5))
	#np.savetxt('all161.txt',predall)
	print('Saved..')
	pred=np.array(pred)
	for ind,i in enumerate(predall):
		dist= np.linalg.norm(pred-i)
		distance.append(dist)
	distanceindex=[]
	for ind,i in enumerate(distance):
		distanceindex.append([ind,i])
	#print(distanceindex)
	distanceindex.sort(key=lambda x:x[1])
	print(distanceindex)
	recomm = []
	for i in range(5):
		recomm.append(distanceindex[i][0])

	# distanceindex=np.array(distanceindex)
	# recomm=distanceindex[:,0][:5]
	print(recomm)
	for i in recomm:
		# print(len(os.listdir(os.getcwd()+'/utils/dataset/liked/userid/id1/blues')))
		print(os.listdir(os.getcwd()+'/utils/dataset/liked/userid/id1/blues')[int(i)])
	



	
#print(os.listdir(os.getcwd()+'/utils/dataset/liked/userid/id1/blues'))
getdistance()



