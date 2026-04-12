
import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "archon.db")

def get_connection():
    """
    DBへの接続を返す関数
    """
    conn = sqlite3.connect(DB_PATH)
    #カラム名でアクセスできるようにする
    #これがないとconn[0]のように番号でのアクセスしかできない
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """
    テーブルが存在しなければ作成する関数
    アプリの起動時に１回だけ呼び出す
    """
    conn = get_connection()
    conn.execute("""
                 CREATE TABLE IF NOT EXSITS history(
                    id         INTENGER PRIMARY KEY AUTOINCREMENT,
                    query      TEXT NOT NULL,
                    answer     TEXT NOT NULL,
                    sources    TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                 )
            """)
    conn.commit()
    conn.close()
