# Optical Atlas — 光学系のギャラリー

光学方式と実製品46項目を巡る、日本語の静的ギャラリー。対物7、アイピース13、カメラレンズ16、反射・屈折反射系10項目を収録しています。方式のSVG模式図、実製品の公表仕様、カテゴリ・メーカー系統の絞り込み、別名・複数語検索、詳細ダイアログ、回折限界MTFの操作画面を備えています。

ZEISS系はテッサー、プラナー、ゾナー、ビオゴン、ディスタゴン、ホロゴンなど。Leica / Leitzはエルマー5cm f/3.5、ズミクロンM 50mm f/2（No.11826）、APOズミクロンM 50mm f/2 ASPH.、ズミルックスM 50mm f/1.4 ASPH.（0.45m対応型）、ノクティルックスM 50mm f/0.95 ASPH.（No.11602）を収録しています。

系統名は歴史的な関連を示し、その方式を用いるすべての製品の製造元を表しません。実製品は具体的なモデルを対象にし、内部形状の推定図の代わりに公表仕様と一次資料へのリンクを掲載しています。エルマーの歴史的個体カードは焦点距離・開放F値を表示し、構成枚数は記載していません。

## ローカルで表示

依存パッケージやビルドは不要です。`index.html` をブラウザーで開くか、次のサーバーを使います。

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

ブラウザーで http://127.0.0.1:8000 を開きます。

## GitHub Pages

公開先は [koyamahr.github.io/optics](https://koyamahr.github.io/optics/)、リポジトリは [koyamahr/optics](https://github.com/koyamahr/optics) です。GitHub Pagesはmainブランチのルートから公開しています。

1. GitHubリポジトリに、このフォルダのファイルをpushします。
2. Settings → Pages → Build and deployment で **Deploy from a branch** を選びます。
3. Branch を **main**、フォルダを **/ (root)** にして保存します。

すべて相対パスなので、プロジェクトのサブパスでも表示できます。公開方法の詳細は [GitHub公式ドキュメント](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site) を参照してください。

## 内容の追加

`data.js` が基礎データ、`catalog.js` が追加方式・製品・系統のデータです。`category` は `objective` / `eyepiece` / `camera` / `reflector`。`lenses` は模式図の座標で、光学設計値ではありません。実製品は `kind: 'product'` とし、確認できた `elements`・`groups`、`focal`・`aperture` を記載します。参考資料は `SOURCES`、メーカー・設計系統は `BRANDS` に登録します。

フィルターの件数はデータから計算します。総数の紹介文とREADMEは追加時に更新してください。公開データの変更時は、HTML内のスクリプト・スタイルのバージョン文字列も更新し、旧版キャッシュとの混在を防ぎます。

## 図とMTFの範囲

断面図と光路の線はオリジナルの模式図です。実機の設計・性能や計算による光線追跡を示していません。形状・枚数は代表例です。各カードから参照した一次資料を開けます。

MTFは、遮蔽のない一様な円形瞳、単色、非干渉結像、無収差を仮定した解析式で計算します。像側の近軸F値を使い、`ν = frequency × wavelength_mm × F-number`、`MTF = 2/π × (acos(ν) − ν√(1−ν²))`（0 ≤ ν < 1）、ν ≥ 1で0です。実在レンズの実測MTFや、中央遮蔽のある反射望遠鏡のMTFではありません。センサー特性、収差、デフォーカスも含みません。

式の参考：[Edmund Optics — Introduction to MTF](https://www.edmundoptics.com/knowledge-center/application-notes/optics/introduction-to-modulation-transfer-function)

実際のレンズ方式別MTFを追加する場合は、出典と測定条件を明記した測定データ、または曲率・厚み・ガラス材・間隔・絞り位置を含む光学処方が必要です。
