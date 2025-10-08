// 简单的公告系统测试脚本
// 在浏览器控制台中运行此脚本可以检查公告数据是否正确加载

(function() {
    console.log('=== 公告系统测试 ===');
    
    // 检查redact.js是否正确加载
    console.log('1. redact.js数据检查:');
    if (window.announcementsData) {
        console.log(`   - 成功加载${window.announcementsData.length}条公告数据`);
        console.log(`   - 第一条公告: ${window.announcementsData[0].title}`);
        console.log(`   - pinned类型: ${typeof window.announcementsData[0].pinned}`);
    } else {
        console.error('   - 未找到announcementsData，请检查redact.js文件');
    }
    
    // 检查announcements.js功能
    console.log('\n2. announcements.js功能检查:');
    if (window.announcementManager) {
        const annData = window.announcementManager.getAnnouncements();
        console.log(`   - 当前公告数量: ${annData.length}`);
        console.log(`   - pinned值示例: ${annData[0].pinned}`);
        
        // 尝试排序并查看结果
        if (typeof window.announcementManager.sortAnnouncements === 'function') {
            const sorted = window.announcementManager.sortAnnouncements([...annData]);
            console.log(`   - 排序后第一条公告: ${sorted[0].title}`);
        }
    } else {
        console.error('   - 未找到announcementManager，请检查announcements.js文件');
    }
    
    // 检查DOM渲染情况
    console.log('\n3. DOM渲染检查:');
    const container = document.querySelector('.announcements');
    if (container) {
        const cards = container.querySelectorAll('.announcement-card');
        console.log(`   - 页面上渲染了${cards.length}条公告`);
        if (cards.length > 0) {
            console.log(`   - 第一条公告标题: ${cards[0].querySelector('h2')?.textContent}`);
        }
    } else {
        console.error('   - 未找到公告容器元素');
    }
    
    console.log('\n=== 测试完成 ===');
})();