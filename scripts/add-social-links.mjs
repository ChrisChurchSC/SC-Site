import { readFileSync, writeFileSync } from 'fs'

const OLD_CLOSING = `    <section className={styles.closingSlide}>
      <img src="https://cdn.sanity.io/files/ppq16wpu/production/f4fbfd1cf112b5d16a11cd8800b9b8d5f02ae496.gif" alt="" className={styles.closingGif} />
    </section>`

const NEW_CLOSING = `    <section className={styles.closingSlide}>
      <img src="https://cdn.sanity.io/files/ppq16wpu/production/f4fbfd1cf112b5d16a11cd8800b9b8d5f02ae496.gif" alt="" className={styles.closingGif} />
      <div className={styles.closingSocials}>
        <a href="https://www.instagram.com/_super_conscious/" target="_blank" rel="noopener noreferrer" className={styles.closingSocialLink}>Instagram</a>
        <a href="https://www.linkedin.com/company/super-conscious/" target="_blank" rel="noopener noreferrer" className={styles.closingSocialLink}>LinkedIn</a>
      </div>
    </section>`

// Capabilities.jsx (different whitespace)
const CAP_OLD = `    <section className={styles.closingSlide}>
      <img
        src="https://cdn.sanity.io/files/ppq16wpu/production/f4fbfd1cf112b5d16a11cd8800b9b8d5f02ae496.gif"
        alt=""
        className={styles.closingGif}
      />
    </section>`

const CAP_NEW = `    <section className={styles.closingSlide}>
      <img
        src="https://cdn.sanity.io/files/ppq16wpu/production/f4fbfd1cf112b5d16a11cd8800b9b8d5f02ae496.gif"
        alt=""
        className={styles.closingGif}
      />
      <div className={styles.closingSocials}>
        <a href="https://www.instagram.com/_super_conscious/" target="_blank" rel="noopener noreferrer" className={styles.closingSocialLink}>Instagram</a>
        <a href="https://www.linkedin.com/company/super-conscious/" target="_blank" rel="noopener noreferrer" className={styles.closingSocialLink}>LinkedIn</a>
      </div>
    </section>`

// ContentPackages.jsx (no trailing space after gif)
const PKG_OLD = `    <section className={styles.closingSlide}>
      <img src="https://cdn.sanity.io/files/ppq16wpu/production/f4fbfd1cf112b5d16a11cd8800b9b8d5f02ae496.gif" alt="" className={styles.closingGif}/>
    </section>`

const PKG_NEW = `    <section className={styles.closingSlide}>
      <img src="https://cdn.sanity.io/files/ppq16wpu/production/f4fbfd1cf112b5d16a11cd8800b9b8d5f02ae496.gif" alt="" className={styles.closingGif}/>
      <div className={styles.closingSocials}>
        <a href="https://www.instagram.com/_super_conscious/" target="_blank" rel="noopener noreferrer" className={styles.closingSocialLink}>Instagram</a>
        <a href="https://www.linkedin.com/company/super-conscious/" target="_blank" rel="noopener noreferrer" className={styles.closingSocialLink}>LinkedIn</a>
      </div>
    </section>`

const files = [
  ['src/pages/AgencyCapabilities.jsx', OLD_CLOSING, NEW_CLOSING],
  ['src/pages/BrandSystems.jsx',        OLD_CLOSING, NEW_CLOSING],
  ['src/pages/ContentPrograms.jsx',     OLD_CLOSING, NEW_CLOSING],
  ['src/pages/DigitalProducts.jsx',     OLD_CLOSING, NEW_CLOSING],
  ['src/pages/Capabilities.jsx',        CAP_OLD,     CAP_NEW],
  ['src/pages/ContentPackages.jsx',     PKG_OLD,     PKG_NEW],
]

for (const [file, from, to] of files) {
  let content = readFileSync(file, 'utf8')
  if (content.includes(from)) {
    writeFileSync(file, content.split(from).join(to))
    console.log('Updated:', file)
  } else {
    console.warn('NOT FOUND in:', file)
  }
}
