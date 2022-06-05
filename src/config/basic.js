// 影视分类
export const categories = ['电影', '电视剧', '动漫', '纪录片', '综艺']

// 影人相册类型
export const actorPhotoTypes = [
  {
    label: "写真",
    value: "portrait"
  },
  {
    label: "生活照",
    value: "life"
  }, 
  {
    label: "活动照",
    value: "activity"
  }, 
  {
    label: "截图",
    value: "cut"
  },
  {
    label: "其它",
    value: "other"
  },
]

// 角色相册类型
export const rolePhotoTypes = [
  {
    label: "海报",
    value: "poster"
  },
  {
    label: "截图",
    value: "cut"
  },
  {
    label: "其它",
    value: "other"
  },
]


// 影视相册类型
export const moviePhotoTypes = [
  {
    value: "poster",
    label: "海报",
    children: [
      {
        value: "offical",
        label: "正式海报",
      },
      {
        value: "preview",
        label: "预告海报",
      },
      {
        value: "role",
        label: "角色海报",
      },
      {
        value: "other",
        label: "其它海报",
      },
    ],
  },
  {
    value: "still",
    label: "剧照",
    children: [
      {
        value: "offical",
        label: "官方剧照",
      },
      {
        value: "cut",
        label: "截图",
      },
      {
        value: "work",
        label: "工作照",
      },
      {
        value: "other",
        label: "其它",
      },
    ],
  },
  {
    value: "wallpaper",
    label: "壁纸",
  }
]

// 视频类型
export const videoTypes = [
  {
    label: "预告片",
    value: "trailer",
  },
  {
    label: "花絮",
    value: "blooper",
  },
  {
    label: "片段",
    value: "section",
  },
  {
    label: "剪辑",
    value: "clip",
  },
  {
    label: "其它",
    value: "other",
  },
]