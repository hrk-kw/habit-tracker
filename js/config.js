// トラック定義: ホーム画面カードの表示順・色分け閾値(日数)・遷移先ハッシュ
export const TRACKS = [
  { id: 'gym', type: 'gym', label: 'ジム', hash: '#gym', green: 2, yellow: 4 },
  { id: 'bike', type: 'bike', label: '自転車', hash: '#bike', green: 3, yellow: 7 },
  { id: 'home', type: 'home', label: '家トレ', hash: '#hometrack', green: 2, yellow: 4 },
];

// ジム種目→鍛えた部位のマッピング(筋肉可視化用)。解剖学的な厳密さより「見て楽しい」ことを優先した粗い分類。
export const EXERCISE_MUSCLE_MAP = {
  'レッグプレス': ['legs', 'glutes'],
  'チェストプレス': ['chest'],
  'ラットプルダウン': ['back'],
  'シーテッドロー': ['back'],
  'レッグカール': ['hamstrings'],
  'アブドミナルクランチ': ['abs'],
  'ロータリートルソー': ['abs'],
  'バックエクステンション': ['lower_back'],
  'ショルダープレス': ['shoulders'],
};

// 種目名→説明文。名前だけでは動きが分かりにくい種目にのみキーを持たせる
// (自明な種目にⓘマークを出して煩雑にしないため)。
export const EXERCISE_DESCRIPTION_MAP = {
  'ロータリートルソー': 'マシンに座りハンドルを持って、体幹を左右にひねる種目。わき腹(腹斜筋)を鍛える。',
  'デッドバグ': '仰向けに寝て、片手と反対側の片脚を伸ばしながら床すれすれまで下ろし、体幹を安定させたまま元に戻す。左右交互に行う体幹トレーニング。',
  'クラムシェル': '横向きに寝て膝を曲げ、かかとをつけたまま膝だけを開閉する。お尻の横(中臀筋)を鍛える。',
  'グルートブリッジ': '仰向けで膝を立て、お尻を持ち上げてから下ろす。お尻・裏ももを鍛える。',
  'バックエクステンション': 'うつ伏せの姿勢から上体を反らして戻す。腰・背中下部を鍛える。前傾姿勢による腰痛予防に有効。',
  '膝抱え込みストレッチ': '仰向けで片膝を両手で抱え、胸に引き寄せる。腰まわりのストレッチ。',
  '胸を開くストレッチ': '両手を後ろで組み、肩甲骨を寄せるように胸を開く。前傾姿勢で固まった胸まわりをほぐすストレッチ。',
};

// 初回seed用の固定メニュー。追加候補species も最初から含める(不要なら後でDB上で無効化可能)。
export const INITIAL_EXERCISES = [
  { name: 'レッグプレス', category: 'outer', default_weight_kg: null, default_reps: null },
  { name: 'チェストプレス', category: 'outer', default_weight_kg: null, default_reps: null },
  { name: 'ラットプルダウン', category: 'outer', default_weight_kg: null, default_reps: null },
  { name: 'シーテッドロー', category: 'outer', default_weight_kg: null, default_reps: null },
  { name: 'レッグカール', category: 'outer', default_weight_kg: null, default_reps: null },
  { name: 'アブドミナルクランチ', category: 'outer', default_weight_kg: null, default_reps: null },
  { name: 'ロータリートルソー', category: 'outer', default_weight_kg: null, default_reps: null },
  { name: 'バックエクステンション', category: 'outer', default_weight_kg: null, default_reps: null },
  { name: 'ショルダープレス', category: 'outer', default_weight_kg: null, default_reps: null },
  { name: 'グルートブリッジ', category: 'inner', default_weight_kg: null, default_reps: null },
  { name: 'デッドバグ', category: 'inner', default_weight_kg: null, default_reps: null },
  { name: 'プランク', category: 'inner', default_weight_kg: null, default_reps: null },
  { name: '膝抱え込みストレッチ', category: 'inner', default_weight_kg: null, default_reps: null },
  { name: 'クラムシェル', category: 'inner', default_weight_kg: null, default_reps: null },
  { name: '胸を開くストレッチ', category: 'inner', default_weight_kg: null, default_reps: null },
];
