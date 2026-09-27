import { motion, MotionConfig, stagger, type Variants } from 'motion/react'
import './App.css'

const container: Variants = {
  hidden: {},
  visible: { transition: { delayChildren: stagger(0.12) } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 24 },
  },
}

const features = [
  {
    title: 'Entrées',
    text: 'Les éléments apparaissent en cascade grâce aux variants et à stagger().',
  },
  {
    title: 'Gestes',
    text: 'whileHover et whileTap rendent boutons et cartes réactifs au survol et au clic.',
  },
  {
    title: 'Défilement',
    text: 'whileInView lance l’animation quand la section entre dans l’écran.',
  },
]

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <motion.section
        id="hero"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <motion.p className="eyebrow" variants={item}>
          Vite + React + Motion
        </motion.p>
        <motion.h1 variants={item}>Des sites qui prennent vie</motion.h1>
        <motion.p variants={item}>
          Modifiez <code>src/App.tsx</code> pour commencer.
        </motion.p>
        <motion.a
          className="cta"
          href="https://motion.dev/docs/react"
          target="_blank"
          rel="noreferrer"
          variants={item}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Documentation Motion
        </motion.a>
      </motion.section>

      <motion.section
        id="features"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {features.map((feature) => (
          <motion.article
            key={feature.title}
            className="card"
            variants={item}
            whileHover={{ y: -6 }}
          >
            <h2>{feature.title}</h2>
            <p>{feature.text}</p>
          </motion.article>
        ))}
      </motion.section>
    </MotionConfig>
  )
}

export default App
