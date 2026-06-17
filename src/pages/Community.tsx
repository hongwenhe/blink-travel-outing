// 风采 - 类朋友圈信息流 + 筛选 + 发帖 + 转发
import { useEffect, useMemo, useState } from 'react'
import {
  Heart,
  Share2,
  Camera,
  MapPin,
  X,
  Send,
  Check,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Plus,
} from 'lucide-react'
import MiniProgramBar from '../components/MiniProgramBar'
import { useAppStore } from '../store/useAppStore'
import type { Post, CommunityFilter } from '../types'

const aiImage = (prompt: string, imageSize: string = 'square_hd') =>
  `https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=${imageSize}`

const NINE_GRID_YUNNAN = [
  aiImage('realistic travel photography, Yunnan old town stone lane, warm sunset, candid tourist moment, premium social feed image'),
  aiImage('realistic travel photography, Erhai lake bicycle path, blue sky, middle aged tourists smiling, premium social feed image'),
  aiImage('realistic travel photography, Yulong Snow Mountain close view, crisp air, scenic travel photo, premium social feed image'),
  aiImage('realistic travel photography, Dali ancient town flower window, bright afternoon, elegant composition, premium social feed image'),
  aiImage('realistic travel photography, Lijiang stone bridge and canal, gentle sunlight, cinematic travel snapshot'),
  aiImage('realistic travel photography, Bai ethnic lunch table, colorful local dishes, warm atmosphere, premium travel feed'),
  aiImage('realistic travel photography, Blue Moon Valley turquoise lake, vivid water, premium scenic image'),
  aiImage('realistic travel photography, travel group portrait in Yunnan, joyful candid moment, polished mobile social image'),
  aiImage('realistic travel photography, night market lanterns in Lijiang, rich warm color, premium travel snapshot'),
]

const NINE_GRID_GROUP = [
  aiImage('realistic travel photography, travel group at mountain viewpoint, smiling middle aged tourists, premium mobile social image'),
  aiImage('realistic travel photography, close up of flower cake and tea on travel table, cozy detail shot'),
  aiImage('realistic travel photography, old town wooden window and red lantern, elegant composition'),
  aiImage('realistic travel photography, tour guide helping elderly tourist on stone path, caring moment'),
  aiImage('realistic travel photography, lake shore reflection and clouds, refined scenic composition'),
  aiImage('realistic travel photography, tourist taking photo with smartphone in old town, candid moment'),
  aiImage('realistic travel photography, boutique hotel courtyard in Yunnan, warm evening light'),
  aiImage('realistic travel photography, travel bus interior with sunlight and relaxed tourists'),
  aiImage('realistic travel photography, ancient town archway and blue sky, high quality scenic image'),
]

const NINE_GRID_ROUTE = [
  aiImage('realistic travel photography, Dali Erhai sunrise panorama, poetic mood, premium social feed'),
  aiImage('realistic travel photography, local craft market stall in Yunnan, colorful handmade items'),
  aiImage('realistic travel photography, cable car view over green valley, adventure travel shot'),
  aiImage('realistic travel photography, boutique cafe in Lijiang old town, warm wood tones'),
  aiImage('realistic travel photography, tourists feeding seagulls by lake, happy candid scene'),
  aiImage('realistic travel photography, hotel breakfast buffet detail, fresh fruit and noodles'),
  aiImage('realistic travel photography, snow mountain meadow, bright clear day, premium landscape'),
  aiImage('realistic travel photography, travel group walking under trees, relaxed pace'),
  aiImage('realistic travel photography, evening old town street with lantern glow, cinematic'),
]

const THREE_GRID_STORY = [
  aiImage('realistic travel photography, elderly tourists taking photos beside Erhai lake, bright sky, polished social feed image'),
  aiImage('realistic travel photography, local flower cake and tea on wooden table, warm detail shot'),
  aiImage('realistic travel photography, Dali ancient town arch and blue sky, clean composition'),
]

const FOUR_GRID_STORY = [
  aiImage('realistic travel photography, Lijiang old town corner with lanterns, premium mobile social image'),
  aiImage('realistic travel photography, smiling travel group in boutique hotel courtyard, relaxed candid'),
  aiImage('realistic travel photography, Blue Moon Valley water close view, vivid turquoise scenic image'),
  aiImage('realistic travel photography, Yunnan local dinner table with steam and warm light, premium travel snapshot'),
]

const MOCK_PHOTOS = [...NINE_GRID_YUNNAN]

const BEFORE_POSTS: Post[] = [
  {
    id: 'bp1',
    author: { name: '李筱然', avatar: 'L' },
    text: '叔叔阿姨们记得今晚把身份证和常用药放进随身包，明早 5:20 我会在群里再提醒一次。',
    images: [],
    location: '出团群公告',
    likes: 12,
    comments: 4,
    createdAt: '06-10 20:18',
  },
  {
    id: 'bp2',
    author: { name: '张叔', avatar: '张' },
    text: '第一次去云南，已经把防晒霜和薄外套备好了，希望能拍到玉龙雪山！',
    images: [],
    location: '出发前心情',
    likes: 8,
    comments: 3,
    createdAt: '06-11 08:32',
  },
]

const IDLE_POSTS: Post[] = [
  {
    id: 'ip1',
    author: { name: '同行小助手', avatar: '同' },
    text: '最近暂无新订单，您仍可回看过往旅程动态、转发精彩照片，或者切换到“行前 / 行中”查看演示效果。',
    images: [],
    location: '旅程档案',
    likes: 6,
    comments: 1,
    createdAt: '06-04 10:10',
  },
]

const BEFORE_ROUTE_POSTS: FeedPost[] = [
  {
    id: 'br1',
    author: { name: '周阿姨', avatar: '周' },
    text: '同线路上一团把大理和丽江的拍照机位都标出来了，大家出发前可以先收藏，到了就不慌。',
    images: FOUR_GRID_STORY,
    location: '云南慢游线 · 行前参考',
    likes: 15,
    comments: 6,
    createdAt: '06-09 19:12',
    scopes: ['route', 'all'],
    badge: '同线路',
    source: '线路经验',
    likedBy: ['赵姐', '张叔', '同行小助手'],
    commentItems: [
      { name: '赵姐', text: '这 4 张图特别实用，出发前就能先做功课。' },
      { name: '张叔', text: '这种线路经验最有参考价值。' },
    ],
  },
  {
    id: 'br2',
    author: { name: '何叔', avatar: '何' },
    text: '把同线路最经典的 9 个点位做成一组图，给第一次去云南的朋友们提前熟悉一下路线节奏。',
    images: NINE_GRID_ROUTE,
    location: '大理 + 丽江',
    likes: 28,
    comments: 9,
    createdAt: '06-08 21:40',
    scopes: ['route', 'all'],
    badge: '同线路',
    source: '线路图集',
    likedBy: ['陈阿姨', '周叔', '王阿姨'],
    commentItems: [
      { name: '陈阿姨', text: '看完这组图，路线一下就有画面感了。' },
      { name: '王阿姨', text: '还没出发就已经开始期待了。' },
    ],
  },
  {
    id: 'br3',
    author: { name: '林叔', avatar: '林' },
    text: '我把同线路上一团在古城、雪山、酒店拍的 3 张重点图整理出来了，给准备出发的朋友们参考。',
    images: THREE_GRID_STORY,
    location: '云南慢游线 · 行前参考',
    likes: 17,
    comments: 5,
    createdAt: '06-09 15:26',
    scopes: ['route', 'all'],
    badge: '同线路',
    source: '线路速览',
    likedBy: ['周阿姨', '王阿姨', '同行小助手'],
    commentItems: [
      { name: '周阿姨', text: '这种 3 张图特别适合先快速了解线路。' },
      { name: '王阿姨', text: '看完心里更有底了。' },
    ],
  },
  {
    id: 'br4',
    author: { name: '刘姐', avatar: '刘' },
    text: '同线路的住宿、用餐和车程节奏我做了 4 图总结，怕大家第一次参加时抓不住重点。',
    images: FOUR_GRID_STORY,
    location: '大理 + 丽江节奏参考',
    likes: 20,
    comments: 6,
    createdAt: '06-08 18:08',
    scopes: ['route', 'all'],
    badge: '同线路',
    source: '节奏总结',
    likedBy: ['赵姐', '张叔', '周叔'],
    commentItems: [
      { name: '赵姐', text: '这组 4 图把节奏说清楚了。' },
      { name: '张叔', text: '第一次报团的人很需要这种总结。' },
    ],
  },
]

const BEFORE_TODAY_POSTS: FeedPost[] = [
  {
    id: 'bt1',
    author: { name: '出团播报', avatar: '播' },
    text: '今天共有 3 个云南团出发，虹桥机场值机排队较平稳，建议大家按约定时间到达即可。',
    images: [],
    location: '今日出行播报',
    likes: 9,
    comments: 4,
    createdAt: '06-11 07:18',
    scopes: ['today', 'all'],
    badge: '今日出行',
    source: '平台播报',
    likedBy: ['同行小助手', '李筱然'],
    commentItems: [{ name: '李筱然', text: '今天出行秩序不错，请大家保持手机畅通。' }],
  },
  {
    id: 'bt2',
    author: { name: '赵姐', avatar: '赵' },
    text: '我刚把今天出发团的行李照片发给家里了，三张图刚刚好，简单又清楚。',
    images: THREE_GRID_STORY,
    location: '虹桥机场 T2',
    likes: 12,
    comments: 5,
    createdAt: '06-11 06:52',
    scopes: ['today', 'all'],
    badge: '今日出行',
    source: '今日实拍',
    likedBy: ['王阿姨', '张叔'],
    commentItems: [
      { name: '王阿姨', text: '这种三图发家人群很合适。' },
      { name: '张叔', text: '看着就很踏实。' },
    ],
  },
  {
    id: 'bt3',
    author: { name: '值机播报', avatar: '值' },
    text: '今天上午出发团的值机速度较快，托运行李平均 15 分钟内完成，现场秩序平稳。',
    images: [],
    location: '机场实时播报',
    likes: 7,
    comments: 3,
    createdAt: '06-11 08:06',
    scopes: ['today', 'all'],
    badge: '今日出行',
    source: '值机提醒',
    likedBy: ['同行小助手', '李筱然'],
    commentItems: [{ name: '李筱然', text: '请今天出发的朋友们继续留意登机口变化。' }],
  },
  {
    id: 'bt4',
    author: { name: '王阿姨', avatar: '王' },
    text: '我把今天出发时拍的 4 张图发一下，给还没出门的朋友们看看现场环境和行李摆放情况。',
    images: FOUR_GRID_STORY,
    location: '虹桥机场出发大厅',
    likes: 14,
    comments: 6,
    createdAt: '06-11 07:34',
    scopes: ['today', 'all'],
    badge: '今日出行',
    source: '出发现场',
    likedBy: ['张叔', '赵姐', '同行小助手'],
    commentItems: [
      { name: '张叔', text: '这组图很实在，现场情况一看就懂。' },
      { name: '赵姐', text: '谢谢分享，我已经照着整理行李了。' },
    ],
  },
]

type FeedScope = CommunityFilter

type FeedPost = Post & {
  scopes: FeedScope[]
  badge: string
  source: string
  interactive?: boolean
  likedBy?: string[]
  commentItems?: Array<{ name: string; text: string }>
  routeCard?: {
    title: string
    subtitle: string
    meta: string
    cover: string
  }
}

const FILTERS: Array<{
  key: FeedScope
  label: string
}> = [
  { key: 'group', label: '本团' },
  { key: 'route', label: '同线路' },
  { key: 'today', label: '今日出行' },
  { key: 'all', label: '全部' },
]

const ROUTE_POSTS: FeedPost[] = [
  {
    id: 'rp1',
    author: { name: '周阿姨', avatar: '周' },
    text: '我们是同线路前一天出发的团，今天一路拍了不少景，给大家放一组 9 宫格参考。傍晚在洱海边风大，建议一定带披肩和薄外套。',
    images: NINE_GRID_ROUTE,
    location: '洱海生态廊道',
    likes: 36,
    comments: 12,
    createdAt: '06-17 19:20',
    scopes: ['route', 'all'],
    badge: '同线路',
    source: '云南慢游线',
    likedBy: ['陈阿姨', '何叔', '同行小助手'],
    commentItems: [
      { name: '陈阿姨', text: '披肩这个提醒太实用了，我已经放包里了。' },
      { name: '李阿姨', text: '这张日落照片真好看。' },
      { name: '王医生', text: '这条线路海边风确实比想象中大。' },
      { name: '周叔', text: '谢谢提醒，我把帽子也准备好了。' },
      { name: '赵姐', text: '日落时间段拍人像很柔和。' },
      { name: '小赵', text: '这组九宫格很适合直接转给家里人。' },
      { name: '同行小助手', text: '已为您同步到本线路精选。' },
      { name: '何叔', text: '照片太有氛围了。' },
      { name: '张导', text: '大家傍晚出门记得加件外套。' },
      { name: '李阿姨', text: '我最喜欢第 3 张的天空。' },
      { name: '陈阿姨', text: '看完更期待出发了。' },
      { name: '王阿姨', text: '构图真漂亮。' },
    ],
  },
  {
    id: 'rp2',
    author: { name: '孙师傅', avatar: '孙' },
    text: '这条线早晚温差大，车上常备热水，建议叔叔阿姨们上车后先补水休息。',
    images: [],
    location: '大理 → 丽江',
    likes: 18,
    comments: 5,
    createdAt: '06-17 09:40',
    scopes: ['route', 'today', 'all'],
    badge: '线路服务',
    source: '跟团提醒',
    likedBy: ['王医生', '张导'],
    commentItems: [{ name: '周叔', text: '热水这个细节真贴心。' }],
  },
  {
    id: 'rp3',
    author: { name: '赵大姐', avatar: '赵' },
    text: '同线路的上一团把蓝月谷、古城、酒店小景都拍齐了，给大家做个一屏看全的攻略参考。',
    images: NINE_GRID_YUNNAN,
    location: '丽江 + 大理沿线',
    likes: 44,
    comments: 16,
    createdAt: '06-16 20:28',
    scopes: ['route', 'all'],
    badge: '同线路',
    source: '线路攻略图集',
    likedBy: ['何叔', '陈阿姨', '王医生', '同行小助手'],
    commentItems: [
      { name: '何叔', text: '这种九宫格很直观，去哪儿一眼就知道了。' },
      { name: '赵大姐', text: '我把好看的机位都记在图里了。' },
    ],
  },
  {
    id: 'rp4',
    author: { name: '何叔', avatar: '何' },
    text: '今天顺手发 3 张沿途随拍，适合给家里人报个平安，也很有旅行氛围。',
    images: THREE_GRID_STORY,
    location: '大理沿湖公路',
    likes: 19,
    comments: 7,
    createdAt: '06-17 13:12',
    scopes: ['route', 'today', 'all'],
    badge: '同线路',
    source: '沿途随拍',
    likedBy: ['张叔', '王阿姨', '李筱然'],
    commentItems: [
      { name: '张叔', text: '这种三张图很适合发家族群。' },
      { name: '王阿姨', text: '第二张点心看起来很好吃。' },
    ],
  },
  {
    id: 'rp5',
    author: { name: '陈阿姨', avatar: '陈' },
    text: '酒店和晚餐我拍了 4 张，环境、庭院和餐桌都放一起，给后面的团友们参考。',
    images: FOUR_GRID_STORY,
    location: '丽江精品酒店',
    likes: 27,
    comments: 11,
    createdAt: '06-17 21:08',
    scopes: ['route', 'all'],
    badge: '同线路',
    source: '食宿参考',
    likedBy: ['赵大姐', '周叔', '同行小助手', '小赵'],
    commentItems: [
      { name: '赵大姐', text: '四张图这种对比感很好，一眼就看出环境。' },
      { name: '周叔', text: '房间看起来挺安静整洁。' },
      { name: '小赵', text: '晚餐那张颜色太有食欲了。' },
      { name: '同行小助手', text: '已加入线路食宿参考内容。' },
      { name: '何叔', text: '这个酒店院子真舒服。' },
      { name: '李阿姨', text: '我喜欢这种木质风格。' },
      { name: '王阿姨', text: '餐桌摆盘很精致。' },
      { name: '张导', text: '这家酒店确实口碑不错。' },
      { name: '陈阿姨', text: '我自己最满意第 1 张。' },
      { name: '刘叔', text: '谢谢分享，心里更有数了。' },
      { name: '赵姐', text: '看起来很适合慢慢住。' },
    ],
  },
  {
    id: 'rp6',
    author: { name: '吴老师', avatar: '吴' },
    text: '同线路我最喜欢的其实是单张大景，今天这张雪山角度很正，适合直接存下来当封面。',
    images: [
      aiImage(
        'realistic travel photography, snow mountain wide view with bright sky and travelers in foreground, premium social hero image',
        'landscape_16_9',
      ),
    ],
    location: '玉龙雪山观景台',
    likes: 33,
    comments: 9,
    createdAt: '06-17 17:52',
    scopes: ['route', 'all'],
    badge: '同线路',
    source: '大景分享',
    likedBy: ['王阿姨', '赵姐', '张导'],
    commentItems: [
      { name: '王阿姨', text: '这种单张大图特别适合转给家里人。' },
      { name: '张导', text: '这个角度确实是经典机位。' },
    ],
  },
  {
    id: 'rp7',
    author: { name: '彭姐', avatar: '彭' },
    text: '这条线路不只是景好，路上的小店和茶歇也很有意思，我放 3 张大家看看。',
    images: THREE_GRID_STORY,
    location: '大理古城周边',
    likes: 22,
    comments: 8,
    createdAt: '06-16 16:24',
    scopes: ['route', 'all'],
    badge: '同线路',
    source: '途中小景',
    likedBy: ['周阿姨', '何叔', '陈阿姨'],
    commentItems: [
      { name: '周阿姨', text: '第二张小点心看起来太诱人了。' },
      { name: '何叔', text: '这类生活感内容特别加分。' },
    ],
  },
  {
    id: 'rp8',
    author: { name: '秦阿姨', avatar: '秦' },
    text: '我把同线路最值得停留的 9 个细节位重新拼了一组，从景点到小街都顾到了。',
    images: NINE_GRID_GROUP,
    location: '大理 + 丽江细节图集',
    likes: 39,
    comments: 13,
    createdAt: '06-16 19:46',
    scopes: ['route', 'all'],
    badge: '同线路',
    source: '细节图集',
    likedBy: ['赵大姐', '王医生', '同行小助手', '小赵'],
    commentItems: [
      { name: '赵大姐', text: '这组图比只拍大景更有代入感。' },
      { name: '王医生', text: '节奏感和氛围感都很好。' },
      { name: '小赵', text: '这组我想直接收藏。' },
    ],
  },
  {
    id: 'rp9',
    author: { name: '陆叔', avatar: '陆' },
    text: '沿着这条线走，酒店、餐食和车程安排我最关心，所以又补 4 张参考图，给后来的朋友们做比较。',
    images: FOUR_GRID_STORY,
    location: '同线路食宿交通',
    likes: 25,
    comments: 10,
    createdAt: '06-15 21:06',
    scopes: ['route', 'all'],
    badge: '同线路',
    source: '食宿交通参考',
    likedBy: ['王阿姨', '周叔', '刘姐'],
    commentItems: [
      { name: '王阿姨', text: '这种比较图特别有帮助。' },
      { name: '刘姐', text: '安排一目了然。' },
    ],
  },
]

const PUBLIC_POSTS: FeedPost[] = [
  {
    id: 'ap1',
    author: { name: '同行编辑部', avatar: '行' },
    text: '本周云南线热度最高的打卡点是蓝月谷，建议上午拍人像、下午拍湖面倒影。',
    images: [
      aiImage(
        'realistic travel photography, Blue Moon Valley panoramic landscape, turquoise water and snow mountain backdrop, premium hero image',
        'landscape_16_9',
      ),
    ],
    location: '热门线路推荐',
    likes: 52,
    comments: 9,
    createdAt: '06-17 08:10',
    scopes: ['all'],
    badge: '平台精选',
    source: '目的地内容',
    likedBy: ['同行编辑部', '旅行研究员'],
    commentItems: [{ name: '小赵', text: '这篇攻略我已经转给本团阿姨们了。' }],
    routeCard: {
      title: '昆明 - 大理 - 丽江 7 天慢游',
      subtitle: '出行线路',
      meta: '轻松节奏 · 含接送站 · 适合中老年用户',
      cover: aiImage(
        'realistic travel photography, Yunnan Erhai lake and old town route banner, polished travel product card image',
        'landscape_16_9',
      ),
    },
  },
  {
    id: 'ap2',
    author: { name: '同行编辑部', avatar: '行' },
    text: '再补一组大理到丽江的精选风景九宫格，基本把这条线路最出片的点位都覆盖到了。',
    images: NINE_GRID_GROUP,
    location: '云南慢游线精选',
    likes: 61,
    comments: 14,
    createdAt: '06-16 18:36',
    scopes: ['all'],
    badge: '平台精选',
    source: '官方图集',
    likedBy: ['旅行研究员', '同行编辑部', '张导'],
    commentItems: [
      { name: '小周', text: '这组图发给爸妈，他们一下子就有出发欲望了。' },
      { name: '张导', text: '这条线的经典景都在这里了。' },
    ],
  },
  {
    id: 'ap3',
    author: { name: '同行编辑部', avatar: '行' },
    text: '这条线路的“最适合给家人报平安”的 3 张标准图，我们也整理了一版，方便直接参考。',
    images: THREE_GRID_STORY,
    location: '风采示例',
    likes: 29,
    comments: 11,
    createdAt: '06-15 18:18',
    scopes: ['all'],
    badge: '平台精选',
    source: '内容模板',
    likedBy: ['旅行研究员', '同行小助手', '李筱然'],
    commentItems: [
      { name: '旅行研究员', text: '这组模板很适合中老年用户直接套用。' },
      { name: '李筱然', text: '我们带团时就常建议家属看这种图。' },
    ],
  },
  {
    id: 'ap4',
    author: { name: '同行编辑部', avatar: '行' },
    text: '再补一张真正适合做封面的线路大图，适合在风采页里做当天推荐和热点内容。',
    images: [
      aiImage(
        'realistic travel photography, Yunnan lake and mountain panoramic sunset, polished premium social feed cover image',
        'landscape_16_9',
      ),
    ],
    location: '平台推荐封面',
    likes: 41,
    comments: 13,
    createdAt: '06-15 09:32',
    scopes: ['all'],
    badge: '平台精选',
    source: '官方推荐',
    likedBy: ['同行小助手', '张导', '王医生'],
    commentItems: [
      { name: '张导', text: '这种大图最适合做当天精选。' },
      { name: '王医生', text: '一眼看过去就很舒服。' },
      { name: '小赵', text: '封面感很强。' },
    ],
  },
]

const TODAY_POSTS: FeedPost[] = [
  {
    id: 'tp1',
    author: { name: '出行播报', avatar: '播' },
    text: '今天云南慢游线共有 6 个团在途，丽江古城晚间人流适中，适合散步和拍照。',
    images: [],
    location: '今日出行播报',
    likes: 21,
    comments: 8,
    createdAt: '06-17 17:30',
    scopes: ['today', 'all'],
    badge: '今日出行',
    source: '平台播报',
    likedBy: ['同行小助手', '王医生', '张导'],
    commentItems: [
      { name: '张导', text: '今晚四方街活动较多，建议大家结伴出行。' },
      { name: '王医生', text: '温差偏大，回酒店前记得加件外套。' },
    ],
  },
  {
    id: 'tp2',
    author: { name: '孙阿姨', avatar: '孙' },
    text: '今天一路都很顺，我挑了 3 张最有代表性的照片发一下，给没来的朋友们看看实时状态。',
    images: THREE_GRID_STORY,
    location: '玉龙雪山沿线',
    likes: 24,
    comments: 10,
    createdAt: '06-17 15:22',
    scopes: ['today', 'all'],
    badge: '今日出行',
    source: '实时分享',
    likedBy: ['李阿姨', '赵姐', '同行小助手'],
    commentItems: [
      { name: '李阿姨', text: '这组图一看就是今天拍的。' },
      { name: '赵姐', text: '云层和光线都很漂亮。' },
    ],
  },
  {
    id: 'tp3',
    author: { name: '王医生', avatar: '王' },
    text: '今日高原反应整体平稳，大家状态都不错。发一张现场大图，给家属朋友们报个平安。',
    images: [
      aiImage(
        'realistic travel photography, travel group resting at mountain viewpoint, calm safe atmosphere, premium wide social image',
        'landscape_16_9',
      ),
    ],
    location: '蓝月谷观景平台',
    likes: 31,
    comments: 12,
    createdAt: '06-17 16:48',
    scopes: ['today', 'all'],
    badge: '今日出行',
    source: '随团医生播报',
    likedBy: ['张导', '李筱然', '刘秀英'],
    commentItems: [
      { name: '张导', text: '谢谢王医生，大家今天节奏控制得很好。' },
      { name: '李筱然', text: '家属看到这张照片会更放心。' },
      { name: '刘秀英', text: '今天确实比想象中轻松。' },
      { name: '王阿姨', text: '看起来大家气色都很好。' },
      { name: '小赵', text: '这张大图很适合做当天总结。' },
      { name: '周叔', text: '山上风景真值了。' },
      { name: '赵姐', text: '谢谢一路照顾。' },
      { name: '同行小助手', text: '已同步到今日出行页。' },
      { name: '陈阿姨', text: '看着很安心。' },
      { name: '何叔', text: '这张角度真不错。' },
      { name: '李阿姨', text: '想转给家里人。' },
      { name: '王医生', text: '大家今晚早点休息。' },
    ],
    routeCard: {
      title: '玉龙雪山 + 蓝月谷安心慢游线',
      subtitle: '出行线路',
      meta: '随团医生服务 · 节奏舒缓 · 家属可放心',
      cover: aiImage(
        'realistic travel photography, Blue Moon Valley and snow mountain route banner, premium tour product image',
        'landscape_16_9',
      ),
    },
  },
  {
    id: 'tp4',
    author: { name: '小管家播报', avatar: '管' },
    text: '今天大理到丽江段整体很顺，沿路服务区停靠及时，大家补水和休息都比较充分。',
    images: [],
    location: '今日在途播报',
    likes: 17,
    comments: 7,
    createdAt: '06-17 14:36',
    scopes: ['today', 'all'],
    badge: '今日出行',
    source: '在途提醒',
    likedBy: ['李筱然', '张导'],
    commentItems: [
      { name: '李筱然', text: '今天整体节奏控制得比较舒适。' },
      { name: '张导', text: '后续集合时间我会继续提醒大家。' },
    ],
  },
  {
    id: 'tp5',
    author: { name: '邓阿姨', avatar: '邓' },
    text: '今天看到的路上风景很通透，我拼了 4 张实时图，给家里人看也很方便。',
    images: FOUR_GRID_STORY,
    location: '今日在途实拍',
    likes: 26,
    comments: 11,
    createdAt: '06-17 13:08',
    scopes: ['today', 'all'],
    badge: '今日出行',
    source: '在途分享',
    likedBy: ['王阿姨', '赵姐', '同行小助手'],
    commentItems: [
      { name: '王阿姨', text: '这组图很有“今天正在路上”的感觉。' },
      { name: '赵姐', text: '四张图信息量刚刚好。' },
      { name: '同行小助手', text: '已加入今日出行风采流。' },
    ],
    routeCard: {
      title: '大理环洱海休闲观景线',
      subtitle: '出行线路',
      meta: '车程舒适 · 停留点充足 · 拍照体验更好',
      cover: aiImage(
        'realistic travel photography, Erhai lake tour route banner with sightseeing bus and happy travelers, premium travel card',
        'landscape_16_9',
      ),
    },
  },
  {
    id: 'tp6',
    author: { name: '周叔', avatar: '周' },
    text: '今天我也凑个热闹，发 9 张在途小景，基本把一天里最有代表性的时刻都放进来了。',
    images: NINE_GRID_ROUTE,
    location: '今日沿途图集',
    likes: 35,
    comments: 14,
    createdAt: '06-17 20:16',
    scopes: ['today', 'all'],
    badge: '今日出行',
    source: '当天图集',
    likedBy: ['张叔', '李阿姨', '王医生', '同行小助手'],
    commentItems: [
      { name: '张叔', text: '这组图把今天一天都串起来了。' },
      { name: '李阿姨', text: '看完就像重新走了一遍。' },
      { name: '王医生', text: '状态都拍得很自然。' },
    ],
  },
]

function decorateUserPosts(
  posts: Post[],
  mode: 'during' | 'before' | 'idle',
): FeedPost[] {
  return posts.map((post, idx) => {
    if (mode === 'before') {
      return {
        ...post,
        scopes: ['group', 'all'] as FeedScope[],
        badge: '我的发布',
        source: '行前分享',
        interactive: true,
        likedBy: ['李筱然', '王阿姨'],
        commentItems: [{ name: '李筱然', text: '已收到，出发前的准备内容大家都能看到。' }],
      }
    }

    if (mode === 'idle') {
      return {
        ...post,
        scopes: ['today', 'all'],
        badge: '我的发布',
        source: '随时分享',
        interactive: true,
        likedBy: ['同行小助手'],
        commentItems: [{ name: '同行小助手', text: '没有订单时也可以先分享旅行回忆。' }],
      }
    }

    return {
      ...post,
      scopes: ['group', 'all'],
      badge: '本团动态',
      source: idx === 0 ? '同团旅伴' : '本团分享',
      interactive: true,
      likedBy:
        idx === 0
          ? ['李阿姨', '张导', '王医生']
          : ['刘秀英', '李筱然', '王医生', '小赵'],
      commentItems:
        idx === 0
          ? [
              { name: '张导', text: '大家下午集合前记得在大堂休息一下。' },
              { name: '李阿姨', text: '收到，我已经在喝水了。' },
            ]
          : [
              { name: '小赵', text: '这张合影我等会发高清原图到群里。' },
              { name: '王医生', text: '今天大家状态都很棒。' },
            ],
    }
  })
}

function getFeedPostsByStage(
  demoStage: ReturnType<typeof useAppStore.getState>['demoStage'],
  posts: Post[],
): FeedPost[] {
  const stage = demoStage === 'duringBatch' ? 'during' : demoStage
  if (stage === 'during') {
    return [...decorateUserPosts(posts, 'during'), ...ROUTE_POSTS, ...TODAY_POSTS, ...PUBLIC_POSTS].map(
      (post) => ({
        ...post,
        interactive: post.interactive ?? true,
      }),
    )
  }
  if (stage === 'before') {
    const beforeFeed = BEFORE_POSTS.map((post, idx) => ({
      ...post,
      scopes: ['group', 'all'] as FeedScope[],
      badge: idx === 0 ? '本团公告' : '行前交流',
      source: idx === 0 ? '出团提醒' : '团友准备',
      likedBy: idx === 0 ? ['张叔', '王阿姨', '刘叔'] : ['李筱然', '赵姐'],
      commentItems:
        idx === 0
          ? [{ name: '王阿姨', text: '收到，我已经把药和证件放进随身包了。' }]
          : [{ name: '赵姐', text: '我也打算带一件轻薄羽绒。' }],
    }))
    return [...decorateUserPosts(posts, 'before'), ...beforeFeed, ...BEFORE_ROUTE_POSTS, ...BEFORE_TODAY_POSTS]
  }
  const idleFeed = IDLE_POSTS.map((post) => ({
    ...post,
    scopes: ['today', 'all'] as FeedScope[],
    badge: '历史沉淀',
    source: '旅程档案',
    likedBy: ['同行小助手'],
    commentItems: [{ name: '系统提示', text: '下次有订单后会自动回到当前旅程动态流。' }],
  }))
  return [...decorateUserPosts(posts, 'idle'), ...ROUTE_POSTS, ...PUBLIC_POSTS, ...idleFeed]
}

function getRouteMetaTags(meta: string) {
  return meta
    .split(/\s*[·•]\s*/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 3)
}

export default function Community() {
  const demoStage = useAppStore((s) => s.demoStage)
  const stage = demoStage === 'duringBatch' ? 'during' : demoStage
  const posts = useAppStore((s) => s.posts)
  const addPost = useAppStore((s) => s.addPost)
  const toggleLike = useAppStore((s) => s.toggleLike)
  const setTabBarVisible = useAppStore((s) => s.setTabBarVisible)
  const activeFilter = useAppStore((s) => s.communityPreferredFilter)
  const setActiveFilter = useAppStore((s) => s.setCommunityPreferredFilter)
  const user = useAppStore((s) => s.user)
  const [composing, setComposing] = useState(false)
  const [forwarding, setForwarding] = useState<FeedPost | null>(null)
  const [receiverPreview, setReceiverPreview] = useState<{ who: string; post: FeedPost } | null>(null)
  const [sharedToast, setSharedToast] = useState<string | null>(null)
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({})
  const feedPosts = useMemo(() => getFeedPostsByStage(stage, posts), [stage, posts])
  const availableFilters = useMemo(
    () => (stage === 'idle' ? FILTERS.filter((item) => item.key === 'today' || item.key === 'all') : FILTERS),
    [stage],
  )

  useEffect(() => {
    const defaultFilter = stage === 'idle' ? 'today' : 'route'
    if (!availableFilters.some((item) => item.key === activeFilter)) {
      setActiveFilter(defaultFilter)
    }
  }, [activeFilter, availableFilters, stage])

  useEffect(() => {
    setTabBarVisible(!receiverPreview)
    return () => setTabBarVisible(true)
  }, [receiverPreview, setTabBarVisible])

  const filteredPosts = useMemo(
    () => feedPosts.filter((post) => post.scopes.includes(activeFilter)),
    [feedPosts, activeFilter],
  )
  const onForwardConfirm = (who: string) => {
    if (!forwarding) return
    setReceiverPreview({ who, post: forwarding })
    setForwarding(null)
  }

  return (
    <div className="page-enter relative h-full min-h-0 flex flex-col overflow-hidden">
      <MiniProgramBar title="风采" />
      <div className="flex-1 min-h-0 scroll-area no-scrollbar pb-[104px]">
        {/* 顶部筛选 */}
        <div className="sticky top-0 z-20 bg-rice px-4 pb-2 pt-3">
          <div className="rounded-[22px] border border-line/70 bg-[#FFF9EE] px-2 py-2 shadow-[0_8px_20px_rgba(80,50,30,0.08)]">
            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: `repeat(${availableFilters.length}, minmax(0, 1fr))` }}
            >
              {availableFilters.map((item) => {
                const active = activeFilter === item.key
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveFilter(item.key)}
                    className={`rounded-[16px] border px-2 py-3 transition whitespace-nowrap ${
                      active
                        ? 'border-cinnabar bg-cinnabar text-white shadow-[0_10px_18px_rgba(200,72,59,0.22)]'
                        : 'border-transparent bg-riceDeep/55 text-inkSoft'
                    }`}
                  >
                    <div className="flex items-center justify-center text-[15px] font-semibold leading-none">
                      <span>{item.label}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* 信息流 */}
        <ul className="mt-2 px-4">
          {filteredPosts.map((p) => (
            <li key={p.id} className="border-b border-line/55 py-4 last:border-b-0">
              <div className="flex items-start gap-3">
                <WechatAvatar name={p.author.name} size={44} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[20px] leading-tight text-ink font-semibold">{p.author.name}</span>
                        <span className="rounded-full bg-cinnabar/10 px-2 py-0.5 text-[12px] text-cinnabar">
                          {p.badge}
                        </span>
                      </div>
                      <div className="t-cap mt-1">{p.source}</div>
                    </div>
                    <span className="text-[13px] leading-none text-fog shrink-0 pt-1">{p.createdAt}</span>
                  </div>
                  {p.location && (
                    <div className="mt-1.5 flex items-center gap-1 text-[14px] leading-snug text-fog">
                      <MapPin size={12} /> {p.location}
                    </div>
                  )}
                  <p className="mt-2 text-[18px] leading-[1.8] text-ink whitespace-pre-wrap">{p.text}</p>

                  {p.images.length > 0 && (
                    <div
                      className={`mt-3 grid gap-1.5 ${gridClass(p.images.length)} ${
                        p.images.length === 1 ? 'max-w-full' : 'max-w-[92%]'
                      }`}
                    >
                      {p.images.map((src, i) => (
                        <div
                          key={i}
                          className={`overflow-hidden bg-riceDeep ${
                            p.images.length === 1 ? 'aspect-[4/3] rounded-2xl' : 'aspect-square rounded-xl'
                          }`}
                        >
                          <img
                            src={src}
                            alt=""
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {p.likedBy && p.likedBy.length > 0 && (
                    <div className="mt-3 rounded-2xl bg-riceDeep/60 px-3 py-2.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Heart size={14} className="mt-[3px] shrink-0 text-cinnabar" fill="#C8483B" />
                        <div className="flex -space-x-2">
                          {p.likedBy.slice(0, 6).map((name) => (
                            <WechatAvatar key={name} name={name} size={24} className="ring-2 ring-[#FFFBF1]" />
                          ))}
                        </div>
                        <span className="text-[15px] text-inkSoft">{p.likes} 人点赞</span>
                      </div>
                      {p.commentItems && p.commentItems.length > 0 && (
                        <div className="mt-2 border-t border-line/60 pt-2 space-y-2">
                          {getVisibleComments(p, expandedComments[p.id]).map((comment, idx) => (
                            <div key={`${comment.name}-${idx}`} className="text-[16px] leading-[1.75] text-inkSoft">
                              <span className="font-semibold text-ink">{comment.name}</span>：{comment.text}
                            </div>
                          ))}
                          {p.comments > 10 && (
                            <button
                              onClick={() =>
                                setExpandedComments((prev) => ({ ...prev, [p.id]: !prev[p.id] }))
                              }
                              className="inline-flex items-center gap-1 text-[15px] font-semibold text-cinnabar"
                            >
                              {expandedComments[p.id] ? (
                                <>
                                  收起评论 <ChevronUp size={15} />
                                </>
                              ) : (
                                <>
                                  展开全部 {p.comments} 条评论 <ChevronDown size={15} />
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {(activeFilter === 'today' || activeFilter === 'all') && p.routeCard && (
                    <button
                      className="group relative mt-3 block w-full overflow-hidden rounded-[22px] border border-[#E7D5B7] bg-[#FFFDF7] text-left shadow-[0_10px_22px_rgba(114,87,52,0.06)] active:scale-[0.99]"
                      type="button"
                    >
                      <div className="relative aspect-[16/8.4] overflow-hidden">
                        <img
                          src={p.routeCard.cover}
                          alt={p.routeCard.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-active:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                        <div className="absolute right-3 top-3 rounded-full bg-black/22 px-2.5 py-1 text-[12px] font-medium text-white backdrop-blur-sm">
                          同行甄选
                        </div>
                        <div className="absolute left-3 right-3 bottom-3">
                          <div className="text-[20px] font-semibold leading-[1.35] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.28)]">
                            {p.routeCard.title}
                          </div>
                        </div>
                      </div>

                      <div className="relative bg-[#FFFDF7] px-4 pb-3.5 pt-3">
                        <div className="flex flex-wrap gap-2">
                          {getRouteMetaTags(p.routeCard.meta).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-[#F7EEDF] px-2.5 py-1 text-[12px] font-medium leading-none text-[#7B6442]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="mt-3 text-[13px] leading-[1.6] text-inkSoft">
                          行程节奏舒缓，服务信息清楚，适合直接转给家人看看。
                        </div>
                      </div>
                    </button>
                  )}

                  <div className="mt-3 flex items-center justify-end gap-4 text-[14px] text-fog">
                    <button
                      onClick={() => stage === 'during' && p.interactive && toggleLike(p.id)}
                      className="flex items-center gap-1 active:scale-95"
                      aria-label="点赞"
                      disabled={stage !== 'during' || !p.interactive}
                    >
                      <Heart
                        size={17}
                        className={p.liked ? 'text-cinnabar' : 'text-fog'}
                        fill={p.liked ? '#C8483B' : 'transparent'}
                      />
                      <span className={p.liked ? 'text-cinnabar' : ''}>{p.likes}</span>
                    </button>
                    <button
                      className="flex items-center gap-1.5 rounded-full bg-riceDeep/70 px-2.5 py-1 text-[15px] font-medium text-inkSoft"
                      aria-label="回复"
                      disabled={stage !== 'during' || !p.interactive}
                    >
                      <span>回复</span>
                      <span>{p.comments}</span>
                    </button>
                    <button
                      onClick={() =>
                        stage === 'during' &&
                        p.interactive &&
                        setForwarding(p)
                      }
                      className="flex items-center gap-1.5 rounded-full border border-cinnabar/20 bg-cinnabar/8 px-2.5 py-1 text-cinnabar"
                      aria-label="转发"
                      disabled={stage !== 'during' || !p.interactive}
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cinnabar text-white">
                        <Share2 size={13} />
                      </span>
                      <span className="text-[13px] font-semibold">转发</span>
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => setComposing(true)}
        className="absolute bottom-[108px] right-4 z-30 h-14 w-14 rounded-full bg-cinnabar text-white shadow-[0_14px_28px_rgba(200,72,59,0.35)] flex items-center justify-center active:scale-95"
        aria-label="发布风采"
      >
        <div className="relative">
          <Camera size={22} />
          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-cinnabar">
            <Plus size={12} />
          </span>
        </div>
      </button>

      {/* 发布弹层 */}
      {composing && (
        <Compose
          user={user}
          onClose={() => setComposing(false)}
          onSubmit={(post) => {
            addPost(post)
            setComposing(false)
            setSharedToast('已发布到风采')
            setTimeout(() => setSharedToast(null), 1800)
          }}
        />
      )}

      {/* 转发弹层 */}
      {stage === 'during' && forwarding && (
        <ForwardSheet post={forwarding} onClose={() => setForwarding(null)} onConfirm={onForwardConfirm} />
      )}

      {/* 接收人预览 */}
      {receiverPreview && (
        <ReceiverPreview
          sender={user.name}
          who={receiverPreview.who}
          post={receiverPreview.post}
          onClose={() => setReceiverPreview(null)}
        />
      )}

      {/* 提示 */}
      {sharedToast && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-24 z-50 px-3 py-1.5 rounded-full bg-ink text-white text-[13px] animate-slideIn flex items-center gap-1">
          <Check size={14} /> {sharedToast}
        </div>
      )}
    </div>
  )
}

function gridClass(n: number) {
  if (n === 1) return 'grid-cols-1'
  if (n === 2 || n === 4) return 'grid-cols-2'
  if (n === 3 || n === 5 || n === 6) return 'grid-cols-3'
  return 'grid-cols-3'
}

function avatarPromptByName(name: string) {
  const mapping: Record<string, string> = {
    王医生: 'realistic square wechat avatar portrait, Chinese male doctor in his 40s, clean light background, friendly smile, premium profile photo',
    张导: 'realistic square wechat avatar portrait, Chinese male tour guide in his 40s, warm smile, outdoor light, premium profile photo',
    李筱然: 'realistic square wechat avatar portrait, Chinese young female travel butler, neat hair, friendly smile, clean background',
    刘秀英: 'realistic square wechat avatar portrait, Chinese middle aged woman traveler, natural smile, clean background, premium profile photo',
    小赵: 'realistic square wechat avatar portrait, Chinese young male traveler, casual style, friendly expression, clean background',
    赵大姐: 'realistic square wechat avatar portrait, Chinese middle aged woman traveler, elegant casual clothing, clean bright background',
    周阿姨: 'realistic square wechat avatar portrait, Chinese older woman traveler, gentle smile, clean bright background',
    何叔: 'realistic square wechat avatar portrait, Chinese older man traveler, calm expression, clean light background',
    陈阿姨: 'realistic square wechat avatar portrait, Chinese older woman traveler, warm smile, clean light background',
    王阿姨: 'realistic square wechat avatar portrait, Chinese older woman, friendly face, clean profile background',
    张叔: 'realistic square wechat avatar portrait, Chinese older man, friendly smile, clean background',
    刘叔: 'realistic square wechat avatar portrait, Chinese older man traveler, relaxed smile, clean background',
    赵姐: 'realistic square wechat avatar portrait, Chinese middle aged woman, soft light, clean background',
    周叔: 'realistic square wechat avatar portrait, Chinese older man, warm expression, clean background',
    孙师傅: 'realistic square wechat avatar portrait, Chinese male driver in his 40s, simple shirt, clean background',
    同行编辑部: 'realistic square wechat avatar illustration, travel brand mascot portrait, clean background, polished profile image',
    同行小助手: 'realistic square wechat avatar illustration, helpful travel assistant mascot, soft warm palette, clean background',
    default: 'realistic square wechat avatar portrait, Chinese traveler, friendly smile, clean background, premium profile photo',
  }

  return mapping[name] || mapping.default
}

function avatarSrcByName(name: string) {
  return aiImage(avatarPromptByName(name), 'square_hd')
}

function WechatAvatar({
  name,
  size,
  className = '',
}: {
  name: string
  size: number
  className?: string
}) {
  return (
    <img
      src={avatarSrcByName(name)}
      alt={name}
      width={size}
      height={size}
      className={`shrink-0 rounded-[12px] object-cover border border-line/60 bg-riceDeep ${className}`}
    />
  )
}

function getVisibleComments(post: FeedPost, expanded: boolean | undefined) {
  const items = post.commentItems || []
  if (post.comments > 10 && !expanded) return items.slice(0, 3)
  return items
}

function Compose({
  user,
  onClose,
  onSubmit,
}: {
  user: { name: string; avatar: string }
  onClose: () => void
  onSubmit: (p: ReturnType<typeof makePost>) => void
}) {
  const [text, setText] = useState('')
  const [picked, setPicked] = useState<string[]>([])
  const [loc, setLoc] = useState('丽江古城')

  const togglePick = (src: string) => {
    setPicked((arr) => (arr.includes(src) ? arr.filter((x) => x !== src) : [...arr, src].slice(0, 9)))
  }

  const submit = () => {
    if (!text.trim() && picked.length === 0) return
    onSubmit(
      makePost({
        id: 'p-' + Date.now(),
        author: { name: user.name, avatar: user.avatar },
        text: text.trim() || '(图片分享)',
        images: picked,
        location: loc,
        likes: 0,
        comments: 0,
        createdAt: nowText(),
      }),
    )
  }

  return (
    <div className="absolute inset-0 z-40 bg-rice flex min-h-0 flex-col animate-slideIn">
      <div className="px-4 pt-1 flex items-center justify-between h-12 border-b border-line/60">
        <button onClick={onClose} className="t-body text-inkSoft flex items-center gap-0.5">
          <ChevronLeft size={18} /> 取消
        </button>
        <div className="font-song t-title text-ink font-bold">发布动态</div>
        <button
          onClick={submit}
          className="btn-primary px-3.5 h-8 text-[14px] flex items-center gap-0.5"
        >
          <Send size={14} /> 发布
        </button>
      </div>

      <div className="flex-1 min-h-0 scroll-area no-scrollbar pb-6">
        <div className="px-4 pt-3">
          <div className="mb-3 flex items-center gap-3">
            <WechatAvatar name={user.name} size={44} />
            <div className="min-w-0">
              <div className="text-[18px] font-semibold text-ink">{user.name}</div>
              <div className="t-cap mt-0.5">发布到风采墙</div>
            </div>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="说点什么…记录下今天的美好"
            className="w-full p-3 rounded-xl border border-line bg-riceDeep/30 text-ink t-body focus:outline-none focus:border-cinnabar resize-none"
            rows={4}
          />
          <div className="mt-2 t-cap flex items-center gap-1">
            <MapPin size={12} />
            <input
              value={loc}
              onChange={(e) => setLoc(e.target.value)}
              className="flex-1 bg-transparent focus:outline-none"
            />
          </div>
        </div>

        <div className="px-4 mt-3">
          <div className="t-cap mb-1.5">从相册选择（最多 9 张）</div>
          <div className="grid grid-cols-3 gap-1.5">
            {MOCK_PHOTOS.map((src) => {
              const active = picked.includes(src)
              return (
                <button
                  key={src}
                  onClick={() => togglePick(src)}
                  className="relative aspect-square rounded-lg overflow-hidden bg-riceDeep"
                >
                  <img src={src} className="w-full h-full object-cover" alt="" />
                  {active && (
                    <div className="absolute inset-0 bg-cinnabar/30 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-cinnabar text-white flex items-center justify-center text-[12px] font-bold">
                        {picked.indexOf(src) + 1}
                      </div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="px-4 mt-3">
          <div className="paper-card p-3 flex items-center justify-between">
            <span className="t-body text-ink">谁可以看</span>
            <span className="t-cap">同团旅伴 · 公开</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ForwardSheet({
  post,
  onClose,
  onConfirm,
}: {
  post: FeedPost
  onClose: () => void
  onConfirm: (who: string) => void
}) {
  const friends = ['闺女小敏', '老伴', '邻居老李', '社区张大姐', '儿子小军', '广场舞王姐']
  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end animate-slideIn">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="relative bg-rice rounded-t-3xl p-4 pb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="font-song t-title text-ink font-bold">转发给朋友 / 群</div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-riceDeep/60 flex items-center justify-center">
            <X size={14} />
          </button>
        </div>
        <div className="rounded-2xl border border-line/70 bg-[#FFF8EC] px-3 py-2.5">
          <div className="text-[13px] font-semibold text-cinnabar">即将转发的内容</div>
          <div className="mt-1 text-[15px] leading-[1.6] text-ink line-clamp-2">{post.text}</div>
          <div className="mt-1 text-[12px] text-inkSoft">
            {post.images.length > 0 ? `${post.images.length} 张图片` : '文字动态'}
            {post.routeCard ? ' · 含出行线路入口' : ''}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3 mt-2">
          {friends.map((f) => (
            <button
              key={f}
              onClick={() => onConfirm(f)}
              className="flex flex-col items-center gap-1 active:scale-95"
            >
              <WechatAvatar name={f} size={48} />
              <span className="t-cap text-ink">{f}</span>
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 t-cap text-inkSoft">
          <Share2 size={14} /> 模拟微信一键分享 · 实际数据会发到聊天
        </div>
      </div>
    </div>
  )
}

function ReceiverPreview({
  sender,
  who,
  post,
  onClose,
}: {
  sender: string
  who: string
  post: FeedPost
  onClose: () => void
}) {
  const [postOpened, setPostOpened] = useState(false)
  const [routeOpened, setRouteOpened] = useState(false)
  const [receiverLiked, setReceiverLiked] = useState(false)
  const [receiverCommented, setReceiverCommented] = useState(false)
  const [receiverToast, setReceiverToast] = useState<string | null>(null)
  const previewImage = post.images[0] || post.routeCard?.cover
  const routeTags = post.routeCard ? getRouteMetaTags(post.routeCard.meta) : []
  const receiverReply =
    post.routeCard
      ? '这条线路不错，我也想转给家里人看看。'
      : post.images.length > 0
        ? '照片拍得真好，我刚点开看完。'
        : '我收到了，晚点再仔细看看。'
  const routeMoments = [
    {
      time: '09:30',
      title: '雪山观景',
      detail: '车程和步行都偏舒缓，适合边走边看。',
    },
    {
      time: '13:40',
      title: '蓝月谷停留',
      detail: '主打拍照和休息，不赶场，家属也容易看懂线路价值。',
    },
    {
      time: '19:00',
      title: '酒店入住',
      detail: '当晚节奏收得早，方便中老年用户恢复体力。',
    },
  ]
  const serviceItems = [
    '随团医生与小管家双重陪同',
    '车程舒缓，停留点更充足',
    '适合直接转发给家人做安心参考',
  ]
  const receiverLikedBy = post.likedBy?.length ? post.likedBy : [sender, '同行小助手', who]
  const receiverComments =
    post.commentItems && post.commentItems.length > 0
      ? post.commentItems
      : [
          { name: sender, text: '我刚转给你，你先看看这条风采。' },
          { name: who, text: '这个页面清楚多了，我能看懂。' },
        ]
  const commentPreview = receiverCommented
    ? [...receiverComments, { name: who, text: '这组照片真不错，我也想转给家里人看看。' }]
    : receiverComments
  const likeCount = post.likes + (receiverLiked ? 1 : 0)
  const likedByPreview = receiverLiked ? [who, ...receiverLikedBy] : receiverLikedBy

  const showReceiverToast = (text: string) => {
    setReceiverToast(text)
    window.setTimeout(() => setReceiverToast(null), 1600)
  }

  return (
    <div className="absolute inset-0 z-50 bg-[#EDE5D8] flex min-h-0 flex-col animate-slideIn">
      <div className="px-4 pt-1 flex items-center justify-between h-12 border-b border-[#D6CAB1] bg-[#F7F1E5]">
        <button onClick={onClose} className="t-body text-inkSoft flex items-center gap-0.5">
          <ChevronLeft size={18} /> 返回
        </button>
        <div className="min-w-0 text-center">
          <div className="text-[18px] font-semibold text-ink">{who}</div>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-full bg-riceDeep/60 flex items-center justify-center">
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 min-h-0 scroll-area no-scrollbar px-3 py-3">
        <div className="flex justify-end">
          <div className="max-w-[82%] rounded-[18px] rounded-tr-md bg-[#95EC69] px-3 py-2.5 text-[15px] leading-[1.65] text-ink shadow-sm">
            {who}，给你看看我们今天的风采。
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2.5">
          <WechatAvatar name={who} size={38} />
          <div className="max-w-[84%] min-w-0">
            <div className="rounded-[20px] rounded-tl-md bg-white p-3 shadow-[0_8px_18px_rgba(80,50,30,0.06)]">
              <div className="rounded-[18px] border border-[#EEE2CC] bg-[#FFFCF6] p-3">
                <button type="button" onClick={() => setPostOpened(true)} className="block w-full text-left">
                  <div className="flex items-start gap-2.5">
                    <WechatAvatar name={post.author.name} size={34} />
                    <div className="min-w-0 flex-1">
                      <div className="text-[15px] font-semibold text-ink">{post.author.name}</div>
                      <div className="mt-1 text-[15px] leading-[1.65] text-ink line-clamp-3">{post.text}</div>
                    </div>
                  </div>

                  {previewImage && (
                    <div className="mt-3 overflow-hidden rounded-[16px] bg-riceDeep">
                      <img src={previewImage} alt="" className="h-[136px] w-full object-cover" loading="lazy" />
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="text-[12px] text-fog">
                      {post.location || '旅途风采'}
                      {post.images.length > 0 ? ` · ${post.images.length} 张图` : ''}
                    </div>
                    <div className="text-[12px] text-fog">{post.createdAt}</div>
                  </div>
                </button>

                {post.routeCard && (
                  <button
                    type="button"
                    onClick={() => setRouteOpened(true)}
                    className="mt-3 block w-full rounded-[18px] border border-[#E6D7BC] bg-white p-2.5 text-left active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-riceDeep">
                        <img
                          src={post.routeCard.cover}
                          alt={post.routeCard.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[14px] font-semibold leading-snug text-ink line-clamp-2">
                          {post.routeCard.title}
                        </div>
                        <div className="mt-1 text-[12px] leading-snug text-inkSoft line-clamp-2">
                          {post.routeCard.meta}
                        </div>
                      </div>
                    </div>
                  </button>
                )}
              </div>
            </div>

            <div className="mt-3 rounded-[18px] rounded-tl-md bg-white px-3 py-2.5 text-[15px] leading-[1.65] text-ink shadow-sm">
              {receiverReply}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#D6CAB1] bg-[#F7F1E5] px-3 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex-1 rounded-full bg-white px-4 py-2.5 text-[14px] text-fog">回复 {sender}...</div>
          <div className="rounded-full bg-[#95EC69] px-3 py-2 text-[14px] font-semibold text-ink">发送</div>
        </div>
      </div>

      {postOpened && (
        <div className="absolute inset-0 z-[55] flex min-h-0 flex-col bg-rice animate-slideIn">
          <div className="flex h-12 items-center justify-between border-b border-line/70 bg-[#FBF7EE] px-4">
            <button
              type="button"
              onClick={() => setPostOpened(false)}
              className="flex items-center gap-0.5 text-[15px] text-inkSoft"
            >
              <ChevronLeft size={18} /> 返回
            </button>
            <div className="min-w-0 text-center">
              <div className="text-[18px] font-semibold text-ink">风采详情</div>
            </div>
            <button
              type="button"
              onClick={() => setPostOpened(false)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-riceDeep/60"
            >
              <X size={14} />
            </button>
          </div>

          <div className="flex-1 min-h-0 scroll-area no-scrollbar pb-28">
            <div className="px-4 pt-4">
              <div className="rounded-[26px] border border-line/70 bg-white p-4 shadow-[0_12px_30px_rgba(80,50,30,0.06)]">
                <div className="flex items-start gap-3">
                  <WechatAvatar name={post.author.name} size={46} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[20px] font-semibold text-ink">{post.author.name}</span>
                          <span className="rounded-full bg-cinnabar/10 px-2 py-0.5 text-[12px] text-cinnabar">
                            {post.badge}
                          </span>
                        </div>
                        <div className="mt-1 text-[13px] text-fog">{post.source}</div>
                      </div>
                      <div className="shrink-0 text-[12px] text-fog">{post.createdAt}</div>
                    </div>
                    {post.location && (
                      <div className="mt-2 flex items-center gap-1 text-[14px] text-fog">
                        <MapPin size={12} /> {post.location}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 text-[18px] leading-[1.85] text-ink">{post.text}</div>

                {post.images.length > 0 && (
                  <div
                    className={`mt-4 grid gap-1.5 ${gridClass(post.images.length)} ${
                      post.images.length === 1 ? 'max-w-full' : 'max-w-[92%]'
                    }`}
                  >
                    {post.images.map((src, index) => (
                      <div
                        key={`${src}-${index}`}
                        className={`overflow-hidden bg-riceDeep ${
                          post.images.length === 1 ? 'aspect-[4/3] rounded-[20px]' : 'aspect-square rounded-2xl'
                        }`}
                      >
                        <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                      </div>
                    ))}
                  </div>
                )}

                {post.routeCard && (
                  <button
                    type="button"
                    onClick={() => setRouteOpened(true)}
                    className="mt-4 block w-full rounded-[22px] border border-[#E7D5B7] bg-[#FFFDF7] p-3 text-left shadow-[0_10px_22px_rgba(114,87,52,0.06)] active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-20 w-28 shrink-0 overflow-hidden rounded-2xl bg-riceDeep">
                        <img
                          src={post.routeCard.cover}
                          alt={post.routeCard.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[17px] font-semibold leading-[1.45] text-ink">
                          {post.routeCard.title}
                        </div>
                        <div className="mt-1 text-[13px] leading-[1.6] text-inkSoft">{post.routeCard.meta}</div>
                      </div>
                    </div>
                  </button>
                )}

                <div className="mt-4 flex items-center justify-between border-y border-line/60 py-3">
                  <button
                    type="button"
                    onClick={() => setReceiverLiked((value) => !value)}
                    className="flex flex-1 items-center justify-center gap-1.5 text-[15px] font-medium text-inkSoft active:scale-95"
                  >
                    <Heart
                      size={17}
                      className={receiverLiked ? 'text-cinnabar' : 'text-fog'}
                      fill={receiverLiked ? '#C8483B' : 'transparent'}
                    />
                    <span className={receiverLiked ? 'text-cinnabar' : ''}>点赞</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setReceiverCommented(true)}
                    className="flex flex-1 items-center justify-center gap-1.5 text-[15px] font-medium text-inkSoft active:scale-95"
                  >
                    <span>评论</span>
                    <span>{commentPreview.length}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => showReceiverToast('已转发到家人群')}
                    className="flex flex-1 items-center justify-center gap-1.5 text-[15px] font-medium text-cinnabar active:scale-95"
                  >
                    <Share2 size={15} />
                    <span>转发</span>
                  </button>
                </div>

                <div className="mt-4 rounded-2xl bg-[#FFF8EC] px-3 py-3">
                  <div className="flex items-center gap-2">
                    <Heart size={14} className="shrink-0 text-cinnabar" fill="#C8483B" />
                    <div className="flex -space-x-2">
                      {likedByPreview.slice(0, 5).map((name) => (
                        <WechatAvatar key={name} name={name} size={24} className="ring-2 ring-[#FFF8EC]" />
                      ))}
                    </div>
                    <div className="text-[15px] text-inkSoft">{likeCount} 人点赞</div>
                  </div>
                  <div className="mt-3 space-y-2 border-t border-line/60 pt-3">
                    {commentPreview.slice(0, 5).map((comment, index) => (
                      <div key={`${comment.name}-${index}`} className="text-[15px] leading-[1.7] text-inkSoft">
                        <span className="font-semibold text-ink">{comment.name}</span>：{comment.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {routeOpened && post.routeCard && (
        <div className="absolute inset-0 z-[60] flex min-h-0 flex-col bg-[#F7F1E5] animate-slideIn">
          <div className="flex h-12 items-center justify-between border-b border-[#DCCDB2] bg-[#FBF6EC] px-4">
            <button
              type="button"
              onClick={() => setRouteOpened(false)}
              className="flex items-center gap-0.5 text-[15px] text-inkSoft"
            >
              <ChevronLeft size={18} /> 返回
            </button>
            <div className="min-w-0 text-center">
              <div className="text-[18px] font-semibold text-ink">出行线路</div>
            </div>
            <button
              type="button"
              onClick={() => setRouteOpened(false)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-riceDeep/60"
            >
              <X size={14} />
            </button>
          </div>

          <div className="flex-1 min-h-0 scroll-area no-scrollbar pb-28">
            <div className="relative aspect-[16/11] overflow-hidden">
              <img
                src={post.routeCard.cover}
                alt={post.routeCard.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
              <div className="absolute left-4 right-4 bottom-4">
                <div className="text-[24px] font-semibold leading-[1.3] text-white">
                  {post.routeCard.title}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {routeTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/20 bg-black/20 px-2.5 py-1 text-[12px] text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3 px-4 pt-4">
              <div className="rounded-[22px] border border-[#E5D7BC] bg-white p-4 shadow-[0_10px_24px_rgba(80,50,30,0.05)]">
                <div className="text-[18px] font-semibold text-ink">线路亮点</div>
                <div className="mt-2 text-[15px] leading-[1.75] text-inkSoft">
                  雪山、蓝月谷和轻徒步结合，整体节奏舒缓，适合中老年用户边走边看，不用赶场。
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="rounded-2xl bg-[#FFF7EA] px-3 py-2">
                    <div className="text-[12px] text-fog">适合人群</div>
                    <div className="mt-1 text-[15px] font-semibold text-ink">中老年慢游</div>
                  </div>
                  <div className="rounded-2xl bg-[#FFF7EA] px-3 py-2">
                    <div className="text-[12px] text-fog">浏览重点</div>
                    <div className="mt-1 text-[15px] font-semibold text-ink">安心省心</div>
                  </div>
                  <div className="rounded-2xl bg-[#FFF7EA] px-3 py-2">
                    <div className="text-[12px] text-fog">服务保障</div>
                    <div className="mt-1 text-[15px] font-semibold text-ink">随团陪同</div>
                  </div>
                </div>
              </div>

              <div className="rounded-[22px] border border-[#E5D7BC] bg-white p-4 shadow-[0_10px_24px_rgba(80,50,30,0.05)]">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-[18px] font-semibold text-ink">线路总览</div>
                  <div className="text-[13px] text-fog">{post.location || '云南慢游线'}</div>
                </div>
                <div className="mt-2 text-[15px] leading-[1.75] text-inkSoft">
                  主打风景好、节奏稳、停留时间更充足，适合想看景、想拍照、又不想太累的出行人群。
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {serviceItems.map((item) => (
                    <div
                      key={item}
                      className="inline-flex rounded-full border border-[#EAD9BB] bg-[#FFFAF1] px-3 py-1.5 text-[13px] text-inkSoft"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[22px] border border-[#E5D7BC] bg-white p-4 shadow-[0_10px_24px_rgba(80,50,30,0.05)]">
                <div className="text-[18px] font-semibold text-ink">当天节奏</div>
                <div className="mt-3 space-y-3">
                  {routeMoments.map((item) => (
                    <div key={item.time} className="flex gap-3">
                      <div className="w-14 shrink-0 text-[14px] font-semibold text-cinnabar">{item.time}</div>
                      <div className="min-w-0 flex-1 rounded-2xl bg-[#FFF8EC] px-3 py-2.5">
                        <div className="text-[15px] font-semibold text-ink">{item.title}</div>
                        <div className="mt-1 text-[14px] leading-[1.7] text-inkSoft">{item.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[22px] border border-[#E5D7BC] bg-white p-4 shadow-[0_10px_24px_rgba(80,50,30,0.05)]">
                <div className="text-[18px] font-semibold text-ink">家属最关心的点</div>
                <div className="mt-3 space-y-2">
                  <div className="rounded-2xl bg-[#F7F1E5] px-3 py-2.5 text-[15px] leading-[1.7] text-inkSoft">
                    服务安排：随团医生、小管家和导游全程陪同，更安心。
                  </div>
                  <div className="rounded-2xl bg-[#F7F1E5] px-3 py-2.5 text-[15px] leading-[1.7] text-inkSoft">
                    节奏感受：车程不赶，停留时间更宽松，体力负担较轻。
                  </div>
                  <div className="rounded-2xl bg-[#F7F1E5] px-3 py-2.5 text-[15px] leading-[1.7] text-inkSoft">
                    家属关注：线路、节奏和服务信息都能一眼看明白。
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#DCCDB2] bg-[#FBF6EC] px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex-1 rounded-full border border-[#E4D4B6] bg-white px-4 py-3 text-[15px] font-semibold text-ink"
              >
                查看完整行程
              </button>
              <button
                type="button"
                className="flex-1 rounded-full bg-cinnabar px-4 py-3 text-[15px] font-semibold text-white shadow-[0_10px_20px_rgba(200,72,59,0.2)]"
              >
                咨询小管家
              </button>
            </div>
          </div>
        </div>
      )}

      {receiverToast && (
        <div className="absolute bottom-20 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-ink px-3 py-1.5 text-[13px] text-white shadow-lg">
          {receiverToast}
        </div>
      )}
    </div>
  )
}

function makePost(p: {
  id: string
  author: { name: string; avatar: string }
  text: string
  images: string[]
  location: string
  likes: number
  comments: number
  createdAt: string
}) {
  return p
}

function nowText() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}
