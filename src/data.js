export const artists = [
  {
    id: 1,
    name: "林风眠",
    bio: "中国现代画家，被誉为中西融合代表人物",
    avatar: "https://picsum.photos/seed/ar1/200/200",
    location: "浙江绍兴",
    followers: 3250,
    works: 12
  },
  {
    id: 2,
    name: "吴冠中",
    bio: "中国当代著名画家，以水墨画与油画结合著称",
    avatar: "https://picsum.photos/seed/ar2/200/200",
    location: "江苏宜兴",
    followers: 5820,
    works: 18
  },
  {
    id: 3,
    name: "徐悲鸿",
    bio: "中国现代画坛巨匠，尤以画马闻名于世",
    avatar: "https://picsum.photos/seed/ar3/200/200",
    location: "江苏宜兴",
    followers: 7100,
    works: 24
  },
  {
    id: 4,
    name: "齐白石",
    bio: "中国近现代著名画家，诗书画印全能",
    avatar: "https://picsum.photos/seed/ar4/200/200",
    location: "湖南湘潭",
    followers: 8900,
    works: 36
  },
  {
    id: 5,
    name: "张大千",
    bio: "中国著名画家，晚年融汇古今中外画风",
    avatar: "https://picsum.photos/seed/ar5/200/200",
    location: "四川内江",
    followers: 6400,
    works: 20
  },
  {
    id: 6,
    name: "潘玉良",
    bio: "中国著名女画家，中国早期西画运动的重要代表",
    avatar: "https://picsum.photos/seed/ar6/200/200",
    location: "江苏扬州",
    followers: 2800,
    works: 15
  }
];

export const artworks = [
  {
    id: 1,
    title: "春山晨雾",
    aid: 1,
    artist: "林风眠",
    price: 128000,
    orig: 158000,
    cat: "山水",
    style: "水墨设色",
    size: "68×138cm",
    year: "2021",
    mat: "宣纸",
    desc: "以轻盈笔触捕捉春日山林的朦胧之美，晨雾缭绕，层次分明，意境悠远。",
    img: "https://picsum.photos/seed/at1/800/600",
    views: 2340,
    sold: 0,
    stock: 1,
    featured: true
  },
  {
    id: 2,
    title: "江南水乡",
    aid: 2,
    artist: "吴冠中",
    price: 256000,
    orig: null,
    cat: "风景",
    style: "油画棒彩",
    size: "50×70cm",
    year: "2022",
    mat: "布面油画",
    desc: "白墙黛瓦、小桥流水，在点与线的韵律中呈现江南的诗画意境。",
    img: "https://picsum.photos/seed/at2/800/600",
    views: 4120,
    sold: 0,
    stock: 1,
    featured: true
  },
  {
    id: 3,
    title: "奔马图",
    aid: 3,
    artist: "徐悲鸿",
    price: 88000,
    orig: 98000,
    cat: "动物",
    style: "水墨",
    size: "95×178cm",
    year: "2020",
    mat: "宣纸",
    desc: "奔马姿态矫健，鬃毛飞扬，以刚劲有力的线条勾勒出骏马的澎湃活力。",
    img: "https://picsum.photos/seed/at3/800/600",
    views: 5680,
    sold: 3,
    stock: 2,
    featured: true
  },
  {
    id: 4,
    title: "虾趣图",
    aid: 4,
    artist: "齐白石",
    price: 68000,
    orig: null,
    cat: "花鸟",
    style: "水墨",
    size: "45×90cm",
    year: "2019",
    mat: "宣纸",
    desc: "寥寥数笔却形神兼备，意趣盎然，尽显大师返璞归真的艺术境界。",
    img: "https://picsum.photos/seed/at4/800/600",
    views: 7890,
    sold: 8,
    stock: 1,
    featured: false
  },
  {
    id: 5,
    title: "荷花双燕",
    aid: 4,
    artist: "齐白石",
    price: 158000,
    orig: 188000,
    cat: "花鸟",
    style: "设色",
    size: "68×136cm",
    year: "2022",
    mat: "宣纸",
    desc: "盛夏荷塘，燕语莺声，浓淡相宜，情趣横生。",
    img: "https://picsum.photos/seed/at5/800/600",
    views: 3560,
    sold: 1,
    stock: 1,
    featured: false
  },
  {
    id: 6,
    title: "黄山云海",
    aid: 5,
    artist: "张大千",
    price: 320000,
    orig: null,
    cat: "山水",
    style: "泼墨泼彩",
    size: "120×240cm",
    year: "2023",
    mat: "绢本",
    desc: "云海翻涌，山峦若隐若现，气势恢宏，艺术生涯巅峰时期的珍贵之作。",
    img: "https://picsum.photos/seed/at6/800/600",
    views: 6120,
    sold: 0,
    stock: 1,
    featured: true
  },
  {
    id: 7,
    title: "瓶花",
    aid: 6,
    artist: "潘玉良",
    price: 48000,
    orig: 52000,
    cat: "花卉",
    style: "油画",
    size: "40×50cm",
    year: "2021",
    mat: "布面油画",
    desc: "以西方印象派的光色手法描绘东方插花艺术，明快典雅。",
    img: "https://picsum.photos/seed/at7/800/600",
    views: 2100,
    sold: 2,
    stock: 3,
    featured: false
  },
  {
    id: 8,
    title: "秋江独钓",
    aid: 1,
    artist: "林风眠",
    price: 98000,
    orig: null,
    cat: "山水",
    style: "水墨",
    size: "55×105cm",
    year: "2022",
    mat: "宣纸",
    desc: "秋水长天，一叶扁舟，意境空灵悠远，中国文人画的精神家园。",
    img: "https://picsum.photos/seed/at8/800/600",
    views: 3200,
    sold: 1,
    stock: 2,
    featured: false
  }
];

export const categories = ["全部", "山水", "花鸟", "动物", "风景", "书法", "当代"];

export const stories = [
  {
    id: 1,
    title: "林风眠：孤独的先行者",
    type: "艺术家",
    cover: "https://picsum.photos/seed/st1/400/300",
    author: "画里画外编辑部",
    read: "8分钟"
  },
  {
    id: 2,
    title: "2024春季艺术品拍卖市场趋势报告",
    type: "市场",
    cover: "https://picsum.photos/seed/st2/400/300",
    author: "市场研究组",
    read: "12分钟"
  },
  {
    id: 3,
    title: "如何收藏第一幅中国画：从入门到进阶",
    type: "收藏",
    cover: "https://picsum.photos/seed/st3/400/300",
    author: "收藏顾问团",
    read: "10分钟"
  }
];

export const charity = [
  {
    id: 1,
    title: "云南山区儿童艺术教室",
    desc: "为云南红河州山区学校建设专业艺术教室，配备画材和教学设备",
    raised: 286000,
    goal: 300000,
    beneficiaries: 186,
    cover: "https://picsum.photos/seed/ch1/800/400",
    tag: "进行中"
  },
  {
    id: 2,
    title: "甘肃乡村小学美术支教计划",
    desc: "联合艺术家志愿者，每月赴甘肃偏远乡村小学开展美术教育",
    raised: 142000,
    goal: 200000,
    beneficiaries: 320,
    cover: "https://picsum.photos/seed/ch2/800/400",
    tag: "进行中"
  },
  {
    id: 3,
    title: "自闭症儿童艺术疗愈项目",
    desc: "与专业艺术疗愈师合作，为自闭症儿童提供艺术创作疗愈课程",
    raised: 98000,
    goal: 150000,
    beneficiaries: 54,
    cover: "https://picsum.photos/seed/ch3/800/400",
    tag: "进行中"
  }
];

export const orders = [
  {
    id: "HL20240315001",
    arts: [artworks[0], artworks[2]],
    total: 216000,
    status: "已完成",
    date: "2024-03-15"
  },
  {
    id: "HL20240310002",
    arts: [artworks[3]],
    total: 68000,
    status: "运输中",
    date: "2024-03-10"
  },
  {
    id: "HL20240305003",
    arts: [artworks[1]],
    total: 256000,
    status: "待发货",
    date: "2024-03-05"
  }
];

export const exhibitions = [
  {
    id: 1,
    title: "水墨之境——林风眠艺术展",
    type: "线下展览",
    cover: "https://picsum.photos/seed/ex1/800/500",
    artist: "林风眠",
    location: "北京今日美术馆",
    date: "2026-04-15 至 2026-05-20",
    price: 68,
    status: "即将开始",
    tag: "预约中",
    desc: "本次展览汇聚林风眠先生50余幅精品，涵盖其在各个时期的代表作品，展现中西融合的艺术探索历程。展览期间将举办多场专题讲座和现场导览。",
    highlights: ["50+幅真迹展出", "AR互动体验", "限量周边发售"]
  },
  {
    id: 2,
    title: "大千世界——张大千泼彩艺术展",
    type: "线上虚拟展",
    cover: "https://picsum.photos/seed/ex2/800/500",
    artist: "张大千",
    location: "线上虚拟展厅",
    date: "2026-04-01 至 2026-06-30",
    price: 0,
    status: "正在展出",
    tag: "免费参观",
    desc: "通过先进的VR技术，足不出户即可身临其境地欣赏张大千先生的泼墨泼彩佳作。虚拟展厅还原真实展馆空间，支持语音导览和细节放大。",
    highlights: ["VR虚拟展厅", "语音全程导览", "高清细节赏析"]
  },
  {
    id: 3,
    title: "齐白石艺术文献展",
    type: "线下展览",
    cover: "https://picsum.photos/seed/ex3/800/500",
    artist: "齐白石",
    location: "上海博物馆",
    date: "2026-03-01 至 2026-04-10",
    price: 50,
    status: "即将结束",
    tag: "最后一周",
    desc: "展览呈现齐白石先生的书画作品及相关文献资料，展现这位艺术大师从木匠到画家的传奇人生。",
    highlights: ["文献资料首次公开", "沉浸式体验区", "互动创作工坊"]
  },
  {
    id: 4,
    title: "吴冠中当代艺术对话展",
    type: "线下展览",
    cover: "https://picsum.photos/seed/ex4/800/500",
    artist: "吴冠中",
    location: "南京博物院",
    date: "2026-05-01 至 2026-06-15",
    price: 80,
    status: "即将开始",
    tag: "早鸟票",
    desc: "展览将吴冠中的经典作品与当代艺术家的创新之作并置，探讨传统与创新的对话与融合。",
    highlights: ["传统与当代对话", "现场创作演示", "艺术沙龙"]
  }
];

export const events = [
  {
    id: 1,
    title: "艺术家面对面：徐悲鸿画马艺术分享",
    type: "公益讲座",
    cover: "https://picsum.photos/seed/ev1/800/400",
    date: "2026-04-20 14:00",
    location: "画里画外艺术中心",
    participants: 86,
    price: 0,
    status: "报名中",
    tag: "公益免费",
    desc: "著名艺术史学者深度解读徐悲鸿先生的画马艺术，分享其艺术人生与创作故事。现场将有互动环节，参与者有机会获得徐悲鸿画册一本。"
  },
  {
    id: 2,
    title: "儿童水墨画工作坊",
    type: "艺术体验",
    cover: "https://picsum.photos/seed/ev2/800/400",
    date: "2026-04-25 10:00",
    location: "云南山区小学（远程连线）",
    participants: 45,
    price: 0,
    status: "报名中",
    tag: "公益活动",
    desc: "联合山区学校，通过视频连线方式，带领乡村儿童体验水墨画的魅力。志愿者艺术家将现场演示并指导孩子们完成自己的水墨作品。"
  },
  {
    id: 3,
    title: "潘玉良女性艺术主题沙龙",
    type: "艺术沙龙",
    cover: "https://picsum.photos/seed/ev3/800/400",
    date: "2026-05-08 19:00",
    location: "画里画外艺术中心",
    participants: 50,
    price: 99,
    status: "报名中",
    tag: "会员专享",
    desc: "母亲节特别活动，探讨潘玉良作为中国早期女性艺术家的传奇人生与艺术成就。现场将准备精美茶歇，会员可携一位朋友参加。"
  },
  {
    id: 4,
    title: "艺术品收藏与鉴赏入门课程",
    type: "教育课程",
    cover: "https://picsum.photos/seed/ev4/800/400",
    date: "2026-05-15 起每周六",
    location: "线上+线下同步",
    participants: 120,
    price: 299,
    status: "报名中",
    tag: "系列课程",
    desc: "为期4周的入门课程，系统讲解中国画鉴赏知识、收藏价值判断、市场行情分析等，适合艺术收藏爱好者。完成课程可获得结业证书。"
  }
];
