// 公告数据文件
// 用于存储公告内容，方便非技术人员编辑

/**
 * 公告数据数组
 * 每个公告对象包含：标题、内容、日期、是否置顶(0=不置顶, 1=置顶)
 */

/*
公告示例讲解
    {
        title: "在此处填写标题",
        content: `
        <p>亲爱的玩家们：</p>
        <p>正文文本（可以包含HTML标签）</p>
        <p>正文文本</p>
        <p>正文文本</p>
        `,
        date: "2025-09-01（日期示例，符合YYYY-MM-DD格式）",
        pinned: 0（是否置顶，0=不置顶, 1=置顶）
    }
 */
/*
复制粘贴使用
    ,{
        title: "标题",
        content: `
        <p>亲爱的玩家们：</p>
        <p>文本</p>
        <p>文本</p>
        <p>文本</p>
        `,
        date: "2025-09-01",
        pinned: 0
    }
 */
const announcements = [
    {
        title: "FK服务器网站试运行开始",
        content: `
        <p>亲爱的玩家们：</p>
        <p>FK服务器网站试运行开始，欢迎大家访问</p>
        <p>网站还在建设中，如果有什么建议可以联系我</p>
        <p>联系QQ：2292480165</p>
        `,
        date: "2025-10-01",
        pinned: 1
    }
];

// 将公告数据暴露给其他文件
if (typeof module !== 'undefined' && module.exports) {
    // Node.js 环境
    module.exports = announcements;
} else {
    // 浏览器环境
    window.announcementsData = announcements;
}