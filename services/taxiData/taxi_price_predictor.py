
"""
   trip_distance  pickup_longitude  pickup_latitude  rate_code  diffy
ValueError: feature_names mismatch: [u'trip_distance', u'pickup_longitude', u'pickup_latitude', u'rate_code', u'diff'] [u'diff', u'pickup_latitude', u'pickup_longitude', u'rate_code', u'trip_distance']

"""

#library imports
import xgboost
import pickle
import pandas as pd
import numpy as np
import sys

#input parameters
trip_distance = float(sys.argv[1])
diff = float(sys.argv[2])
pickup_longitude = float(sys.argv[3])
pickup_latitude = float(sys.argv[4])
rate_code = float(sys.argv[5])

df = {'trip_distance':[trip_distance],'pickup_longitude':[pickup_longitude],'pickup_latitude':[pickup_latitude],'rate_code':[rate_code],'diff':[diff]}
#d = {'rate_code':[rate_code],'trip_distance':[input_distance],'diff':[input_time],'pickup_longitude':[pickup_longitude],'pickup_latitude':[pickup_latitude]}
df = pd.DataFrame(data = df)
cols = ['trip_distance', 'pickup_longitude', 'pickup_latitude', 'rate_code', 'diff']
df = df[cols]

#loading model
loaded_model = pickle.load(open('/Users/sambhavanand/Desktop/projects/hackbar/nyc-taxi-data/taxi-backend/services/taxiData/taxiModelddsb.pickle',"rb"))

#regress based on input parameters
output = loaded_model.predict(data=df)
output = output+.50 #for MTA tax
print(output[0])
