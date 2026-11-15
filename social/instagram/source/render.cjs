// Renders the Instagram carousel and stories from the live site.
//
//   npm run build && npx vite preview --port 4173
//   node social/instagram/source/render.cjs [--skip-shots] [--skip-video]
//
// Needs Playwright (Chromium) and ffmpeg. Output goes to social/instagram/.
const { chromium } = require('playwright')
const { execFileSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

const BASE = process.env.SITE_URL || 'http://localhost:4173/'
const SRC = __dirname
const OUT = path.resolve(SRC, '..')
const SHOTS = path.join(SRC, 'shots')
const FRAMES = path.join(SRC, 'frames')
const args = new Set(process.argv.slice(2))
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

/** Video slot on the story background, and the section list beside it. */
const SLOT = { x: 72, y: 310, w: 640, h: 1384 }
const SECTIONS = 6

async function scrollTo(page, id) {
  await page.evaluate((id) => {
    const el = document.getElementById(id)
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: 'instant' })
  }, id)
}

async function shots(browser) {
  fs.mkdirSync(SHOTS, { recursive: true })
  const mobile = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true }
  const desktop = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 }

  const m = await browser.newPage(mobile)
  await m.goto(BASE, { waitUntil: 'networkidle' })
  await wait(3500)
  await m.screenshot({ path: path.join(SHOTS, 'm-hero.png') })
  for (const id of ['services', 'gallery', 'studio']) {
    await scrollTo(m, id)
    await wait(2200)
    await m.screenshot({ path: path.join(SHOTS, `m-${id}.png`) })
  }
  await m.close()

  const d = await browser.newPage(desktop)
  await d.goto(BASE, { waitUntil: 'networkidle' })
  await wait(3500)
  await d.screenshot({ path: path.join(SHOTS, 'd-hero.png') })
  await d.close()

  // The sugar crystals at three moments, cropped to the nail.
  const times = [650, 900, 3600]
  for (const [i, t] of times.entries()) {
    const p = await browser.newPage(desktop)
    await p.goto(BASE, { waitUntil: 'load' })
    await wait(t)
    await p.screenshot({ path: path.join(SHOTS, `crystals-${i + 1}.png`), clip: { x: 880, y: 120, width: 520, height: 720 } })
    await p.close()
  }
}

async function slides(browser) {
  const page = await browser.newPage({ viewport: { width: 1200, height: 1400 }, deviceScaleFactor: 1 })
  await page.goto('file://' + path.join(SRC, 'templates.html'))
  await page.waitForFunction(() => document.body.dataset.ready === '1')
  await page.waitForLoadState('networkidle')
  // A transparent page lets the section list overlay keep its see-through background.
  await page.addStyleTag({ content: 'body { background: transparent !important }' })
  fs.mkdirSync(FRAMES, { recursive: true })
  const ids = await page.$$eval('.s', (els) => els.map((e) => e.id))
  for (const id of ids) {
    if (id === 'story-2-toc') {
      for (let i = 0; i < SECTIONS; i++) {
        await page.$$eval('#story-2-toc li', (lis, i) => lis.forEach((li, k) => li.classList.toggle('on', k === i)), i)
        await page.locator('#' + id).screenshot({ path: path.join(FRAMES, `toc-${i}.png`), omitBackground: true })
      }
      continue
    }
    const file = id === 'story-2-bg' ? path.join(FRAMES, 'story-2-bg.png') : path.join(OUT, `${id}.png`)
    await page.locator('#' + id).screenshot({ path: file })
    console.log('✓', path.relative(process.cwd(), file))
  }
  await page.close()
}

/** Records a smooth scroll through the mobile site with the CDP screencast. */
async function recordScroll(browser) {
  const dir = path.join(FRAMES, 'scroll')
  fs.rmSync(dir, { recursive: true, force: true })
  fs.mkdirSync(dir, { recursive: true })
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  const cdp = await page.context().newCDPSession(page)
  const frames = []
  cdp.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => {
    const file = path.join(dir, `${String(frames.length).padStart(5, '0')}.jpg`)
    fs.writeFileSync(file, Buffer.from(data, 'base64'))
    frames.push({ file, t: metadata.timestamp })
    await cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {})
  })
  await page.goto(BASE, { waitUntil: 'domcontentloaded' })
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: 780, maxHeight: 1688 })
  await wait(3600) // the crystals gather into the nail
  const lastFrame = frames.at(-1).t
  // Glide section to section. Each mark is when a new section takes over the screen.
  const { start, marks } = await page.evaluate(async () => {
    const now = () => (performance.timeOrigin + performance.now()) / 1000
    const start = now()
    const marks = []
    const ease = (t) => 1 - Math.pow(1 - t, 3)
    const glide = (el, to, ms, axis = 'y') =>
      new Promise((done) => {
        const from = axis === 'y' ? window.scrollY : el.scrollLeft
        const t0 = performance.now()
        const step = (t) => {
          const k = Math.min(1, (t - t0) / ms)
          const v = from + (to - from) * ease(k)
          if (axis === 'y') window.scrollTo(0, v)
          else el.scrollLeft = v
          if (k < 1) requestAnimationFrame(step)
          else done()
        }
        requestAnimationFrame(step)
      })
    const enter = (ms) => marks.push(now() + ms / 2000)
    const pause = (ms) => new Promise((r) => setTimeout(r, ms))
    const top = (id) => document.getElementById(id).getBoundingClientRect().top + window.scrollY
    enter(1300)
    await glide(null, top('about'), 1300)
    await pause(1300)
    enter(1300)
    await glide(null, top('services'), 1300)
    await pause(900)
    await glide(null, top('services') + 380, 1100)
    await pause(900)
    enter(1300)
    await glide(null, top('gallery'), 1300)
    await pause(700)
    const rail = [...document.querySelectorAll('#gallery *')].find(
      (e) => e.scrollWidth > e.clientWidth + 40 && getComputedStyle(e).overflowX !== 'visible',
    )
    if (rail) {
      await glide(rail, rail.clientWidth * 0.85, 1200, 'x')
      await pause(800)
      await glide(rail, rail.clientWidth * 1.7, 1200, 'x')
      await pause(800)
    }
    enter(1400)
    await glide(null, top('studio'), 1400)
    await pause(1400)
    enter(1300)
    await glide(null, top('booking'), 1300)
    await pause(1500)
    return { start, marks }
  })
  await cdp.send('Page.stopScreencast')
  await page.close()
  // Map page time onto the screencast clock, then onto video time.
  const offset = lastFrame - start
  const cuts = marks.map((m) => m + offset - frames[0].t)
  return { frames, cuts }
}

function encode({ frames, cuts }) {
  const ff = (a) => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...a], { stdio: 'inherit' })
  // Constant 30 fps from the screencast's variable frame timestamps.
  const list =
    frames
      .map((f, i) => {
        const next = frames[i + 1] ? frames[i + 1].t : f.t + 1 / 30
        return `file '${f.file}'\nduration ${Math.max(0.001, next - f.t).toFixed(4)}`
      })
      .join('\n') + `\nfile '${frames.at(-1).file}'\n`
  const listFile = path.join(FRAMES, 'scroll.txt')
  fs.writeFileSync(listFile, list)
  const total = frames.at(-1).t - frames[0].t + 1 / 30
  const screen = path.join(FRAMES, 'screen.mp4')
  ff(['-f', 'concat', '-safe', '0', '-i', listFile, '-vf', `fps=30,scale=${SLOT.w}:${SLOT.h}:flags=lanczos`,
    '-c:v', 'libx264', '-crf', '12', '-pix_fmt', 'yuv420p', screen])

  // Background, then the recording, then the section list that follows it.
  const bounds = [0, ...cuts, total + 1]
  const inputs = ['-loop', '1', '-i', path.join(FRAMES, 'story-2-bg.png'), '-i', screen]
  let graph = `[0][1]overlay=${SLOT.x}:${SLOT.y}:shortest=1[v0];`
  for (let i = 0; i < SECTIONS; i++) {
    inputs.push('-loop', '1', '-i', path.join(FRAMES, `toc-${i}.png`))
    const [a, b] = [bounds[i], bounds[i + 1]].map((t) => t.toFixed(2))
    graph += `[v${i}][${i + 2}]overlay=0:0:shortest=1:enable='gte(t,${a})*lt(t,${b})'[v${i + 1}];`
  }
  graph += `[v${SECTIONS}]fade=t=in:st=0:d=0.3,fade=t=out:st=${(total - 0.5).toFixed(2)}:d=0.5,format=yuv420p[v]`
  ff([...inputs, '-filter_complex', graph, '-map', '[v]', '-t', total.toFixed(2), '-r', '30',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '19', '-profile:v', 'high', '-movflags', '+faststart',
    path.join(OUT, 'story-2.mp4')])
  console.log('✓ story-2.mp4', total.toFixed(1) + 's, sections at', cuts.map((c) => c.toFixed(1)).join(' '))
}

;(async () => {
  const browser = await chromium.launch()
  if (!args.has('--skip-shots')) await shots(browser)
  await slides(browser)
  if (!args.has('--skip-video')) encode(await recordScroll(browser))
  await browser.close()
})()
