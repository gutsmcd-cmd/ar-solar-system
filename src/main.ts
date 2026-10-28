import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

type Lang = 'ja' | 'en'
const T = {
  ja: { app: 'ARたいようけい', big: '大きい文字', lead: '太陽系を床や机の上において、惑星が回るのを見よう。惑星をタップすると、豆知識が出ます。',
    ar: '🪐 ARで床におく', or: 'ARが使えなくても、下の3Dの太陽系を指で回して見られます。一度開けば電波がなくても使えます。',
    size: '大きさ', speed: '速さ', move: 'おき直す', exit: '終わる', tapPlanet: '惑星をタップしてね',
    scan: 'スマホをゆっくり動かして床や机を映し、輪が出たらタップ', placed: '惑星をタップすると豆知識が出ます',
    noXr: 'この端末では AR が使えないようです。Android の Chrome と「Google Play 開発者サービス（AR）」が必要です。下の3Dで楽しめます。', fail: 'AR を始められませんでした。カメラを許可して、もう一度ためしてください。' },
  en: { app: 'AR Solar System', big: 'Large text', lead: 'Put the solar system on your floor or table and watch the planets go round. Tap a planet for fun facts.',
    ar: '🪐 Place in AR', or: 'No AR? You can still spin the 3D solar system below with your finger. Works with no signal after the first visit.',
    size: 'Size', speed: 'Speed', move: 'Move it', exit: 'Done', tapPlanet: 'Tap a planet',
    scan: 'Move your phone slowly over the floor or a table, then tap when the ring shows', placed: 'Tap a planet for fun facts',
    noXr: 'AR doesn’t seem to work on this device. It needs Chrome on Android with “Google Play Services for AR”. Enjoy the 3D view below.', fail: 'Could not start AR. Please allow the camera and try again.' },
}
type P = { id: string; ja: string; en: string; r: number; d: number; days: number; color: number; ring?: boolean; fj: string[]; fe: string[] }
const PL: P[] = [
  { id: 'sun', ja: '太陽', en: 'Sun', r: 0.09, d: 0, days: 1, color: 0xe3c48f, fj: ['太陽系でいちばん大きく、地球が約109個ならぶ大きさ。', '表面の温度は約5500℃。', '光が地球にとどくまで約8分20秒。'], fe: ['The biggest thing in the solar system — about 109 Earths across.', 'Its surface is about 5,500 °C.', 'Its light takes about 8 min 20 s to reach Earth.'] },
  { id: 'mercury', ja: '水星', en: 'Mercury', r: 0.012, d: 0.15, days: 88, color: 0xa59d94, fj: ['太陽にいちばん近い惑星。', '1年はたった88日。', '昼は約430℃、夜は約−180℃。'], fe: ['The closest planet to the Sun.', 'A year there is only 88 days.', 'Days reach about 430 °C, nights drop to about −180 °C.'] },
  { id: 'venus', ja: '金星', en: 'Venus', r: 0.018, d: 0.2, days: 225, color: 0xd2bf9c, fj: ['いちばん熱い惑星（約460℃）。', 'ほかの惑星と逆向きに自転する。', '夜空で月の次に明るく見える。'], fe: ['The hottest planet (about 460 °C).', 'It spins the opposite way to most planets.', 'After the Moon, it’s the brightest thing in the night sky.'] },
  { id: 'earth', ja: '地球', en: 'Earth', r: 0.019, d: 0.26, days: 365, color: 0x8ea6b4, fj: ['生き物がいるとわかっている、ただ一つの星。', '表面の約7割が海。', '月が1つある。'], fe: ['The only place we know has life.', 'About 70% of its surface is ocean.', 'It has one Moon.'] },
  { id: 'mars', ja: '火星', en: 'Mars', r: 0.014, d: 0.32, days: 687, color: 0xb98b7c, fj: ['赤いのは、土にさびた鉄が多いから。', '太陽系でいちばん高い山（オリンポス山・約22km）がある。', '小さな月が2つある。'], fe: ['It’s red because its dust is full of rusty iron.', 'It has the tallest volcano in the solar system, Olympus Mons (about 22 km).', 'It has two tiny moons.'] },
  { id: 'jupiter', ja: '木星', en: 'Jupiter', r: 0.05, d: 0.45, days: 4333, color: 0xc7ab8f, fj: ['いちばん大きな惑星。地球が1300個以上入る。', '大赤斑という、地球より大きな嵐がある。', '月が90個以上ある。'], fe: ['The biggest planet — over 1,300 Earths would fit inside.', 'The Great Red Spot is a storm bigger than Earth.', 'It has more than 90 moons.'] },
  { id: 'saturn', ja: '土星', en: 'Saturn', r: 0.042, d: 0.6, days: 10759, color: 0xd6c6a2, ring: true, fj: ['きれいな環は、氷と岩のつぶでできている。', 'とても軽く、大きなお風呂があれば水に浮く。', '月が140個以上ある。'], fe: ['Its rings are made of bits of ice and rock.', 'It’s so light it would float in a giant bathtub.', 'It has more than 140 moons.'] },
  { id: 'uranus', ja: '天王星', en: 'Uranus', r: 0.03, d: 0.73, days: 30687, color: 0xa9c2c0, fj: ['横だおしのまま回っている。', '1年は地球の約84年。', '青緑色はメタンのガスの色。'], fe: ['It spins lying on its side.', 'One year there is about 84 Earth years.', 'Its blue-green colour comes from methane gas.'] },
  { id: 'neptune', ja: '海王星', en: 'Neptune', r: 0.029, d: 0.85, days: 60190, color: 0x8796ab, fj: ['太陽からいちばん遠い惑星。', '風は時速2000km以上にもなる。', '1年は地球の約165年。'], fe: ['The farthest planet from the Sun.', 'Its winds can blow over 2,000 km/h.', 'One year there is about 165 Earth years.'] },
]

const $ = <E extends HTMLElement>(id: string) => document.getElementById(id) as E
let lang: Lang = (localStorage.getItem('ars-lang') as Lang) || 'ja'
const t = (k: keyof typeof T.ja) => T[lang][k]
let current: P | null = null
function applyLang() {
  document.documentElement.lang = lang
  document.querySelectorAll<HTMLElement>('[data-t]').forEach((el) => (el.textContent = t(el.dataset.t as keyof typeof T.ja)))
  $('lang').textContent = lang === 'ja' ? 'English' : '日本語'; document.title = t('app')
  if (current) showFact(current)
  hint()
}
$('lang').onclick = () => { lang = lang === 'ja' ? 'en' : 'ja'; localStorage.setItem('ars-lang', lang); applyLang() }
const big = $('big')
if (localStorage.getItem('ars-big') === '1') { document.documentElement.classList.add('big'); big.setAttribute('aria-pressed', 'true') }
big.onclick = () => { const on = document.documentElement.classList.toggle('big'); big.setAttribute('aria-pressed', String(on)); localStorage.setItem('ars-big', on ? '1' : '0') }

function showFact(p: P) {
  current = p; $('fname').textContent = lang === 'ja' ? p.ja : p.en
  $('flist').innerHTML = ''; (lang === 'ja' ? p.fj : p.fe).forEach((s) => { const li = document.createElement('li'); li.textContent = s; $('flist').appendChild(li) })
  $('fact').hidden = false
}
$('fclose').onclick = () => { $('fact').hidden = true; current = null }

// ---------- scene ----------
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio)); renderer.setSize(innerWidth, innerHeight)
renderer.xr.enabled = true
$('view').appendChild(renderer.domElement)
const scene = new THREE.Scene()
const bg = new THREE.Color(0x2f352e); scene.background = bg
const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.01, 50)
camera.position.set(0, 0.9, 1.3)
const controls = new OrbitControls(camera, renderer.domElement); controls.target.set(0, 0, 0); controls.enableDamping = true
scene.add(new THREE.AmbientLight(0xffffff, 0.5))
const sunLight = new THREE.PointLight(0xfff2dd, 3, 0, 0); scene.add(sunLight)

// stars for 3D view
const sg = new THREE.BufferGeometry(); const sp: number[] = []
for (let i = 0; i < 600; i++) { const v = new THREE.Vector3().randomDirection().multiplyScalar(8 + Math.random() * 8); sp.push(v.x, v.y, v.z) }
sg.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3))
const stars = new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xd8d2c8, size: 0.03 })); scene.add(stars)

const sys = new THREE.Group(); scene.add(sys)
const inner = new THREE.Group(); sys.add(inner)
const meshes: THREE.Mesh[] = []
const pivots: { g: THREE.Group; p: P; m: THREE.Mesh }[] = []
for (const p of PL) {
  const mat = p.id === 'sun' ? new THREE.MeshBasicMaterial({ color: p.color }) : new THREE.MeshStandardMaterial({ color: p.color, roughness: 0.9 })
  const m = new THREE.Mesh(new THREE.SphereGeometry(p.r, 32, 16), mat); m.userData.p = p
  if (p.ring) { const ring = new THREE.Mesh(new THREE.RingGeometry(p.r * 1.3, p.r * 2.1, 48), new THREE.MeshBasicMaterial({ color: 0xcdbd9e, side: THREE.DoubleSide, transparent: true, opacity: 0.75 })); ring.rotation.x = -Math.PI / 2.4; m.add(ring) }
  // bigger invisible hit target for small planets
  const hit = new THREE.Mesh(new THREE.SphereGeometry(Math.max(p.r * 1.8, 0.03), 8, 6), new THREE.MeshBasicMaterial({ visible: false })); hit.userData.p = p; m.add(hit); meshes.push(hit)
  const g = new THREE.Group(); g.rotation.y = Math.random() * Math.PI * 2
  m.position.x = p.d; g.add(m); inner.add(g); pivots.push({ g, p, m })
  if (p.d) {
    const pts = []; for (let i = 0; i <= 96; i++) { const a = (i / 96) * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * p.d, 0, Math.sin(a) * p.d)) }
    inner.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x9dae98, transparent: true, opacity: 0.45 })))
  }
}
const scaleIn = $<HTMLInputElement>('scale'), speedIn = $<HTMLInputElement>('speed')
const applyScale = () => inner.scale.setScalar(Number(scaleIn.value)); scaleIn.oninput = applyScale; applyScale()

const ray = new THREE.Raycaster()
function pick(origin: THREE.Vector3, dir: THREE.Vector3) {
  ray.set(origin, dir); const h = ray.intersectObjects(meshes, false)[0]
  if (h) { showFact(h.object.userData.p as P); navigator.vibrate?.(15); return true }
  return false
}
// 3D view tap
let down: { x: number; y: number } | null = null
renderer.domElement.addEventListener('pointerdown', (e) => (down = { x: e.clientX, y: e.clientY }))
renderer.domElement.addEventListener('pointerup', (e) => {
  if (!down || renderer.xr.isPresenting || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 8) return
  ray.setFromCamera(new THREE.Vector2((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1), camera)
  const h = ray.intersectObjects(meshes, false)[0]; if (h) showFact(h.object.userData.p as P)
})
addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight) })

// ---------- AR ----------
let hitSource: XRHitTestSource | null = null, placed = false, inAr = false
const reticle = new THREE.Mesh(new THREE.RingGeometry(0.05, 0.065, 32).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0xc9a3a8 }))
reticle.matrixAutoUpdate = false; reticle.visible = false; scene.add(reticle)
function hint() {
  const h = $('hint')
  h.textContent = !inAr ? (current ? '' : t('tapPlanet')) : placed ? t('placed') : t('scan')
}
const controller = renderer.xr.getController(0); scene.add(controller)
controller.addEventListener('select', () => {
  if (!placed) {
    if (!reticle.visible) return
    sys.position.setFromMatrixPosition(reticle.matrix); sys.position.y += 0.1; sys.visible = true; placed = true; reticle.visible = false; hint(); return
  }
  const o = new THREE.Vector3().setFromMatrixPosition(controller.matrixWorld)
  const d = new THREE.Vector3(0, 0, -1).applyQuaternion(new THREE.Quaternion().setFromRotationMatrix(controller.matrixWorld))
  pick(o, d)
})
document.querySelectorAll('.bar *, .fact *').forEach((b) => b.addEventListener('beforexrselect', (e) => e.preventDefault()))

async function startAr() {
  const ok = await navigator.xr?.isSessionSupported('immersive-ar').catch(() => false)
  const m = $('msg')
  if (!ok) { m.textContent = t('noXr'); m.hidden = false; return }
  let s: XRSession
  try { s = await navigator.xr!.requestSession('immersive-ar', { requiredFeatures: ['hit-test'], optionalFeatures: ['dom-overlay'], domOverlay: { root: $('overlay') } } as XRSessionInit) }
  catch { m.textContent = t('fail'); m.hidden = false; return }
  inAr = true; placed = false; document.body.classList.add('inar'); scene.background = null; stars.visible = false; sys.visible = false
  sys.position.set(0, 0, 0); $('move').hidden = false; $('exit').hidden = false
  renderer.xr.setReferenceSpaceType('local'); await renderer.xr.setSession(s)
  hitSource = (await s.requestHitTestSource!({ space: await s.requestReferenceSpace('viewer') })) ?? null
  s.addEventListener('end', () => {
    inAr = false; hitSource = null; document.body.classList.remove('inar'); scene.background = bg; stars.visible = true; sys.visible = true; sys.position.set(0, 0, 0)
    reticle.visible = false; $('move').hidden = true; $('exit').hidden = true; hint()
  })
  hint()
}
$('ar').onclick = startAr
$('exit').onclick = () => renderer.xr.getSession()?.end()
$('move').onclick = () => { placed = false; sys.visible = false; hint() }

const clock = new THREE.Clock(); let simDays = 0
renderer.setAnimationLoop((_t, frame?: XRFrame) => {
  const dt = Math.min(0.1, clock.getDelta())
  simDays += dt * 30 * Number(speedIn.value) // 1x: Earth orbit ≈ 12 s
  for (const { g, p, m } of pivots) { if (p.d) g.rotation.y = -(simDays / p.days) * Math.PI * 2 + g.userData.o; m.rotation.y += dt * 0.5 }
  if (frame && hitSource && !placed) {
    const hits = frame.getHitTestResults(hitSource), ref = renderer.xr.getReferenceSpace()!
    const pose = hits[0]?.getPose(ref); reticle.visible = !!pose; if (pose) reticle.matrix.fromArray(pose.transform.matrix)
  }
  if (!inAr) controls.update()
  renderer.render(scene, camera)
})
pivots.forEach((v) => (v.g.userData.o = Math.random() * Math.PI * 2))
applyLang()
