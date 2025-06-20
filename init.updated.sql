-- 华容道游戏数据库初始化脚本
-- 创建日期: 2025年6月18日

-- 确保连接到正确的数据库
\c game_huaroingdao;

-- 创建用户表 (与你之前准备的表结构一致)
CREATE TABLE IF NOT EXISTS game_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    email VARCHAR(100),
    last_login TIMESTAMP
);

-- 创建游戏进度表
CREATE TABLE IF NOT EXISTS game_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES game_users(id) ON DELETE CASCADE,
    current_level INTEGER DEFAULT 1,
    completed_levels INTEGER[] DEFAULT '{}',
    total_steps INTEGER DEFAULT 0,
    total_time INTEGER DEFAULT 0,
    best_times INTEGER[] DEFAULT '{}',
    last_played TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建游戏统计表
CREATE TABLE IF NOT EXISTS game_stats (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES game_users(id) ON DELETE CASCADE,
    level INTEGER NOT NULL,
    steps INTEGER NOT NULL,
    time_seconds INTEGER NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, level)
);

-- 创建索引以优化查询性能
CREATE INDEX IF NOT EXISTS idx_username ON game_users(username);
CREATE INDEX IF NOT EXISTS idx_created_at ON game_users(created_at);
CREATE INDEX IF NOT EXISTS idx_user_progress ON game_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stats ON game_stats(user_id, level);
CREATE INDEX IF NOT EXISTS idx_last_played ON game_progress(last_played);

-- 插入示例数据（可选）
INSERT INTO game_users (username, password, email) VALUES 
('demo_player', '$2b$10$example_hashed_password', 'demo@example.com')
ON CONFLICT (username) DO NOTHING;

-- 为示例用户创建初始进度
INSERT INTO game_progress (user_id, current_level) 
SELECT id, 1 FROM game_users WHERE username = 'demo_player'
ON CONFLICT DO NOTHING;

-- 显示创建的表
\dt

-- 显示表结构
\d game_users
\d game_progress
\d game_stats

-- 输出成功信息
SELECT 'Database initialization completed successfully!' as status;
