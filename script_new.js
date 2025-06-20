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
        
        // 10个关卡配置，难度递增
        this.levels = {
            1: { // 简单 - 基础华容道
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
                ]
            },
            2: { // 进阶
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
                ]
            },
            3: { // 中等
                pieces: [
                    { id: 'caocao', type: 'caocao', name: '曹操', x: 1, y: 1, width: 2, height: 2 },
                    { id: 'guanyu', type: 'general', name: '关羽', x: 1, y: 0, width: 2, height: 1 },
                    { id: 'zhangfei', type: 'general', name: '张飞', x: 0, y: 0, width: 1, height: 2 },
                    { id: 'zhaoyun', type: 'general', name: '赵云', x: 3, y: 0, width: 1, height: 2 },
                    { id: 'machao', type: 'general', name: '马超', x: 0, y: 3, width: 1, height: 2 },
                    { id: 'huangzhong', type: 'general', name: '黄忠', x: 3, y: 3, width: 1, height: 2 },
                    { id: 'soldier1', type: 'soldier', name: '兵1', x: 1, y: 3, width: 1, height: 1 },
                    { id: 'soldier2', type: 'soldier', name: '兵2', x: 2, y: 3, width: 1, height: 1 },
                    { id: 'soldier3', type: 'soldier', name: '兵3', x: 0, y: 2, width: 1, height: 1 },
                    { id: 'soldier4', type: 'soldier', name: '兵4', x: 3, y: 2, width: 1, height: 1 }
                ]
            },
            4: { // 中高等
                pieces: [
                    { id: 'caocao', type: 'caocao', name: '曹操', x: 0, y: 1, width: 2, height: 2 },
                    { id: 'guanyu', type: 'general', name: '关羽', x: 2, y: 1, width: 2, height: 1 },
                    { id: 'zhangfei', type: 'general', name: '张飞', x: 0, y: 0, width: 1, height: 1 },
                    { id: 'zhaoyun', type: 'general', name: '赵云', x: 2, y: 0, width: 1, height: 1 },
                    { id: 'machao', type: 'general', name: '马超', x: 3, y: 0, width: 1, height: 1 },
                    { id: 'huangzhong', type: 'general', name: '黄忠', x: 2, y: 2, width: 1, height: 2 },
                    { id: 'weiyan', type: 'general', name: '魏延', x: 3, y: 2, width: 1, height: 2 },
                    { id: 'soldier1', type: 'soldier', name: '兵1', x: 0, y: 3, width: 1, height: 1 },
                    { id: 'soldier2', type: 'soldier', name: '兵2', x: 1, y: 3, width: 1, height: 1 },
                    { id: 'soldier3', type: 'soldier', name: '兵3', x: 1, y: 0, width: 1, height: 1 },
                    { id: 'soldier4', type: 'soldier', name: '兵4', x: 0, y: 4, width: 1, height: 1 }
                ]
            },
            5: { // 困难
                pieces: [
                    { id: 'caocao', type: 'caocao', name: '曹操', x: 2, y: 0, width: 2, height: 2 },
                    { id: 'guanyu', type: 'general', name: '关羽', x: 0, y: 0, width: 2, height: 1 },
                    { id: 'zhangfei', type: 'general', name: '张飞', x: 0, y: 1, width: 1, height: 2 },
                    { id: 'zhaoyun', type: 'general', name: '赵云', x: 1, y: 1, width: 1, height: 2 },
                    { id: 'machao', type: 'general', name: '马超', x: 0, y: 3, width: 1, height: 2 },
                    { id: 'huangzhong', type: 'general', name: '黄忠', x: 3, y: 3, width: 1, height: 2 },
                    { id: 'soldier1', type: 'soldier', name: '兵1', x: 2, y: 2, width: 1, height: 1 },
                    { id: 'soldier2', type: 'soldier', name: '兵2', x: 3, y: 2, width: 1, height: 1 },
                    { id: 'soldier3', type: 'soldier', name: '兵3', x: 1, y: 3, width: 1, height: 1 },
                    { id: 'soldier4', type: 'soldier', name: '兵4', x: 2, y: 3, width: 1, height: 1 }
                ]
            },
            6: { // 很困难
                pieces: [
                    { id: 'caocao', type: 'caocao', name: '曹操', x: 1, y: 2, width: 2, height: 2 },
                    { id: 'guanyu', type: 'general', name: '关羽', x: 0, y: 0, width: 2, height: 1 },
                    { id: 'zhangfei', type: 'general', name: '张飞', x: 2, y: 0, width: 2, height: 1 },
                    { id: 'zhaoyun', type: 'general', name: '赵云', x: 0, y: 1, width: 1, height: 2 },
                    { id: 'machao', type: 'general', name: '马超', x: 3, y: 1, width: 1, height: 2 },
                    { id: 'huangzhong', type: 'general', name: '黄忠', x: 1, y: 1, width: 1, height: 1 },
                    { id: 'weiyan', type: 'general', name: '魏延', x: 2, y: 1, width: 1, height: 1 },
                    { id: 'soldier1', type: 'soldier', name: '兵1', x: 0, y: 3, width: 1, height: 1 },
                    { id: 'soldier2', type: 'soldier', name: '兵2', x: 3, y: 3, width: 1, height: 1 },
                    { id: 'soldier3', type: 'soldier', name: '兵3', x: 0, y: 4, width: 1, height: 1 },
                    { id: 'soldier4', type: 'soldier', name: '兵4', x: 3, y: 4, width: 1, height: 1 }
                ]
            },
            7: { // 专家级
                pieces: [
                    { id: 'caocao', type: 'caocao', name: '曹操', x: 0, y: 2, width: 2, height: 2 },
                    { id: 'guanyu', type: 'general', name: '关羽', x: 2, y: 2, width: 2, height: 1 },
                    { id: 'zhangfei', type: 'general', name: '张飞', x: 0, y: 0, width: 1, height: 2 },
                    { id: 'zhaoyun', type: 'general', name: '赵云', x: 1, y: 0, width: 1, height: 2 },
                    { id: 'machao', type: 'general', name: '马超', x: 2, y: 0, width: 1, height: 2 },
                    { id: 'huangzhong', type: 'general', name: '黄忠', x: 3, y: 0, width: 1, height: 2 },
                    { id: 'soldier1', type: 'soldier', name: '兵1', x: 2, y: 3, width: 1, height: 1 },
                    { id: 'soldier2', type: 'soldier', name: '兵2', x: 3, y: 3, width: 1, height: 1 },
                    { id: 'soldier3', type: 'soldier', name: '兵3', x: 0, y: 4, width: 1, height: 1 },
                    { id: 'soldier4', type: 'soldier', name: '兵4', x: 1, y: 4, width: 1, height: 1 }
                ]
            },
            8: { // 大师级
                pieces: [
                    { id: 'caocao', type: 'caocao', name: '曹操', x: 2, y: 1, width: 2, height: 2 },
                    { id: 'guanyu', type: 'general', name: '关羽', x: 0, y: 2, width: 2, height: 1 },
                    { id: 'zhangfei', type: 'general', name: '张飞', x: 0, y: 0, width: 1, height: 2 },
                    { id: 'zhaoyun', type: 'general', name: '赵云', x: 1, y: 0, width: 1, height: 1 },
                    { id: 'machao', type: 'general', name: '马超', x: 2, y: 0, width: 1, height: 1 },
                    { id: 'huangzhong', type: 'general', name: '黄忠', x: 3, y: 0, width: 1, height: 1 },
                    { id: 'weiyan', type: 'general', name: '魏延', x: 1, y: 1, width: 1, height: 1 },
                    { id: 'soldier1', type: 'soldier', name: '兵1', x: 0, y: 3, width: 1, height: 1 },
                    { id: 'soldier2', type: 'soldier', name: '兵2', x: 1, y: 3, width: 1, height: 1 },
                    { id: 'soldier3', type: 'soldier', name: '兵3', x: 0, y: 4, width: 1, height: 1 },
                    { id: 'soldier4', type: 'soldier', name: '兵4', x: 1, y: 4, width: 1, height: 1 }
                ]
            },
            9: { // 地狱级
                pieces: [
                    { id: 'caocao', type: 'caocao', name: '曹操', x: 0, y: 0, width: 2, height: 2 },
                    { id: 'guanyu', type: 'general', name: '关羽', x: 2, y: 2, width: 2, height: 1 },
                    { id: 'zhangfei', type: 'general', name: '张飞', x: 2, y: 0, width: 1, height: 2 },
                    { id: 'zhaoyun', type: 'general', name: '赵云', x: 3, y: 0, width: 1, height: 2 },
                    { id: 'machao', type: 'general', name: '马超', x: 0, y: 2, width: 1, height: 1 },
                    { id: 'huangzhong', type: 'general', name: '黄忠', x: 1, y: 2, width: 1, height: 1 },
                    { id: 'weiyan', type: 'general', name: '魏延', x: 0, y: 3, width: 1, height: 1 },
                    { id: 'jiangwei', type: 'general', name: '姜维', x: 1, y: 3, width: 1, height: 1 },
                    { id: 'soldier1', type: 'soldier', name: '兵1', x: 2, y: 3, width: 1, height: 1 },
                    { id: 'soldier2', type: 'soldier', name: '兵2', x: 3, y: 3, width: 1, height: 1 },
                    { id: 'soldier3', type: 'soldier', name: '兵3', x: 2, y: 4, width: 1, height: 1 },
                    { id: 'soldier4', type: 'soldier', name: '兵4', x: 3, y: 4, width: 1, height: 1 }
                ]
            },
            10: { // 终极挑战
                pieces: [
                    { id: 'caocao', type: 'caocao', name: '曹操', x: 1, y: 0, width: 2, height: 2 },
                    { id: 'guanyu', type: 'general', name: '关羽', x: 0, y: 2, width: 1, height: 2 },
                    { id: 'zhangfei', type: 'general', name: '张飞', x: 1, y: 2, width: 1, height: 2 },
                    { id: 'zhaoyun', type: 'general', name: '赵云', x: 2, y: 2, width: 1, height: 2 },
                    { id: 'machao', type: 'general', name: '马超', x: 3, y: 2, width: 1, height: 2 },
                    { id: 'huangzhong', type: 'general', name: '黄忠', x: 0, y: 0, width: 1, height: 1 },
                    { id: 'weiyan', type: 'general', name: '魏延', x: 3, y: 0, width: 1, height: 1 },
                    { id: 'jiangwei', type: 'general', name: '姜维', x: 0, y: 1, width: 1, height: 1 },
                    { id: 'soldier1', type: 'soldier', name: '兵1', x: 3, y: 1, width: 1, height: 1 },
                    { id: 'soldier2', type: 'soldier', name: '兵2', x: 0, y: 4, width: 1, height: 1 },
                    { id: 'soldier3', type: 'soldier', name: '兵3', x: 1, y: 4, width: 1, height: 1 },
                    { id: 'soldier4', type: 'soldier', name: '兵4', x: 2, y: 4, width: 1, height: 1 },
                    { id: 'soldier5', type: 'soldier', name: '兵5', x: 3, y: 4, width: 1, height: 1 }
                ]
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadLevel(this.currentLevel);
        this.updateDisplay();
    }
    
    setupEventListeners() {
        // 控制按钮
        document.getElementById('reset').addEventListener('click', () => this.resetLevel());
        document.getElementById('prev-level').addEventListener('click', () => this.changeLevel(-1));
        document.getElementById('next-level').addEventListener('click', () => this.changeLevel(1));
        document.getElementById('hint').addEventListener('click', () => this.showHint());
        
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
        
        this.currentLevel = level;
        this.moveCount = 0;
        this.pieces = JSON.parse(JSON.stringify(this.levels[level].pieces));
        this.resetTimer();
        this.createBoard();
        this.updateDisplay();
        this.updateLevelButtons();
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
}

// 游戏启动
document.addEventListener('DOMContentLoaded', () => {
    new HuaRongDao();
});
