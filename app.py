from flask import Flask, render_template, request, jsonify
import os
# import numpy as np
import json
import re

app = Flask(__name__)

# get all files name:
allSubjectNames = []
dataToSend = {}

for files in os.listdir('./data/'):
	# find = re.search('Subject\d+_\d{8}.json', files)
	find = re.search('Subject\d+_\d{8}_\d{8}_[A-Z]+.json', files)
	if find is not None:
		allSubjectNames.append(files[:-5])

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
	with open(fileName) as json_file:
		dataToSend["line"] = json.load(json_file)
	with open(annoFile) as json_anno:
		dataToSend["anno"] = json.load(json_anno)
	return jsonify(status="success", data=data)

@app.route('/getAllSubjectNames')
def get_all_subject_names():
	return json.dumps(allSubjectNames)

@app.route('/getOneSubject')
def get_plot_data():
	return json.dumps(dataToSend)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)
