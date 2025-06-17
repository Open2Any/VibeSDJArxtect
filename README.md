# 混合云基础设施架构可视化平台

一个基于React和ReactFlow构建的现代化混合云基础设施架构可视化平台，展示私有云与阿里云的无缝集成。

## ✨ 特性

### 🏗️ 完整的混合云架构
- **私有云基础设施**：Proxmox虚拟化、PowerDNS、OpenVPN、MySQL、Flink CDC
- **阿里云服务集成**：VPC网络、RDS数据库、OSS对象存储
- **智能化平台**：Dify AI平台、n8n自动化工具、GitLab CI/CD

### 🎯 功能层级组织
- **自动化与智能化层**：AI服务、工作流自动化、持续集成部署
- **网络基础设施层**：DNS服务、VPN隧道、混合云网络互通
- **数据存储层**：关系数据库、对象存储、实时数据同步
- **微服务计算层**：容器化服务集群、业务逻辑处理

### 🔗 可视化连接展示
- **动画连接线**：实时展示私有云与阿里云之间的数据流
- **连接类型标识**：
  - 🌐 虚拟组网（PowerDNS ↔ 阿里云VPC）
  - 🔐 混合架构（OpenVPN ↔ 阿里云VPC）
  - ⚡ 准实时同步（MySQL ↔ 阿里云RDS）
  - 📦 对象存储同步（OSS ↔ 阿里云OSS）
  - 🔄 CDC实时同步（Flink CDC ↔ 阿里云RDS）

### 📊 实时监控面板
- **14个服务状态监控**：运行时间、资源使用率、连接状态
- **混合云连接状态指示器**：网络层互通、数据库同步、存储同步、AI集成
- **动态时间显示**：实时更新的系统时间

### 💡 业务价值展示
- **非技术人员友好**：使用生活化比喻解释技术概念
- **业务价值说明**：每个服务的商业价值和技术特性
- **实用示例**：n8n自动化的5个实际应用场景
- **CI/CD流程**：GitLab的3个典型部署示例

## 🚀 快速开始

### 环境要求
- Node.js 16+
- npm 或 yarn

### 安装与运行
```bash
# 克隆项目
git clone git@github.com:Open2Any/VibeSDJArxtect.git
cd VibeSDJArxtect

# 安装依赖
npm install

# 启动开发服务器
npm start
```

访问 `http://localhost:3000` 查看应用。

## 🛠️ 技术栈

- **前端框架**：React 18
- **可视化库**：ReactFlow (XYFlow)
- **构建工具**：Webpack 5
- **样式**：CSS-in-JS
- **开发服务器**：Webpack Dev Server

## 📁 项目结构

```
VibeSDJArxtect/
├── src/
│   ├── App.jsx          # 主应用组件
│   └── index.jsx        # 应用入口
├── public/
│   └── index.html       # HTML模板
├── package.json         # 项目配置
├── webpack.config.js    # Webpack配置
└── README.md           # 项目文档
```

## 🎨 界面特性

### 现代化UI设计
- **渐变背景**：优雅的紫蓝色渐变
- **毛玻璃效果**：现代化的半透明面板
- **响应式布局**：适配不同屏幕尺寸
- **动画效果**：平滑的交互动画

### 交互功能
- **节点点击**：查看详细服务信息
- **连接动画**：动态展示数据流向
- **状态监控**：实时服务状态更新
- **缩放控制**：支持图表缩放和平移

## 🔧 自定义配置

### 添加新服务
1. 在`nodeData`中定义服务信息
2. 在`nodes`数组中添加节点配置
3. 在`serviceStatus`中添加状态数据
4. 根据需要在`edges`中添加连接关系

### 修改样式
- 节点样式：修改`getNodeStyle`函数
- 连接样式：更新`edges`数组中的`style`属性
- 整体布局：调整节点的`position`属性

## 📈 业务场景

### 适用行业
- **金融科技**：数据安全与合规要求
- **电商平台**：高并发与弹性扩展
- **制造业**：工业4.0数字化转型
- **教育机构**：混合云教学平台

### 解决方案
- **成本优化**：私有云+公有云混合部署
- **数据安全**：敏感数据本地化存储
- **弹性扩展**：按需使用云端资源
- **业务连续性**：多云备份与容灾

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进项目！

### 开发流程
1. Fork本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

## 📄 许可证

本项目采用MIT许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [ReactFlow](https://reactflow.dev/) - 强大的流程图可视化库
- [React](https://reactjs.org/) - 现代化前端框架
- [Webpack](https://webpack.js.org/) - 模块打包工具

---

**注意**：这是一个演示项目，用于展示混合云架构设计理念。实际部署时请根据具体需求调整配置。 