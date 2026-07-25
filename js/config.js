// トラック定義: ホーム画面カードの表示順・色分け閾値(日数)・遷移先ハッシュ
export const TRACKS = [
  { id: 'gym', type: 'gym', label: 'ジム', hash: '#gym', green: 2, yellow: 4 },
  { id: 'bike', type: 'bike', label: '自転車', hash: '#bike', green: 3, yellow: 7 },
  { id: 'home', type: 'home', label: '家トレ', hash: '#hometrack', green: 2, yellow: 4 },
];

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
