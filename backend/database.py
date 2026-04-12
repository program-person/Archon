import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__),"archon.db")

def get_connection():
    """
    DBへの接続を返す関数
    """
    conn = sqlite3.connect(DB_PATH)
    #カラム名でアクセスできるようにする
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """
    テーブルがなければ作成する関数
    """
    conn = get_connection()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS history(
            id       INTEGER PRIMARY KEY AUTOINCREMENT,
            query    TEXT NOT NULL,
            answer    TEXT NOT NULL,
            sources    TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()
    