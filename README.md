# Optical Atlas — 光学系のギャラリー

対物レンズ、アイピース、カメラレンズ、反射望遠鏡の構造を巡る、日本語の静的ギャラリー。14方式のオリジナルSVG模式図、カテゴリ絞り込み、キーワード検索、詳細ダイアログ、回折限界MTFのインタラクティブ表示を備えています。アイピースはハイゲン（ホイヘンス）、ミッテンゼー・ハイゲン（MH型）、ケルナー、プローセル、アッベ式オルソスコピックの5方式です。名称の別名と、ひらがな・カタカナで検索できます。

## ローカルで表示

依存パッケージやビルドは不要です。`index.html` をブラウザーで開くか、次のサーバーを使います。

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

ブラウザーで http://127.0.0.1:8000 を開きます。

## GitHub Pages

想定する独立リポジトリは `koyamahr/optics`、その場合のURLは `https://koyamahr.github.io/optics/` です（公開を保証するものではありません）。

1. GitHubリポジトリに、このフォルダのファイルをpushします。
2. Settings → Pages → Build and deployment で **Deploy from a branch** を選びます。
3. Branch を **main**、フォルダを **/ (root)** にして保存します。

すべて相対パスなので、プロジェクトのサブパスでも表示できます。公開方法の詳細は [GitHub公式ドキュメント](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site) を参照してください。

## 内容の追加

`data.js` の `OPTICS` 配列に追加します。`category` は `objective` / `eyepiece` / `camera` / `reflector`。`lenses` は模式図を描くための座標であり、光学設計値ではありません。参考資料は `SOURCES` に記載します。

## 図とMTFの範囲

断面図と光路の線はオリジナルの模式図です。実機の設計・性能や計算による光線追跡を示していません。形状・枚数は代表例です。各カードから参照した一次資料を開けます。

MTFは、遮蔽のない一様な円形瞳、単色、非干渉結像、無収差を仮定した解析式で計算します。像側の近軸F値を使い、`ν = frequency × wavelength_mm × F-number`、`MTF = 2/π × (acos(ν) − ν√(1−ν²))`（0 ≤ ν < 1）、ν ≥ 1で0です。実在レンズの実測MTFや、中央遮蔽のある反射望遠鏡のMTFではありません。センサー特性、収差、デフォーカスも含みません。

式の参考：[Edmund Optics — Introduction to MTF](https://www.edmundoptics.com/knowledge-center/application-notes/optics/introduction-to-modulation-transfer-function)

実際のレンズ方式別MTFを追加する場合は、出典と測定条件を明記した測定データ、または曲率・厚み・ガラス材・間隔・絞り位置を含む光学処方が必要です。
