/**
 * 文件查看器JavaScript
 * 功能：展示doc_list目录下的文件并提供下载功能
 */

/**
 * 页面加载完成后执行
 */
window.addEventListener('DOMContentLoaded', function() {
    loadFilesList();
    
    document.getElementById('sort-by-name').addEventListener('click', function() {
            // 如果已经是激活状态，则切换排序方向
            if (this.classList.contains('active')) {
                toggleSortDirection('name');
            } else {
                this.classList.add('active');
                document.getElementById('sort-by-time').classList.remove('active');
            }
            sortFiles('name');
        });
        
        document.getElementById('sort-by-time').addEventListener('click', function() {
            // 如果已经是激活状态，则切换排序方向
            if (this.classList.contains('active')) {
                toggleSortDirection('time');
            } else {
                this.classList.add('active');
                document.getElementById('sort-by-name').classList.remove('active');
            }
            sortFiles('time');
        });
});

// 存储原始文件数据和排序状态
let originalFiles = [];
let sortDirections = {
    name: 'asc', // 'asc' 升序, 'desc' 降序
    time: 'asc'
};

/**
 * 加载文件列表并显示在页面上
 */
function loadFilesList() {
    const fileListContainer = document.getElementById('file-list');
    
    // 从配置文件获取文件列表
    fetch('files_config.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('配置文件加载失败');
            }
            return response.json();
        })
        .then(data => {
            // 存储原始文件数据
            originalFiles = data.files || [];
            
            // 确保每个文件都有pinned属性，默认为0
            originalFiles = originalFiles.map(file => ({
                ...file,
                pinned: file.pinned || 0
            }));
            
            // 初始按文件名排序
            sortFiles('name');
        })
        .catch(error => {
            console.error('加载文件列表失败:', error);
            fileListContainer.innerHTML = `
                <div class="no-files">
                    文件列表加载失败，请稍后再试
                </div>
            `;
        });
}

/**
 * 切换文件排序方向
 * @param {string} sortBy - 排序方式：'name'或'time'
 */
function toggleSortDirection(sortBy) {
    sortDirections[sortBy] = sortDirections[sortBy] === 'asc' ? 'desc' : 'asc';
    
    // 更新排序方向指示器
    const directionElement = document.getElementById(`sort-direction-${sortBy}`);
    if (directionElement) {
        directionElement.textContent = sortDirections[sortBy] === 'asc' ? '↑' : '↓';
    }
}

/**
 * 对文件进行排序
 * @param {string} sortBy - 排序方式：'name'或'time'
 */
function sortFiles(sortBy) {
    const fileListContainer = document.getElementById('file-list');
    
    if (originalFiles.length === 0) {
        fileListContainer.innerHTML = `
            <div class="no-files">
                当前没有可查看的文件
            </div>
        `;
        return;
    }
    
    // 复制文件列表，避免修改原始数据
    let sortedFiles = [...originalFiles];
    
    // 按排序方式对文件进行排序
    if (sortBy === 'name') {
        sortedFiles.sort((a, b) => {
            const comparison = a.name.localeCompare(b.name);
            return sortDirections.name === 'asc' ? comparison : -comparison;
        });
    } else if (sortBy === 'time') {
        sortedFiles.sort((a, b) => {
            const comparison = new Date(a.time) - new Date(b.time);
            return sortDirections.time === 'asc' ? comparison : -comparison;
        });
    }
    
    // 分离置顶文件和普通文件（只根据配置文件中的pinned属性）
    const pinned = [];
    const unpinned = [];
    
    sortedFiles.forEach(file => {
        if (file.pinned === 1) {
            pinned.push(file);
        } else {
            unpinned.push(file);
        }
    });
    
    // 合并置顶文件和普通文件（置顶文件在前）
    const finalFiles = [...pinned, ...unpinned];
    
    // 清空容器
    fileListContainer.innerHTML = '';
    
    // 添加文件项到列表
    finalFiles.forEach(file => {
        const fileItem = createFileItem(file);
        fileListContainer.appendChild(fileItem);
    });
}

/**
 * 创建文件列表项元素
 * @param {Object} file 文件信息对象
 * @returns {HTMLElement} 文件列表项元素
 */
function createFileItem(file) {
    const item = document.createElement('div');
    item.className = 'file-item';
    
    // 检查文件是否已置顶（根据配置文件中的pinned属性）
    const isPinned = file.pinned === 1;
    if (isPinned) {
        item.classList.add('pinned');
    }
    
    // 获取文件类型图标
    const icon = getFileIcon(file.name);
    
    item.innerHTML = `
        <div class="file-info">
            <div class="file-icon">${icon}</div>
            <div class="file-details">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${file.size}</div>
                <div class="file-time">上传时间：${file.time || '未知'}</div>
            </div>
        </div>
        <div style="display: flex; align-items: center;">
            ${isPinned ? '<span class="pinned-indicator">📌 已置顶</span>' : ''}
            <a href="${file.path}" class="download-btn" download>下载</a>
        </div>
    `;
    
    return item;
}

/**
 * 根据文件扩展名返回对应的图标
 * @param {string} fileName 文件名
 * @returns {string} 图标HTML
 */
function getFileIcon(fileName) {
    // 获取文件扩展名
    const extension = fileName.split('.').pop().toLowerCase();
    
    // 根据扩展名返回不同的图标
    switch (extension) {
        case 'docx':
        case 'doc':
            return '📝'; // Word文档图标
        case 'pdf':
            return '📄'; // PDF文档图标
        case 'xlsx':
        case 'xls':
            return '📊'; // Excel表格图标
        case 'pptx':
        case 'ppt':
            return '📑'; // PowerPoint演示文稿图标
        default:
            return '📎'; // 通用文件图标
    }
}

/**
 * 初始化页面样式
 */
function initPage() {
    // 可以在这里添加页面初始化的代码
    console.log('文件查看器已初始化');
}

// 初始化页面
initPage();