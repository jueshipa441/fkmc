/**
 * 活动页面的JavaScript功能实现
 * 包括数据加载、排序、卡片渲染等功能
 */

// 从JSON文件加载活动数据
async function loadActivities() {
    /**
     * 从JSON文件加载活动数据
     * @returns {Promise<Array>} 活动数据数组
     */
    try {
        const response = await fetch('activities.json');
        if (!response.ok) {
            throw new Error('网络响应错误');
        }
        const activities = await response.json();
        return activities;
    } catch (error) {
        console.error('加载活动数据失败:', error);
        return [];
    }
}

// 对活动进行排序
function sortActivities(activities) {
    /**
     * 对活动进行排序
     * 排序规则：置顶活动优先，然后是正在进行的活动（橙色卡片），最后按开始时间排序
     * @param {Array} activities 活动数据数组
     * @returns {Array} 排序后的活动数据数组
     */
    const now = new Date();
    
    return activities.sort((a, b) => {
        // 置顶活动优先
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        
        // 检查是否正在进行
        const aStartDate = new Date(a.startTime);
        const aEndDate = new Date(a.endTime);
        const bStartDate = new Date(b.startTime);
        const bEndDate = new Date(b.endTime);
        
        const aIsActive = now >= aStartDate && now <= aEndDate;
        const bIsActive = now >= bStartDate && now <= bEndDate;
        
        // 正在进行的活动优先
        if (aIsActive && !bIsActive) return -1;
        if (!aIsActive && bIsActive) return 1;
        
        // 按开始时间排序
        return bStartDate - aStartDate;
    });
}

// 创建活动卡片HTML
function createActivityCard(activity) {
    /**
     * 创建活动卡片的HTML结构
     * @param {Object} activity 单个活动数据
     * @returns {string} 活动卡片的HTML字符串
     */
    const now = new Date();
    const startDate = new Date(activity.startTime);
    const endDate = new Date(activity.endTime);
    const isActive = now >= startDate && now <= endDate;
    
    // 格式化日期显示
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}年${month}月${day}日`;
    };
    
    // 确定卡片样式类
    let cardClass = 'activity-card';
    if (activity.isPinned) {
        cardClass += ' pinned';
    } else if (isActive) {
        cardClass += ' ongoing';
    }
    
    return `
        <div class="${cardClass}">
            <div class="activity-poster">
                <img src="${activity.poster}" alt="${activity.title}">
            </div>
            <div class="activity-info">
                ${activity.isPinned ? '<span class="pinned-badge">置顶</span>' : ''}
                <h3>${activity.title}</h3>
                <p class="activity-description">${activity.description}</p>
            </div>
            <div class="activity-footer">
                <div class="activity-time">
                    ${formatDate(activity.startTime)} - ${formatDate(activity.endTime)}
                    ${activity.specificTime ? '<span class="activity-specific-time"> (' + activity.specificTime + ')</span>' : ''}
                </div>
                <div class="activity-location" style="margin-left: 20px;">
                    ${activity.location}
                </div>
                <a href="activity_detail.html?id=${activity.id}" class="activity-detail-btn">详情</a>
            </div>
        </div>
    `;
}

// 渲染活动列表
async function renderActivityList() {
    /**
     * 渲染活动列表到页面
     */
    const activitiesContainer = document.querySelector('.activities-container');
    if (!activitiesContainer) return;
    
    // 显示加载状态
    activitiesContainer.innerHTML = '<div class="loading">加载中...</div>';
    
    try {
        const activities = await loadActivities();
        const sortedActivities = sortActivities(activities);
        
        if (sortedActivities.length === 0) {
            activitiesContainer.innerHTML = '<div class="no-activities">暂无活动</div>';
            return;
        }
        
        // 创建并添加活动卡片
        let html = '';
        for (const activity of sortedActivities) {
            html += createActivityCard(activity);
        }
        
        activitiesContainer.innerHTML = html;
    } catch (error) {
        activitiesContainer.innerHTML = '<div class="error">加载活动失败</div>';
        console.error('渲染活动列表失败:', error);
    }
}

// 加载活动详情
async function loadActivityDetail(id) {
    /**
     * 加载并显示活动详情
     * @param {string} id 活动ID
     */
    try {
        const activities = await loadActivities();
        const activity = activities.find(a => a.id === id);
        
        if (!activity) {
            document.querySelector('.activity-detail').innerHTML = '<div class="error">活动不存在</div>';
            return;
        }
        
        // 格式化日期
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${year}年${month}月${day}日`;
        };
        
        // 渲染活动详情
        const detailContainer = document.querySelector('.activity-detail');
        if (detailContainer) {
            let imagesHtml = '';
            if (activity.images && activity.images.length > 0) {
                imagesHtml = '<div class="activity-gallery">';
                for (const image of activity.images) {
                    imagesHtml += `<img src="${image}" alt="活动图片">`;
                }
                imagesHtml += '</div>';
            }
            
            detailContainer.innerHTML = `
                <div class="activity-header">
                    ${activity.isPinned ? '<span class="pinned-badge">置顶</span>' : ''}
                    <h1>${activity.title}</h1>
                </div>
                
                <div class="activity-poster-container">
                    <div class="activity-poster-large">
                        <img src="${activity.poster}" alt="${activity.title}">
                    </div>
                </div>
                
                <div class="activity-content">
                    <div class="activity-meta">
                        <div>
                            <h3>开始时间</h3>
                            <p>${formatDate(activity.startTime)}</p>
                        </div>
                        <div>
                            <h3>结束时间</h3>
                            <p>${formatDate(activity.endTime)}</p>
                        </div>
                        <div>
                            <h3>活动地点</h3>
                            <p>${activity.location}</p>
                        </div>
                    </div>

                    <div class="activity-description">
                        <h3>活动简介</h3>
                        <p>${activity.description}</p>
                    </div>

                    <div class="activity-details">
                        <h3>活动详情</h3>
                        <p>${activity.details}</p>
                    </div>

                    ${imagesHtml}
                </div>
                <div class="activity-actions">
                    <a href="activities.html" class="btn">返回列表</a>
                </div>
            `;
        }
    } catch (error) {
        console.error('加载活动详情失败:', error);
        document.querySelector('.activity-detail').innerHTML = '<div class="error">加载活动详情失败</div>';
    }
}

// 从URL获取参数
function getUrlParams() {
    /**
     * 从URL获取查询参数
     * @returns {Object} 查询参数对象
     */
    const params = {};
    const queryString = window.location.search.substring(1);
    const pairs = queryString.split('&');
    
    for (const pair of pairs) {
        const [key, value] = pair.split('=');
        if (key) {
            params[decodeURIComponent(key)] = decodeURIComponent(value || '');
        }
    }
    
    return params;
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    /**
     * 页面加载完成后执行的初始化函数
     */
    // 检查是否是详情页
    const params = getUrlParams();
    if (params.id) {
        // 详情页
        loadActivityDetail(params.id);
    } else if (document.querySelector('.activities-container')) {
        // 列表页
        renderActivityList();
    }
    
    // 初始化图片放大功能
    initImageZoom();
});

// 初始化图片放大功能
function initImageZoom() {
    /**
     * 初始化图片点击放大功能
     * 创建模态框元素并添加事件监听器
     */
    // 创建模态框元素
    let modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <img src="" alt="放大图片">
        </div>
    `;
    document.body.appendChild(modal);
    
    // 获取模态框相关元素
    const modalImg = modal.querySelector('img');
    const closeBtn = modal.querySelector('.modal-close');
    
    // 关闭模态框的函数
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // 恢复页面滚动
    }
    
    // 添加关闭事件监听
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // 添加ESC键关闭模态框
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // 为活动详情页面中的图片添加点击事件监听
    function addImageClickHandlers() {
        // 为画廊图片添加点击事件
        const galleryImages = document.querySelectorAll('.activity-gallery img');
        galleryImages.forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', function() {
                modalImg.src = this.src;
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // 防止页面滚动
            });
        });
        
        // 为海报图片添加点击事件
        const posterImage = document.querySelector('.activity-poster-large img');
        if (posterImage) {
            posterImage.style.cursor = 'pointer';
            posterImage.addEventListener('click', function() {
                modalImg.src = this.src;
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // 防止页面滚动
            });
        }
    }
    
    // 定期检查并添加图片点击事件监听
    // 因为活动详情是异步加载的，需要等待内容渲染完成
    const checkInterval = setInterval(() => {
        const activityDetail = document.querySelector('.activity-detail');
        if (activityDetail && !activityDetail.querySelector('.loading')) {
            addImageClickHandlers();
            clearInterval(checkInterval);
        }
    }, 100);
}