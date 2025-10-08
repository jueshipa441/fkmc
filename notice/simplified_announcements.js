// 简化版公告管理系统
// 核心功能：从redact.js加载数据并渲染公告

/**
 * 获取URL参数
 * @param {string} name - 参数名
 * @returns {string|null} 参数值
 */
function getUrlParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

/**
 * 初始化管理员功能
 * 检查URL参数，显示管理表单
 */
function initAdminFeatures() {
    // 通过URL参数 ?admin=1 来控制是否显示管理表单
    if (getUrlParam('admin') === '1') {
        const adminPanel = document.getElementById('announcement-admin');
        if (adminPanel) {
            adminPanel.style.display = 'block';
        }
        
        // 设置日期输入框的默认值为今天
        const dateInput = document.getElementById('announcement-date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
        }
    }
}

/**
 * 页面加载完成后执行初始化
 */
function initAnnouncementSystem() {
    console.log('开始初始化公告系统...');
    
    // 检查数据是否已加载
    if (window.announcementsData) {
        console.log(`找到${window.announcementsData.length}条公告数据`);
        renderAnnouncements(window.announcementsData);
    } else {
        console.error('未找到公告数据，请检查redact.js文件');
        // 显示错误消息
        const container = document.querySelector('.announcements');
        if (container) {
            container.innerHTML = '<div class="error-message">公告数据加载失败，请刷新页面重试。</div>';
        }
    }
    
    // 初始化管理员功能
    initAdminFeatures();
}

/**
 * 按日期排序公告
 * @param {Array} announcements - 公告数组
 * @returns {Array} 排序后的公告数组
 */
function sortAnnouncements(announcements) {
    return announcements.sort((a, b) => {
        // 先按置顶状态排序（数字类型，1=置顶, 0=不置顶）
        if (a.pinned > b.pinned) return -1;
        if (a.pinned < b.pinned) return 1;
        // 再按日期倒序排序
        return new Date(b.date) - new Date(a.date);
    });
}

/**
 * 渲染公告到页面
 * @param {Array} announcements - 公告数组
 */
function renderAnnouncements(announcements) {
    // 获取公告容器元素
    const container = document.querySelector('.announcements');
    if (!container) {
        console.error('未找到公告容器元素');
        return;
    }
    
    // 清空容器
    container.innerHTML = '';
    
    // 排序公告
    const sorted = sortAnnouncements([...announcements]);
    
    // 渲染每个公告
    sorted.forEach(announcement => {
        const card = document.createElement('div');
        card.className = `announcement-card ${announcement.pinned > 0 ? 'pinned' : ''}`;
        
        // 清理内容中的多余空白
        const cleanedContent = announcement.content
            .replace(/\s+/g, ' ')
            .replace(/\<p>\s+/g, '<p>')
            .replace(/\s+<\/p>/g, '</p>');
        
        // 创建公告HTML内容
        card.innerHTML = `
            <div class="announcement-header">
                <h2>${announcement.title}</h2>
                <span class="announcement-date">${announcement.date}</span>
            </div>
            <div class="announcement-content">
                ${cleanedContent}
            </div>
        `;
        
        container.appendChild(card);
    });
    
    console.log(`成功渲染了${sorted.length}条公告`);
}

// 页面加载完成后初始化公告系统
window.addEventListener('DOMContentLoaded', initAnnouncementSystem);

// 暴露一些方法给全局，方便调试
window.announcementSystem = {
    init: initAnnouncementSystem,
    render: renderAnnouncements,
    sort: sortAnnouncements
};