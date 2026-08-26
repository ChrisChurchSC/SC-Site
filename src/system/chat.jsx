import { useEffect, useRef, useState } from 'react'
import s from './system.module.css'
import { Icon, IconButton, Avatar } from './primitives'

/* Conversation.
 *
 * The parts that matter are the ones a chat UI usually skips: a visible
 * thinking state, a visible tool step, a stream you can watch arrive, and an
 * error you can retry. A chat that shows nothing between the question and the
 * answer looks broken every time the answer takes more than a second.
 *
 * Every timer is tracked and cleared on unmount, so leaving mid-stream cannot
 * leave one firing into a component that no longer exists.
 */

/* Reserves the full height of the finished paragraph before it starts, so the
   layout doesn't reflow line by line as tokens land. */
export function StreamingText() {
  const full = 'The card surface is #161616 on a #0a0a0a ground, at a 4px radius — the one surface the whole site uses.'
  const [n, setN] = useState(0)
  const [running, setRunning] = useState(false)

  const run = () => {
    if (running) return
    setRunning(true)
    setN(0)
    const id = setInterval(() => {
      setN((v) => {
        if (v >= full.length) {
          clearInterval(id)
          setRunning(false)
          return v
        }
        return v + 2
      })
    }, 24)
  }

  return (
    <div className={s.stream}>
      <p className={s.streamText}>
        <span className={s.streamGhost}>{full}</span>
        <span className={s.streamLive}>
          {full.slice(0, n)}
          {running && <span className={s.caret} />}
        </span>
      </p>
      <button type="button" className={s.btnDemo} onClick={run} disabled={running}>
        {running ? 'Streaming' : 'Replay'}
      </button>
    </div>
  )
}

export function ResponseFeedback() {
  const [vote, setVote] = useState(null)
  return (
    <div className={s.voteRow}>
      {[['up', 'Helpful'], ['down', 'Not helpful']].map(([k, label]) => (
        <button
          key={k}
          type="button"
          aria-pressed={vote === k}
          aria-label={label}
          className={`${s.voteBtn} ${vote === k ? s.voteBtnOn : ''}`}
          onClick={() => setVote((v) => (v === k ? null : k))}
        >
          {k === 'up' ? '▲' : '▼'}
        </button>
      ))}
      <span className={s.voteNote}>
        {vote === 'up' ? 'Thanks.' : vote === 'down' ? 'Noted — what was wrong?' : 'Was this useful?'}
      </span>
    </div>
  )
}

export function Chat({
  replies = {},
  fallback = { text: 'I do not have an answer for that one.', cite: [], tool: null },
  suggestions = [],
  models = ['Studio', 'Fast'],
}) {
  const [turns, setTurns] = useState([])
  const [draft, setDraft] = useState('')
  const [phase, setPhase] = useState('idle') // idle | thinking | tool | streaming | error
  const [stream, setStream] = useState('')
  const [attach, setAttach] = useState(null)
  const [model, setModel] = useState('Studio')
  const [failNext, setFailNext] = useState(false)
  const timers = useRef([])
  const logRef = useRef(null)

  // Every timeout is tracked, so unmounting mid-stream cannot leave one
  // firing into a component that no longer exists.
  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = [] }
  useEffect(() => clearTimers, [])

  const scrollDown = () => {
    const el = logRef.current
    if (el) el.scrollTop = el.scrollHeight
  }
  useEffect(scrollDown, [turns, stream, phase])

  const answer = (question) => {
    const reply = replies[question] ?? fallback
    setPhase('thinking')
    timers.current.push(setTimeout(() => {
      if (reply.tool) setPhase('tool')
      timers.current.push(setTimeout(() => {
        if (failNext) { setPhase('error'); setFailNext(false); return }
        setPhase('streaming')
        setStream('')
        let i = 0
        const tick = () => {
          i += 3
          setStream(reply.text.slice(0, i))
          if (i < reply.text.length) timers.current.push(setTimeout(tick, 22))
          else {
            setTurns((t) => [...t, { role: 'bot', ...reply }])
            setStream('')
            setPhase('idle')
          }
        }
        tick()
      }, reply.tool ? 700 : 0))
    }, 500))
  }

  const send = (text) => {
    const q = (text ?? draft).trim()
    if (!q || phase !== 'idle') return
    setTurns((t) => [...t, { role: 'user', text: q, attach }])
    setDraft('')
    setAttach(null)
    answer(q)
  }

  const stop = () => {
    clearTimers()
    if (stream) setTurns((t) => [...t, { role: 'bot', text: stream, cite: [], stopped: true }])
    setStream('')
    setPhase('idle')
  }

  const retry = () => {
    const lastUser = [...turns].reverse().find((t) => t.role === 'user')
    if (lastUser) { setPhase('idle'); answer(lastUser.text) }
  }

  const regenerate = (i) => {
    const q = [...turns.slice(0, i)].reverse().find((t) => t.role === 'user')
    if (!q) return
    setTurns((t) => t.filter((_, n) => n !== i))
    answer(q.text)
  }

  const busy = phase !== 'idle' && phase !== 'error'

  return (
    <div className={s.chat}>
      {/* Header: model, context, reset. A chat with no visible model is a
          chat nobody can reason about when the answer is wrong. */}
      <div className={s.chatHead}>
        <div className={s.chatModel}>
          {models.map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={model === m}
              className={`${s.xSegItem} ${model === m ? s.xSegItemOn : ''}`}
              onClick={() => setModel(m)}
            >
              {m}
            </button>
          ))}
        </div>
        <div className={s.chatHeadRight}>
          <span className={s.chatCtx}>{turns.length} / 20 turns</span>
          <button
            type="button"
            className={s.xTableToggle}
            onClick={() => { clearTimers(); setTurns([]); setStream(''); setPhase('idle') }}
          >
            Reset
          </button>
        </div>
      </div>

      <div className={s.chatLog} ref={logRef}>
        {turns.length === 0 && phase === 'idle' && (
          /* Empty state. A blank composer is a blank page — the suggestions
             are what make the first question possible. */
          <div className={s.chatEmpty}>
            <span className={s.cardEyebrow}>Ask the system</span>
            <span className={s.chatEmptyLine}>
              It knows the tokens, not your project.
            </span>
            <div className={s.promptRow}>
              {suggestions.map((p) => (
                <button key={p} type="button" className={s.prompt} onClick={() => send(p)}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {turns.map((t, i) => (
          <div key={i} className={t.role === 'user' ? s.turnUser : s.turnBot}>
            {t.role === 'user' ? (
              <span className={s.userBubble}>
                {t.attach && (
                  <span className={s.attachChip}>
                    <Icon name="file" size={11} />{t.attach}
                  </span>
                )}
                {t.text}
              </span>
            ) : (
              <div className={s.botTurn}>
                <p className={s.botText}>
                  {t.text}
                  {t.stopped && <span className={s.stoppedTag}>stopped</span>}
                </p>
                {t.code && <pre className={s.chatCode}>{t.code}</pre>}
                {t.cite?.length > 0 && (
                  <span className={s.citeRow}>
                    {t.cite.map(([label, href]) => (
                      <a key={label} href={href} className={s.citation}>{label}</a>
                    ))}
                  </span>
                )}
                {/* Visible on hover, but always in the tab order — a keyboard
                    user cannot hover. */}
                <div className={s.msgActions}>
                  <button type="button" className={s.msgAction} onClick={() => writeToClipboard(t.text)}>
                    <Icon name="copy" size={12} />Copy
                  </button>
                  <button type="button" className={s.msgAction} onClick={() => regenerate(i)}>
                    <Icon name="refresh" size={12} />Regenerate
                  </button>
                  <ResponseFeedback />
                </div>
              </div>
            )}
          </div>
        ))}

        {phase === 'thinking' && (
          <div className={s.turnBot}>
            <span className={s.thinking} aria-label="Thinking"><i /><i /><i /></span>
          </div>
        )}

        {phase === 'tool' && (
          /* A tool call is shown, not hidden. An answer that quietly searched
             something is an answer nobody can check. */
          <div className={s.turnBot}>
            <span className={s.toolCall}>
              <Icon name="search" size={12} />
              {replies[[...turns].reverse().find((t) => t.role === 'user')?.text]?.tool ?? 'Working'}
              <span className={s.thinking}><i /><i /><i /></span>
            </span>
          </div>
        )}

        {phase === 'streaming' && (
          <div className={s.turnBot}>
            <p className={s.botText}>{stream}<span className={s.caret} /></p>
          </div>
        )}

        {phase === 'error' && (
          <div className={s.turnBot}>
            <div className={s.chatError} role="alert">
              <Icon name="warning" size={13} />
              <span>That request didn't complete.</span>
              <button type="button" className={s.msgAction} onClick={retry}>
                <Icon name="refresh" size={12} />Retry
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Follow-ups after an answer — the next question is usually easier to
          recognise than to compose. */}
      {phase === 'idle' && turns.length > 0 && (
        <div className={s.promptRow}>
          {suggestions.filter((s) => !turns.some((t) => t.text === s)).slice(0, 2).map((p) => (
            <button key={p} type="button" className={s.prompt} onClick={() => send(p)}>
              {p}
            </button>
          ))}
        </div>
      )}

      <form className={s.xComposer} onSubmit={(e) => { e.preventDefault(); send() }}>
        <div className={s.xComposerField}>
          {attach && (
            <span className={s.attachChip}>
              <Icon name="file" size={11} />{attach}
              <button type="button" onClick={() => setAttach(null)} aria-label="Remove attachment">
                <Icon name="close" size={10} />
              </button>
            </span>
          )}
          <input
            className={s.composerInput}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={busy ? 'Working…' : 'Ask about a token…'}
            aria-label="Message"
          />
        </div>
        <button
          type="button"
          className={s.iconOnly}
          onClick={() => setAttach('brief.pdf')}
          aria-label="Attach a file"
        >
          <Icon name="upload" size={14} />
        </button>
        {busy ? (
          <button type="button" className={s.composerSend} onClick={stop}>Stop</button>
        ) : (
          <button type="submit" className={s.composerSend} disabled={!draft.trim()}>Send</button>
        )}
      </form>

      <div className={s.chatFoot}>
        <span className={s.chatHint}>
          Canned replies · {model} · {draft.length}/500
        </span>
        <button
          type="button"
          className={`${s.chatFail} ${failNext ? s.chatFailOn : ''}`}
          onClick={() => setFailNext((f) => !f)}
        >
          {failNext ? 'Next reply will fail' : 'Simulate failure'}
        </button>
      </div>
    </div>
  )
}
