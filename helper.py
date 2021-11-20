from flask.sessions import SessionMixin
from flask import Response
import json

configs = json.loads(open("config.json","r").read())

def isloggedin(session:SessionMixin)->bool:
    if "login" in session:
        if str(session["login"]) == "True":
            return True
    return False

def initLOGS():
    if not configs["server_debug_logging"]:
        import logging
        log = logging.getLogger('werkzeug')
        log.setLevel(logging.ERROR)

def initDB(connection):
    global cursor, conn
    conn = connection
    cursor = conn.cursor()
    cursor.execute("""CREATE TABLE IF NOT EXISTS `USERS` (id integer PRIMARY KEY AUTOINCREMENT, firstname text, age int, email text, password text, date datetime DEFAULT(datetime()))""")
    cursor.execute("""CREATE TABLE IF NOT EXISTS `SUBJECTS` (id integer PRIMARY KEY AUTOINCREMENT, name text, description text, date datetime DEFAULT(datetime()))""")
    cursor.execute("""CREATE TABLE IF NOT EXISTS `TOPICS` (id integer PRIMARY KEY AUTOINCREMENT, name text, description text, subjectID int, date datetime DEFAULT(datetime()))""")
    cursor.execute("""CREATE TABLE IF NOT EXISTS `NOTES` (id integer PRIMARY KEY AUTOINCREMENT, question text, answer text, topicID int, date datetime DEFAULT(datetime()))""")

def addSubject(subject):
    if subject[0][0] == "":
        return Response(json.dumps({"status":"false"}), mimetype='application/json')
    cursor.executemany('insert into SUBJECTS(name,description) values (?,?)', subject)
    conn.commit()
    return Response(json.dumps({"status":"true"}), mimetype='application/json')

def addTopic(topic):
    if topic[0][0] == "":
        return Response(json.dumps({"status":"false"}), mimetype='application/json')
    cursor.executemany('insert into TOPICS(name,description,subjectID) values (?,?,?)', topic)
    conn.commit()
    return Response(json.dumps({"status":"true"}), mimetype='application/json')

def addNote(note):
    if note[0][0] == "":
        return Response(json.dumps({"status":"false"}), mimetype='application/json')
    cursor.executemany('insert into NOTES(question,answer,topicID) values (?,?,?)', note)
    conn.commit()
    return Response(json.dumps({"status":"true"}), mimetype='application/json')

