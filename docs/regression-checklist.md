# 回归检查清单

每次大改动或提交前，按此清单过一遍。勾选确认无误后再提交。

## 前台（未登录状态）

- [ ] 首页加载正常：Hero、Stats、产品分类、Featured Products、Why Choose Us、Client Logos、CTA
- [ ] Products 列表页 → 分类筛选 → 座位筛选 → 产品详情页
- [ ] 产品详情页：图片画廊切换、规格显示、配置信息、Send Inquiry 按钮
- [ ] Solutions 页面：卡片显示正常
- [ ] OEM/ODM 页面内容完整
- [ ] Blog 列表 → 文章详情 → Markdown 内容渲染
- [ ] FAQ 页面：手风琴展开/收起
- [ ] Contact 表单：填写 → 提交 → 成功提示
- [ ] Dealer 表单：填写 → 提交 → 成功提示
- [ ] About 页面：统计数据、时间线、认证信息
- [ ] WhatsApp 浮动按钮可点击
- [ ] Footer 链接、社交图标正常

## 移动端（宽度 < 768px）

- [ ] Header 汉堡菜单 → 展开/关闭 → 遮罩点击关闭
- [ ] 产品下拉菜单无间隙问题
- [ ] 表单可正常填写和提交
- [ ] 图片自适应，无溢出

## 后台管理（登录后）

- [ ] `/admin/login` 登录 → 进入 Dashboard
- [ ] Dashboard 统计数据、最近询盘显示
- [ ] Products：列表 → 新建 → 编辑 → 删除 → 图片上传
- [ ] Blog：列表 → 新建 → 编辑 → 删除 → 封面图上传
- [ ] FAQ：添加 → 编辑 → 删除
- [ ] Inquiries：列表 → 标记已读 → 删除 → CSV 导出
- [ ] Dealers：列表 → 标记已读 → 删除
- [ ] Users：列表 → 新建 → 编辑角色 → 删除（需 super_admin）
- [ ] Roles：列表查看（需 super_admin）
- [ ] Settings：公司信息编辑 → 保存

## API 端点

- [ ] `GET /api/inquiries` 未登录 → 401
- [ ] `GET /api/dealers` 未登录 → 401
- [ ] `POST /api/contact` 速率限制生效（第 11 次 → 429）
- [ ] `POST /api/auth/login` 密码错误 5 次 → 429
- [ ] 安全头存在：`curl -I http://localhost:3020/` 检查

## SEO（首次部署或大改动后）

- [ ] 首页 `<head>` 有 `og:`, `twitter:` 标签
- [ ] 产品页有 `application/ld+json`（Product schema）
- [ ] 博客页有 `application/ld+json`（Article schema）
- [ ] `canonical` 链接存在
- [ ] `favicon.svg` 正常加载
- [ ] `sitemap.xml` 可访问
- [ ] `robots.txt` 正确屏蔽 `/api/` 和 `/admin/`

## 构建

- [ ] `npm run build` 无错误
- [ ] `npm run dev` 启动正常
