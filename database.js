/**
 * 数据库操作模块
 * 处理用户账号管理和游戏进度保存
 */

class DatabaseAPI {
    constructor() {
        // 检测运行环境
        this.isContainer = window.location.hostname !== 'localhost' && 
                          window.location.hostname !== '127.0.0.1';
        
        // 根据环境设置API地址
        this.baseURL = this.isContainer ? 
            `${window.location.protocol}//${window.location.host}/api` : 
            'http://localhost:3000/api';
            
        console.log('API Base URL:', this.baseURL);
        console.log('Container Mode:', this.isContainer);
        
        this.currentUser = null;
        this.isConnected = false;
    }

    /**
     * 测试数据库连接
     */
    async testConnection() {
        try {
            const response = await fetch(`${this.baseURL}/health`);
            this.isConnected = response.ok;
            return this.isConnected;
        } catch (error) {
            console.warn('数据库连接失败，使用本地存储模式:', error);
            this.isConnected = false;
            return false;
        }
    }

    /**
     * 用户注册
     */
    async registerUser(username, password, email = null) {
        try {
            // 前端验证
            if (!username || username.length < 3 || username.length > 50) {
                throw new Error('用户名长度必须在3-50字符之间');
            }
            if (!password || password.length < 6) {
                throw new Error('密码长度至少6位');
            }

            if (this.isConnected) {
                // 服务器注册
                const response = await fetch(`${this.baseURL}/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: username.trim(),
                        password: password,
                        email: email?.trim() || null
                    })
                });

                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || '注册失败');
                }

                return { success: true, user: data.user };
            } else {
                // 本地存储注册
                const users = this.getLocalUsers();
                if (users.find(u => u.username === username.trim())) {
                    throw new Error('用户名已存在');
                }

                const user = {
                    id: Date.now(),
                    username: username.trim(),
                    password: password, // 实际应用中应该加密
                    email: email?.trim() || null,
                    created_at: new Date().toISOString(),
                    last_login: null
                };

                users.push(user);
                localStorage.setItem('huarongdao_users', JSON.stringify(users));
                
                return { success: true, user };
            }
        } catch (error) {
            console.error('注册错误:', error);
            return { success: false, message: error.message };
        }
    }

    /**
     * 用户登录
     */
    async loginUser(username, password) {
        try {
            if (this.isConnected) {
                // 服务器登录
                const response = await fetch(`${this.baseURL}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: username.trim(),
                        password: password
                    })
                });

                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || '登录失败');
                }

                this.currentUser = data.user;
                localStorage.setItem('huarongdao_current_user', JSON.stringify(this.currentUser));
                
                return { success: true, user: data.user };
            } else {
                // 本地存储登录
                const users = this.getLocalUsers();
                const user = users.find(u => u.username === username.trim() && u.password === password);
                
                if (!user) {
                    throw new Error('用户名或密码错误');
                }

                // 更新最后登录时间
                user.last_login = new Date().toISOString();
                localStorage.setItem('huarongdao_users', JSON.stringify(users));
                
                this.currentUser = user;
                localStorage.setItem('huarongdao_current_user', JSON.stringify(this.currentUser));
                
                return { success: true, user };
            }
        } catch (error) {
            console.error('登录错误:', error);
            return { success: false, message: error.message };
        }
    }

    /**
     * 用户登出
     */
    logout() {
        this.currentUser = null;
        localStorage.removeItem('huarongdao_current_user');
        return { success: true };
    }

    /**
     * 删除用户账号
     */
    async deleteUser(userId) {
        try {
            if (this.isConnected) {
                // 服务器删除
                const response = await fetch(`${this.baseURL}/user/${userId}`, {
                    method: 'DELETE'
                });

                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || '删除失败');
                }

                this.logout();
                return { success: true };
            } else {
                // 本地存储删除
                const users = this.getLocalUsers();
                const filteredUsers = users.filter(u => u.id !== userId);
                localStorage.setItem('huarongdao_users', JSON.stringify(filteredUsers));
                
                // 删除用户进度
                localStorage.removeItem(`huarongdao_progress_${userId}`);
                
                this.logout();
                return { success: true };
            }
        } catch (error) {
            console.error('删除账号错误:', error);
            return { success: false, message: error.message };
        }
    }

    /**
     * 保存游戏进度
     */
    async saveProgress(gameState) {
        try {
            if (!this.currentUser) {
                throw new Error('请先登录账号');
            }

            const progressData = {
                user_id: this.currentUser.id,
                current_level: gameState.currentLevel,
                move_count: gameState.moveCount,
                elapsed_time: gameState.elapsedTime,
                completed_levels: gameState.completedLevels || [],
                saved_at: new Date().toISOString()
            };

            if (this.isConnected) {
                // 服务器保存
                const response = await fetch(`${this.baseURL}/progress`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(progressData)
                });

                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || '保存失败');
                }

                return { success: true };
            } else {
                // 本地存储保存
                localStorage.setItem(`huarongdao_progress_${this.currentUser.id}`, JSON.stringify(progressData));
                return { success: true };
            }
        } catch (error) {
            console.error('保存进度错误:', error);
            return { success: false, message: error.message };
        }
    }

    /**
     * 加载游戏进度
     */
    async loadProgress() {
        try {
            if (!this.currentUser) {
                throw new Error('请先登录账号');
            }

            if (this.isConnected) {
                // 服务器加载
                const response = await fetch(`${this.baseURL}/progress/${this.currentUser.id}`);
                
                if (response.status === 404) {
                    return { success: true, progress: null }; // 没有保存的进度
                }

                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || '加载失败');
                }

                return { success: true, progress: data.progress };
            } else {
                // 本地存储加载
                const progressData = localStorage.getItem(`huarongdao_progress_${this.currentUser.id}`);
                const progress = progressData ? JSON.parse(progressData) : null;
                
                return { success: true, progress };
            }
        } catch (error) {
            console.error('加载进度错误:', error);
            return { success: false, message: error.message };
        }
    }

    /**
     * 获取当前登录用户
     */
    getCurrentUser() {
        if (!this.currentUser) {
            const stored = localStorage.getItem('huarongdao_current_user');
            if (stored) {
                this.currentUser = JSON.parse(stored);
            }
        }
        return this.currentUser;
    }

    /**
     * 检查用户是否已登录
     */
    isLoggedIn() {
        return this.getCurrentUser() !== null;
    }

    /**
     * 获取本地存储的用户列表（离线模式）
     */
    getLocalUsers() {
        const users = localStorage.getItem('huarongdao_users');
        return users ? JSON.parse(users) : [];
    }

    /**
     * 格式化时间显示
     */
    formatDate(dateString) {
        if (!dateString) return '从未';
        const date = new Date(dateString);
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// 导出实例
window.DatabaseAPI = DatabaseAPI;
