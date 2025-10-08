/**
 * 主页活动海报展示功能
 * 从activities.json加载数据，筛选出标记为在主页显示的活动，并在主页展示其海报
 */

// 从JSON文件加载活动数据
async function loadActivities() {
    /**
     * 从JSON文件加载活动数据
     * @returns {Promise<Array>} 活动数据数组
     */
    try {
        const response = await fetch('act/activities.json');
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

// 筛选出需要在主页显示的活动
function filterHomepageActivities(activities) {
    /**
     * 筛选出需要在主页显示的活动
     * @param {Array} activities 活动数据数组
     * @returns {Array} 需要在主页显示的活动数据数组
     */
    return activities.filter(activity => activity.showOnHomepage === 1);
}

// 渲染主页活动海报
async function renderHomepagePosters() {
    /**
     * 渲染主页活动海报到页面
     */
    const postersContainer = document.querySelector('.homepage-posters');
    if (!postersContainer) return;
    
    try {
        const activities = await loadActivities();
        const homepageActivities = filterHomepageActivities(activities);
        
        if (homepageActivities.length === 0) {
            postersContainer.innerHTML = '';
            return;
        }
        
        // 创建海报HTML
        let html = '';
        for (const activity of homepageActivities) {
            html += `
                <a href="act/activity_detail.html?id=${activity.id}" class="homepage-poster-link">
                    <div class="homepage-poster">
                        <img src="${activity.poster}" alt="${activity.title}">
                        <div class="homepage-poster-overlay">
                            <h3>${activity.title}</h3>
                            <p>${activity.description}</p>
                        </div>
                    </div>
                </a>
            `;
        }
        
        postersContainer.innerHTML = html;
    } catch (error) {
        postersContainer.innerHTML = '<div class="posters-error">加载海报失败</div>';
        console.error('渲染主页海报失败:', error);
    }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    /**
     * 页面加载完成后执行的初始化函数
     */
    renderHomepagePosters();
});