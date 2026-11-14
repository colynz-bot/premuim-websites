// Renders the Instagram carousel, stories and video story from the live site.
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

async function scrollTo(page, id, offset = 0) {
  await page.evaluate(
    ([id, offset]) => {
      const el = document.getElementById(id)
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: 'instant' })
    },
    [id, offset],
  )
}

async function shots(browser) {
  fs.mkdirSync(SHOTS, { recursive: true })
  const m = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true })
  await m.goto(BASE, { waitUntil: 'networkidle' })
  await wait(3500) // let the sugar crystals form the nail
  await m.screenshot({ path: path.join(SHOTS, 'm-hero.png') })
  for (const id of ['services', 'gallery', 'studio', 'booking']) {
    await scrollTo(m, id)
    await wait(2200)
    await m.screenshot({ path: path.join(SHOTS, `m-${id}.png`) })
  }
  const d = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
  await d.goto(BASE, { waitUntil: 'networkidle' })
  await wait(3500)
  await d.screenshot({ path: path.join(SHOTS, 'd-hero.png') })
  await scrollTo(d, 'gallery')
  await wait(2200)
  await d.screenshot({ path: path.join(SHOTS, 'd-gallery.png') })
  await m.close()
  await d.close()
}

async function slides(browser) {
  const page = await browser.newPage({ viewport: { width: 1200, height: 1400 }, deviceScaleFactor: 1 })
  await page.goto('file://' + path.join(SRC, 'templates.html'))
  await page.evaluate(() => document.fonts.ready)
  // A transparent page lets the video frame keep its see-through phone screen.
  await page.addStyleTag({ content: 'body { background: transparent !important }' })
  await page.waitForLoadState('networkidle')
  const ids = await page.$$eval('.slide', (els) => els.map((e) => e.id))
  for (const id of ids) {
    const internal = id.startsWith('story-video')
    const file = internal ? path.join(FRAMES, `${id}.png`) : path.join(OUT, `${id}.png`)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    await page.locator('#' + id).screenshot({ path: file, omitBackground: id === 'story-video-frame' })
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
  // Glide section to section, with a pause on each. One easing curve, like the site.
  await page.evaluate(async () => {
    const ease = (t) => 1 - Math.pow(1 - t, 3)
    const glide = (el, to, ms, axis = 'y') =>
      new Promise((done) => {
        const from = axis === 'y' ? window.scrollY : el.scrollLeft
        const t0 = performance.now()
        const step = (now) => {
          const k = Math.min(1, (now - t0) / ms)
          const v = from + (to - from) * ease(k)
          if (axis === 'y') window.scrollTo(0, v)
          else el.scrollLeft = v
          if (k < 1) requestAnimationFrame(step)
          else done()
        }
        requestAnimationFrame(step)
      })
    const pause = (ms) => new Promise((r) => setTimeout(r, ms))
    const top = (id) => document.getElementById(id).getBoundingClientRect().top + window.scrollY
    await glide(null, top('about'), 1300)
    await pause(1300)
    await glide(null, top('services'), 1300)
    await pause(900)
    await glide(null, top('services') + 380, 1100)
    await pause(900)
    await glide(null, top('gallery'), 1300)
    await pause(700)
    const rail = [...document.querySelectorAll('#gallery *')].find((e) => e.scrollWidth > e.clientWidth + 40 && getComputedStyle(e).overflowX !== 'visible')
    if (rail) {
      await glide(rail, rail.clientWidth * 0.85, 1200, 'x')
      await pause(800)
      await glide(rail, rail.clientWidth * 1.7, 1200, 'x')
      await pause(800)
    }
    await glide(null, top('studio'), 1400)
    await pause(1400)
    await glide(null, top('booking'), 1300)
    await pause(1500)
  })
  await cdp.send('Page.stopScreencast')
  await page.close()
  return frames
}

function encode(frames) {
  // Constant 30 fps from the screencast's variable frame timestamps.
  const list = frames
    .map((f, i) => {
      const next = frames[i + 1] ? frames[i + 1].t : f.t + 1 / 30
      return `file '${f.file}'\nduration ${Math.max(0.001, next - f.t).toFixed(4)}`
    })
    .join('\n') + `\nfile '${frames.at(-1).file}'\n`
  const listFile = path.join(FRAMES, 'scroll.txt')
  fs.writeFileSync(listFile, list)
  const total = frames.at(-1).t - frames[0].t + 1 / 30
  const ff = (a) => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...a], { stdio: 'inherit' })
  ff(['-f', 'concat', '-safe', '0', '-i', listFile, '-vf', 'fps=30,scale=510:1104:flags=lanczos', '-c:v', 'libx264', '-crf', '14', '-pix_fmt', 'yuv420p', path.join(FRAMES, 'screen.mp4')])
  const fade = Math.max(0, total - 0.6).toFixed(2)
  ff([
    '-loop', '1', '-i', path.join(FRAMES, 'story-video-bg.png'),
    '-i', path.join(FRAMES, 'screen.mp4'),
    '-loop', '1', '-i', path.join(FRAMES, 'story-video-frame.png'),
    '-filter_complex', `[0][1]overlay=285:666:shortest=1[a];[a][2]overlay=0:0:shortest=1,fade=t=in:st=0:d=0.4,fade=t=out:st=${fade}:d=0.6,format=yuv420p[v]`,
    '-map', '[v]', '-t', total.toFixed(2), '-r', '30', '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-profile:v', 'high', '-movflags', '+faststart',
    path.join(OUT, 'story-video.mp4'),
  ])
  console.log('✓ story-video.mp4', total.toFixed(1) + 's')
}

;(async () => {
  const browser = await chromium.launch()
  if (!args.has('--skip-shots')) await shots(browser)
  await slides(browser)
  if (!args.has('--skip-video')) encode(await recordScroll(browser))
  await browser.close()
})()
