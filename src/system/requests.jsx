import { useState } from 'react'
import s from './system.module.css'
import { Icon, Avatar, Button } from './primitives'
import { Path } from './browser'

/* Requests — the list-of-open-work pattern.
 *
 * Reviews here, but the shape fits anything with an author, an age, a state
 * and a decision waiting at the end of it: issues, approvals, change requests.
 *
 * The thing that makes this pattern work, and the thing most imitations drop:
 * a request is an object in its own right, not a filtered view of the things
 * it touches. It has its own id, its own conversation and its own outcome, and
 * it outlives the file it changes. A "reviews" tab that is really a file list
 * filtered by status cannot hold a conversation, cannot be assigned, and
 * disappears the moment the status changes.
 */

export const REQUEST_STATES = {
  draft: { icon: 'draft', label: 'Draft', tone: 'muted' },
  open: { icon: 'request', label: 'Open', tone: 'open' },
  approved: { icon: 'success', label: 'Approved', tone: 'good' },
  changes: { icon: 'error', label: 'Changes requested', tone: 'bad' },
  merged: { icon: 'merged', label: 'Published', tone: 'merged' },
  closed: { icon: 'close', label: 'Closed', tone: 'muted' },
}

const toneClass = {
  open: s.stOpen, good: s.stGood, bad: s.stBad, merged: s.stMerged, muted: s.stMuted,
}

export function RequestState({ state, withLabel }) {
  const meta = REQUEST_STATES[state] ?? REQUEST_STATES.open
  return (
    <span className={`${s.state} ${toneClass[meta.tone]}`}>
      <Icon name={meta.icon} size={15} />
      {withLabel && meta.label}
    </span>
  )
}

/* The size of a change, as a number and as a shape. Five blocks rather than a
   proportional bar: at a glance you want "mostly additions" or "mostly
   deletions", and five buckets carry that without implying precision. */
export function DiffStat({ added = 0, removed = 0 }) {
  const total = added + removed
  let up = total === 0 ? 0 : Math.round((added / total) * 5)
  if (added > 0 && up === 0) up = 1
  if (removed > 0 && up === 5) up = 4
  return (
    <span className={s.diffStat}>
      <span className={s.diffAdd}>+{added}</span>
      <span className={s.diffCut}>−{removed}</span>
      <span className={s.diffBlocks} aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className={`${s.diffBlock} ${i < up ? s.diffBlockAdd : s.diffBlockCut}`} />
        ))}
      </span>
    </span>
  )
}

/* Open and closed are counted separately and switched between, rather than
   filtered with everything in one pile. Closed work is a different question
   from open work — you go looking for it deliberately. */
export function RequestList({ requests, filter, onFilter, counts, onOpen }) {
  return (
    <div className={s.browser}>
      <div className={s.requestBar}>
        <span className={s.requestFilters}>
          {[['open', 'Open'], ['closed', 'Closed']].map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={filter === key}
              className={`${s.requestFilter} ${filter === key ? s.requestFilterOn : ''}`}
              onClick={() => onFilter(key)}
            >
              <Icon name={key === 'open' ? 'request' : 'check'} size={13} />
              {counts[key]} {label}
            </button>
          ))}
        </span>
      </div>

      <div className={s.browserList} role="list">
        {requests.length === 0 && (
          <div className={s.browserEmpty}>
            <span className={s.eyebrow}>Nothing here</span>
            <span className={s.browserEmptyLine}>
              {filter === 'open' ? 'No open reviews. Everything is published.' : 'Nothing closed yet.'}
            </span>
          </div>
        )}
        {requests.map((r) => (
          <button key={r.id} type="button" role="listitem" className={s.requestRow} onClick={() => onOpen(r)}>
            <RequestState state={r.draft && r.state === 'open' ? 'draft' : r.state} />
            <span className={s.requestMain}>
              <span className={s.requestTitle}>{r.title}</span>
              {(r.labels?.length > 0 || r.draft) && (
                <span className={s.requestLabels}>
                  {r.draft && <span className={`${s.requestLabel} ${s.requestLabelDraft}`}>Draft</span>}
                  {r.labels?.map((l) => <span key={l} className={s.requestLabel}>{l}</span>)}
                </span>
              )}
              {/* The id and the age answer "which one" and "how stale" — the
                  two questions asked of every row in a queue. */}
              <span className={s.requestMeta}>
                #{r.id} opened {r.opened} ago by {r.author} · {r.asset}
              </span>
            </span>
            <span className={s.requestSide}>
              {r.checks?.length > 0 && <ChecksGlyph checks={r.checks} />}
              {r.reviewers?.length > 0 && (
                <span className={s.requestAvatars}>
                  {r.reviewers.map((p) => <Avatar key={p.name ?? p} name={p.name ?? p} size={20} />)}
                </span>
              )}
              {r.comments > 0 && (
                <span className={s.requestComments}>
                  <Icon name="comment" size={13} />{r.comments}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* Rolled up to one mark in the list, expanded to a list in the detail. Nobody
   scanning a queue wants four check names per row; they want to know whether
   this one is clean. */
function ChecksGlyph({ checks }) {
  const bad = checks.filter((c) => c.state === 'fail').length
  const running = checks.filter((c) => c.state === 'running').length
  const tone = bad ? 'bad' : running ? 'muted' : 'good'
  const icon = bad ? 'error' : running ? 'clock' : 'success'
  const label = bad ? `${bad} failing` : running ? `${running} running` : 'All checks passed'
  return (
    <span className={`${s.state} ${toneClass[tone]}`} title={label} aria-label={label}>
      <Icon name={icon} size={14} />
    </span>
  )
}

const CHECK_TONE = { pass: 'good', fail: 'bad', running: 'muted', skip: 'muted' }
const CHECK_ICON = { pass: 'success', fail: 'error', running: 'clock', skip: 'minus' }

/* ── Detail ────────────────────────────────────────────────────────────────
   Four views of one request, a conversation, a status panel that says what is
   true before it offers a button, and a rail of the facts somebody set rather
   than argued. In that order, because a reviewer reads top to bottom once and
   then acts. */
export function RequestDetail({
  request, path, onNavigate,
  onApprove, onRequestChanges, onPublish, onClose, onReopen, onReady, onComment,
  children,
}) {
  const [view, setView] = useState('Conversation')
  const [draft, setDraft] = useState('')
  const [preview, setPreview] = useState(false)

  const live = !['merged', 'closed'].includes(request.state)
  const stateKey = request.draft && request.state === 'open' ? 'draft' : request.state
  const meta = REQUEST_STATES[stateKey] ?? REQUEST_STATES.open
  const approvals = request.timeline.filter((t) => t.kind === 'approved').length
  const revisions = request.revisions ?? []
  const checks = request.checks ?? []
  const files = request.files ?? []
  const failing = checks.filter((c) => c.state === 'fail').length
  const running = checks.filter((c) => c.state === 'running').length
  const added = files.reduce((n, f) => n + (f.added ?? 0), 0)
  const removed = files.reduce((n, f) => n + (f.removed ?? 0), 0)

  const views = [
    { key: 'Conversation', icon: 'comment', count: request.comments },
    { key: 'Revisions', icon: 'commit', count: revisions.length },
    { key: 'Checks', icon: 'checklist', count: checks.length },
    { key: 'Assets changed', icon: 'diff', count: files.length },
  ]

  const send = () => {
    if (!draft.trim()) return
    onComment?.(draft.trim())
    setDraft('')
    setPreview(false)
  }

  return (
    <div className={s.requestPage}>
      <Path segments={path} onNavigate={onNavigate} />

      {/* Title, then the sentence saying what this request would do if you said
          yes. Everything else on the page is evidence for that sentence. */}
      <div className={s.requestHead}>
        <h2 className={s.requestHeadTitle}>
          {request.title} <span className={s.requestHeadId}>#{request.id}</span>
        </h2>
        <div className={s.requestHeadMeta}>
          <span className={`${s.stateBadge} ${toneClass[meta.tone]}`}>
            <Icon name={meta.icon} size={13} />{meta.label}
          </span>
          <span className={s.requestHeadLine}>
            <strong>{request.author}</strong> wants to publish{' '}
            {revisions.length} {revisions.length === 1 ? 'revision' : 'revisions'} into{' '}
            <span className={s.ref}>{request.base ?? 'v2.1 — current'}</span> from{' '}
            <span className={s.ref}>{request.head ?? request.asset}</span>
          </span>
        </div>
      </div>

      <div className={s.requestViews}>
        <span className={s.requestViewTabs} role="tablist" aria-label="Request views">
          {views.map((v) => (
            <button
              key={v.key}
              type="button"
              role="tab"
              aria-selected={view === v.key}
              className={`${s.requestView} ${view === v.key ? s.requestViewOn : ''}`}
              onClick={() => setView(v.key)}
            >
              <Icon name={v.icon} size={14} />
              {v.key}
              {v.count > 0 && <span className={s.requestViewCount}>{v.count}</span>}
            </button>
          ))}
        </span>
        {files.length > 0 && <DiffStat added={added} removed={removed} />}
      </div>

      <div className={s.requestBody}>
        <div className={s.requestMainCol}>
          {view === 'Conversation' && (
            <>
              {children}

              <div className={s.timeline}>
                {request.timeline.map((t, i) => (
                  <div key={i} className={s.event}>
                    <span className={s.eventMark}>
                      {t.kind === 'comment'
                        ? <Avatar name={t.who} size={26} />
                        : <span className={`${s.eventIcon} ${eventTone(t.kind)}`}>
                            <Icon name={eventIcon(t.kind)} size={13} />
                          </span>}
                    </span>
                    {t.kind === 'comment' ? (
                      <div className={s.comment}>
                        <div className={s.commentHead}>
                          <span className={s.commentWho}>{t.who}</span>
                          <span className={s.commentWhen}>{t.when} ago</span>
                          {t.role && <span className={s.commentRole}>{t.role}</span>}
                        </div>
                        <p className={s.commentBody}>{t.body}</p>
                      </div>
                    ) : t.kind === 'pushed' ? (
                      /* Revisions land in the conversation where they happened,
                         not only in their own tab — a comment answering a change
                         reads wrong if the change isn't above it. */
                      <div className={s.pushed}>
                        <span className={s.eventText}>
                          <strong>{t.who}</strong> added {t.revisions.length}{' '}
                          {t.revisions.length === 1 ? 'revision' : 'revisions'} · {t.when} ago
                        </span>
                        <ul className={s.revList}>
                          {t.revisions.map((r) => (
                            <li key={r.hash} className={s.revRow}>
                              <Icon name="commit" size={13} />
                              <Avatar name={r.who} size={16} />
                              <span className={s.revTitle}>{r.title}</span>
                              <span className={s.revRight}>
                                {r.ok && <span className={s.stGood}><Icon name="check" size={12} /></span>}
                                <span className={s.revHash}>{r.hash}</span>
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <span className={s.eventText}>
                        <strong>{t.who}</strong> {eventLine(t)} · {t.when} ago
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* The status panel. Facts in the order a reviewer needs them: is
                  it live anywhere, does it pass, will it collide, is it even
                  finished — and only then a button. A publish control that does
                  not say whether anyone approved is asking for a rubber stamp. */}
              <div className={`${s.status} ${request.state === 'merged' ? s.statusDone : ''}`}>
                {request.preview && (
                  <div className={s.statusRow}>
                    <span className={`${s.statusMark} ${s.stMerged}`}><Icon name="upload" size={15} /></span>
                    <span className={s.statusText}>
                      <span className={s.statusTitle}>This review has a live preview</span>
                      <span className={s.statusNote}>{request.preview.note}</span>
                    </span>
                    <a
                      className={s.statusLink}
                      href={request.preview.href ?? '#'}
                      onClick={(e) => e.preventDefault()}
                    >
                      <Icon name="eye" size={13} />Show preview
                    </a>
                  </div>
                )}

                {checks.length > 0 && (
                  <div className={s.statusRow}>
                    <span className={`${s.statusMark} ${toneClass[failing ? 'bad' : running ? 'muted' : 'good']}`}>
                      <Icon name={failing ? 'error' : running ? 'clock' : 'success'} size={15} />
                    </span>
                    <span className={s.statusText}>
                      <span className={s.statusTitle}>
                        {failing ? `${failing} of ${checks.length} checks failed`
                          : running ? `${running} check${running === 1 ? '' : 's'} still running`
                            : 'All checks have passed'}
                      </span>
                      <span className={s.statusNote}>
                        {checks.length} check{checks.length === 1 ? '' : 's'} run on every revision
                      </span>
                    </span>
                    <button type="button" className={s.statusLink} onClick={() => setView('Checks')}>
                      Details<Icon name="chevron-right" size={13} />
                    </button>
                  </div>
                )}

                <div className={s.statusRow}>
                  <span className={`${s.statusMark} ${toneClass[request.conflicts ? 'bad' : 'good']}`}>
                    <Icon name={request.conflicts ? 'error' : 'success'} size={15} />
                  </span>
                  <span className={s.statusText}>
                    <span className={s.statusTitle}>
                      {request.conflicts
                        ? 'This conflicts with the current version'
                        : 'No conflicts with the current version'}
                    </span>
                    <span className={s.statusNote}>
                      {request.conflicts
                        ? 'Someone changed the same asset after this was opened.'
                        : 'Publishing can happen automatically.'}
                    </span>
                  </span>
                </div>

                {request.draft && live && (
                  <div className={s.statusRow}>
                    <span className={`${s.statusMark} ${s.stMuted}`}><Icon name="draft" size={15} /></span>
                    <span className={s.statusText}>
                      <span className={s.statusTitle}>This review is still a draft</span>
                      <span className={s.statusNote}>Drafts cannot be published.</span>
                    </span>
                    <Button size="sm" icon="request" onClick={onReady}>Ready for review</Button>
                  </div>
                )}

                <div className={s.statusFoot}>
                  <span className={s.decisionState}>
                    <Icon name={request.state === 'merged' ? 'merged' : approvals > 0 ? 'success' : 'clock'} size={15} />
                    {request.state === 'merged'
                      ? 'Published to the workspace'
                      : request.state === 'closed'
                        ? 'Closed without publishing'
                        : approvals > 0
                          ? `Approved by ${approvals} of ${request.reviewers?.length ?? approvals} reviewers`
                          : 'Waiting on review'}
                  </span>
                  {live && (
                    <span className={s.decisionActions}>
                      <Button size="sm" icon="error" onClick={onRequestChanges}>Request changes</Button>
                      <Button size="sm" icon="check" onClick={onApprove}>Approve</Button>
                      <Button
                        size="sm"
                        variant="solid"
                        icon="merged"
                        onClick={onPublish}
                        disabled={approvals === 0 || Boolean(request.draft) || failing > 0 || Boolean(request.conflicts)}
                        title={blockedReason({ approvals, request, failing })}
                      >
                        Publish changes
                      </Button>
                    </span>
                  )}
                </div>
              </div>

              {/* The composer. Write and Preview are the same field seen two
                  ways, so they are tabs on the box rather than two controls. */}
              <div className={s.composer}>
                <Avatar name="chris" size={26} />
                <div className={s.composerBox}>
                  <div className={s.composerTabs}>
                    {['Write', 'Preview'].map((k) => (
                      <button
                        key={k}
                        type="button"
                        aria-pressed={preview === (k === 'Preview')}
                        className={`${s.composerTab} ${preview === (k === 'Preview') ? s.composerTabOn : ''}`}
                        onClick={() => setPreview(k === 'Preview')}
                      >
                        {k}
                      </button>
                    ))}
                  </div>
                  {preview ? (
                    <p className={`${s.commentBody} ${draft.trim() ? '' : s.composerEmpty}`}>
                      {draft.trim() || 'Nothing to preview.'}
                    </p>
                  ) : (
                    <textarea
                      className={s.composerField}
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Leave a comment"
                      rows={4}
                    />
                  )}
                  <div className={s.composerFoot}>
                    <span className={s.composerHint}>Kept with the review, not with the asset.</span>
                    <span className={s.composerActions}>
                      {live && <Button size="sm" icon="close" onClick={onClose}>Close review</Button>}
                      {request.state === 'closed' && (
                        <Button size="sm" icon="refresh" onClick={onReopen}>Reopen review</Button>
                      )}
                      <Button size="sm" variant="solid" icon="comment" onClick={send} disabled={!draft.trim()}>
                        Comment
                      </Button>
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {view === 'Revisions' && (
            <ul className={`${s.revList} ${s.revListAlone}`}>
              {revisions.map((r) => (
                <li key={r.hash} className={s.revRow}>
                  <Icon name="commit" size={13} />
                  <Avatar name={r.who} size={16} />
                  <span className={s.revTitle}>{r.title}</span>
                  <span className={s.revRight}>
                    <span className={s.revWhen}>{r.when} ago</span>
                    {r.ok && <span className={s.stGood}><Icon name="check" size={12} /></span>}
                    <span className={s.revHash}>{r.hash}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}

          {view === 'Checks' && (
            <ul className={s.checkList}>
              {checks.map((c) => (
                <li key={c.name} className={s.checkRow}>
                  <span className={`${s.statusMark} ${toneClass[CHECK_TONE[c.state]]}`}>
                    <Icon name={CHECK_ICON[c.state]} size={15} />
                  </span>
                  <span className={s.statusText}>
                    <span className={s.statusTitle}>{c.name}</span>
                    <span className={s.statusNote}>{c.note}</span>
                  </span>
                  <span className={s.revWhen}>{c.took}</span>
                </li>
              ))}
            </ul>
          )}

          {view === 'Assets changed' && (
            <ul className={s.fileChangeList}>
              {files.map((f) => (
                <li key={f.name} className={s.fileChangeRow}>
                  <Icon name={f.icon ?? 'file'} size={14} />
                  <span className={s.fileChangeName}>{f.name}</span>
                  <span className={s.fileChangeNote}>{f.note}</span>
                  <DiffStat added={f.added ?? 0} removed={f.removed ?? 0} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* The rail holds what somebody set, not what somebody argued. Every
            row here is a fact with an owner. */}
        <aside className={s.requestRail}>
          <RailBlock title="Reviewers">
            {request.reviewers?.length
              ? request.reviewers.map((p) => {
                  const person = p.name ? p : { name: p }
                  return (
                    <div key={person.name} className={s.railPerson}>
                      <Avatar name={person.name} size={20} />
                      <span className={s.railName}>{person.name}</span>
                      {person.state && <RequestState state={person.state} />}
                    </div>
                  )
                })
              : <span className={s.railEmpty}>No reviews yet</span>}
          </RailBlock>

          <RailBlock title="Assignees">
            {request.assignees?.length
              ? request.assignees.map((n) => (
                  <div key={n} className={s.railPerson}>
                    <Avatar name={n} size={20} />
                    <span className={s.railName}>{n}</span>
                  </div>
                ))
              : <span className={s.railEmpty}>No one assigned</span>}
          </RailBlock>

          <RailBlock title="Labels">
            {request.labels?.length
              ? (
                <span className={s.requestLabels}>
                  {request.labels.map((l) => <span key={l} className={s.requestLabel}>{l}</span>)}
                </span>
              )
              : <span className={s.railEmpty}>None yet</span>}
          </RailBlock>

          <RailBlock title="Campaign">
            {request.campaign
              ? <span className={s.railValue}>{request.campaign}</span>
              : <span className={s.railEmpty}>Not part of a campaign</span>}
          </RailBlock>

          <RailBlock title={`Participants ${request.participants?.length ?? 0}`}>
            <span className={s.requestAvatars}>
              {(request.participants ?? []).map((p) => <Avatar key={p} name={p} size={24} />)}
            </span>
          </RailBlock>

          <div className={s.railActions}>
            <button type="button" className={s.railAction}>
              <Icon name="lock" size={14} />Lock conversation
            </button>
            <button type="button" className={s.railAction}>
              <Icon name="archive" size={14} />Archive review
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}

function RailBlock({ title, children }) {
  return (
    <section className={s.railBlock}>
      <h3 className={s.railTitle}>{title}</h3>
      <div className={s.railBody}>{children}</div>
    </section>
  )
}

function blockedReason({ approvals, request, failing }) {
  if (request.draft) return 'Drafts cannot be published'
  if (request.conflicts) return 'Resolve the conflict first'
  if (failing > 0) return 'A check is failing'
  if (approvals === 0) return 'Needs at least one approval'
  return undefined
}

const eventIcon = (kind) => ({
  approved: 'success', changes: 'error', closed: 'close',
  reopened: 'refresh', ready: 'request', merged: 'merged',
}[kind] ?? 'clock')

const eventTone = (kind) => ({
  approved: s.stGood, changes: s.stBad, merged: s.stMerged, closed: s.stMuted,
}[kind] ?? '')

const eventLine = (t) => ({
  approved: 'approved these changes',
  changes: 'requested changes',
  closed: 'closed this review',
  reopened: 'reopened this review',
  ready: 'marked this ready for review',
  merged: 'published these changes',
}[t.kind] ?? t.body)
