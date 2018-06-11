sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data/words.db');
fs = require('fs');

var db = null;

function main() {
			initDb();
			
			var express = require('express')
			,bodyParser = require('body-parser');
			var restapi = express.Router();
			restapi.use(bodyParser.json());
			restapi.route('/word');
			}
function log(message) {
			console.log("LOG: %", message);
			}
function initDb() {
			log("Init of db goes here");
			if (! fs.existsSync("data"))
				fs.mkdirSync("data");
			db = new sqlite3.Database("data/db.sqlite");
			
			db.serialize(() => {
			db.run("CREATE TABLE IF NOT EXISTS Note (id INTEGER PRIMARY KEY, text TEXT NOT NULL)");
			db.run("INSERT INTO Note(text) VALUES ('Pro 1')");
			db.close()});
			
			
			}
function wordGET(req,res) {
    lLog("Asking for all words");
    db.all("SELECT key, value FROM word", function(err, rows) {
        if(err) {
            resError(res,err);
        } else {
            var words = [];
            rows.forEach(function(row) {
                var word = { "key": row.key, "value":row.value};
                words.push(word);
            })
            res.json({ "words":words});
        }
    });
}
function wordGETbyID(req, res) {
    word_key=req.params.key;
    lLog("Asking for word with key: "+word_key);
    dbGetWord(word_key,function(err,word) {
        if(err) {
            resError(res,err)
        } else { 
            res.json(word);
        }
    });
}
function wordPOST(req, res) {
    var value=req.body.value;
    var key=req.body.key;

    if (value!=undefined) {
        lLog("Creating new word with value: "+value);
        if (key!=undefined) {
            lLog("Ignoring key argument in POST")
        }
        dbCreateWord(value,function(err,key) {
            if(err) {
                resError("err");
            } else {
                res.json({"key":key,"value":value});
            }
        });
    } else {
        resError(res,"No value given");
    }
}
function wordDELETEbyID(req,res) {
    var key=req.params.key;
    if (key!=undefined) {
        lLog("Deleting word with key: "+key);
        dbDeleteWord(key,function(err) {
            if (err) {
                resError(res,err);
            } else {
                res.end();
            }
        });
    } else {
        resError(res,"No key given");
    }
}
function wordPUTbyID(req,res) {
    var key=req.params.key;
    var value=req.body.value;
    if (key!=undefined) {
        if (key != req.body.key) {
            resError(res,"Different key in ressource and json");
        } else {
            lLog("Updateing word with key: "+key+" to value: "+value);
            dbUpdateWord(key,value,function(err,result) {
                if(err) {
                    resError(res,err);
                } else {
                    res.end();
                }
            });
        }
    }
}
main();