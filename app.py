from flask import Flask, render_template, request, jsonify
import os
# import numpy as np
import json
import re
import csv

app = Flask(__name__)

# get all files name:
#allSubjectNames = []
dataToSend = {}

#for files in os.listdir('./data/'):
#	# find = re.search('Subject\d+_\d{8}.json', files)
#	find = re.search('Subject\d+_\d{8}_\d{8}_[A-Z]+.json', files)
#	if find is not None:
#		allSubjectNames.append(files[:-5])


@app.route('/')
def index():
    return render_template("index.html")

@app.route('/subjectName', methods=['POST'])
def subject_name():
	global dataToSend
	dataToSend = {"line": [], "anno": []}
	data = json.loads(request.form.get('data'))
	curSubjectName = data["name"]
	fileName = './data/' + curSubjectName + '.json'
	annoFile = './data/' + curSubjectName + '_annotation.json'
	tableFile = './data/' + curSubjectName + '.csv'
	with open(fileName) as json_file:
		dataToSend["line"] = json.load(json_file)
	with open(annoFile) as json_anno:
		dataToSend["anno"] = json.load(json_anno)
	if os.path.exists(tableFile):
		dataToSend["table"] = []
		dataToSend["tableFR"] = []
		with open(tableFile) as csv_file:
			csv_reader = csv.reader(csv_file, delimiter=',')
			line_count = 0
			for row in csv_reader:
				if line_count == 0:
					for i in range(0, len(row)):
						dataToSend["tableFR"].append(["<b>" + row[i] + "</b>"])
					line_count += 1
					continue
				if line_count == 1:
					for i in range(0, len(row)):
						dataToSend["table"].append([row[i]])
					line_count += 1
				else:
					for i in range(0, len(row)):
						dataToSend["table"][i].append(row[i])
	#	print (dataToSend["table"])
	#	print (dataToSend["tableFR"])
	# 		for row in csv_reader:
	# 			if line_count == 0:
	# 				dataToSend["tableFirstRow"] = row
	# 				line_count += 1
	# 			else:
	# 				temp = {}
	# 				for i in range(0, len(row)):
	# 					temp[dataToSend["tableFirstRow"][i]] = row[i]
	# 				dataToSend["table"].append(temp)
	# print (dataToSend["tableFirstRow"])
	# print (dataToSend["table"])
	return jsonify(status="success", data=data)

@app.route('/getAllSubjectNames')
def get_all_subject_names():
	allSubjectNames = []
	for files in os.listdir('./data/'):
	# find = re.search('Subject\d+_\d{8}.json', files)
		find = re.search('Subject\d+_\d{8}_\d{8}_[A-Z]+.json', files)
		if find is not None:
			allSubjectNames.append(files[:-5])
	return json.dumps(allSubjectNames)

@app.route('/getOneSubject')
def get_plot_data():
	return json.dumps(dataToSend)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)
