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
        
        // 检测是否是移动端访问
        this.isMobileVersion = this.detectMobileVersion();
        
        // 拖拽相关变量
        this.draggedPiece = null;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;
        
        // 用户管理和数据库
        this.db = new DatabaseAPI();
        this.completedLevels = new Set();
        
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
      detectMobileVersion() {
        // 检测是否是m.开头的域名访问
        const hostname = window.location.hostname;
        const isMobileDomain = hostname.startsWith('m.');
        
        // 检测是否是移动设备
        const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // 检测屏幕尺寸
        const isSmallScreen = window.innerWidth <= 768;
        
        // 更智能的移动端判断
        let isMobile = false;
        let mobileReason = '';
        
        if (isMobileDomain) {
            isMobile = true;
            mobileReason = 'm.域名访问';
        } else if (isMobileDevice) {
            isMobile = true;
            mobileReason = '移动设备UA';
        } else if (isSmallScreen) {
            isMobile = true;
            mobileReason = '小屏幕尺寸';
        }
        
        console.log(`移动端检测: 域名=${isMobileDomain}, 设备=${isMobileDevice}, 小屏=${isSmallScreen}, 结果=${isMobile} (${mobileReason})`);
        
        // 根据检测结果添加相应的类
        if (isMobile) {
            document.body.classList.add('mobile-detected');
            if (isMobileDomain) {
                document.body.classList.add('mobile-domain');
            }
            if (isMobileDevice) {
                document.body.classList.add('mobile-device');
            }
        } else {
            document.body.classList.add('desktop-detected');
        }
        
        return isMobile;
    }
    
    init() {
        this.setupEventListeners();
        // FIX: Defer initial board creation until after the first paint
        // to ensure the layout is stable and board dimensions are correct, preventing race conditions on load.
        requestAnimationFrame(() => {
            this.loadLevel(this.currentLevel);
        });
        this.updateDisplay();
        
        // 初始化数据库和用户状态
        this.initDatabase();
        
        // 显示当前访问URL
        this.updateCurrentURL();
    }
    
    async initDatabase() {
        try {
            await this.db.testConnection();
            console.log('数据库连接状态:', this.db.isConnected ? '已连接' : '离线模式');
            
            // 检查是否有已登录用户
            const currentUser = this.db.getCurrentUser();
            if (currentUser) {
                this.updateUserDisplay(currentUser);
            }
        } catch (error) {
            console.warn('数据库初始化失败:', error);
        }
    }      setupEventListeners() {
        // 控制按钮
        document.getElementById('reset').addEventListener('click', () => this.resetLevel());
        document.getElementById('prev-level').addEventListener('click', () => this.changeLevel(-1));
        document.getElementById('next-level').addEventListener('click', () => this.changeLevel(1));
        document.getElementById('hint').addEventListener('click', () => this.showHint());
        document.getElementById('toggle-zoom').addEventListener('click', () => this.toggleZoom());
        
        // 账号管理按钮
        document.getElementById('account-btn').addEventListener('click', () => this.showAccountModal());
        
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
          // 窗口大小变化监听（用于屏幕旋转等情况）
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                console.log('窗口大小变化，重新检测设备类型并创建游戏板');
                // 重新检测设备类型
                this.updateDeviceDetection();
                // 重新创建游戏板，确保交互正常
                this.createBoard();
                // 重新设置拖拽事件，确保在新的尺寸下正常工作
                this.setupAllDragEvents();
            }, 500); // 增加延迟时间，确保浏览器完成布局
        });
    }
    
    // 重新设置所有棋子的拖拽事件（窗口大小变化后调用）
    setupAllDragEvents() {
        this.pieces.forEach(piece => {
            if (piece.element) {
                // 移除旧的事件监听器
                const newElement = piece.element.cloneNode(true);
                piece.element.parentNode.replaceChild(newElement, piece.element);
                piece.element = newElement;
                
                // 重新设置拖拽
                this.setupDragAndDrop(piece, newElement);
            }
        });
        console.log('重新设置了所有棋子的拖拽事件');
    }

    // 切换缩放功能
    toggleZoom() {
        const wrapper = document.getElementById('game-board-wrapper');
        const button = document.getElementById('toggle-zoom');
        
        wrapper.classList.toggle('zoomed');
        
        if (wrapper.classList.contains('zoomed')) {
            button.textContent = '🔍 缩小';
            button.style.background = 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)';
        } else {
            button.textContent = '🔍 放大';
            button.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
        }
        
        // 延迟重新创建游戏板以确保CSS动画完成
        setTimeout(() => {
            this.createBoard();
            this.setupAllDragEvents(); // 确保拖拽事件正常
        }, 300);
    }

    // 更新设备检测（窗口大小变化时调用）
    updateDeviceDetection() {
        // 清除之前的检测类
        document.body.classList.remove('mobile-detected', 'mobile-domain', 'mobile-device', 'desktop-detected');
        
        // 重新检测
        const hostname = window.location.hostname;
        const isMobileDomain = hostname.startsWith('m.');
        const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isSmallScreen = window.innerWidth <= 768;
        
        let isMobile = false;
        let mobileReason = '';
        
        if (isMobileDomain) {
            isMobile = true;
            mobileReason = 'm.域名访问';
        } else if (isMobileDevice) {
            isMobile = true;
            mobileReason = '移动设备UA';
        } else if (isSmallScreen) {
            isMobile = true;
            mobileReason = '小屏幕尺寸';
        }
        
        console.log(`重新检测移动端: 域名=${isMobileDomain}, 设备=${isMobileDevice}, 小屏=${isSmallScreen}, 结果=${isMobile} (${mobileReason})`);
        
        // 添加相应的类
        if (isMobile) {
            document.body.classList.add('mobile-detected');
            if (isMobileDomain) {
                document.body.classList.add('mobile-domain');
            }
            if (isMobileDevice) {
                document.body.classList.add('mobile-device');
            }
        } else {
            document.body.classList.add('desktop-detected');
        }
        
        this.isMobileVersion = isMobile;
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
    }    createBoard() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = '';
        
        const boardRect = gameBoard.getBoundingClientRect();
        console.log(`Attempting to create board. Initial dimensions: ${boardRect.width}x${boardRect.height}`);

        // If board dimensions are not ready, abort and retry on the next animation frame.
        if (boardRect.width <= 0 || boardRect.height <= 0) {
            console.warn(`Board dimensions not ready yet. Retrying...`);
            requestAnimationFrame(() => this.createBoard());
            return;
        }

        // 获取实际的padding值
        const computedStyle = window.getComputedStyle(gameBoard);
        const paddingLeft = parseFloat(computedStyle.paddingLeft);
        const paddingTop = parseFloat(computedStyle.paddingTop);
        const paddingRight = parseFloat(computedStyle.paddingRight);
        const paddingBottom = parseFloat(computedStyle.paddingBottom);
        
        const availableWidth = boardRect.width - paddingLeft - paddingRight;
        
        // FIX: Calculate a single cell size based on width to ensure pieces are square and avoid dependency on initial board height.
        let cellSize = Math.floor(availableWidth / this.gridSize.width);
        
        // 根据不同情况设置最小cellSize
        let minCellSize = 60; // 默认移动端
        
        if (document.body.classList.contains('desktop-detected')) {
            minCellSize = 80; // 桌面端
        } else if (document.body.classList.contains('mobile-domain')) {
            minCellSize = 70; // m.域名访问
        } else if (document.body.classList.contains('mobile-device')) {
            minCellSize = 50; // 真实移动设备，更小的方块
        }
        
        console.log(`使用最小cellSize: ${minCellSize}px`);
        
        cellSize = Math.max(cellSize, minCellSize);
        
        // 为了确保所有方块宽度完全一致且为正方形，强制使用基于宽度的单一计算结果
        this.cellSize = {
            width: cellSize,
            height: cellSize
        };
        
        console.log(`Board dimensions: ${boardRect.width}x${boardRect.height}, Available: ${availableWidth}x${boardRect.height - paddingTop - paddingBottom}, CellSize: ${cellSize}x${cellSize}`);
        
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
        
        // 精确计算方块尺寸，考虑border-box模式
        // 由于使用了box-sizing: border-box，border会包含在总宽度内
        const pieceWidth = piece.width * this.cellSize.width;
        const pieceHeight = piece.height * this.cellSize.height;
        
        pieceElement.style.width = `${pieceWidth}px`;
        pieceElement.style.height = `${pieceHeight}px`;
        
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
        
        // 更新视觉位置 - 使用精确的定位，不添加额外偏移
        piece.element.style.left = `${piece.x * this.cellSize.width}px`;
        piece.element.style.top = `${piece.y * this.cellSize.height}px`;
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
    
    // 账号管理功能
    showAccountModal() {
        alert('账号管理功能开发中，目前支持本地游戏模式');
        // 这里可以显示账号管理弹窗
        console.log('账号管理功能已集成数据库API');
    }
    
    updateUserDisplay(user) {
        const userElement = document.getElementById('current-user');
        if (user) {
            userElement.textContent = user.username;
            userElement.style.color = '#28a745';
        } else {            userElement.textContent = '游客';
            userElement.style.color = '#6c757d';
        }
    }    // 更新当前访问URL显示
    updateCurrentURL() {
        const urlElement = document.getElementById('current-url');
        if (urlElement) {
            const currentURL = window.location.href;
            let versionInfo = '';
            
            if (document.body.classList.contains('mobile-domain')) {
                versionInfo = ' (m.域名移动版)';
            } else if (document.body.classList.contains('mobile-device')) {
                versionInfo = ' (移动设备检测)';
            } else if (document.body.classList.contains('mobile-detected')) {
                versionInfo = ' (移动端版本)';
            } else {
                versionInfo = ' (桌面版)';
            }
            
            urlElement.textContent = currentURL + versionInfo;
        }
    }
}

// 游戏启动
document.addEventListener('DOMContentLoaded', () => {
    new HuaRongDao();
});
