// 公告管理系统
// 用于简化公告发布流程，支持置顶功能和按日期排序

// 从数据文件导入公告数据
let announcements = [];

/**
 * 初始化公告数据
 * 从外部文件加载数据
 */
function initAnnouncementsData() {
    // 在浏览器环境中，数据会通过window.announcementsData提供
    if (typeof window !== 'undefined' && window.announcementsData) {
        announcements = window.announcementsData;
    } else {
        // 备用数据，防止加载失败
        announcements = [
            {
                title: "数据加载失败",
                content: "<p>公告数据加载失败，请刷新页面重试。</p>",
                date: new Date().toISOString().split('T')[0],
                pinned: 0
            }
        ];
    }
}

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
        
        // 绑定表单提交事件
        const form = document.getElementById('announcement-form');
        if (form) {
            form.addEventListener('submit', handleFormSubmit);
        }
    }
}

/**
 * 处理表单提交事件
 * @param {Event} event - 表单提交事件
 */
function handleFormSubmit(event) {
    event.preventDefault();
    
    const title = document.getElementById('announcement-title').value.trim();
    const content = document.getElementById('announcement-content').value.trim();
    const date = document.getElementById('announcement-date').value;
    // 将布尔值转换为数字类型（1=置顶, 0=不置顶）
    const pinned = document.getElementById('announcement-pinned').checked ? 1 : 0;
    
    if (title && content && date) {
        // 添加新公告
        addAnnouncement(title, formatContentForDisplay(content), date, pinned);
        
        // 重置表单
        event.target.reset();
        
        // 重新设置日期为今天
        document.getElementById('announcement-date').value = new Date().toISOString().split('T')[0];
        
        // 显示成功提示
        alert('公告发布成功！');
    } else {
        alert('请填写所有必填字段！');
    }
}

/**
 * 格式化内容用于显示
 * @param {string} content - 原始内容
 * @returns {string} 格式化后的HTML内容
 */
function formatContentForDisplay(content) {
    // 将换行符转换为段落标签
    const paragraphs = content.split('\n')
        .map(para => para.trim())
        .filter(para => para.length > 0)
        .map(para => `<p>${para}</p>`);
    
    return paragraphs.join('\n        ');
}

/**
 * 格式化日期显示
 * @param {string} dateStr - 日期字符串，格式为YYYY-MM-DD
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(dateStr) {
    // 这里可以根据需要调整日期格式
    return dateStr;
}

/**
 * 按日期排序公告
 * @param {Array} announcements - 公告数组
 * @returns {Array} 排序后的公告数组
 */
function sortAnnouncements(announcements) {
    // 先按置顶状态排序（置顶的在前），再按日期倒序排序
    // 注意：pinned值是数字类型（0=不置顶, 1=置顶）
    return announcements.sort((a, b) => {
        if (a.pinned > b.pinned) return -1;
        if (a.pinned < b.pinned) return 1;
        return new Date(b.date) - new Date(a.date);
    });
}

/**
 * 渲染公告到页面
 */
function renderAnnouncements() {
    // 获取公告容器元素
    const announcementsContainer = document.querySelector('.announcements');
    if (!announcementsContainer) return;
    
    // 清空容器
    announcementsContainer.innerHTML = '';
    
    // 排序公告
    const sortedAnnouncements = sortAnnouncements(announcements);
    
    // 渲染每个公告
    sortedAnnouncements.forEach(announcement => {
        const announcementCard = document.createElement('div');
        announcementCard.className = `announcement-card ${announcement.pinned ? 'pinned' : ''}`;
        
        // 移除内容中的多余空白
        const cleanedContent = announcement.content.replace(/\s+/g, ' ').replace(/\<p>\s+/g, '<p>').replace(/\s+<\/p>/g, '</p>');
        
        // 创建公告HTML内容
        announcementCard.innerHTML = `
            <div class="announcement-header">
                <h2>${announcement.title}</h2>
                <span class="announcement-date">${formatDate(announcement.date)}</span>
            </div>
            <div class="announcement-content">
                ${cleanedContent}
            </div>
        `;
        
        announcementsContainer.appendChild(announcementCard);
    });
}

/**
 * 添加新公告
 * @param {string} title - 公告标题
 * @param {string} content - 公告内容
 * @param {string} date - 公告日期（格式：YYYY-MM-DD）
 * @param {number} pinned - 是否置顶（1=置顶, 0=不置顶）
 */
function addAnnouncement(title, content, date, pinned = 0) {
    announcements.push({
        title,
        content,
        date,
        pinned
    });
    renderAnnouncements();
}

/**
 * 当页面加载完成后执行初始化
 */
document.addEventListener('DOMContentLoaded', () => {
    // 初始化公告数据
    initAnnouncementsData();
    // 渲染公告列表
    renderAnnouncements();
    // 初始化管理功能
    initAdminFeatures();
});

// 暴露一些方法给全局，方便调试
window.announcementManager = {
    addAnnouncement,
    renderAnnouncements,
    getAnnouncements: () => [...announcements],
    sortAnnouncements
};