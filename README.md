# Deploy Your Life 🚀

**React × 状態管理で作る、エンジニア向けライフシミュレーションゲーム**

[![Game Screenshot](https://via.placeholder.com/800x400/1a1a1a/00ff88?text=Deploy+Your+Life+Screenshot)](https://github.com/Mimic52006masaki/DeployYourLife)

フリーランス・起業・SNS・AI時代をテーマに、
「スキル習得・精神管理・収支判断」を月次ターン制で体験できる
**プログラマー向けキャリアシミュレーションゲーム**です。

---

## 🌟 特徴

### 🎯 リアルなキャリアパス
- **バイト → 会社員 → フリーランス → 起業家**への段階的成長
- JavaScript/Python/Designのスキルツリー
- 各選択が精神・資金・影響力に影響

### 💰 現代的なマネタイズ
- 副業案件（LP制作・API開発・データ分析）
- SNSフォロワーによる報酬倍率
- 法人化によるストック収入

### 🤖 AI時代を反映
- AI Proサブスクで効率化（精神消費軽減・成功率UP）
- 月額固定費のマネジメント

### 📊 月次レポート
- 詳細な収入・支出内訳
- 精神変動のフィードバック
- 意思決定の可視化

---

## 🎮 ゲームシステム

### 行動（毎月最大2回）
- **言語学習**: JavaScript/Python/Design Lvアップ（¥20,000）
- **SNS投稿**: フォロワー獲得（バズ/炎上/通常）
- **副業実行**: 即金収入（精神リスクあり）
- **休養**: 精神回復（収入なし）

### 精神システム
- 精神値で状態変化（安定/疲労/注意/危険）
- 高すぎるとケアレスミス・体調不良
- 低すぎるとバーンアウト

### 成長要素
- 言語スキルで案件解禁
- フォロワー数で副業報酬倍率
- 所持金で法人化可能

---

## 🏁 エンディング（評価システム）

12ヶ月終了時、以下の要素から総合スコアを算出します。

- 所持金
- 習得スキル（JavaScript / Python / Design）
- 精神状態
- フォロワー数

### 評価ランク（例）

- **Aランク**: 安定した個人開発者
- **Bランク**: 攻める準備が整ったエンジニア
- **Cランク**: 生活はできるが余裕なし
- **Fランク**: 破産寸前

※ 将来的にマルチエンディング・金額ベース評価を拡張予定

---

## 📁 プロジェクト構造

### src/ ディレクトリ

#### メインコンポーネント
- **`App.jsx`**: メインアプリケーションコンポーネント
  - ゲーム状態管理（useState）
  - 全体レイアウトとUIレンダリング
  - ゲームロジック（行動処理・月末計算・イベント判定）
- **`main.jsx`**: Reactアプリケーションのエントリーポイント
  - ReactDOM.render() の実行

#### コンポーネント (`src/components/`)
- **`CommandMenu.jsx`**: 行動選択メニュー
  - 学習・SNS投稿・休養などのコマンドボタン
  - アクション回数管理と無効化ロジック
- **`HUD.jsx`**: ヘッダーUI（使用されていない）
  - 月・アクション数・所持金の表示（現在App.jsxに統合）
- **`QuestPanel.jsx`**: 副業案件パネル
  - 利用可能案件の表示と選択
  - AIブースター設定
  - 法人化ボタン
- **`StatusPanel.jsx`**: ステータスパネル（使用されていない）
  - 精神・スキル・フォロワー表示（現在App.jsxに統合）
- **`SystemLogs.jsx`**: システムログパネル（使用されていない）
  - ゲームログの出力表示（現在App.jsxに統合）

#### フック (`src/hooks/`)
- **`useGameState.js`**: ゲーム状態管理フック（未使用）
  - 将来的なカスタムフック実装用

### 設定ファイル
- **`package.json`**: プロジェクト設定
  - 依存関係（React, Tailwind, Lucide Icons）
  - ビルドスクリプト（dev, build, preview）
- **`vite.config.js`**: Viteビルド設定
- **`tailwind.config.js`**: Tailwind CSS設定
- **`postcss.config.js`**: PostCSS設定
- **`index.html`**: HTMLテンプレート

### ドキュメント
- **`README.md`**: プロジェクト説明（本ファイル）
- **`deploy_your_life_roo_code用_開発指示書.md`**: 開発仕様書

## 🛠 技術スタック

- **Frontend**: React 18 + Hooks
- **Styling**: Tailwind CSS + Lucide Icons
- **Build**: Vite
- **Language**: JavaScript (ES6+)
- **State**: useState (Redux不要のシンプル設計)

### アーキテクチャの特徴
- **関数コンポーネント + Hooks**
- **状態駆動UI**: 数値変化で自動UI更新
- **純関数設計**: テスト・拡張容易
- **レスポンシブ**: モバイル対応

---

## 🚀 プレイ方法

```bash
# リポジトリをクローン
git clone https://github.com/Mimic52006masaki/DeployYourLife.git

# 依存関係をインストール
npm install

# 開発サーバー起動
npm run dev

# ブラウザで http://localhost:5173 を開く
```

### ゲームスタート
1. 言語学習でスキルアップ
2. 副業案件をこなして資金稼ぎ
3. SNSでフォロワー獲得・報酬倍率アップ
4. AI Proで効率化
5. 条件を満たしたら法人化
6. 12ヶ月生き残って理想のエンディングへ

---

## 📈 開発ロードマップ

### ✅ v0.1 / v0.2（実装済み）
- 月次ターン制ゲームループ
- 言語スキルシステム
- 副業案件生成
- SNSフォロワー・バズ/炎上
- AIツールサブスク
- Tailwind CSS UI
- 月次レポートモーダル

### 🔄 v0.3（設計・実装予定）
- 社員雇用システム
- プロダクト開発と売上
- 大型イベント（M&A / 炎上 / バズ）
- エンディング分岐拡張

### 🚀 v1.0 目標
- フルキャリアシミュレーション
- チュートリアルシステム
- セーブ/ロード機能

---

## 🎨 UIデザイン思想

### コンセプト: ネオレトロ × ターミナル × モダン

**「技術者の現実を、ゲームとして没入できるUI」** を目指しました。

#### ビジュアル思想
- **レトロゲーム感**: `border-2` + `shadow-[4px_4px_0px]` で「90年代PC」風
- **ターミナルUI**: Terminalアイコン・ログ出力・コマンドメニュー風
- **モダン演出**: animate-in, backdrop-blur, ring-offset で「今っぽさ」

#### 情報優先度設計
1. **Mental Health**: ゲームオーバー直結 → 顔アイコン + バー + 色変化
2. **Actions残数**: ターン進行キー → pulseアニメーション + ブロック表示
3. **所持金**: 現実的プレッシャー → 大きく目立つ配置

#### 状態とUIの完全同期
```js
// mental値で表情・色・長さが連動
width: `${100 - gameState.mental}%`
bg-red-500 // 危険域
```
- **80超え**: 赤バー + 顔変化
- **Actions=0**: "Actions_Consumed"表示 + Next Turnボタン出現

#### ターン制ゲームのUX最適化
- **HUD**: 状況一目瞭然（Month/Actions/Money）
- **Command Menu**: スキル開発 / ライフ実行 の明確分離
- **月次サマリー**: backdrop-blur + animate-in で「区切り感」
- **ログ**: Terminal風で「技術者感」演出

### 技術的特徴
- **Tailwind CSSユーティリティファースト**: デザインシステム不要
- **レスポンシブ**: モバイル優先（orderプロパティ活用）
- **アニメーション**: 状態変化を直感的に（pulse, bounce, fade-in）
- **コンポーネント化**: UIとロジックの分離準備済み

---

## 🤝 コントリビュート

バグ修正・機能追加・UI改善など歓迎！

```bash
# ブランチ作成
git checkout -b feature/new-feature

# コミット
git commit -m "Add new feature"

# PR作成
# GitHubでPull Request
```

---

## 📄 ライセンス

MIT License - 個人・商用問わず自由に使用可能

---

## 🙌 作者

**Mimic52006masaki**

- GitHub: [@Mimic52006masaki](https://github.com/Mimic52006masaki/DeployYourLife)
- 個人開発でReact・ゲーム制作を学習中

---

## 🎯 コンセプト

> **Code your way to freedom**

プログラミングスキルで現実を変える。
フリーランス・起業家のリアルな挑戦を、
データドリブンな意思決定ゲームとして体験。

**Deploy Your Life** - コードで人生をデプロイせよ。

---

## 📞 お問い合わせ

バグ報告・機能リクエスト・感想などは[Issues](https://github.com/Mimic52006masaki/DeployYourLife/issues)まで！

---

**🎮 [今すぐプレイする](https://deploy-your-life.vercel.app/)** (デプロイ予定)