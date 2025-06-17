import React, { useCallback, useState, useEffect } from 'react';
import { ReactFlow, MiniMap, Controls, Background, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// 模拟服务状态数据
const serviceStatus = {
  proxmox: { status: 'running', uptime: '24天', cpu: '15%', memory: '45%', vms: 12 },
  powerdns: { status: 'running', uptime: '18天', queries: '1.2M/day', zones: 15 },
  openvpn: { status: 'running', uptime: '30天', connected: 8, throughput: '125Mbps' },
  mysql: { status: 'running', uptime: '22天', connections: 45, size: '2.3GB' },
  flink: { status: 'running', uptime: '5天', jobs: 3, records: '50K/day' },
  oss: { status: 'running', uptime: '15天', storage: '2.8TB', sync_jobs: 5, api_calls: '890K/day' },
  n8n: { status: 'running', uptime: '12天', workflows: 25, executions: '1.2K/day', success_rate: '98.5%' },
  gitlab: { status: 'running', uptime: '20天', pipelines: 156, deployments: '45/week', success_rate: '96.2%' },
  dify: { status: 'running', uptime: '8天', ai_apps: 12, queries: '2.5K/day', models: 5 },
  cluster: { status: 'running', uptime: '30天', services: 15, load_avg: '2.3', requests: '150K/day' },
  bi_service: { status: 'running', uptime: '15天', dashboards: 28, reports: '180/week', users: 45 },
  alicloud: { status: 'running', uptime: '365天', instances: 8, regions: 3, services: 25 },
  ali_rds: { status: 'running', uptime: '180天', connections: 120, size: '1.8TB', iops: '8000' },
  ali_oss: { status: 'running', uptime: '200天', storage: '15TB', requests: '2.5M/day', cdn: '99.9%' },
  ali_vpc: { status: 'running', uptime: '365天', subnets: 8, bandwidth: '1Gbps', connections: 5 }
};

// n8n自动化样例
const n8nExamples = [
  {
    title: "📧 邮件自动回复系统",
    description: "当收到客户邮件时，自动分类并发送确认回复",
    steps: ["监听邮箱", "识别邮件类型", "匹配回复模板", "发送自动回复", "记录到CRM系统"]
  },
  {
    title: "📊 销售数据自动报表",
    description: "每日自动收集销售数据并生成可视化报表",
    steps: ["连接数据库", "提取销售数据", "计算关键指标", "生成图表", "发送给管理层"]
  },
  {
    title: "🔔 库存预警系统",
    description: "监控库存水平，低于阈值时自动通知采购部门",
    steps: ["检查库存数据", "对比安全库存", "生成预警信息", "发送通知", "记录预警日志"]
  },

  {
    title: "📱 社交媒体内容发布",
    description: "定时自动发布营销内容到多个社交平台",
    steps: ["读取内容库", "选择发布时间", "适配不同平台", "自动发布", "监控互动数据"]
  },
  {
    title: "🎯 客户跟进自动化",
    description: "根据客户行为自动触发个性化跟进流程",
    steps: ["监控客户行为", "评估客户意向", "选择跟进策略", "发送个性化内容", "安排后续跟进"]
  }
];

// GitLab CI/CD样例
const gitlabExamples = [
  {
    title: "🚀 自动化部署流水线",
    description: "代码提交后自动测试、构建、部署到生产环境",
    steps: ["代码提交", "自动化测试", "构建镜像", "安全扫描", "自动部署"]
  },
  {
    title: "🔍 代码质量检测",
    description: "每次提交都进行代码质量分析和安全检查",
    steps: ["代码扫描", "质量分析", "安全检测", "生成报告", "通知开发者"]
  },
  {
    title: "📦 多环境管理",
    description: "自动管理开发、测试、预发布、生产多个环境",
    steps: ["环境检测", "版本管理", "配置部署", "健康检查", "回滚机制"]
  },

];

// 重点案例展示 - 独立显示的两个主要案例
const highlightedCases = [
  {
    id: "rds-sync",
    title: "🏪 阿里云RDS数据实时同步案例",
    subtitle: "商户业务数据智能化处理",
    description: "通过Flink CDC从阿里云RDS实时同步商品、商家、商家行为数据到私有云，为AI微服务和商品服务提供实时数据支撑",
    icon: "🔄",
    color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    keyFeatures: [
      "实时监听阿里云RDS数据变更",
      "自动同步商品、商家、行为数据",
      "为AI微服务提供实时数据源",
      "支持商户标签智能生成",
      "商品推荐算法数据基础"
    ],
    techStack: ["Flink CDC", "阿里云RDS", "MySQL", "AI微服务", "商户标签服务"],
    dataFlow: [
      { step: 1, name: "阿里云RDS", desc: "商户业务数据源" },
      { step: 2, name: "Flink CDC", desc: "实时数据同步" },
      { step: 3, name: "私有云MySQL", desc: "本地数据存储" },
      { step: 4, name: "AI微服务", desc: "智能分析处理" },
      { step: 5, name: "业务应用", desc: "标签生成&推荐" }
    ]
  },
  {
    id: "crawler-pipeline",
    title: "🕷️ 智能标品数据爬取与更新案例",
    subtitle: "CI/CD驱动的自动化数据处理",
    description: "通过CI/CD定时触发爬虫获取最新标品数据，经AI数据清理和质量检验后，自动更新标品服务并通知所有下游服务",
    icon: "🚀",
    color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    keyFeatures: [
      "CI/CD定时触发爬虫任务",
      "AI智能数据清理和标准化",
      "自动化质量检验和验证",
      "标品服务自动更新",
      "下游服务自动通知机制"
    ],
    techStack: ["GitLab CI/CD", "Python爬虫", "AI清理服务", "标品微服务", "n8n通知"],
    dataFlow: [
      { step: 1, name: "定时触发", desc: "CI/CD Pipeline启动" },
      { step: 2, name: "数据爬取", desc: "获取最新标品信息" },
      { step: 3, name: "AI清理", desc: "数据标准化处理" },
      { step: 4, name: "质量检验", desc: "数据完整性验证" },
      { step: 5, name: "服务更新", desc: "推送&通知下游" }
    ]
  }
];

// Flink CDC数据同步案例
const flinkCdcExamples = [
  {
    title: "🏪 商户数据实时同步",
    description: "从阿里云RDS实时同步商品、商家、商家行为数据到私有云，支持AI微服务分析",
    steps: ["监听RDS变更", "数据提取", "格式转换", "实时同步", "触发下游服务"]
  },
  {
    title: "🏷️ 商户标签智能分析",
    description: "基于同步的商户行为数据，通过AI微服务生成智能标签和画像",
    steps: ["行为数据收集", "AI特征提取", "标签生成", "画像构建", "实时更新"]
  },
  {
    title: "🛍️ 商品智能推荐",
    description: "利用同步的商品和用户数据，为商品微服务提供智能推荐能力",
    steps: ["数据预处理", "用户画像匹配", "商品特征分析", "推荐算法", "结果输出"]
  }
];

// 节点数据定义
const nodeData = {
  A: { 
    label: '物理服务器\n128核256线程\n512GB内存\n64TB HDD + 4TB SSD', 
    desc: '这是我们的核心硬件基础设施，就像一个超级强大的电脑主机。它有128个处理器核心（相当于128个大脑同时工作），512GB内存（临时存储空间），以及68TB的存储空间（用来永久保存数据）。这台服务器承载着我们所有的业务系统。',
    type: 'hardware',
    icon: '🖥️',
    businessValue: '为所有业务系统提供计算能力和存储空间，是整个IT基础设施的根基。'
  },
  B: { 
    label: 'Proxmox VE\n虚拟化平台', 
    desc: 'Proxmox就像一个"魔法师"，能把一台物理服务器变成多台虚拟服务器。这样我们就可以在同一台硬件上运行多个不同的系统，就像在一栋大楼里划分出多个独立的办公室，每个办公室都有自己的用途，但共享同一栋大楼的基础设施。',
    type: 'virtualization',
    icon: '☁️',
    status: serviceStatus.proxmox,
    businessValue: '提高硬件利用率，降低成本，同时提供系统隔离和安全性。一台服务器当多台用！',
    technicalDetails: '基于KVM和LXC技术，提供Web管理界面，支持热迁移、快照、备份等企业级功能。'
  },
  
  // 自动化和智能化层
  AI1: { 
    label: 'Dify AI平台', 
    desc: 'Dify是我们的"智能大脑中枢"，帮助构建各种AI应用来提升工作效率。比如智能客服机器人可以24小时回答客户问题，文档自动生成工具能快速产出标准化文档，数据分析助手能从海量数据中提取关键洞察。它让我们的工作更智能、更高效。',
    type: 'ai',
    icon: '🤖',
    status: serviceStatus.dify,
    businessValue: '通过AI技术提升工作效率，减少重复劳动，为客户提供7×24小时智能服务。',
    technicalDetails: '支持多种大语言模型，提供可视化AI应用构建器，支持API集成。'
  },
  AI2: {
    label: 'n8n\n自动化平台',
    desc: 'n8n是我们的"数字化流水线工程师"，专门负责自动化各种重复性工作任务。它能自动处理邮件回复、生成报表、监控库存、发布内容等工作，就像拥有一个永不疲倦的助手团队，让员工可以专注于更有创造性和战略性的工作。',
    type: 'automation',
    icon: '🔧',
    status: serviceStatus.n8n,
    businessValue: '自动化重复性工作，提高效率99%，减少人为错误，释放员工创造力。',
    technicalDetails: '可视化工作流编辑器，支持400+应用集成，提供代码和无代码开发模式。',
    examples: n8nExamples
  },
  AI3: {
    label: 'GitLab CI/CD\n持续集成部署',
    desc: 'GitLab CI/CD是我们的"软件生产流水线"，它能自动化整个软件开发和部署过程。当开发者提交代码后，系统会自动进行测试、构建、部署，大大提升开发效率和软件质量。就像工厂的自动化生产线，确保每个产品都符合质量标准。',
    type: 'cicd',
    icon: '🚀',
    status: serviceStatus.gitlab,
    businessValue: '加速软件交付，提升代码质量，减少部署风险，支持快速迭代。',
    technicalDetails: '集成代码管理、CI/CD流水线、容器镜像仓库，支持多环境自动化部署。',
    examples: gitlabExamples
  },

  // 网络层
  NET1: { 
    label: 'PowerDNS\nDNS服务器', 
    desc: 'PowerDNS是连接阿里云和私有云的"网络导航系统"。它不仅为用户提供域名解析服务，更重要的是为私有云和阿里云之间的服务发现和通信提供基础支撑，确保混合云环境下的网络互通。',
    type: 'network',
    icon: '🌐',
    status: serviceStatus.powerdns,
    businessValue: '实现混合云网络互通，支持服务发现，确保系统高可用性。',
    technicalDetails: '高性能权威DNS服务器，支持动态更新，具备负载均衡和故障切换能力。'
  },
  NET2: { 
    label: 'OpenVPN\n网络隧道', 
    desc: 'OpenVPN是私有云与阿里云之间的"安全高速通道"。它建立了一条加密的网络隧道，让私有云和阿里云的服务可以安全、稳定地相互访问和数据交换，同时也支持员工远程安全接入内网。',
    type: 'security',
    icon: '🔒',
    status: serviceStatus.openvpn,
    businessValue: '构建安全的混合云网络架构，支持云间数据同步和远程办公。',
    technicalDetails: '基于SSL/TLS的VPN隧道技术，支持点对点和站点间连接。'
  },

  // 存储层
  STORE1: { 
    label: 'MySQL\n关系数据库', 
    desc: 'MySQL是我们的"结构化数据管家"，专门负责存储和管理有明确关系的业务数据，如客户信息、订单记录、商品目录等。它与阿里云的数据库服务进行实时同步，确保关键业务数据的一致性和安全性。',
    type: 'database',
    icon: '🗄️',
    status: serviceStatus.mysql,
    businessValue: '确保业务数据安全和一致性，支持复杂查询分析，实现云端数据同步。',
    technicalDetails: '支持主从复制、读写分离，具备完整的备份恢复机制。'
  },
  STORE2: { 
    label: 'OSS对象存储\n阿里云兼容接口', 
    desc: 'OSS是我们的"多媒体数据仓库"，专门存储图片、视频、文档等非结构化数据。它完全兼容阿里云OSS接口，能无缝实现本地存储与云端存储的数据同步和备份，确保重要文件永不丢失。',
    type: 'storage',
    icon: '💾',
    status: serviceStatus.oss,
    businessValue: '提供海量存储空间，降低存储成本，实现云端数据持久化和灾备。',
    technicalDetails: '兼容S3/OSS API，支持数据生命周期管理、多副本存储、CDN加速。',
    syncFeatures: [
      '云端同步：与阿里云OSS实时数据同步',
      '智能备份：根据策略自动备份重要文件',
      '版本控制：保留文件历史版本，支持回滚',
      '访问控制：细粒度权限管理，保障数据安全',
      'CDN集成：全球加速访问，提升用户体验'
    ]
  },
  STORE3: { 
    label: 'Flink CDC\n数据同步服务', 
    desc: 'Flink CDC是私有云与阿里云之间的"数据同步专家"。它实时监控数据变化，确保私有云和阿里云的数据库保持同步。当任何一边的数据发生变更时，都会立即同步到另一边，保证数据的一致性和完整性。',
    type: 'data',
    icon: '🔄',
    status: serviceStatus.flink,
    businessValue: '实现云间数据实时同步，确保业务连续性，支持混合云数据一致性。',
    technicalDetails: '基于CDC技术的实时数据同步，支持多种数据源，具备断点续传能力。'
  },

  // 计算层
  COMPUTE1: { 
    label: '微服务集群\n(4核8G*5台)', 
    desc: '这是我们的"业务处理工厂"，专门运行各种内网微服务。包括商品服务（管理商品信息和库存）、标品服务（处理标准化产品数据）、AI服务（提供智能推荐和分析）等。它们协同工作，处理日常业务请求和各种临时工作流任务。',
    type: 'compute',
    icon: '⚡',
    status: serviceStatus.cluster,
    businessValue: '承载核心业务逻辑，支持业务快速扩展，提供高可用的微服务架构。',
    technicalDetails: '基于容器化部署，支持服务发现、负载均衡、自动扩缩容。',
    services: [
      '商品服务：商品信息管理，库存控制，价格策略',
      '标品服务：标准化产品数据处理和匹配',
      'AI服务：智能推荐，数据分析，预测算法',
      '订单服务：订单处理，支付集成，物流跟踪',
      '用户服务：用户认证，权限管理，个人中心'
    ]
  },
  
  // BI分析层
  BI1: {
    label: 'BI数据分析服务',
    desc: 'BI服务是我们的"数据洞察专家"，基于MySQL数据库中的业务数据，提供强大的商业智能分析能力。它能够从海量的业务数据中挖掘有价值的商业洞察，生成各种可视化报表和仪表板，帮助管理层做出数据驱动的决策。',
    type: 'analytics',
    icon: '📊',
    status: serviceStatus.bi_service,
    businessValue: '将原始数据转化为商业洞察，支持数据驱动决策，提升业务运营效率和竞争优势。',
    technicalDetails: '基于Apache Superset/Grafana，支持多数据源连接，提供实时仪表板和定时报表生成。',
    capabilities: [
      '销售分析：销售趋势、区域分布、产品表现分析',
      '用户画像：用户行为分析、留存率、转化率统计',
      '运营监控：业务指标监控、异常告警、性能分析',
      '财务报表：收入分析、成本控制、利润率统计',
      '市场洞察：市场趋势、竞品分析、机会识别'
    ]
  },

  // 阿里云服务
  ALI_CLOUD: {
    label: '阿里云\n云计算平台',
    desc: '阿里云是我们的"云端合作伙伴"，提供弹性可扩展的云计算服务。通过混合云架构，我们将关键业务保留在私有云中，同时利用阿里云的全球基础设施和丰富的云服务来扩展能力，实现成本优化和业务创新。',
    type: 'cloud',
    icon: '☁️',
    status: serviceStatus.alicloud,
    businessValue: '提供弹性扩展能力，全球化部署，成本优化，丰富的云服务生态。',
    technicalDetails: '基于飞天系统的云计算平台，提供IaaS、PaaS、SaaS全栈服务。'
  },
  ALI_RDS: {
    label: 'RDS数据库\n云端数据库',
    desc: '阿里云RDS是云端的"数据库专家"，提供高可用、高性能的托管数据库服务。与我们的私有云MySQL进行准实时数据同步，确保关键业务数据在云端也有备份，支持灾备和全球化部署。',
    type: 'cloud-database',
    icon: '🗃️',
    status: serviceStatus.ali_rds,
    businessValue: '提供云端数据备份，支持灾备恢复，实现数据全球化访问。',
    technicalDetails: '托管式数据库服务，支持自动备份、监控告警、弹性扩展。'
  },
  ALI_OSS: {
    label: '阿里云OSS\n云端对象存储',
    desc: '阿里云OSS是我们的"云端数据仓库"，提供海量、安全、低成本的对象存储服务。与私有云OSS进行数据同步，实现数据的云端备份和全球CDN加速，为用户提供更快的访问体验。',
    type: 'cloud-storage',
    icon: '📦',
    status: serviceStatus.ali_oss,
    businessValue: '无限存储容量，全球CDN加速，成本效益优化，数据持久化保障。',
    technicalDetails: '分布式对象存储，99.999999999%数据持久性，全球CDN节点。'
  },
  ALI_VPC: {
    label: 'VPC网络\n云端虚拟网络',
    desc: '阿里云VPC是构建混合云网络的"虚拟网络大脑"。通过专线、VPN等方式与私有云建立安全的网络连接，实现两朵云之间的无缝通信，支持统一的网络管理和安全策略。',
    type: 'cloud-network',
    icon: '🌐',
    status: serviceStatus.ali_vpc,
    businessValue: '构建安全的混合云网络，支持业务无缝扩展到云端，统一网络管理。',
    technicalDetails: '隔离的云上网络环境，支持专线、VPN、云企业网等连接方式。'
  }
};

// 获取节点样式
const getNodeStyle = (nodeType, hasStatus = false) => {
  const baseStyle = {
    width: 200,
    height: 80,
    borderRadius: 12,
    border: '2px solid',
    background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  };

  const typeColors = {
    hardware: '#6c757d',
    virtualization: '#007bff',
    network: '#28a745',
    security: '#ffc107',
    database: '#dc3545',
    data: '#17a2b8',
    compute: '#6f42c1',
    analytics: '#673ab7',
    ai: '#fd7e14',
    automation: '#e83e8c',
    cicd: '#20c997',
    storage: '#795548',
    cloud: '#ff9800',
    'cloud-database': '#e91e63',
    'cloud-storage': '#9c27b0',
    'cloud-network': '#4caf50'
  };

  return {
    ...baseStyle,
    borderColor: typeColors[nodeType] || '#6c757d',
    ...(hasStatus && { boxShadow: '0 4px 12px rgba(0,123,255,0.3)' })
  };
};

// 分组节点组件
const GroupNode = ({ data }) => (
  <div style={{
    width: data.width,
    height: data.height,
    background: `linear-gradient(135deg, ${data.color}15 0%, ${data.color}25 100%)`,
    borderRadius: 16,
    border: `2px dashed ${data.color}60`,
    position: 'relative',
    pointerEvents: 'none'
  }}>
    <div style={{
      position: 'absolute',
      top: 8,
      left: 16,
      fontSize: 14,
      fontWeight: 'bold',
      color: data.color,
      background: 'white',
      padding: '4px 12px',
      borderRadius: 20,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      {data.title}
    </div>
  </div>
);

// 自定义节点组件
const CustomNode = ({ data, selected }) => {
  const nodeInfo = nodeData[data.id];
  const isOnline = nodeInfo?.status?.status === 'running';
  
  return (
    <div style={{
      ...getNodeStyle(nodeInfo?.type, !!nodeInfo?.status),
      transform: selected ? 'scale(1.05)' : 'scale(1)',
      transition: 'transform 0.2s ease',
      position: 'relative'
    }}>
      {/* 连接点 - 上下左右四个方向 */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ 
          background: '#555',
          width: 8,
          height: 8,
          border: '2px solid #fff'
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ 
          background: '#555',
          width: 8,
          height: 8,
          border: '2px solid #fff'
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{ 
          background: '#555',
          width: 8,
          height: 8,
          border: '2px solid #fff'
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ 
          background: '#555',
          width: 8,
          height: 8,
          border: '2px solid #fff'
        }}
      />
      
      <div style={{ fontSize: 18, marginBottom: 4 }}>
        {nodeInfo?.icon} {isOnline && <span style={{ color: '#28a745', fontSize: 8 }}>●</span>}
      </div>
      <div style={{ fontSize: 11, lineHeight: 1.2 }}>
        {data.label}
      </div>
    </div>
  );
};

const nodeTypes = {
  customNode: CustomNode,
  groupNode: GroupNode,
};

// 节点和连接定义
const nodes = [
  // 私有云分组背景节点
  {
    id: 'group-private',
    type: 'groupNode',
    data: { 
      title: '🏢 私有云基础设施',
      color: '#2196f3',
      width: 1000,
      height: 580
    },
    position: { x: 30, y: 30 },
    draggable: false,
    selectable: false,
    zIndex: -2
  },
  {
    id: 'group-ai',
    type: 'groupNode',
    data: { 
      title: '🤖 自动化与智能化层',
      color: '#fd7e14',
      width: 620,
      height: 120
    },
    position: { x: 50, y: 290 },
    draggable: false,
    selectable: false,
    zIndex: 0
  },
  {
    id: 'group-network',
    type: 'groupNode',
    data: { 
      title: '🌐 网络基础设施层',
      color: '#28a745',
      width: 400,
      height: 120
    },
    position: { x: 90, y: 450 },
    draggable: false,
    selectable: false,
    zIndex: 0
  },
  {
    id: 'group-storage',
    type: 'groupNode',
    data: { 
      title: '💾 数据存储层',
      color: '#dc3545',
      width: 320,
      height: 180
    },
    position: { x: 610, y: 450 },
    draggable: false,
    selectable: false,
    zIndex: 0
  },
  {
    id: 'group-compute',
    type: 'groupNode',
    data: { 
      title: '⚡ 计算分析层',
      color: '#6f42c1',
      width: 400,
      height: 120
    },
    position: { x: 320, y: 690 },
    draggable: false,
    selectable: false,
    zIndex: 0
  },

  // 阿里云分组背景节点
  {
    id: 'group-alicloud',
    type: 'groupNode',
    data: { 
      title: '☁️ 阿里云平台',
      color: '#ff9800',
      width: 480,
      height: 580
    },
    position: { x: 1100, y: 30 },
    draggable: false,
    selectable: false,
    zIndex: -2
  },
  {
    id: 'group-ali-network',
    type: 'groupNode',
    data: { 
      title: '🌐 云端网络',
      color: '#4caf50',
      width: 220,
      height: 120
    },
    position: { x: 1130, y: 450 },
    draggable: false,
    selectable: false,
    zIndex: 0
  },
  {
    id: 'group-ali-storage',
    type: 'groupNode',
    data: { 
      title: '📦 云端存储',
      color: '#9c27b0',
      width: 220,
      height: 180
    },
    position: { x: 1370, y: 450 },
    draggable: false,
    selectable: false,
    zIndex: 0
  },

  // 私有云主要服务节点
  { 
    id: 'A', 
    type: 'customNode',
    data: { label: nodeData.A.label, id: 'A' }, 
    position: { x: 400, y: 80 },
    zIndex: 10
  },
  { 
    id: 'B', 
    type: 'customNode',
    data: { label: nodeData.B.label, id: 'B' }, 
    position: { x: 400, y: 200 },
    zIndex: 10
  },
  
  // 自动化和智能化层
  { 
    id: 'AI1', 
    type: 'customNode',
    data: { label: nodeData.AI1.label, id: 'AI1' }, 
    position: { x: 80, y: 330 },
    zIndex: 10
  },
  { 
    id: 'AI2', 
    type: 'customNode',
    data: { label: nodeData.AI2.label, id: 'AI2' }, 
    position: { x: 300, y: 330 },
    zIndex: 10
  },
  { 
    id: 'AI3', 
    type: 'customNode',
    data: { label: nodeData.AI3.label, id: 'AI3' }, 
    position: { x: 520, y: 330 },
    zIndex: 10
  },

  // 网络层
  { 
    id: 'NET1', 
    type: 'customNode',
    data: { label: nodeData.NET1.label, id: 'NET1' }, 
    position: { x: 120, y: 490 },
    zIndex: 10
  },
  { 
    id: 'NET2', 
    type: 'customNode',
    data: { label: nodeData.NET2.label, id: 'NET2' }, 
    position: { x: 340, y: 490 },
    zIndex: 10
  },

  // 存储层
  { 
    id: 'STORE1', 
    type: 'customNode',
    data: { label: nodeData.STORE1.label, id: 'STORE1' }, 
    position: { x: 640, y: 490 },
    zIndex: 10
  },
  { 
    id: 'STORE2', 
    type: 'customNode',
    data: { label: nodeData.STORE2.label, id: 'STORE2' }, 
    position: { x: 850, y: 490 },
    zIndex: 10
  },
  { 
    id: 'STORE3', 
    type: 'customNode',
    data: { label: nodeData.STORE3.label, id: 'STORE3' }, 
    position: { x: 745, y: 590 },
    zIndex: 10
  },

  // 计算层
  { 
    id: 'COMPUTE1', 
    type: 'customNode',
    data: { label: nodeData.COMPUTE1.label, id: 'COMPUTE1' }, 
    position: { x: 400, y: 730 },
    zIndex: 10
  },
  
  // BI分析层
  { 
    id: 'BI1', 
    type: 'customNode',
    data: { label: nodeData.BI1.label, id: 'BI1' }, 
    position: { x: 550, y: 730 },
    zIndex: 10
  },

  // 阿里云服务节点
  { 
    id: 'ALI_CLOUD', 
    type: 'customNode',
    data: { label: nodeData.ALI_CLOUD.label, id: 'ALI_CLOUD' }, 
    position: { x: 1290, y: 200 },
    zIndex: 10
  },
  { 
    id: 'ALI_VPC', 
    type: 'customNode',
    data: { label: nodeData.ALI_VPC.label, id: 'ALI_VPC' }, 
    position: { x: 1160, y: 490 },
    zIndex: 10
  },
  { 
    id: 'ALI_RDS', 
    type: 'customNode',
    data: { label: nodeData.ALI_RDS.label, id: 'ALI_RDS' }, 
    position: { x: 1400, y: 490 },
    zIndex: 10
  },
  { 
    id: 'ALI_OSS', 
    type: 'customNode',
    data: { label: nodeData.ALI_OSS.label, id: 'ALI_OSS' }, 
    position: { x: 1400, y: 590 },
    zIndex: 10
  }
];

const edges = [
  // 私有云内部连接
  { id: 'eA-B', source: 'A', target: 'B', animated: true, style: { stroke: '#007bff', strokeWidth: 4 } },
  
  // 虚拟化平台到各层
  { id: 'eB-AI1', source: 'B', target: 'AI1', style: { stroke: '#fd7e14', strokeWidth: 3 } },
  { id: 'eB-AI2', source: 'B', target: 'AI2', style: { stroke: '#e83e8c', strokeWidth: 3 } },
  { id: 'eB-AI3', source: 'B', target: 'AI3', style: { stroke: '#20c997', strokeWidth: 3 } },
  
  { id: 'eB-NET1', source: 'B', target: 'NET1', style: { stroke: '#28a745', strokeWidth: 3 } },
  { id: 'eB-NET2', source: 'B', target: 'NET2', style: { stroke: '#ffc107', strokeWidth: 3 } },
  
  { id: 'eB-STORE1', source: 'B', target: 'STORE1', style: { stroke: '#dc3545', strokeWidth: 3 } },
  { id: 'eB-STORE2', source: 'B', target: 'STORE2', style: { stroke: '#795548', strokeWidth: 3 } },
  { id: 'eB-STORE3', source: 'B', target: 'STORE3', style: { stroke: '#17a2b8', strokeWidth: 3 } },
  
  { id: 'eB-COMPUTE1', source: 'B', target: 'COMPUTE1', style: { stroke: '#6f42c1', strokeWidth: 3 } },
  { id: 'eB-BI1', source: 'B', target: 'BI1', style: { stroke: '#673ab7', strokeWidth: 3 } },
  
  // BI服务连接到数据库
  { id: 'eSTORE1-BI1', source: 'STORE1', target: 'BI1', style: { stroke: '#673ab7', strokeWidth: 3 } },
  
  // 私有云数据同步连接
  { id: 'eSTORE3-STORE1', source: 'STORE3', target: 'STORE1', animated: true, style: { stroke: '#17a2b8', strokeWidth: 3 } },
  { id: 'eSTORE3-STORE2', source: 'STORE3', target: 'STORE2', animated: true, style: { stroke: '#17a2b8', strokeWidth: 3 } },
  
  // 私有云网络层互连
  { id: 'eNET1-NET2', source: 'NET1', target: 'NET2', style: { stroke: '#28a745', strokeWidth: 2, strokeDasharray: '5,5' } },

  // 阿里云内部连接
  { id: 'eALI_CLOUD-ALI_VPC', source: 'ALI_CLOUD', target: 'ALI_VPC', style: { stroke: '#4caf50', strokeWidth: 3 } },
  { id: 'eALI_CLOUD-ALI_RDS', source: 'ALI_CLOUD', target: 'ALI_RDS', style: { stroke: '#e91e63', strokeWidth: 3 } },
  { id: 'eALI_CLOUD-ALI_OSS', source: 'ALI_CLOUD', target: 'ALI_OSS', style: { stroke: '#9c27b0', strokeWidth: 3 } },

  // 混合云连接 - 网络层（虚拟组网）
  { 
    id: 'eNET1-ALI_VPC', 
    source: 'NET1', 
    target: 'ALI_VPC', 
    animated: true,
    style: { 
      stroke: '#4caf50', 
      strokeWidth: 5, 
      strokeDasharray: '15,8'
    },
    label: '🌐 虚拟组网',
    labelStyle: { 
      fill: '#4caf50', 
      fontWeight: 'bold',
      fontSize: '14px'
    }
  },
  { 
    id: 'eNET2-ALI_VPC', 
    source: 'NET2', 
    target: 'ALI_VPC', 
    animated: true,
    style: { 
      stroke: '#ff9800', 
      strokeWidth: 5, 
      strokeDasharray: '15,8'
    },
    label: '🔐 混合架构',
    labelStyle: { 
      fill: '#ff9800', 
      fontWeight: 'bold',
      fontSize: '14px'
    }
  },

  // 混合云连接 - 数据层（准实时同步）
  { 
    id: 'eSTORE1-ALI_RDS', 
    source: 'STORE1', 
    target: 'ALI_RDS', 
    animated: true,
    style: { 
      stroke: '#e91e63', 
      strokeWidth: 5, 
      strokeDasharray: '12,6'
    },
    label: '⚡ 准实时同步',
    labelStyle: { 
      fill: '#e91e63', 
      fontWeight: 'bold',
      fontSize: '14px'
    }
  },
  { 
    id: 'eSTORE2-ALI_OSS', 
    source: 'STORE2', 
    target: 'ALI_OSS', 
    animated: true,
    style: { 
      stroke: '#9c27b0', 
      strokeWidth: 5, 
      strokeDasharray: '12,6'
    },
    label: '📦 对象存储同步',
    labelStyle: { 
      fill: '#9c27b0', 
      fontWeight: 'bold',
      fontSize: '14px'
    }
  },
  { 
    id: 'eSTORE3-ALI_RDS', 
    source: 'STORE3', 
    target: 'ALI_RDS', 
    animated: true,
    style: { 
      stroke: '#17a2b8', 
      strokeWidth: 5, 
      strokeDasharray: '12,6'
    },
    label: '🔄 CDC实时同步',
    labelStyle: { 
      fill: '#17a2b8', 
      fontWeight: 'bold',
      fontSize: '14px'
    }
  },

  // 增加一些额外的云间连接以显示更丰富的混合云架构
  {
    id: 'eAI1-ALI_CLOUD',
    source: 'AI1',
    target: 'ALI_CLOUD',
    animated: true,
    style: {
      stroke: '#673ab7',
      strokeWidth: 4,
      strokeDasharray: '20,10'
    },
    label: '🤖 AI服务集成',
    labelStyle: {
      fill: '#673ab7',
      fontWeight: 'bold',
      fontSize: '12px'
    }
  },
  {
    id: 'eAI2-ALI_CLOUD',
    source: 'AI2',
    target: 'ALI_CLOUD',
    animated: true,
    style: {
      stroke: '#ff5722',
      strokeWidth: 4,
      strokeDasharray: '20,10'
    },
    label: '⚙️ 自动化流程',
    labelStyle: {
      fill: '#ff5722',
      fontWeight: 'bold',
      fontSize: '12px'
    }
  }
];

export default function App() {
  const [modal, setModal] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // 更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const onNodeClick = useCallback((event, node) => {
    // 只处理非分组节点的点击事件
    if (node.type === 'customNode') {
      setModal(nodeData[node.data.id]);
    }
  }, []);

  const renderStatusBadge = (status) => {
    if (!status) return null;
    
    const statusColor = status.status === 'running' ? '#28a745' : '#dc3545';
    return (
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: statusColor,
        color: 'white',
        padding: '4px 8px',
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8
      }}>
        <span style={{ marginRight: 4 }}>●</span>
        {status.status.toUpperCase()}
      </div>
    );
  };

  const renderStatusDetails = (status) => {
    if (!status) return null;
    
    return (
      <div style={{ marginTop: 16, fontSize: 14 }}>
        <div style={{ color: '#666', marginBottom: 8 }}>📊 服务状态详情:</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div><strong>运行时间:</strong> {status.uptime}</div>
          {status.cpu && <div><strong>CPU使用率:</strong> {status.cpu}</div>}
          {status.memory && <div><strong>内存使用率:</strong> {status.memory}</div>}
          {status.vms && <div><strong>虚拟机数量:</strong> {status.vms}台</div>}
          {status.queries && <div><strong>日查询量:</strong> {status.queries}</div>}
          {status.zones && <div><strong>DNS区域:</strong> {status.zones}个</div>}
          {status.connected && <div><strong>VPN连接数:</strong> {status.connected}</div>}
          {status.throughput && <div><strong>网络吞吐量:</strong> {status.throughput}</div>}
          {status.connections && <div><strong>数据库连接:</strong> {status.connections}</div>}
          {status.size && <div><strong>数据大小:</strong> {status.size}</div>}
          {status.jobs && <div><strong>同步作业:</strong> {status.jobs}</div>}
          {status.records && <div><strong>处理速率:</strong> {status.records}</div>}
          {status.storage && <div><strong>存储用量:</strong> {status.storage}</div>}
          {status.sync_jobs && <div><strong>同步任务:</strong> {status.sync_jobs}个</div>}
          {status.api_calls && <div><strong>API调用:</strong> {status.api_calls}</div>}
          {status.workflows && <div><strong>工作流数量:</strong> {status.workflows}个</div>}
          {status.executions && <div><strong>日执行次数:</strong> {status.executions}</div>}
          {status.success_rate && <div><strong>成功率:</strong> {status.success_rate}</div>}
          {status.pipelines && <div><strong>流水线数:</strong> {status.pipelines}个</div>}
          {status.deployments && <div><strong>周部署次数:</strong> {status.deployments}</div>}
          {status.ai_apps && <div><strong>AI应用数:</strong> {status.ai_apps}个</div>}
          {status.models && <div><strong>模型数量:</strong> {status.models}个</div>}
          {status.services && <div><strong>微服务数:</strong> {status.services}个</div>}
          {status.load_avg && <div><strong>平均负载:</strong> {status.load_avg}</div>}
          {status.requests && <div><strong>日请求量:</strong> {status.requests}</div>}
          {status.instances && <div><strong>实例数量:</strong> {status.instances}台</div>}
          {status.regions && <div><strong>覆盖区域:</strong> {status.regions}个</div>}
          {status.iops && <div><strong>IOPS:</strong> {status.iops}</div>}
          {status.cdn && <div><strong>CDN可用性:</strong> {status.cdn}</div>}
          {status.subnets && <div><strong>子网数量:</strong> {status.subnets}个</div>}
          {status.bandwidth && <div><strong>带宽:</strong> {status.bandwidth}</div>}
        </div>
      </div>
    );
  };

  const renderBusinessValue = (businessValue) => {
    if (!businessValue) return null;
    
    return (
      <div style={{ marginTop: 16, padding: 12, background: '#e3f2fd', borderRadius: 8 }}>
        <div style={{ color: '#1976d2', fontWeight: 'bold', marginBottom: 4 }}>💼 业务价值</div>
        <div style={{ color: '#1565c0', fontSize: 14 }}>{businessValue}</div>
      </div>
    );
  };

  const renderTechnicalDetails = (technicalDetails) => {
    if (!technicalDetails) return null;
    
    return (
      <div style={{ marginTop: 16, padding: 12, background: '#f3e5f5', borderRadius: 8 }}>
        <div style={{ color: '#7b1fa2', fontWeight: 'bold', marginBottom: 4 }}>🔧 技术特性</div>
        <div style={{ color: '#6a1b9a', fontSize: 14 }}>{technicalDetails}</div>
      </div>
    );
  };

  const renderSyncFeatures = (syncFeatures) => {
    if (!syncFeatures) return null;
    
    return (
      <div style={{ marginTop: 16, padding: 12, background: '#e8f5e8', borderRadius: 8 }}>
        <div style={{ color: '#2e7d32', fontWeight: 'bold', marginBottom: 8 }}>🔄 云端同步功能</div>
        {syncFeatures.map((feature, index) => (
          <div key={index} style={{ color: '#1b5e20', fontSize: 14, marginBottom: 4 }}>
            • {feature}
          </div>
        ))}
      </div>
    );
  };

  const renderServicesList = (services) => {
    if (!services) return null;
    
    return (
      <div style={{ marginTop: 16, padding: 12, background: '#f3e5f5', borderRadius: 8 }}>
        <div style={{ color: '#7b1fa2', fontWeight: 'bold', marginBottom: 8 }}>🏗️ 微服务清单</div>
        {services.map((service, index) => (
          <div key={index} style={{ color: '#6a1b9a', fontSize: 14, marginBottom: 4 }}>
            • {service}
          </div>
        ))}
      </div>
    );
  };

  const renderCapabilities = (capabilities) => {
    if (!capabilities) return null;
    
    return (
      <div style={{ marginTop: 16, padding: 12, background: '#f3e5f5', borderRadius: 8 }}>
        <div style={{ color: '#673ab7', fontWeight: 'bold', marginBottom: 8 }}>📊 BI分析能力</div>
        {capabilities.map((capability, index) => (
          <div key={index} style={{ color: '#512da8', fontSize: 14, marginBottom: 4 }}>
            • {capability}
          </div>
        ))}
      </div>
    );
  };

  const renderExamples = (examples, title, bgColor, titleColor) => {
    if (!examples) return null;
    
    return (
      <div style={{ marginTop: 16, padding: 12, background: bgColor, borderRadius: 8 }}>
        <div style={{ color: titleColor, fontWeight: 'bold', marginBottom: 12 }}>{title}</div>
        {examples.map((example, index) => (
          <div key={index} style={{ marginBottom: 16, padding: 8, background: 'white', borderRadius: 6 }}>
            <div style={{ color: '#ad1457', fontWeight: 'bold', marginBottom: 4 }}>{example.title}</div>
            <div style={{ color: '#880e4f', fontSize: 13, marginBottom: 6 }}>{example.description}</div>
            <div style={{ fontSize: 12, color: '#4a148c' }}>
              <strong>执行步骤：</strong> {example.steps.join(' → ')}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* 头部 */}
      <div style={{ 
        background: 'rgba(255,255,255,0.95)', 
        backdropFilter: 'blur(10px)',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 20px rgba(0,0,0,0.1)'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, color: '#333', fontWeight: '700' }}>
            🏗️ 混合云基础设施架构
          </h1>
          <div style={{ fontSize: 14, color: '#666', marginTop: 4 }}>
            私有云 + 阿里云 | 智能化 + 自动化 | 网络层 + 存储层 + 计算层
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>
            {currentTime.toLocaleTimeString('zh-CN')}
          </div>
          <div style={{ fontSize: 12, color: '#666' }}>
            {currentTime.toLocaleDateString('zh-CN')}
          </div>
        </div>
      </div>

      {/* 状态栏 */}
      <div style={{ 
        padding: '16px 32px',
        display: 'flex',
        gap: 12,
        overflowX: 'auto'
      }}>
        {Object.entries(serviceStatus).map(([key, status]) => (
          <div key={key} style={{
            background: 'rgba(255,255,255,0.9)',
            borderRadius: 8,
            padding: '8px 12px',
            minWidth: 100,
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ 
              color: status.status === 'running' ? '#28a745' : '#dc3545',
              fontSize: 11,
              fontWeight: 'bold'
            }}>
              ● {key.toUpperCase()}
            </div>
            <div style={{ fontSize: 9, color: '#666', marginTop: 2 }}>
              运行 {status.uptime}
            </div>
          </div>
        ))}
      </div>

      {/* 混合云连接状态指示器 */}
      <div style={{
        padding: '8px 32px',
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(5px)',
        borderTop: '1px solid rgba(255,255,255,0.3)',
        borderBottom: '1px solid rgba(255,255,255,0.3)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          fontSize: 12,
          fontWeight: 'bold'
        }}>
          <div style={{ color: '#333' }}>🔗 混合云连接状态（共{edges.length}条连接）：</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4caf50' }}></div>
            <span style={{ color: '#4caf50' }}>网络层互通</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#e91e63' }}></div>
            <span style={{ color: '#e91e63' }}>数据库同步</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#9c27b0' }}></div>
            <span style={{ color: '#9c27b0' }}>存储同步</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5722' }}></div>
            <span style={{ color: '#ff5722' }}>AI/自动化集成</span>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div style={{ 
        width: '95vw', 
        height: 'calc(100vh - 240px)', 
        margin: '0 auto', 
        background: 'rgba(255,255,255,0.95)',
        borderRadius: 12,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        marginTop: '20px'
      }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          fitView
          defaultEdgeOptions={{
            animated: false,
            style: { strokeWidth: 2, stroke: '#b1b1b7' }
          }}
          connectOnClick={false}
          nodesDraggable={true}
          nodesConnectable={false}
          elementsSelectable={true}
        >
          <MiniMap 
            style={{ 
              background: 'rgba(255,255,255,0.8)',
              borderRadius: 8
            }}
          />
          <Controls 
            style={{ 
              background: 'rgba(255,255,255,0.8)',
              borderRadius: 8
            }}
          />
          <Background color="#f0f0f0" gap={20} />
        </ReactFlow>
      </div>

      {/* 重点案例展示区域 */}
      <div style={{
        padding: '20px 32px',
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        marginTop: 20
      }}>
        <div style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: '#333',
          marginBottom: 16,
          textAlign: 'center'
        }}>
          ⭐ 核心业务案例展示
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: 20,
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {highlightedCases.map((caseItem, index) => (
            <div key={caseItem.id} style={{
              background: 'white',
              borderRadius: 12,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              border: '1px solid rgba(0,0,0,0.1)'
            }}>
              {/* 案例头部 */}
              <div style={{
                background: caseItem.color,
                padding: '16px 20px',
                color: 'white'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 8
                }}>
                  <span style={{ fontSize: 24 }}>{caseItem.icon}</span>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 'bold' }}>
                      {caseItem.title}
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.9 }}>
                      {caseItem.subtitle}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.4, opacity: 0.95 }}>
                  {caseItem.description}
                </div>
              </div>

              {/* 案例内容 */}
              <div style={{ padding: '20px' }}>
                {/* 核心特性 */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 8 }}>
                    🎯 核心特性
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {caseItem.keyFeatures.map((feature, idx) => (
                      <div key={idx} style={{
                        background: '#f8f9fa',
                        padding: '4px 8px',
                        borderRadius: 4,
                        fontSize: 12,
                        color: '#495057',
                        border: '1px solid #e9ecef'
                      }}>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 技术栈 */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 8 }}>
                    🛠️ 技术栈
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {caseItem.techStack.map((tech, idx) => (
                      <div key={idx} style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: 12,
                        fontSize: 11,
                        fontWeight: 'bold'
                      }}>
                        {tech}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 数据流程 */}
                <div>
                  <div style={{ fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 8 }}>
                    📊 数据流程
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    {caseItem.dataFlow.map((flow, idx) => (
                      <React.Fragment key={idx}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          background: '#f8f9fa',
                          padding: '6px 10px',
                          borderRadius: 6,
                          border: '1px solid #dee2e6'
                        }}>
                          <div style={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            background: caseItem.color,
                            color: 'white',
                            fontSize: 10,
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {flow.step}
                          </div>
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 'bold', color: '#333' }}>
                              {flow.name}
                            </div>
                            <div style={{ fontSize: 10, color: '#666' }}>
                              {flow.desc}
                            </div>
                          </div>
                        </div>
                        {idx < caseItem.dataFlow.length - 1 && (
                          <div style={{ color: '#666', fontSize: 12 }}>→</div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 详情模态框 */}
      {modal && (
        <div style={{
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh',
          background: 'rgba(0,0,0,0.5)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 1000,
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            background: '#fff', 
            borderRadius: 16, 
            padding: 32, 
            minWidth: 500, 
            maxWidth: '90vw',
            maxHeight: '85vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            position: 'relative'
          }}>
            <button 
              style={{ 
                position: 'absolute', 
                right: 16, 
                top: 16, 
                background: 'none',
                border: 'none',
                fontSize: 24, 
                cursor: 'pointer', 
                color: '#888',
                padding: 4
              }}
              onClick={() => setModal(null)}
            >
              ×
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 32, marginRight: 12 }}>{modal.icon}</span>
              <div>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#333' }}>
                  {modal.label.replace(/\n/g, ' ')}
                </div>
                {renderStatusBadge(modal.status)}
              </div>
            </div>
            
            <div style={{ color: '#555', lineHeight: 1.6, fontSize: 16, marginBottom: 16 }}>
              {modal.desc}
            </div>
            
            {renderBusinessValue(modal.businessValue)}
            {renderTechnicalDetails(modal.technicalDetails)}
            {renderStatusDetails(modal.status)}
            {renderSyncFeatures(modal.syncFeatures)}
            {renderServicesList(modal.services)}
            {renderCapabilities(modal.capabilities)}
            {modal.examples && renderExamples(modal.examples, '🚀 应用示例', '#fce4ec', '#c2185b')}
          </div>
        </div>
      )}
    </div>
  );
} 