// 社区动态 Mock 数据
import type { Post } from '../types'

export const initialPosts: Post[] = [
  {
    id: 'p1',
    author: { name: '王医生', avatar: 'W' },
    text: '叔叔阿姨们今天状态都很好，下午茶时间大家记得多喝水，云南海拔高容易口干。',
    images: [],
    location: '丽江古城 · 客栈大堂',
    likes: 8,
    comments: 3,
    createdAt: '2026-06-15 16:20',
  },
  {
    id: 'p2',
    author: { name: '刘秀英', avatar: 'L' },
    text: '今天在玉龙雪山上合影啦！4506 米我居然爬上来了，张导一路搀着我，必须点赞！',
    images: [],
    location: '玉龙雪山 · 4506 米观景台',
    likes: 23,
    comments: 7,
    createdAt: '2026-06-17 11:45',
  },
  {
    id: 'p3',
    author: { name: '小赵', avatar: 'X' },
    text: '明天的蓝月谷真的太美了，我帮李阿姨她们拍了一组照片，回头发给大家～',
    images: [],
    location: '玉龙雪山 · 蓝月谷',
    likes: 14,
    comments: 4,
    createdAt: '2026-06-17 14:10',
  },
  {
    id: 'p4',
    author: { name: '李筱然', avatar: 'L' },
    text: '今晚 8 点四方街有纳西古乐表演，感兴趣的叔叔阿姨我帮大家占位子～',
    images: [],
    location: '丽江古城 · 四方街',
    likes: 11,
    comments: 2,
    createdAt: '2026-06-17 18:00',
  },
]
