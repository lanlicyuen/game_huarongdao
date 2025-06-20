class HuaRongDao {
    constructor() {
        this.currentLevel = 1;
        this.moveCount = 0;
        this.startTime = null;
        this.timerInterval = null;
        this.board = [];
        this.pieces = [];
        this.gridSize = { width: 4, height: 5 };
        this.cellSize = { width: 90, height: 90 };
          // 拖拽相关变量
        this.draggedPiece = null;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;
        
        // 数据库和用户管理
        this.db = new DatabaseAPI();
        this.completedLevels = new Set();
        
          // 10个关卡配置，基于经典华容道布局，确保每一关都可解
        this.levels = {
            1: { // 简单 - 经典横刀立马
                pieces: [
                    { id: 'caocao', type: 'caocao', name: '曹操', x: 1, y: 0, width: 2, height: 2 },
                    { id: 'guanyu', type: 'general', name: '关羽', x: 1, y: 2, width: 2, height: 1 },
                    { id: 'zhangfei', type: 'general', name: '张飞', x: 0, y: 0, width: 1, height: 2 },
                    { id: 'zhaoyun', type: 'general', name: '赵云', x: 3, y: 0, width: 1, height: 2 },
                    { id: 'machao', type: 'general', name: '马超', x: 0, y: 2, width: 1, height: 2 },
                    { id: 'huangzhong', type: 'general', name: '黄忠', x: 3, y: 2, width: 1, height: 2 },
                    { id: 'soldier1', type: 'soldier', name: '兵1', x: 1, y: 3, width: 1, height: 1 },
                    { id: 'soldier2', type: 'soldier', name: '兵2', x: 2, y: 3, width: 1, height: 1 },
                    { id: 'soldier3', type: 'soldier', name: '兵3', x: 0, y: 4, width: 1, height: 1 },
                    { id: 'soldier4', type: 'soldier', name: '兵4', x: 3, y: 4, width: 1, height: 1 }
                    // 空位在 (1,4) 和 (2,4)
                ]
            },
            2: { // 进阶 - 近在咫尺
                pieces: [
                    { id: 'caocao', type: 'caocao', name: '曹操', x: 1, y: 1, width: 2, height: 2 },
                    { id: 'guanyu', type: 'general', name: '关羽', x: 1, y: 0, width: 2, height: 1 },
                    { id: 'zhangfei', type: 'general', name: '张飞', x: 0, y: 0, width: 1, height: 2 },
                    { id: 'zhaoyun', type: 'general', name: '赵云', x: 3, y: 0, width: 1, height: 2 },
                    { id: 'machao', type: 'general', name: '马超', x: 0, y: 2, width: 1, height: 2 },
                    { id: 'huangzhong', type: 'general', name: '黄忠', x: 3, y: 2, width: 1, height: 2 },
                    { id: 'soldier1', type: 'soldier', name: '兵1', x: 1, y: 3, width: 1, height: 1 },
                    { id: 'soldier2', type: 'soldier', name: '兵2', x: 2, y: 3, width: 1, height: 1 },
                    { id: 'soldier3', type: 'soldier', name: '兵3', x: 0, y: 4, width: 1, height: 1 },
                    { id: 'soldier4', type: 'soldier', name: '兵4', x: 3, y: 4, width: 1, height: 1 }
                    // 空位在 (1,4) 和 (2,4)
                ]
            },
            3: { // 中等 - 守口如瓶
                pieces: [
                    { id: 'caocao', type: 'caocao', name: '曹操', x: 0, y: 0, width: 2, height: 2 },
                    { id: 'guanyu', type: 'general', name: '关羽', x: 2, y: 0, width: 2, height: 1 },
                    { id: 'zhangfei', type: 'general', name: '张飞', x: 2, y: 1, width: 1, height: 2 },
                    { id: 'zhaoyun', type: 'general', name: '赵云', x: 3, y: 1, width: 1, height: 2 },
                    { id: 'machao', type: 'general', name: '马超', x: 0, y: 2, width: 1, height: 2 },
                    { id: 'huangzhong', type: 'general', name: '黄忠', x: 1, y: 2, width: 1, height: 2 },
                    { id: 'soldier1', type: 'soldier', name: '兵1', x: 2, y: 3, width: 1, height: 1 },
                    { id: 'soldier2', type: 'soldier', name: '兵2', x: 3, y: 3, width: 1, height: 1 },
                    { id: 'soldier3', type: 'soldier', name: '兵3', x: 0, y: 4, width: 1, height: 1 },
                    { id: 'soldier4', type: 'soldier', name: '兵4', x: 1, y: 4, width: 1, height: 1 }
                    // 空位在 (2,4) 和 (3,4)
                ]
            },
            4: { // 中高等 - 群英会
                pieces: [
                    { id: 'caocao', type: 'caocao', name: '曹操', x: 1, y: 0, width: 2, height: 2 },
                    { id: 'guanyu', type: 'general', name: '关羽', x: 0, y: 0, width: 1, height: 2 },
                    { id: 'zhangfei', type: 'general', name: '张飞', x: 3, y: 0, width: 1, height: 2 },
                    { id: 'zhaoyun', type: 'general', name: '赵云', x: 0, y: 2, width: 1, height: 2 },
                    { id: 'machao', type: 'general', name: '马超', x: 3, y: 2, width: 1, height: 2 },
                    { id: 'huangzhong', type: 'general', name: '黄忠', x: 1, y: 2, width: 2, height: 1 },
                    { id: 'soldier1', type: 'soldier', name: '兵1', x: 1, y: 3, width: 1, height: 1 },
                    { id: 'soldier2', type: 'soldier', name: '兵2', x: 2, y: 3, width: 1, height: 1 },
                    { id: 'soldier3', type: 'soldier', name: '兵3', x: 0, y: 4, width: 1, height: 1 },
                    { id: 'soldier4', type: 'soldier', name: '兵4', x: 3, y: 4, width: 1, height: 1 }
                    // 空位在 (1,4) 和 (2,4)
                ]
            },            5: { // 困难 - 峰回路转
                pieces: [
                    { id: 'caocao', type: 'caocao', name: '曹操', x: 0, y: 1, width: 2, height: 2 },
                    { id: 'guanyu', type: 'general', name: '关羽', x: 2, y: 0, width: 2, height: 1 },
                    { id: 'zhangfei', type: 'general', name: '张飞', x: 0, y: 0, width: 1, height: 1 },
                    { id: 'zhaoyun', type: 'general', name: '赵云', x: 1, y: 0, width: 1, height: 1 },
                    { id: 'machao', type: 'general', name: '马超', x: 2, y: 1, width: 1, height: 2 },
                    { id: 'huangzhong', type: 'general', name: '黄忠', x: 3, y: 1, width: 1, height: 2 },
                    { id: 'soldier1', type: 'soldier', name: '兵1', x: 0, y: 3, width: 1, height: 1 },
                    { id: 'soldier2', type: 'soldier', name: '兵2', x: 1, y: 3, width: 1, height: 1 },
                    { id: 'soldier3', type: 'soldier', name: '兵3', x: 3, y: 3, width: 1, height: 1 },
                    { id: 'soldier4', type: 'soldier', name: '兵4', x: 0, y: 4, width: 1, height: 1 }
                    // 空位在 (2,3), (1,4), (2,4), (3,4)
                ]
            },
            6: { // 很困难 - 过五关
                pieces: [
                    { id: 'caocao', type: 'caocao', name: '曹操', x: 2, y: 0, width: 2, height: 2 },
                    { id: 'guanyu', type: 'general', name: '关羽', x: 0, y: 0, width: 2, height: 1 },
                    { id: 'zhangfei', type: 'general', name: '张飞', x: 0, y: 1, width: 1, height: 2 },
                    { id: 'zhaoyun', type: 'general', name: '赵云', x: 1, y: 1, width: 1, height: 2 },
                    { id: 'machao', type: 'general', name: '马超', x: 2, y: 2, width: 2, height: 1 },
                    { id: 'huangzhong', type: 'general', name: '黄忠', x: 0, y: 3, width: 1, height: 2 },
                    { id: 'soldier1', type: 'soldier', name: '兵1', x: 1, y: 3, width: 1, height: 1 },
                    { id: 'soldier2', type: 'soldier', name: '兵2', x: 2, y: 3, width: 1, height: 1 },
                    { id: 'soldier3', type: 'soldier', name: '兵3', x: 3, y: 3, width: 1, height: 1 },
                    { id: 'soldier4', type: 'soldier', name: '兵4', x: 1, y: 4, width: 1, height: 1 }
                    // 空位在 (0,4), (2,4), (3,4)
                ]
            },
            7: { // 专家级 - 双将挡路
                pieces: [
                    { id: 'caocao', type: 'caocao', name: '曹操', x: 1, y: 1, width: 2, height: 2 },
                    { id: 'guanyu', type: 'general', name: '关羽', x: 0, y: 0, width: 2, height: 1 },
                    { id: 'zhangfei', type: 'general', name: '张飞', x: 2, y: 0, width: 2, height: 1 },
                    { id: 'zhaoyun', type: 'general', name: '赵云', x: 0, y: 1, width: 1, height: 2 },
                    { id: 'machao', type: 'general', name: '马超', x: 3, y: 1, width: 1, height: 2 },
                    { id: 'huangzhong', type: 'general', name: '黄忠', x: 1, y: 3, width: 1, height: 1 },
                    { id: 'weiyan', type: 'general', name: '魏延', x: 2, y: 3, width: 1, height: 1 },
                    { id: 'soldier1', type: 'soldier', name: '兵1', x: 0, y: 3, width: 1, height: 1 },
                    { id: 'soldier2', type: 'soldier', name: '兵2', x: 3, y: 3, width: 1, height: 1 },
                    { id: 'soldier3', type: 'soldier', name: '兵3', x: 0, y: 4, width: 1, height: 1 }
                    // 空位在 (1,4), (2,4), (3,4)
                ]
            },            8: { // 大师级 - 左右为难
                pieces: [
                    { id: 'caocao', type: 'caocao', name: '曹操', x: 0, y: 0, width: 2, height: 2 },
                    { id: 'guanyu', type: 'general', name: '关羽', x: 2, y: 1, width: 2, height: 1 },
                    { id: 'zhangfei', type: 'general', name: '张飞', x: 2, y: 0, width: 1, height: 1 },
                    { id: 'zhaoyun', type: 'general', name: '赵云', x: 3, y: 0, width: 1, height: 1 },
                    { id: 'machao', type: 'general', name: '马超', x: 0, y: 2, width: 1, height: 1 },
                    { id: 'huangzhong', type: 'general', name: '黄忠', x: 1, y: 2, width: 1, height: 1 },
                    { id: 'weiyan', type: 'general', name: '魏延', x: 3, y: 2, width: 1, height: 1 },
                    { id: 'soldier1', type: 'soldier', name: '兵1', x: 0, y: 3, width: 1, height: 1 },
                    { id: 'soldier2', type: 'soldier', name: '兵2', x: 1, y: 3, width: 1, height: 1 },
                    { id: 'soldier3', type: 'soldier', name: '兵3', x: 3, y: 3, width: 1, height: 1 }
                    // 空位在 (2,2), (2,3), (0,4), (1,4), (2,4), (3,4)
                ]
            },
            9: { // 地狱级 - 前挡后阻
                pieces: [
                    { id: 'caocao', type: 'caocao', name: '曹操', x: 1, y: 0, width: 2, height: 2 },
                    { id: 'guanyu', type: 'general', name: '关羽', x: 0, y: 0, width: 1, height: 2 },
                    { id: 'zhangfei', type: 'general', name: '张飞', x: 3, y: 0, width: 1, height: 2 },
                    { id: 'zhaoyun', type: 'general', name: '赵云', x: 0, y: 2, width: 1, height: 1 },
                    { id: 'machao', type: 'general', name: '马超', x: 1, y: 2, width: 1, height: 1 },
                    { id: 'huangzhong', type: 'general', name: '黄忠', x: 2, y: 2, width: 1, height: 1 },
                    { id: 'weiyan', type: 'general', name: '魏延', x: 3, y: 2, width: 1, height: 1 },
                    { id: 'soldier1', type: 'soldier', name: '兵1', x: 0, y: 3, width: 1, height: 1 },
                    { id: 'soldier2', type: 'soldier', name: '兵2', x: 1, y: 3, width: 1, height: 1 },
                    { id: 'soldier3', type: 'soldier', name: '兵3', x: 2, y: 3, width: 1, height: 1 },
                    { id: 'soldier4', type: 'soldier', name: '兵4', x: 3, y: 3, width: 1, height: 1 }
                    // 空位在 (0,4), (1,4), (2,4), (3,4)
                ]
            },
            10: { // 终极挑战 - 水泄不通
                pieces: [
                    { id: 'caocao', type: 'caocao', name: '曹操', x: 1, y: 0, width: 2, height: 2 },
                    { id: 'guanyu', type: 'general', name: '关羽', x: 0, y: 0, width: 1, height: 2 },
                    { id: 'zhangfei', type: 'general', name: '张飞', x: 3, y: 0, width: 1, height: 2 },
                    { id: 'zhaoyun', type: 'general', name: '赵云', x: 0, y: 2, width: 1, height: 2 },
                    { id: 'machao', type: 'general', name: '马超', x: 3, y: 2, width: 1, height: 2 },
                    { id: 'huangzhong', type: 'general', name: '黄忠', x: 1, y: 2, width: 1, height: 1 },
                    { id: 'weiyan', type: 'general', name: '魏延', x: 2, y: 2, width: 1, height: 1 },
                    { id: 'soldier1', type: 'soldier', name: '兵1', x: 1, y: 3, width: 1, height: 1 },
                    { id: 'soldier2', type: 'soldier', name: '兵2', x: 2, y: 3, width: 1, height: 1 },
                    { id: 'soldier3', type: 'soldier', name: '兵3', x: 0, y: 4, width: 1, height: 1 },
                    { id: 'soldier4', type: 'soldier', name: '兵4', x: 3, y: 4, width: 1, height: 1 }
                    // 空位在 (1,4) 和 (2,4)
                ]
            }
        };
        
        this.init();
    }    init() {
        this.setupEventListeners();
        this.loadLevel(this.currentLevel);
        this.updateDisplay();
        
        // 初始化数据库连接
        this.initDatabase();
        
        // 运行关卡验证
        setTimeout(() => {
            this.validateAllLevels();
        }, 1000);
    }
    
    async initDatabase() {
        try {
            await this.db.testConnection();
            console.log('数据库连接状态:', this.db.isConnected ? '已连接' : '离线模式');
            
            // 检查是否有已登录用户
            const currentUser = this.db.getCurrentUser();
            if (currentUser) {
                this.updateUserDisplay(currentUser);
                
                // 询问是否加载进度
                if (confirm('检测到已登录账号，是否加载之前的游戏进度？')) {
                    await this.loadUserProgress();
                }
            }
        } catch (error) {
            console.warn('数据库初始化失败:', error);
        }
    }    setupEventListeners() {
        // 控制按钮
        document.getElementById('reset').addEventListener('click', () => this.resetLevel());
        document.getElementById('prev-level').addEventListener('click', () => this.changeLevel(-1));
        document.getElementById('next-level').addEventListener('click', () => this.changeLevel(1));
        document.getElementById('hint').addEventListener('click', () => this.showHint());
        
        // 账号管理按钮
        document.getElementById('account-btn').addEventListener('click', () => this.showAccountModal());
        
        // 管理员功能 - 验证所有关卡
        document.getElementById('validate-all-btn').addEventListener('click', () => {
            console.log('手动触发关卡验证...');
            const results = this.validateAllLevels();
            
            // 生成验证报告
            let report = '关卡验证报告:\n';
            results.forEach(r => {
                report += `关卡 ${r.level}: ${r.valid ? '✓ 有效' : '✗ 无效'} (空位: ${r.emptyCells})\n`;
            });
            
            const validCount = results.filter(r => r.valid).length;
            report += `\n总结: ${validCount}/10 个关卡有效`;
            
            alert(report);
        });
        
        // 账号管理弹窗事件
        this.setupAccountModalListeners();
        
        // 关卡选择
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const level = parseInt(e.target.dataset.level);
                this.loadLevel(level);
            });
        });
        
        // 胜利模态框
        document.getElementById('next-level-modal').addEventListener('click', () => {
            this.hideVictoryModal();
            this.changeLevel(1);
        });
        document.getElementById('replay-level').addEventListener('click', () => {
            this.hideVictoryModal();
            this.resetLevel();
        });
        document.getElementById('close-modal').addEventListener('click', () => {
            this.hideVictoryModal();
        });
    }
      loadLevel(level) {
        if (level < 1 || level > 10) return;
        
        // 验证关卡有效性
        if (!this.validateLevel(this.levels[level])) {
            console.error(`关卡 ${level} 无效! 请检查关卡布局。`);
            alert(`关卡 ${level} 存在问题，无法正常游戏。请选择其他关卡。`);
            return;
        }
        
        this.currentLevel = level;
        this.moveCount = 0;
        this.pieces = JSON.parse(JSON.stringify(this.levels[level].pieces));
        this.resetTimer();
        this.createBoard();
        this.updateDisplay();
        this.updateLevelButtons();
        
        console.log(`关卡 ${level} 加载成功，验证通过！`);
    }
    
    createBoard() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = '';
        
        // 创建网格
        this.board = Array(this.gridSize.height).fill().map(() => Array(this.gridSize.width).fill(null));
        
        // 创建网格视觉效果
        for (let y = 0; y < this.gridSize.height; y++) {
            for (let x = 0; x < this.gridSize.width; x++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.style.left = `${x * this.cellSize.width}px`;
                cell.style.top = `${y * this.cellSize.height}px`;
                cell.style.width = `${this.cellSize.width}px`;
                cell.style.height = `${this.cellSize.height}px`;
                gameBoard.appendChild(cell);
            }
        }
        
        // 创建出口区域
        const exitZone = document.createElement('div');
        exitZone.className = 'exit-zone';
        gameBoard.appendChild(exitZone);
        
        // 放置棋子
        this.pieces.forEach(piece => {
            this.createPiece(piece);
            this.placePiece(piece);
        });
        
        this.startTimer();
    }
    
    createPiece(piece) {
        const pieceElement = document.createElement('div');
        pieceElement.className = `piece ${piece.type}`;
        pieceElement.id = piece.id;
        pieceElement.textContent = piece.name;
        pieceElement.style.width = `${piece.width * this.cellSize.width - 6}px`;
        pieceElement.style.height = `${piece.height * this.cellSize.height - 6}px`;
        
        // 添加拖拽功能
        this.setupDragAndDrop(piece, pieceElement);
        
        document.getElementById('game-board').appendChild(pieceElement);
        piece.element = pieceElement;
    }
    
    setupDragAndDrop(piece, element) {
        let isDragging = false;
        
        // 鼠标事件
        element.addEventListener('mousedown', (e) => {
            this.startDrag(e, piece, element);
            e.preventDefault();
        });
        
        // 触摸事件（移动设备）
        element.addEventListener('touchstart', (e) => {
            this.startDrag(e.touches[0], piece, element);
            e.preventDefault();
        }, { passive: false });
        
        // 添加全局事件监听器
        document.addEventListener('mousemove', (e) => {
            if (this.draggedPiece === piece) {
                this.duringDrag(e, piece, element);
            }
        });
        
        document.addEventListener('touchmove', (e) => {
            if (this.draggedPiece === piece) {
                this.duringDrag(e.touches[0], piece, element);
                e.preventDefault();
            }
        }, { passive: false });
        
        document.addEventListener('mouseup', (e) => {
            if (this.draggedPiece === piece) {
                this.endDrag(e, piece, element);
            }
        });
        
        document.addEventListener('touchend', (e) => {
            if (this.draggedPiece === piece) {
                this.endDrag(e.changedTouches[0] || e.touches[0] || e, piece, element);
            }
        });
    }
    
    startDrag(event, piece, element) {
        if (this.draggedPiece) return; // 防止多重拖拽
        
        this.draggedPiece = piece;
        this.dragStartX = piece.x;
        this.dragStartY = piece.y;
        
        const rect = element.getBoundingClientRect();
        const gameBoard = document.getElementById('game-board');
        const boardRect = gameBoard.getBoundingClientRect();
        
        this.dragOffsetX = event.clientX - rect.left;
        this.dragOffsetY = event.clientY - rect.top;
        
        // 视觉反馈
        element.classList.add('moving');
        element.style.zIndex = '1000';
        element.style.transform = 'scale(1.05)';
        
        // 显示可能的移动位置
        this.showPossibleMoves(piece);
        
        // 临时移除棋子占用的棋盘位置
        this.clearPieceFromBoard(piece);
    }
    
    duringDrag(event, piece, element) {
        if (!this.draggedPiece) return;
        
        const gameBoard = document.getElementById('game-board');
        const boardRect = gameBoard.getBoundingClientRect();
        
        // 计算新位置
        const newLeft = event.clientX - boardRect.left - this.dragOffsetX;
        const newTop = event.clientY - boardRect.top - this.dragOffsetY;
        
        // 限制在游戏板内
        const maxLeft = gameBoard.clientWidth - element.offsetWidth;
        const maxTop = gameBoard.clientHeight - element.offsetHeight;
        
        const constrainedLeft = Math.max(0, Math.min(newLeft, maxLeft));
        const constrainedTop = Math.max(0, Math.min(newTop, maxTop));
        
        element.style.left = `${constrainedLeft}px`;
        element.style.top = `${constrainedTop}px`;
    }
    
    endDrag(event, piece, element) {
        if (!this.draggedPiece) return;
        
        const gameBoard = document.getElementById('game-board');
        const boardRect = gameBoard.getBoundingClientRect();
        
        // 计算目标网格位置 - 基于棋子的左上角
        const elementRect = element.getBoundingClientRect();
        const relativeX = elementRect.left - boardRect.left;
        const relativeY = elementRect.top - boardRect.top;
        
        // 转换为网格坐标，四舍五入到最近的网格位置
        const gridX = Math.round(relativeX / this.cellSize.width);
        const gridY = Math.round(relativeY / this.cellSize.height);
        
        // 确保在边界内
        const clampedX = Math.max(0, Math.min(gridX, this.gridSize.width - piece.width));
        const clampedY = Math.max(0, Math.min(gridY, this.gridSize.height - piece.height));
        
        // 恢复棋子到原位置用于检测
        this.restorePieceToBoard(piece, this.dragStartX, this.dragStartY);
        
        // 华容道规则：只能移动到相邻位置
        if (this.canMoveTo(piece, clampedX, clampedY)) {
            // 执行移动
            this.movePiece(piece, clampedX, clampedY);
            this.moveCount++;
            this.updateDisplay();
            
            // 检查胜利条件
            if (this.checkWin()) {
                this.showVictory();
            }
        } else {
            // 移动无效，恢复到原位置
            this.placePiece(piece);
        }
        
        // 清理拖拽状态
        this.cleanupDrag(element);
    }
    
    clearPieceFromBoard(piece) {
        for (let y = piece.y; y < piece.y + piece.height; y++) {
            for (let x = piece.x; x < piece.x + piece.width; x++) {
                if (y >= 0 && y < this.gridSize.height && x >= 0 && x < this.gridSize.width) {
                    this.board[y][x] = null;
                }
            }
        }
    }
    
    restorePieceToBoard(piece, x, y) {
        for (let dy = 0; dy < piece.height; dy++) {
            for (let dx = 0; dx < piece.width; dx++) {
                const boardY = y + dy;
                const boardX = x + dx;
                if (boardY >= 0 && boardY < this.gridSize.height && boardX >= 0 && boardX < this.gridSize.width) {
                    this.board[boardY][boardX] = piece.id;
                }
            }
        }
    }
    
    cleanupDrag(element) {
        element.classList.remove('moving');
        element.style.zIndex = '';
        element.style.transform = '';
        this.clearPossibleMoves();
        this.draggedPiece = null;
    }
    
    placePiece(piece) {
        // 更新棋盘状态
        for (let y = piece.y; y < piece.y + piece.height; y++) {
            for (let x = piece.x; x < piece.x + piece.width; x++) {
                this.board[y][x] = piece.id;
            }
        }
        
        // 更新视觉位置
        piece.element.style.left = `${piece.x * this.cellSize.width + 3}px`;
        piece.element.style.top = `${piece.y * this.cellSize.height + 3}px`;
    }
    
    showPossibleMoves(piece) {
        this.clearPossibleMoves();
        
        // 只检查相邻的四个方向
        const directions = [
            { x: -1, y: 0 }, // 左
            { x: 1, y: 0 },  // 右
            { x: 0, y: -1 }, // 上
            { x: 0, y: 1 }   // 下
        ];
        
        directions.forEach(dir => {
            const newX = piece.x + dir.x;
            const newY = piece.y + dir.y;
            
            if (this.canMoveTo(piece, newX, newY)) {
                const hint = document.createElement('div');
                hint.className = 'hint-overlay';
                hint.style.left = `${newX * this.cellSize.width + 3}px`;
                hint.style.top = `${newY * this.cellSize.height + 3}px`;
                hint.style.width = `${piece.width * this.cellSize.width - 6}px`;
                hint.style.height = `${piece.height * this.cellSize.height - 6}px`;
                document.getElementById('game-board').appendChild(hint);
            }
        });
    }
    
    clearPossibleMoves() {
        document.querySelectorAll('.hint-overlay').forEach(hint => hint.remove());
    }
    
    canMoveTo(piece, newX, newY) {
        // 检查边界
        if (newX < 0 || newY < 0 || 
            newX + piece.width > this.gridSize.width || 
            newY + piece.height > this.gridSize.height) {
            return false;
        }
        
        // 只允许水平或垂直相邻移动，不允许跳跃
        const deltaX = Math.abs(newX - piece.x);
        const deltaY = Math.abs(newY - piece.y);
        
        // 必须是相邻移动：要么水平移动一格，要么垂直移动一格，不能同时移动
        if ((deltaX === 1 && deltaY === 0) || (deltaX === 0 && deltaY === 1)) {
            // 检查目标位置是否有冲突
            for (let y = newY; y < newY + piece.height; y++) {
                for (let x = newX; x < newX + piece.width; x++) {
                    if (this.board[y] && this.board[y][x] !== null && this.board[y][x] !== piece.id) {
                        return false;
                    }
                }
            }
            return true;
        }
        
        return false; // 不是相邻移动
    }
    
    movePiece(piece, newX, newY) {
        // 清除旧位置
        for (let y = piece.y; y < piece.y + piece.height; y++) {
            for (let x = piece.x; x < piece.x + piece.width; x++) {
                this.board[y][x] = null;
            }
        }
        
        // 更新棋子位置
        piece.x = newX;
        piece.y = newY;
        
        // 放置到新位置
        this.placePiece(piece);
    }
    
    checkWin() {
        // 曹操到达底部出口位置 (x: 1-2, y: 3-4)
        const caocao = this.pieces.find(p => p.id === 'caocao');
        return caocao && caocao.x === 1 && caocao.y === 3;
    }
    
    showVictory() {
        this.stopTimer();
        
        document.getElementById('victory-level').textContent = this.currentLevel;
        document.getElementById('victory-time').textContent = this.formatTime(this.getElapsedTime());
        document.getElementById('victory-moves').textContent = this.moveCount;
        document.getElementById('victory-modal').classList.remove('hidden');
        
        // 标记关卡完成
        this.markLevelCompleted(this.currentLevel);
    }
    
    hideVictoryModal() {
        document.getElementById('victory-modal').classList.add('hidden');
    }
    
    markLevelCompleted(level) {
        const levelBtn = document.querySelector(`[data-level="${level}"]`);
        if (levelBtn) {
            levelBtn.classList.add('completed');
        }
    }
    
    resetLevel() {
        this.loadLevel(this.currentLevel);
    }
    
    changeLevel(delta) {
        const newLevel = this.currentLevel + delta;
        if (newLevel >= 1 && newLevel <= 10) {
            this.loadLevel(newLevel);
        }
    }
    
    showHint() {
        // 简单提示：高亮曹操和目标位置
        const caocao = this.pieces.find(p => p.id === 'caocao');
        if (caocao) {
            caocao.element.style.animation = 'pulse 1s infinite';
            setTimeout(() => {
                caocao.element.style.animation = '';
            }, 3000);
        }
        
        // 显示目标区域提示
        const exitZone = document.querySelector('.exit-zone');
        exitZone.style.animation = 'pulse 1s infinite';
        setTimeout(() => {
            exitZone.style.animation = '';
        }, 3000);
    }
    
    startTimer() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            this.updateTimer();
        }, 1000);
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    resetTimer() {
        this.stopTimer();
        this.startTime = null;
        document.getElementById('timer').textContent = '00:00';
    }
    
    updateTimer() {
        if (this.startTime) {
            const elapsed = this.getElapsedTime();
            document.getElementById('timer').textContent = this.formatTime(elapsed);
        }
    }
    
    getElapsedTime() {
        return this.startTime ? Math.floor((Date.now() - this.startTime) / 1000) : 0;
    }
    
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    updateDisplay() {
        document.getElementById('current-level').textContent = this.currentLevel;
        document.getElementById('move-count').textContent = this.moveCount;
    }
    
    updateLevelButtons() {
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.level) === this.currentLevel) {
                btn.classList.add('active');
            }
        });
    }
      // 验证关卡是否有足够的空位
    validateLevel(levelData) {
        const testBoard = Array(this.gridSize.height).fill(null).map(() => 
            Array(this.gridSize.width).fill(null)
        );
        
        let occupiedCells = 0;
        const totalCells = this.gridSize.width * this.gridSize.height;
        
        // 放置所有棋子到测试棋盘
        for (let piece of levelData.pieces) {
            for (let y = piece.y; y < piece.y + piece.height; y++) {
                for (let x = piece.x; x < piece.x + piece.width; x++) {
                    if (y >= 0 && y < this.gridSize.height && x >= 0 && x < this.gridSize.width) {
                        if (testBoard[y][x] !== null) {
                            console.warn(`关卡冲突: 位置(${x},${y})被多个棋子占用`);
                            return false;
                        }
                        testBoard[y][x] = piece.id;
                        occupiedCells++;
                    } else {
                        console.warn(`关卡错误: 棋子${piece.id}超出边界`);
                        return false;
                    }
                }
            }
        }
        
        const emptyCells = totalCells - occupiedCells;
        console.log(`关卡验证: 空位数量=${emptyCells}, 总格子=${totalCells}`);
        
        // 至少需要2个空位才能有移动空间
        if (emptyCells < 2) {
            console.warn(`关卡错误: 空位不足 (${emptyCells} < 2)`);
            return false;
        }
        
        return true;
    }
    
    // 批量验证所有关卡
    validateAllLevels() {
        console.log('开始批量验证所有关卡...');
        const validationResults = [];
        
        for (let level = 1; level <= 10; level++) {
            const isValid = this.validateLevel(this.levels[level]);
            const result = {
                level: level,
                valid: isValid,
                emptyCells: this.getEmptyCellsCount(this.levels[level])
            };
            validationResults.push(result);
            
            console.log(`关卡 ${level}: ${isValid ? '✓ 有效' : '✗ 无效'} (空位: ${result.emptyCells})`);
        }
        
        const validCount = validationResults.filter(r => r.valid).length;
        console.log(`验证完成: ${validCount}/10 个关卡有效`);
        
        return validationResults;
    }
    
    // 获取关卡空位数量
    getEmptyCellsCount(levelData) {
        let occupiedCells = 0;
        const totalCells = this.gridSize.width * this.gridSize.height;
        
        for (let piece of levelData.pieces) {
            occupiedCells += piece.width * piece.height;
        }
          return totalCells - occupiedCells;
    }
    
    // === 账号管理功能 ===
    
    setupAccountModalListeners() {
        // 主账号管理弹窗
        document.getElementById('close-account-modal').addEventListener('click', () => this.hideAccountModal());
        
        // 游客视图按钮
        document.getElementById('login-btn').addEventListener('click', () => this.showLoginView());
        document.getElementById('register-btn').addEventListener('click', () => this.showRegisterView());
        
        // 登录视图
        document.getElementById('do-login').addEventListener('click', () => this.handleLogin());
        document.getElementById('back-to-guest').addEventListener('click', () => this.showGuestView());
        
        // 注册视图
        document.getElementById('do-register').addEventListener('click', () => this.handleRegister());
        document.getElementById('back-to-guest-reg').addEventListener('click', () => this.showGuestView());
        
        // 用户视图
        document.getElementById('save-progress').addEventListener('click', () => this.handleSaveProgress());
        document.getElementById('load-progress').addEventListener('click', () => this.handleLoadProgress());
        document.getElementById('logout-btn').addEventListener('click', () => this.handleLogout());
        document.getElementById('delete-account').addEventListener('click', () => this.showDeleteConfirm());
        document.getElementById('close-user-modal').addEventListener('click', () => this.hideAccountModal());
        
        // 删除确认弹窗
        document.getElementById('confirm-delete').addEventListener('click', () => this.handleDeleteAccount());
        document.getElementById('cancel-delete').addEventListener('click', () => this.hideDeleteConfirm());
    }
    
    showAccountModal() {
        const currentUser = this.db.getCurrentUser();
        if (currentUser) {
            this.showUserView(currentUser);
        } else {
            this.showGuestView();
        }
        document.getElementById('account-modal').classList.remove('hidden');
    }
    
    hideAccountModal() {
        document.getElementById('account-modal').classList.add('hidden');
    }
    
    showGuestView() {
        this.hideAllAccountViews();
        document.getElementById('guest-view').classList.remove('hidden');
    }
    
    showLoginView() {
        this.hideAllAccountViews();
        document.getElementById('login-view').classList.remove('hidden');
    }
    
    showUserView(user) {
        this.hideAllAccountViews();
        document.getElementById('user-view').classList.remove('hidden');
        document.getElementById('username-display').textContent = user.username;
    }
    
    hideAllAccountViews() {
        document.querySelectorAll('.account-section').forEach(section => {
            section.classList.add('hidden');
        });
    }
    
    async handleLogin() {
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;
        
        if (!username || !password) {
            alert('请输入用户名和密码');
            return;
        }
        
        const result = await this.db.loginUser(username, password);
        if (result.success) {
            this.updateUserDisplay(result.user);
            this.showUserView(result.user);
            alert('登录成功！');
        } else {
            alert('登录失败：' + result.message);
        }
    }
    
    async handleRegister() {
        const username = document.getElementById('reg-username').value.trim();
        const password = document.getElementById('reg-password').value;
        const email = document.getElementById('reg-email').value.trim();
        
        if (!username || !password) {
            alert('请输入用户名和密码');
            return;
        }
        
        const result = await this.db.registerUser(username, password, email);
        if (result.success) {
            alert('注册成功！请登录您的账号。');
            this.showLoginView();
        } else {
            alert('注册失败：' + result.message);
        }
    }
    
    handleLogout() {
        this.db.logout();
        this.updateUserDisplay(null);
        this.hideAccountModal();
        alert('已退出登录');
    }
    
    showDeleteConfirm() {
        document.getElementById('delete-confirm-modal').classList.remove('hidden');
    }
    
    hideDeleteConfirm() {
        document.getElementById('delete-confirm-modal').classList.add('hidden');
    }
    
    updateUserDisplay(user) {
        const userElement = document.getElementById('current-user');
        if (user) {
            userElement.textContent = user.username;
            userElement.style.color = '#28a745';
        } else {
            userElement.textContent = '游客';
            userElement.style.color = '#6c757d';
        }
    }
}

// 游戏启动
document.addEventListener('DOMContentLoaded', () => {
    new HuaRongDao();
});
// === 账号管理功能 ===
    
    setupAccountModalListeners() {
        // 主账号管理弹窗
        document.getElementById('close-account-modal').addEventListener('click', () => this.hideAccountModal());
        
        // 游客视图按钮
        document.getElementById('login-btn').addEventListener('click', () => this.showLoginView());
        document.getElementById('register-btn').addEventListener('click', () => this.showRegisterView());
        
        // 登录视图
        document.getElementById('do-login').addEventListener('click', () => this.handleLogin());
        document.getElementById('back-to-guest').addEventListener('click', () => this.showGuestView());
        
        // 注册视图
        document.getElementById('do-register').addEventListener('click', () => this.handleRegister());
        document.getElementById('back-to-guest-reg').addEventListener('click', () => this.showGuestView());
        
        // 用户视图
        document.getElementById('save-progress').addEventListener('click', () => this.handleSaveProgress());
        document.getElementById('load-progress').addEventListener('click', () => this.handleLoadProgress());
        document.getElementById('logout-btn').addEventListener('click', () => this.handleLogout());
        document.getElementById('delete-account').addEventListener('click', () => this.showDeleteConfirm());
        document.getElementById('close-user-modal').addEventListener('click', () => this.hideAccountModal());
        
        // 删除确认弹窗
        document.getElementById('confirm-delete').addEventListener('click', () => this.handleDeleteAccount());
        document.getElementById('cancel-delete').addEventListener('click', () => this.hideDeleteConfirm());
        
        // 回车键登录/注册
        document.getElementById('login-password').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleLogin();
        });
        document.getElementById('reg-password').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleRegister();
        });
    }
    
    showAccountModal() {
        const currentUser = this.db.getCurrentUser();
        if (currentUser) {
            this.showUserView(currentUser);
        } else {
            this.showGuestView();
        }
        document.getElementById('account-modal').classList.remove('hidden');
    }
    
    hideAccountModal() {
        document.getElementById('account-modal').classList.add('hidden');
        this.clearFormInputs();
    }
    
    showGuestView() {
        this.hideAllAccountViews();
        document.getElementById('guest-view').classList.remove('hidden');
    }
    
    showLoginView() {
        this.hideAllAccountViews();
        document.getElementById('login-view').classList.remove('hidden');
        document.getElementById('login-username').focus();
    }
    
    showRegisterView() {
        this.hideAllAccountViews();
        document.getElementById('register-view').classList.remove('hidden');
        document.getElementById('reg-username').focus();
    }
    
    showUserView(user) {
        this.hideAllAccountViews();
        document.getElementById('user-view').classList.remove('hidden');
        
        // 更新用户信息显示
        document.getElementById('username-display').textContent = user.username;
        document.getElementById('register-time').textContent = this.db.formatDate(user.created_at);
        document.getElementById('last-login-time').textContent = this.db.formatDate(user.last_login);
    }
    
    hideAllAccountViews() {
        document.querySelectorAll('.account-section').forEach(section => {
            section.classList.add('hidden');
        });
    }
    
    clearFormInputs() {
        document.getElementById('login-username').value = '';
        document.getElementById('login-password').value = '';
        document.getElementById('reg-username').value = '';
        document.getElementById('reg-password').value = '';
        document.getElementById('reg-email').value = '';
    }
    
    async handleLogin() {
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;
        
        if (!username || !password) {
            alert('请输入用户名和密码');
            return;
        }
        
        const button = document.getElementById('do-login');
        button.disabled = true;
        button.textContent = '登录中...';
        
        try {
            const result = await this.db.loginUser(username, password);
            
            if (result.success) {
                this.updateUserDisplay(result.user);
                this.showUserView(result.user);
                
                // 询问是否加载进度
                if (confirm('登录成功！是否加载之前保存的游戏进度？')) {
                    await this.loadUserProgress();
                }
            } else {
                alert('登录失败：' + result.message);
            }
        } finally {
            button.disabled = false;
            button.textContent = '登录';
        }
    }
    
    async handleRegister() {
        const username = document.getElementById('reg-username').value.trim();
        const password = document.getElementById('reg-password').value;
        const email = document.getElementById('reg-email').value.trim();
        
        if (!username || !password) {
            alert('请输入用户名和密码');
            return;
        }
        
        const button = document.getElementById('do-register');
        button.disabled = true;
        button.textContent = '注册中...';
        
        try {
            const result = await this.db.registerUser(username, password, email);
            
            if (result.success) {
                alert('注册成功！请登录您的账号。');
                this.showLoginView();
                document.getElementById('login-username').value = username;
            } else {
                alert('注册失败：' + result.message);
            }
        } finally {
            button.disabled = false;
            button.textContent = '注册';
        }
    }
    
    handleLogout() {
        if (confirm('确定要退出登录吗？')) {
            this.db.logout();
            this.updateUserDisplay(null);
            this.hideAccountModal();
            alert('已退出登录');
        }
    }
    
    showDeleteConfirm() {
        document.getElementById('delete-confirm-modal').classList.remove('hidden');
    }
    
    hideDeleteConfirm() {
        document.getElementById('delete-confirm-modal').classList.add('hidden');
    }
    
    async handleDeleteAccount() {
        const currentUser = this.db.getCurrentUser();
        if (!currentUser) return;
        
        const button = document.getElementById('confirm-delete');
        button.disabled = true;
        button.textContent = '删除中...';
        
        try {
            const result = await this.db.deleteUser(currentUser.id);
            
            if (result.success) {
                this.updateUserDisplay(null);
                this.hideDeleteConfirm();
                this.hideAccountModal();
                alert('账号已删除');
            } else {
                alert('删除失败：' + result.message);
            }
        } finally {
            button.disabled = false;
            button.textContent = '确认删除';
        }
    }
    
    async handleSaveProgress() {
        const currentUser = this.db.getCurrentUser();
        if (!currentUser) {
            alert('请先登录账号');
            return;
        }
        
        const gameState = {
            currentLevel: this.currentLevel,
            moveCount: this.moveCount,
            elapsedTime: this.getElapsedTime(),
            completedLevels: Array.from(this.completedLevels)
        };
        
        const button = document.getElementById('save-progress');
        button.disabled = true;
        button.textContent = '保存中...';
        
        try {
            const result = await this.db.saveProgress(gameState);
            
            if (result.success) {
                alert('游戏进度已保存！');
            } else {
                alert('保存失败：' + result.message);
            }
        } finally {
            button.disabled = false;
            button.textContent = '保存进度';
        }
    }
    
    async handleLoadProgress() {
        const currentUser = this.db.getCurrentUser();
        if (!currentUser) {
            alert('请先登录账号');
            return;
        }
        
        const button = document.getElementById('load-progress');
        button.disabled = true;
        button.textContent = '加载中...';
        
        try {
            const result = await this.db.loadProgress();
            
            if (result.success) {
                if (result.progress) {
                    await this.applyLoadedProgress(result.progress);
                    alert('游戏进度已加载！');
                } else {
                    alert('没有找到保存的游戏进度');
                }
            } else {
                alert('加载失败：' + result.message);
            }
        } finally {
            button.disabled = false;
            button.textContent = '加载进度';
        }
    }
    
    async loadUserProgress() {
        try {
            const result = await this.db.loadProgress();
            
            if (result.success && result.progress) {
                await this.applyLoadedProgress(result.progress);
                console.log('用户进度已自动加载');
            }
        } catch (error) {
            console.warn('自动加载进度失败:', error);
        }
    }
    
    async applyLoadedProgress(progress) {
        // 应用加载的进度
        this.currentLevel = progress.current_level || 1;
        this.moveCount = progress.move_count || 0;
        this.completedLevels = new Set(progress.completed_levels || []);
        
        // 重新加载当前关卡
        this.loadLevel(this.currentLevel);
        
        console.log('已加载进度:', {
            level: this.currentLevel,
            moves: this.moveCount,
            completed: Array.from(this.completedLevels)
        });
    }
    
    updateUserDisplay(user) {
        const userElement = document.getElementById('current-user');
        if (user) {
            userElement.textContent = user.username;
            userElement.style.color = '#28a745';
        } else {
            userElement.textContent = '游客';
            userElement.style.color = '#6c757d';
        }
    }
    
    // === 胜利时保存进度 ===
    async onLevelComplete(level) {
        this.completedLevels.add(level);
        
        // 如果用户已登录，询问是否保存进度
        const currentUser = this.db.getCurrentUser();
        if (currentUser) {
            if (confirm('恭喜过关！是否保存当前游戏进度？')) {
                await this.handleSaveProgress();
            }
        }
    }
