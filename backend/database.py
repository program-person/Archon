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
    conn.execute("""
        CREATE TABLE IF NOT EXISTS api_usage (
            id       INTEGER PRIMARY KEY AUTOINCREMENT,
            used_at   DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

def increment_usage():
    """検索のために呼ぶ：使用回数を1増やす"""
    conn = get_connection()
    conn.execute("INSERT INTO api_usage (used_at) VALUES (CURRENT_TIMESTAMP)")
    conn.commit()
    conn.close()

def get_monthly_usage():
    """今月の使用料を返す"""
    conn = get_connection()
    #今月1日以降の件数をカウント
    row = conn.execute("""
        SELECT COUNT(*) as count FROM api_usage
        WHERE strftime('%Y-%m' , used_at) = strftime('%Y-%m', 'now')
    """).fetchone()
    conn.close()
    return row["count"]
