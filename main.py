"""
  ______    _                  __          _________                
.' ____ \  / |_               |  ]        |  _   _  |               
| (___ \_|`| |-'__   _    .--.| |   _   __|_/ | | \_|,--.  _ .--.   
 _.____`.  | | [  | | | / /'`\' |  [ \ [  ]   | |   `'_\ :[ '/'`\ \ 
| \____) | | |, | \_/ |,| \__/  |   \ '/ /   _| |_  // | |,| \__/ | 
 \______.' \__/ '.__.'_/ '.__.;__][\_:  /   |_____| \'-;__/| ;.__/  
                                   \__.'                  [__|                                                                                
"""

from flask import Flask, request, send_from_directory, redirect, jsonify, session, make_response, Response
import os,json,sqlite3,hashlib,uuid, helper,re

configs = json.loads(open("config.json","r").read())

conn = sqlite3.connect(configs["server_database_path"],check_same_thread=configs["server_database_threadsafety"])
cursor = conn.cursor()
helper.initDB(conn)

# set the project root directory as the static folder, you can set others.
SESSION_TYPE = configs["session_type"]
app = Flask(__name__, static_url_path='/')

helper.initLOGS()

@app.route("/api/v1/status")
def test():
    if helper.isloggedin(session):
        user = str(session["user"])
        login = str(session["login"])
    else:
        user = "none"
        login = "false"
    json_str = f'{{"login":"{login}","user":"{user}"}}'
    json_obj = json.loads(json_str)
    return json_obj

@app.route('/api/logout/redir')
def api_interactive_logout(prefill=False):
  if helper.isloggedin(session):
    session.clear()
  return redirect("/web/", code=302)

@app.route('/api/v1/login', methods = ['POST','GET'])
def api_login(prefill=False):
    if request.method == 'POST':
        try:
            global session
            if prefill:
                data = prefill[0]
                session = prefill[1]
            else:
                data = json.loads(request.get_json())
            password = str(hashlib.sha512( str(data['password']).encode("utf-8") ).hexdigest())
            hashed = conn.execute(f"SELECT password,id FROM users where email = '{data['email'].lower()}'").fetchall()
            if not len(hashed):
                return '{"status":"false","msg":"Email does not exist"}'
            if hashed[0][0] != password:
                return '{"status":"false","msg":"Password does not match"}'

            session['login'] = True
            session['user'] = hashed[0][1]

            resp = make_response('{"status":"true"}')
            
            return resp

        except Exception as e:
            print(e)
            return f'{{"status":"false","msg":"{e}"}}'

@app.route('/api/v1/subject', methods = ['POST','GET'])
def api_subject_list():
    cur = conn.cursor()
    cur.execute("SELECT id,name,description FROM SUBJECTS")
    rows = cur.fetchall()
    subjects = []
    for row in rows:
        subjects.append({"name":row[1],"teacher":row[2],"id":row[0]})
    
    return Response(json.dumps(subjects), mimetype='application/json')


@app.route('/api/v1/subject/add', methods = ['POST','GET'])
def api_subject_add():
    data = json.loads(request.get_json())
    name = data["subject"]
    description = data["description"]
    subject = [(name,description)]
    return helper.addSubject(subject)


@app.route('/api/v1/subject/<subject>/topic/add', methods = ['POST','GET'])
def api_subject_topic_add(subject):
    data = json.loads(request.get_json())

    name = data["topic"]
    description = data["description"]
    subjectID = int(subject)

    topic = [(name,description,subjectID)]
    return helper.addTopic(topic)

@app.route('/api/v1/subject/<subject>/topic/<topic>/note/add', methods = ['POST','GET'])
def api_subject_note_add(subject,topic):
    data = json.loads(request.get_json())

    answer = data["answer"]
    question = data["question"]
    topicID = int(topic)

    note = [(question,answer,topicID)]
    return helper.addNote(note)


@app.route('/api/v1/subject/<subject>/topics', methods = ['POST','GET'])
def api_subject_topics_list(subject):
    cur = conn.cursor()
    cmd = "SELECT id,name,description FROM TOPICS WHERE subjectID == "+subject
    cur.execute(cmd)
    rows = cur.fetchall()
    topics = []
    for row in rows:
        topics.append({"name":row[1],"description":row[2],"id":row[0]})
    
    return Response(json.dumps(topics), mimetype='application/json')

@app.route('/api/v1/subject/<subject>/topic/<topic>/notes', methods = ['POST','GET'])
def api_subject_notes_list(subject,topic):
    cur = conn.cursor()
    cmd = "SELECT id,question,answer FROM NOTES WHERE topicID == "+topic
    cur.execute(cmd)
    rows = cur.fetchall()
    topics = []
    for row in rows:
        topics.append({"question":row[1],"answer":row[2],"id":row[0]})
    
    return Response(json.dumps(topics), mimetype='application/json')

@app.route('/api/v1/subject/<subject>', methods = ['POST','GET'])
def api_subject_info(subject):
    cur = conn.cursor()
    cmd = "SELECT id,name FROM SUBJECTS WHERE id == "+subject
    cur.execute(cmd)
    rows = cur.fetchall()
    info = {"name":rows[0][1],"id":rows[0][0]}
    return Response(json.dumps(info), mimetype='application/json')
    return Response(json.dumps({"name":"Computer Science","id":"0"}), mimetype='application/json')

@app.route('/api/v1/subject/<subject>/topic/<topic>', methods = ['POST','GET'])
def api_topic_info(subject,topic):
    cur = conn.cursor()
    cmd = "SELECT id,name FROM TOPICS WHERE id == "+topic
    cur.execute(cmd)
    rows = cur.fetchall()
    info = {"name":rows[0][1],"id":rows[0][0]}
    return Response(json.dumps(info), mimetype='application/json')
    return Response(json.dumps({"name":"Computer Science","id":"0"}), mimetype='application/json')



@app.route('/api/v1/register', methods = ['POST','GET'])
def api_register():
    if request.method == 'POST':
        try:
            data = json.loads(request.get_json())
            if len(conn.execute(f"SELECT 1 FROM users where email = '{data['email'].lower()}'").fetchall()):
                return '{"status":"false","msg":"Email exists"}'
            password = str(hashlib.sha512( str(data['password']).encode("utf-8") ).hexdigest())
            conn.execute(f"INSERT INTO users(firstname,age,email,password) VALUES('{data['firstname']}', {data['age']}, '{data['email'].lower()}', '{password}')")
            conn.commit()
            prefill = [data,session]
            api_login(prefill=prefill)
            return '{"status":"true"}'
        except Exception as e:
            print(e)
            return f'{{"status":"false","msg":"{e}"}}'

@app.route('/')
def redirect_to_folder():
    return redirect("/web/", code=301)

@app.route('/web/')
def redir_to_html(path="index.html"):
    return send_from_directory(configs["server_static_folder"], "index.html")

@app.route('/favicon.ico')
def redir_favicon(path="index.html"):
    return send_from_directory(configs["server_static_folder"], "favicon.ico")


@app.route('/pdf/mindmap.pdf')
def redir_mindmap(path="index.html"):
    return send_from_directory(configs["server_static_folder"], "Research/StudyTap Mindmap.pdf")

@app.route('/pdf/housestyle.pdf')
def redir_housestyle(path="index.html"):
    return send_from_directory(configs["server_static_folder"], "Research/House Style.pdf")


@app.route('/alt') #tiddlywiky
def see_alt():
    return send_from_directory(".", "Template.html")


@app.route('/web/<path:path>')
def send_static(path="index.html"):
    static_directory = configs["server_static_folder"]
    for route in configs["routes"]:
        if route["path"] == path and not route["dynamic"]:
            return send_from_directory(static_directory, route["url"])
        elif route["dynamic"]:
            pattern = re.compile(route["path"])
            if pattern.match(path):
                return send_from_directory(static_directory, route["url"])
    
    return send_from_directory(static_directory, path)

if __name__ == "__main__":
    app.secret_key = configs["session_masterkey"]
    app.config['SESSION_TYPE'] = configs["session_type"]
    app.run(host=configs["server_bind_address"],port=configs["server_port"],debug=configs["server_debug_mode"])