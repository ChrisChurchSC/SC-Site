import styles from './AdoptWindow.module.css'

/**
 * WHO IS WORKING IN IT — the screen for Build's "Adopt" step.
 *
 * Adopt is the part most brand projects skip: the system exists but nobody
 * outside the room can use it. So this shows the people in it — the client's
 * own team, their partners, their agencies — with what each one can do.
 *
 * SEATS AND INVITES ARE REAL. The platform is priced by seat and invites are
 * a permission the MCP connection explicitly does not have — a person issues
 * them. Roles here are read as access rather than job titles for that
 * reason.
 *
 * The names are generic on purpose: a screen naming a real person's team
 * would be a claim about an engagement. The rows are sample and the panel
 * says so.
 *
 * THE AVATARS ARE DRAWN, NOT PHOTOGRAPHS. There are no portraits in this
 * repo, and a stock face on a screen about "your team" is a picture of
 * somebody who is not on it. Each seat gets a two-tone disc with initials
 * over it, which is what a profile picture looks like at 20px without being
 * one. The initials are nonsense pairs — recognisable ones would be naming
 * people.
 */
const PALETTE = [
  ['#df4ed6', '#7a3fd4'],
  ['#4ecfb3', '#2f8f9d'],
  ['#5a76e5', '#3d4fb8'],
  ['#d47a3f', '#9d552f'],
  ['#8f4ed4', '#4e3fd4'],
  ['#4ec4d4', '#3f7ad4'],
]

const INITIALS = ['AK', 'RM', 'TS', 'JL', 'PN', 'CD', 'MO', 'EV', 'BH', 'SR', 'DW', 'FA', 'GN', 'LQ', 'YT']

/* Deterministic, so a redeploy does not reshuffle the faces. */
function seatSeeds(offset, count) {
  return Array.from({ length: count }, (_, i) => {
    const k = offset + i
    return { colors: PALETTE[k % PALETTE.length], initials: INITIALS[k % INITIALS.length] }
  })
}

const SEATS = [
  { group: 'Marketing team', seats: 6, state: 'Trained' },
  { group: 'Product & design', seats: 4, state: 'Trained' },
  { group: 'Media agency', seats: 3, state: 'Trained' },
  { group: 'Freelance writers', seats: 2, state: 'Invited' },
]

export default function AdoptWindow() {
  const total = SEATS.reduce((n, s) => n + s.seats, 0)

  return (
    <div className={styles.window}>
      <div className={styles.head}>
        <span className={styles.crumbMuted}>SC-Brand</span>
        <span className={styles.slash}>/</span>
        <span className={styles.name}>Access</span>
        <span className={styles.badge}>Sample data</span>
      </div>

      <div className={styles.tabs}>
        <span className={styles.tabOn}>People</span>
        <span className={styles.tab}>Training</span>
        <span className={styles.count}>{total} seats</span>
      </div>

      <div className={styles.list}>
        {SEATS.map(({ group, seats, state }, rowIndex) => (
          <div key={group} className={styles.row}>
            <span className={styles.avatars} aria-hidden="true">
              {seatSeeds(rowIndex * 4, Math.min(seats, 4)).map(({ colors, initials }, i) => (
                <span
                  key={i}
                  className={styles.avatar}
                  style={{ background: `linear-gradient(140deg, ${colors[0]}, ${colors[1]})` }}
                >
                  {initials}
                </span>
              ))}
              {seats > 4 && <span className={styles.more}>+{seats - 4}</span>}
            </span>
            <span className={styles.group}>{group}</span>
            <span className={state === 'Trained' ? styles.done : styles.pending}>{state}</span>
          </div>
        ))}
      </div>

    </div>
  )
}
