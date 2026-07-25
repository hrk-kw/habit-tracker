# 習慣トラッカー

ジム / 自転車 / 家トレの3トラックを独立して記録する軽量PWA。詳細な設計意図は [habit_tracker_design.md](habit_tracker_design.md) を参照。

## ローカルで動かす

ES Modules と Service Worker を使うため `file://` では動かない。HTTPサーバー経由で開く。

```sh
# Node.js があれば npx で十分
npx --yes serve .
# または
python3 -m http.server 8000
```

`http://localhost:<port>/` を開く。JS編集後は `node --check js/<file>.js` で構文確認する。

## アイコンの再生成

`icons/` 以下のPNGは外部ツール無しで `icons/generate-icons.js` から生成している(3本の棒グラフ = 3トラックのモチーフ)。デザインを変える場合は当該スクリプトを編集して再実行する。

```sh
node icons/generate-icons.js
```

## GitHub Pages へのデプロイ

ビルド不要の静的サイトなので、`main` ブランチ直下をそのまま配信する。

```sh
gh repo create habit-tracker --public --source=. --push
echo '{"source":{"branch":"main","path":"/"}}' | gh api -X POST repos/:owner/habit-tracker/pages --input -
```

数十秒後に `https://<user>.github.io/habit-tracker/` で公開される。スマホのChromeで開き「ホーム画面に追加」でPWAとしてインストールできる。

## MVPスコープ

- 3トラックのホーム画面(経過日数+色分け)
- ジム記録(セットログ、前回値引き継ぎ)
- 自転車/家トレの記録(ワンタップ)
- アイコンバッジ(対応環境のみ、アプリを開いた時に更新)

常駐通知・HR連携はMVP対象外(詳細は設計メモの「v1.1以降」を参照)。
