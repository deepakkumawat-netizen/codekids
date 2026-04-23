"""
Database module for CodeKids
- Chat history tracking
- Daily usage limits per tool
"""

import sqlite3
import json
from datetime import datetime
from pathlib import Path

DB_PATH = Path(__file__).parent / "codekids.db"

class CodeKidsDatabase:
    """Manage chat history and usage limits"""

    def __init__(self):
        self.db_path = str(DB_PATH)
        self.init_db()

    def init_db(self):
        """Initialize database tables"""
        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()

        # Chat history table
        c.execute('''
            CREATE TABLE IF NOT EXISTS chat_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                tool_name TEXT,
                language TEXT,
                code TEXT,
                response TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # Usage tracking table
        c.execute('''
            CREATE TABLE IF NOT EXISTS usage_tracking (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                tool_name TEXT,
                usage_count INTEGER DEFAULT 0,
                reset_date DATE NOT NULL,
                UNIQUE(user_id, tool_name, reset_date)
            )
        ''')

        # Adaptive learning tables
        c.execute('''
            CREATE TABLE IF NOT EXISTS students (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_id TEXT UNIQUE NOT NULL,
                teacher_id TEXT NOT NULL,
                name TEXT NOT NULL,
                grade_level TEXT NOT NULL,
                subject TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_activity TIMESTAMP
            )
        ''')

        c.execute('''
            CREATE TABLE IF NOT EXISTS assessments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_id TEXT NOT NULL,
                language TEXT NOT NULL,
                problem_type TEXT,
                is_correct INTEGER NOT NULL,
                time_taken REAL,
                difficulty_rating REAL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        c.execute('''
            CREATE TABLE IF NOT EXISTS learning_objectives (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_id TEXT NOT NULL,
                language TEXT NOT NULL,
                mastery_level REAL DEFAULT 0.0,
                attempts_made INTEGER DEFAULT 0,
                correct_answers INTEGER DEFAULT 0,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        c.execute('''
            CREATE TABLE IF NOT EXISTS recommendations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_id TEXT NOT NULL,
                recommended_language TEXT NOT NULL,
                reasoning TEXT,
                difficulty_level TEXT,
                priority_score REAL,
                status TEXT DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        conn.commit()
        conn.close()
        print("[DB] CodeKids database initialized with adaptive learning tables")

    def save_chat(self, user_id: str, tool_name: str, code: str, response: str, language: str = "") -> int:
        """Save chat session to history"""
        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()

        c.execute('''
            INSERT INTO chat_history (user_id, tool_name, language, code, response)
            VALUES (?, ?, ?, ?, ?)
        ''', (user_id, tool_name, language, code, response))

        chat_id = c.lastrowid
        conn.commit()
        conn.close()

        # Cleanup old chats (keep only last 7)
        self.cleanup_old_chats(user_id, tool_name)

        return chat_id

    def get_last_7_chats(self, user_id: str, tool_name: str = "") -> list:
        """Get last 7 chat sessions for a user/tool"""
        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()

        if tool_name:
            c.execute('''
                SELECT id, tool_name, language, code, response, created_at
                FROM chat_history
                WHERE user_id = ? AND tool_name = ?
                ORDER BY created_at DESC
                LIMIT 7
            ''', (user_id, tool_name))
        else:
            c.execute('''
                SELECT id, tool_name, language, code, response, created_at
                FROM chat_history
                WHERE user_id = ?
                ORDER BY created_at DESC
                LIMIT 7
            ''', (user_id,))

        rows = c.fetchall()
        conn.close()

        chats = []
        for row in rows:
            code_preview = (row[3][:50] + '...') if row[3] and len(row[3]) > 50 else (row[3] or '')
            chats.append({
                'id': row[0],
                'tool_name': row[1],
                'language': row[2],
                'code': row[3],
                'response': row[4],
                'created_at': row[5],
                'preview': code_preview
            })

        return chats

    def cleanup_old_chats(self, user_id: str, tool_name: str = "", keep_count: int = 7) -> int:
        """Delete chats older than the last N per user/tool"""
        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()

        if tool_name:
            c.execute('''
                SELECT id FROM chat_history
                WHERE user_id = ? AND tool_name = ?
                ORDER BY created_at DESC
                LIMIT -1 OFFSET ?
            ''', (user_id, tool_name, keep_count))
        else:
            c.execute('''
                SELECT id FROM chat_history
                WHERE user_id = ?
                ORDER BY created_at DESC
                LIMIT -1 OFFSET ?
            ''', (user_id, keep_count))

        rows_to_delete = c.fetchall()
        deleted_count = len(rows_to_delete)

        if deleted_count > 0:
            ids_to_delete = [row[0] for row in rows_to_delete]
            placeholders = ','.join('?' * len(ids_to_delete))
            c.execute(f'DELETE FROM chat_history WHERE id IN ({placeholders})', ids_to_delete)

        conn.commit()
        conn.close()
        return deleted_count

    def check_usage(self, user_id: str, tool_name: str) -> dict:
        """Check daily usage for a user/tool"""
        from datetime import date
        today = str(date.today())

        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()

        c.execute('''
            SELECT usage_count FROM usage_tracking
            WHERE user_id = ? AND tool_name = ? AND reset_date = ?
        ''', (user_id, tool_name, today))

        row = c.fetchone()
        conn.close()

        if row:
            usage_count = row[0]
        else:
            usage_count = 0

        limit = 50
        remaining = max(0, limit - usage_count)
        exceeded = usage_count >= limit

        return {
            'usage_count': usage_count,
            'limit': limit,
            'remaining': remaining,
            'exceeded': exceeded
        }

    def increment_usage(self, user_id: str, tool_name: str) -> dict:
        """Increment usage count for today"""
        from datetime import date
        today = str(date.today())

        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()

        # Check if entry exists for today
        c.execute('''
            SELECT usage_count FROM usage_tracking
            WHERE user_id = ? AND tool_name = ? AND reset_date = ?
        ''', (user_id, tool_name, today))

        row = c.fetchone()

        if row:
            # Update existing entry
            new_count = row[0] + 1
            c.execute('''
                UPDATE usage_tracking
                SET usage_count = ?
                WHERE user_id = ? AND tool_name = ? AND reset_date = ?
            ''', (new_count, user_id, tool_name, today))
        else:
            # Create new entry
            c.execute('''
                INSERT INTO usage_tracking (user_id, tool_name, usage_count, reset_date)
                VALUES (?, ?, 1, ?)
            ''', (user_id, tool_name, today))
            new_count = 1

        conn.commit()
        conn.close()

        limit = 50
        remaining = max(0, limit - new_count)
        exceeded = new_count >= limit

        return {
            'usage_count': new_count,
            'limit': limit,
            'remaining': remaining,
            'exceeded': exceeded
        }

# Create global database instance
db = CodeKidsDatabase()
