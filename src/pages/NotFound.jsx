import { NavLink } from 'react-router-dom'
import styles from './NotFound.module.css'
import { useMeta } from '../hooks/useMeta'

export default function NotFound() {
  useMeta({
    title: '404 | Super Conscious',
    description: 'Page not found.',
  })
  return (
    <main className={styles.main}>
      <div className={styles.inner}>
        <p className={styles.label}>[ 404 ]</p>
        <h1 className={styles.headline}>This page got lost in the work.</h1>
        <p className={styles.sub}>The URL you followed doesn&apos;t exist, or moved.</p>
        <div className={styles.actions}>
          <NavLink to="/" className={styles.action}>Back to home</NavLink>
          <NavLink to="/work" className={styles.action}>See the work</NavLink>
        </div>
      </div>
    </main>
  )
}
