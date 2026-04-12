# KOTOBA WORKS — Webアニメーション技術リファレンス

このファイルは、サイトで使用している/今後使用可能なアニメーション技術を記録しています。
新しいページを作る際の汎用ガイドとして使ってください。

---

## 現在使用中のテクニック

### 1. GSAP (GreenSock Animation Platform)
- **CDN**: `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js`
- **使用ページ**: index.html (ヒーロー)
- **用途**: タイムラインアニメーション、スプリットテキスト、スクロール連動

### 2. ScrollTrigger (GSAP Plugin)
- **CDN**: `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js`
- **使用ページ**: index.html
- **用途**: スクロール位置に応じたアニメーション発火、パララックス

### 3. IntersectionObserver (Vanilla JS)
- **ファイル**: assets/shared.js
- **使用ページ**: 全ページ
- **用途**: `.fi` クラス要素のフェードイン（画面に入ったら `.v` を付与）

### 4. CSS clip-reveal
- **使用ページ**: index.html (hero-title)
- **仕組み**: `overflow: hidden` の親 + `translateY(110%)` の子 → GSAP で `yPercent: 0` に
- **効果**: テキストが下からマスクの裏をスライドして現れる

### 5. CSS cubic-bezier easing
- **サイト共通**: `cubic-bezier(0.16, 1, 0.3, 1)` — Apple 風の「バネ」
- **使用箇所**: ボタンホバー、カードリフト、ナビ遷移

### 6. Scroll Parallax
- **使用ページ**: index.html, session_lp.html
- **仕組み**: スクロール量に応じて要素の `translateY` を変化させる
- **GSAP版**: `scrub: true` で自動連動

---

## 基本テクニック（全ページ対応済み）

### フェードイン + スライドアップ
```html
<div class="fi">コンテンツ</div>
<div class="fi d1">0.1秒遅延</div>
<div class="fi d2">0.2秒遅延</div>
```
```css
.fi { opacity: 0; transform: translateY(28px); transition: 0.7s; }
.fi.v { opacity: 1; transform: translateY(0); }
```

### ホバーリフト（カード）
```css
.card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
}
```

### グラデーションライン（カード上部）
```css
.card::before {
  content: '';
  width: 100%; height: 3px;
  background: linear-gradient(90deg, var(--navy), var(--terra));
  transform: scaleX(0);
  transition: transform 0.6s;
}
.card:hover::before { transform: scaleX(1); }
```

---

## 上級テクニック（導入済み / 導入可能）

### A. スプリットテキスト（文字単位アニメーション）
**状態: 導入済み（index.html ヒーロー）**

```javascript
// テキストを1文字ずつspanに分割
el.textContent.split('').forEach((char, i) => {
  const span = document.createElement('span');
  span.textContent = char;
  span.style.display = 'inline-block';
  el.appendChild(span);
});

// GSAPで1文字ずつ遅延アニメーション
gsap.to('.hero-char', {
  opacity: 1, y: 0,
  duration: 0.6,
  stagger: 0.03,
  ease: 'power3.out'
});
```

### B. スクロールジャック
**状態: 導入可能**
- **ライブラリ**: fullPage.js (CDN: `https://cdnjs.cloudflare.com/ajax/libs/fullPage.js/4.0.20/fullpage.min.js`)
- **用途**: スクロールを「セクション単位」にスナップ
- **注意**: ユーザー体験を損なう場合あり。使用するなら特定セクションのみ

```javascript
new fullpage('#fullpage', {
  autoScrolling: true,
  scrollingSpeed: 700,
  easing: 'easeInOutCubic'
});
```

### C. カーソルカスタマイズ
**状態: 導入可能**

```css
/* デフォルトカーソルを非表示 */
body { cursor: none; }

/* カスタムカーソル */
.cursor {
  position: fixed;
  width: 20px; height: 20px;
  border: 2px solid var(--navy);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transition: transform 0.15s, width 0.3s, height 0.3s;
  mix-blend-mode: difference;
}
.cursor.hover {
  width: 48px; height: 48px;
  background: rgba(30, 58, 95, 0.1);
}
```

```javascript
const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX - 10 + 'px';
  cursor.style.top = e.clientY - 10 + 'px';
});
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});
```

### D. WebGL / Three.js による3Dオブジェクト
**状態: 導入可能（慎重に）**
- **CDN**: `https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js`
- **用途**: 背景に3Dパーティクル、ロゴの3D回転、抽象オブジェクト
- **注意**: パフォーマンス重い。モバイルでカクつく場合はフォールバック必要

```javascript
// 最小限の3Dシーン
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(w, h);
document.getElementById('webgl-container').appendChild(renderer.domElement);

// パーティクル
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(1000 * 3);
for (let i = 0; i < 1000 * 3; i++) positions[i] = (Math.random() - 0.5) * 10;
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const material = new THREE.PointsMaterial({ size: 0.02, color: 0x1e3a5f });
const points = new THREE.Points(geometry, material);
scene.add(points);
camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  points.rotation.y += 0.001;
  renderer.render(scene, camera);
}
animate();
```

### E. シェーダーエフェクト（GLSL）
**状態: 導入可能（上級者向け）**
- Three.js の `ShaderMaterial` を使用
- 画像にノイズ・歪み・グリッチ・波紋エフェクトを適用
- **注意**: 最もパフォーマンスリスクが高い。デスクトップ限定推奨

### F. ページ遷移アニメーション
**状態: 導入可能**
- **ライブラリ**: Barba.js (`https://unpkg.com/@barba/core`)
- **用途**: ページ間のフェード/スライド遷移
- **注意**: 全ページの `<script>` 構造を統一する必要あり

```javascript
barba.init({
  transitions: [{
    leave(data) {
      return gsap.to(data.current.container, { opacity: 0, duration: 0.5 });
    },
    enter(data) {
      return gsap.from(data.next.container, { opacity: 0, duration: 0.5 });
    }
  }]
});
```

### G. スムーススクロール＋カスタムイージング
**状態: 導入可能**
- **ライブラリ**: Lenis (`https://unpkg.com/lenis@1.0.42/dist/lenis.min.js`)
- **用途**: ネイティブスクロールをスムーズ化（慣性スクロール）

```javascript
const lenis = new Lenis({
  duration: 1.2,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true
});
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// GSAP ScrollTrigger と連携
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(time => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

---

## デザインシステム定数

| 変数 | 値 | 用途 |
|---|---|---|
| `--navy` | `#1e3a5f` | 主要アクセント |
| `--terra` | `#c4643a` | セカンダリアクセント |
| `--bg` | `#fafaf8` | 背景 |
| `--bg-warm` | `#f5f2ed` | 暖色背景 |
| `--en` | Inter | 英語フォント |
| `--jp` | Noto Sans JP | 日本語フォント |
| `--serif` | Noto Serif JP | セリフフォント |
| `--max` | 1120px | 最大幅 |
| easing | `cubic-bezier(0.16, 1, 0.3, 1)` | Apple風バネ |

---

## パフォーマンス注意事項

1. **Three.js / シェーダー**: モバイルでは `window.innerWidth < 768` なら無効化
2. **GSAP**: `will-change: transform` を使う要素は最小限に
3. **Lenis**: iOS Safari で `overflow: hidden` と競合する場合あり
4. **Barba.js**: SPA化するので、GA4/GTM のページビュー計測設定が必要
5. **全般**: `prefers-reduced-motion` メディアクエリでアニメーション無効化対応すること
