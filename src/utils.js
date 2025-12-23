import {
  Sword,
  Utensils,
  ShoppingBag,
  MapPin,
  Save,
  Footprints,
  Train,
  Bus,
  Car,
  Bike,
} from 'lucide-react';

// ==========================================
// 1. 座標資料庫 (Location Database)
// ==========================================
export const LOCATION_DB = {
  // === 🏨 你的住宿 ===
  奈良飯店: [34.6813, 135.8175],
  Daiwa: [34.6813, 135.8175],
  Roynet: [34.6813, 135.8175],
  京都飯店: [34.9957, 135.7593],
  Vessel: [34.9957, 135.7593],
  五條飯店: [34.9957, 135.7593],
  Campana: [34.9957, 135.7593],

  // === ✈️ 機場與主要轉運站 ===
  桃園機場: [25.0797, 121.2342],
  TPE: [25.0797, 121.2342],
  關西機場: [34.432, 135.2304],
  KIX: [34.432, 135.2304],
  京都車站: [34.9858, 135.7588],
  京都駅: [34.9858, 135.7588],
  大阪車站: [34.7024, 135.4959],
  梅田站: [34.7024, 135.4959],
  新大阪: [34.7335, 135.5003],
  新幹線: [34.7335, 135.5003],

  // === 🚆 常用交通站點 ===
  JR奈良: [34.6808, 135.8189],
  近鐵奈良: [34.6851, 135.8208],
  五條站: [34.9959, 135.7596],
  地鐵五條: [34.9959, 135.7596],
  四條站: [35.0035, 135.7594],
  烏丸: [35.0035, 135.7594],
  河原町: [35.0039, 135.7692],
  阪急河原町: [35.0039, 135.7692],
  祇園四條: [35.0037, 135.772],
  京阪電車: [35.0037, 135.772],
  出町柳: [35.0298, 135.7738],

  // === 🛒 採購與補給 ===
  奈良超市: [34.6805, 135.819],
  LIFE超市: [34.6805, 135.819],
  奈良商店街: [34.683, 135.82],
  東向商店街: [34.683, 135.82],
  京都唐吉訶德: [34.9845, 135.759],
  Donki: [34.9845, 135.759],
  友都八喜: [34.9875, 135.7595],
  Yodobashi: [34.9875, 135.7595],
  Fresco超市: [34.996, 135.7585],
  大國藥妝: [35.0037, 135.7685],
  道頓堀唐吉訶德: [34.6687, 135.5013],
  心齋橋Uniqlo: [34.6738, 135.5011],

  // === ⛩️ 熱門景點 ===
  清水寺: [34.9949, 135.785],
  二年坂: [34.9984, 135.7816],
  三年坂: [34.9965, 135.782],
  八坂神社: [35.0037, 135.7786],
  花見小路: [35.0016, 135.7752],
  伏見稻荷: [34.9671, 135.7726],
  宇治: [34.8892, 135.8076],
  中村藤吉: [34.8894, 135.8016],
  嵐山: [35.0094, 135.6668],
  竹林小徑: [35.0172, 135.6713],
  小火車: [35.0177, 135.6622],
  金閣寺: [35.0394, 135.7292],
  錦市場: [35.005, 135.7632],
  二條城: [35.0142, 135.7482],
  鴨川: [35.0068, 135.7715],
  跳烏龜: [35.0298, 135.7738],
  奈良公園: [34.685, 135.843],
  東大寺: [34.689, 135.8398],
  春日大社: [34.6812, 135.8484],
  志津香釜飯: [34.6854, 135.8361],
  中谷堂: [34.6821, 135.8285],
  大阪城: [34.6873, 135.5262],
  環球影城: [34.6654, 135.4323],
  任天堂: [34.6654, 135.4323],
  心齋橋: [34.6713, 135.5015],
  道頓堀: [34.6687, 135.5013],
  黑門市場: [34.6653, 135.5073],
  難波八阪神社: [34.6631, 135.4965],
  通天閣: [34.6525, 135.5063],
  海遊館: [34.6545, 135.4289],
  阿倍野: [34.6462, 135.5133],
  臨空城: [34.4113, 135.2931],
};

// ==========================================
// 2. 導購連結地圖 (SUPPLY_MAP)
// ==========================================
export const SUPPLY_MAP = {
  // === 住宿 (關鍵字擴充) ===
  stay: {
    label: '預訂據點',
    icon: '🏨',
    link: 'https://www.agoda.com/',
    color: 'bg-blue-600',
    reward: '50 EXP',
  },
  hotel: {
    label: '預訂據點',
    icon: '🏨',
    link: 'https://www.agoda.com/',
    color: 'bg-blue-600',
    reward: '50 EXP',
  },
  inn: {
    label: '預訂據點',
    icon: '🏨',
    link: 'https://www.agoda.com/',
    color: 'bg-blue-600',
    reward: '50 EXP',
  },
  住: {
    label: '預訂據點',
    icon: '🏨',
    link: 'https://www.agoda.com/',
    color: 'bg-blue-600',
    reward: '50 EXP',
  },
  宿: {
    label: '預訂據點',
    icon: '🏨',
    link: 'https://www.agoda.com/',
    color: 'bg-blue-600',
    reward: '50 EXP',
  },
  飯店: {
    label: '預訂據點',
    icon: '🏨',
    link: 'https://www.agoda.com/',
    color: 'bg-blue-600',
    reward: '50 EXP',
  },
  民宿: {
    label: '預訂據點',
    icon: '🏨',
    link: 'https://www.agoda.com/',
    color: 'bg-blue-600',
    reward: '50 EXP',
  },
  旅店: {
    label: '預訂據點',
    icon: '🏨',
    link: 'https://www.agoda.com/',
    color: 'bg-blue-600',
    reward: '50 EXP',
  },

  // === 美食 (關鍵字擴充) ===
  食: {
    label: '預約饗宴',
    icon: '🍖',
    link: 'https://www.klook.com/food/',
    color: 'bg-red-500',
    reward: '25 EXP',
  },
  餐: {
    label: '預約饗宴',
    icon: '🍖',
    link: 'https://www.klook.com/food/',
    color: 'bg-red-500',
    reward: '25 EXP',
  },
  飯: {
    label: '預約饗宴',
    icon: '🍖',
    link: 'https://www.klook.com/food/',
    color: 'bg-red-500',
    reward: '25 EXP',
  },
  牛排: {
    label: '補充體力',
    icon: '🥩',
    link: 'https://www.klook.com/food/',
    color: 'bg-red-600',
    reward: '30 EXP',
  },
  壽司: {
    label: '品嚐海味',
    icon: '🍣',
    link: 'https://www.klook.com/food/',
    color: 'bg-red-500',
    reward: '30 EXP',
  },
  拉麵: {
    label: '補充熱量',
    icon: '🍜',
    link: 'https://www.klook.com/food/',
    color: 'bg-red-500',
    reward: '25 EXP',
  },
  燒肉: {
    label: '大快朵頤',
    icon: '🍖',
    link: 'https://www.klook.com/food/',
    color: 'bg-red-600',
    reward: '35 EXP',
  },
  咖啡: {
    label: '恢復魔力',
    icon: '☕',
    link: 'https://www.klook.com/food/',
    color: 'bg-amber-700',
    reward: '10 EXP',
  },
  甜點: {
    label: '恢復魔力',
    icon: '🍰',
    link: 'https://www.klook.com/food/',
    color: 'bg-pink-500',
    reward: '15 EXP',
  },

  // === 票券/樂園 ===
  門票: {
    label: '獲取通行證',
    icon: '🎟️',
    link: 'https://www.klook.com/',
    color: 'bg-orange-500',
    reward: '30 EXP',
  },
  票: {
    label: '獲取通行證',
    icon: '🎟️',
    link: 'https://www.klook.com/',
    color: 'bg-orange-500',
    reward: '30 EXP',
  },
  券: {
    label: '獲取通行證',
    icon: '🎟️',
    link: 'https://www.klook.com/',
    color: 'bg-orange-500',
    reward: '30 EXP',
  },
  樂園: {
    label: '獲取通行證',
    icon: '🎟️',
    link: 'https://www.klook.com/',
    color: 'bg-orange-500',
    reward: '30 EXP',
  },
  環球: {
    label: '獲取快速通關',
    icon: '⚡',
    link: 'https://www.klook.com/',
    color: 'bg-purple-600',
    reward: '100 EXP',
  },
  迪士尼: {
    label: '獲取快速通關',
    icon: '🏰',
    link: 'https://www.klook.com/',
    color: 'bg-red-500',
    reward: '100 EXP',
  },

  // === 交通 ===
  JR: {
    label: '購買周遊券',
    icon: '🚄',
    link: 'https://www.jrpass.com/',
    color: 'bg-green-600',
    reward: '40 EXP',
  },
  站: {
    label: '購買移動卷軸',
    icon: '🚄',
    link: 'https://www.klook.com/',
    color: 'bg-green-600',
    reward: '40 EXP',
  },
  駅: {
    label: '購買移動卷軸',
    icon: '🚄',
    link: 'https://www.klook.com/',
    color: 'bg-green-600',
    reward: '40 EXP',
  },
  鐵: {
    label: '購買移動卷軸',
    icon: '🚄',
    link: 'https://www.klook.com/',
    color: 'bg-green-600',
    reward: '40 EXP',
  },
  車: {
    label: '購買移動卷軸',
    icon: '🚄',
    link: 'https://www.jrpass.com/',
    color: 'bg-green-600',
    reward: '40 EXP',
  },
  車: {
    label: '購買移動卷軸',
    icon: '🚄',
    link: 'https://www.jrpass.com/',
    color: 'bg-green-600',
    reward: '40 EXP',
  },
  交通: {
    label: '購買移動卷軸',
    icon: '🚄',
    link: 'https://www.jrpass.com/',
    color: 'bg-green-600',
    reward: '40 EXP',
  },
  機場: {
    label: '召喚傳送陣',
    icon: '✈️',
    link: 'https://www.klook.com/',
    color: 'bg-sky-500',
    reward: '60 EXP',
  },
  pass: {
    label: '購買周遊券',
    icon: '🎫',
    link: 'https://www.jrpass.com/',
    color: 'bg-green-600',
    reward: '40 EXP',
  },
  周遊: {
    label: '購買周遊券',
    icon: '🎫',
    link: 'https://www.jrpass.com/',
    color: 'bg-green-600',
    reward: '40 EXP',
  },

  // === 通訊 ===
  sim: {
    label: '裝備通訊物資',
    icon: '📶',
    link: 'https://www.klook.com/',
    color: 'bg-emerald-500',
    reward: '20 EXP',
  },
  網: {
    label: '裝備通訊物資',
    icon: '📶',
    link: 'https://www.klook.com/',
    color: 'bg-emerald-500',
    reward: '20 EXP',
  },
  wifi: {
    label: '裝備通訊物資',
    icon: '📶',
    link: 'https://www.klook.com/',
    color: 'bg-emerald-500',
    reward: '20 EXP',
  },
};

// ==========================================
// 3. 類型設定 (RPG Style)
// ==========================================
export const TYPE_CONFIG = {
  sightseeing: { icon: Sword, color: '#ef4444', label: '探險' },
  transport: { icon: MapPin, color: '#3b82f6', label: '傳送' },
  food: { icon: Utensils, color: '#f97316', label: '料理' },
  shopping: { icon: ShoppingBag, color: '#eab308', label: '補給' },
  checkin: { icon: Save, color: '#a855f7', label: '存檔' },
};

export const TRANSPORT_MODES = {
  walk: { label: '步行', icon: Footprints },
  train: { label: '電車', icon: Train },
  bus: { label: '公車', icon: Bus },
  car: { label: '開車', icon: Car },
  bike: { label: '腳踏車', icon: Bike },
};

// ==========================================
// 4. 工具函式
// ==========================================
export const getCoords = (locationName) => {
  if (!locationName) return null;
  if (LOCATION_DB[locationName]) return LOCATION_DB[locationName];
  for (const key in LOCATION_DB) {
    if (locationName.includes(key)) return LOCATION_DB[key];
  }
  return null;
};

export const formatDbItem = (item) => ({
  id: item.id,
  dayId: item.day,
  time: item.time ? item.time.slice(0, 5) : '',
  timePeriod: item.time_period || 'morning',
  title: item.activity,
  location: item.location,
  cost: item.cost,
  type: item.type || 'sightseeing',
  notes: item.notes || '',
  completed: item.completed || false,
  transMode: item.trans_mode || 'train',
  transTime: item.trans_time || '',
});
