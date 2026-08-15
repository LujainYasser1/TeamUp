import React from 'react'
import { __css } from '../lib/style'
import logo from '../assets/logo.svg'

export default function AppShell({ V }) {
  if (!(V.isApp)) return null
  return (
    <>
      <div style={__css("min-height:100vh")}>
        <div style={__css(`position:fixed;inset-block:0;inset-inline-start:0;width:258px;z-index:60;display:flex;flex-direction:column;gap:8px;padding:22px 16px 18px;background:#fff;border-inline-end:1px solid #e6e8e4;transform:${V.sidebarShift};transition:transform .26s cubic-bezier(.2,.8,.2,1)`)}>
          <div style={__css("display:flex;align-items:center;justify-content:space-between;padding-inline:8px;margin-bottom:18px")}>
            <div style={__css("display:inline-flex;align-items:center;gap:10px;direction:ltr")}>
              <img src={logo} alt="TeamUp" width="26" height="26" style={__css("width:26px;height:26px;flex:none")} />
              <span style={__css("font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:17px;letter-spacing:-.03em;color:#0b2f26")}>
                TeamUp
              </span>
            </div>
          </div>
          <div style={__css("display:flex;align-items:center;gap:8px;margin-bottom:14px")}>
            <button className="hv5" onClick={V.goMe} style={__css("display:flex;align-items:center;gap:11px;flex:1;min-width:0;padding:12px;border:1px solid #e6e8e4;border-radius:16px;background:#fff;cursor:pointer;text-align:start;transition:border-color .16s,background .16s")}>
              <span style={__css(`width:38px;height:38px;border-radius:50%;display:grid;place-items:center;background:${V.meAvatarBg};color:#fff;font-weight:700;font-size:14px;flex:none`)}>
                {V.meInitials}
              </span>
              <span style={__css("display:flex;flex-direction:column;line-height:1.3;overflow:hidden")}>
                <strong style={__css("font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>
                  {V.meName}
                </strong>
                <span style={__css("font-size:13px;color:#6b7a74;white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>
                  {V.meRole}
                </span>
              </span>
            </button>
          </div>
          <div style={__css("display:flex;flex-direction:column;gap:4px")}>
            {(V.nav || []).map((n, __i7) => (<React.Fragment key={__i7}>
              <button onClick={n.go} data-active={n.active} style={__css(`display:flex;align-items:center;gap:12px;width:100%;padding:11px 14px;border:0;border-radius:14px;background:${n.bg};color:${n.fg};font-size:14.5px;font-weight:600;cursor:pointer;text-align:start;white-space:nowrap`)}>
                <svg width="19" height="19" viewBox={"0 0 24 24"} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={__css("flex:none")}>
                  <path d={n.p1} />
                  <path d={n.p2} />
                </svg>
                <span style={__css("flex:1")}>
                  {n.label}
                </span>
                {n.badge ? (<>
                  <span style={__css("display:inline-grid;place-items:center;min-width:20px;height:20px;padding:0 6px;border-radius:999px;background:#77519a;color:#fff;font-size:11.5px;font-weight:700")}>
                    {n.badge}
                  </span>
                </>) : null}
              </button>
            </React.Fragment>))}
          </div>
          <div style={__css("margin-top:auto;padding-top:14px;border-top:1px solid #e6e8e4")}>
            <button className="hv6" onClick={V.askLogout} style={__css("display:flex;align-items:center;gap:12px;width:100%;padding:12px 14px;border:0;border-radius:14px;background:transparent;color:#6b7a74;font-size:14px;font-weight:600;cursor:pointer;text-align:start;white-space:nowrap;transition:background .16s,color .16s")}>
              <svg width="18" height="18" viewBox={"0 0 24 24"} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={__css("flex:none")}>
                <path d="M15 4.5h3a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-3" />
                <path d="M10.5 8 14.5 12l-4 4M14 12H4" />
              </svg>
              {V.L.logout}
            </button>
          </div>
        </div>
        <div style={__css(`margin-inline-start:${V.mainOffset};min-height:100vh;display:flex;flex-direction:column;transition:margin .26s cubic-bezier(.2,.8,.2,1)`)}>
          <div style={__css("position:sticky;top:0;z-index:50;display:flex;align-items:center;gap:12px;height:58px;padding-inline:20px;background:rgba(255,255,255,.92);border-bottom:1px solid #e6e8e4;backdrop-filter:blur(14px)")}>
            <button className="hv3" onClick={V.toggleSidebar} title={V.L.menu} aria-label={V.L.menu} aria-expanded={V.sidebarOpen} style={__css("width:38px;height:38px;display:grid;place-items:center;border:1px solid #e6e8e4;border-radius:12px;background:#fff;color:#3b4a45;cursor:pointer;flex:none;transition:border-color .16s,color .16s")}>
              <svg width="18" height="18" viewBox={"0 0 24 24"} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
            {V.sidebarClosed ? (<>
              <div style={__css("display:inline-flex;align-items:center;gap:9px;direction:ltr")}>
                <img src={logo} alt="TeamUp" width="24" height="24" style={__css("width:24px;height:24px;flex:none")} />
                <span style={__css("font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:16px;letter-spacing:-.03em;color:#0b2f26")}>
                  TeamUp
                </span>
              </div>
            </>) : null}
          </div>
          {V.isGuest ? (<>
            <div style={__css("background:linear-gradient(120deg,#f8f4fb,#f1f8f5);border-bottom:1px solid #e6e8e4;padding:11px 32px;font-size:14px;color:#5d3f76")}>
              <div style={__css("display:flex;align-items:center;gap:12px;max-width:1120px;margin-inline:auto")}>
                <span style={__css("padding:3px 10px;border-radius:999px;background:#efe7f6;font-weight:700;font-size:12px")}>
                  {V.L.guestBadge}
                </span>
                <span style={__css("flex:1")}>
                  {V.guestBannerText}
                </span>
                <button onClick={V.startOnboarding} style={__css("padding:7px 16px;border:0;border-radius:999px;background:#77519a;color:#fff;font-size:13px;font-weight:600;cursor:pointer")}>
                  {V.L.createAccount}
                </button>
              </div>
            </div>
          </>) : null}
          <div style={__css("width:100%;max-width:1120px;margin-inline:auto;padding:40px 32px 80px;flex:1")}>
            {V.onDiscover ? (<>
              <div>
                <div style={__css("margin-bottom:28px;animation:tu-step .4s cubic-bezier(.2,.8,.2,1) both")}>
                  <span style={__css("font-size:12.5px;font-weight:700;color:#77519a")}>
                    {V.L.discoverEyebrow}
                  </span>
                  <h1 style={__css("margin:6px 0 8px;font-size:34px;font-weight:700;letter-spacing:-.02em")}>
                    {V.L.discoverTitle}
                  </h1>
                  <p style={__css("margin:0;color:#6b7a74;max-width:62ch")}>
                    {V.discoverSubtitle}
                  </p>
                </div>
                <div style={__css("background:#fff;border:1px solid #e6e8e4;border-radius:28px;box-shadow:0 2px 8px rgba(11,47,38,.06);padding:28px;display:flex;flex-direction:column;gap:24px;margin-bottom:32px")}>
                  <div style={__css("display:flex;flex-direction:column;gap:12px")}>
                    <span style={__css("font-size:13px;font-weight:700;color:#77519a")}>
                      {V.L.lookingFor}
                    </span>
                    <div style={__css("display:flex;gap:10px;flex-wrap:wrap")}>
                      {(V.collabTabs || []).map((c, __i8) => (<React.Fragment key={__i8}>
                        <button className="hv7" onClick={c.pick} style={__css(`display:inline-flex;align-items:center;gap:9px;border:1px solid ${c.border};background:${c.pillBg};color:${c.pillFg};padding:11px 22px;border-radius:999px;font-size:14.5px;font-weight:600;cursor:pointer;white-space:nowrap`)}>
                          {c.label}
                        </button>
                      </React.Fragment>))}
                    </div>
                  </div>
                  <div style={__css("height:1px;background:#e6e8e4")} />
                  <div style={__css("display:flex;flex-direction:column;gap:14px")}>
                    <span style={__css("font-size:17px;font-weight:700;color:#0b2f26;letter-spacing:-.015em")}>
                      {V.L.filterBySkills}
                    </span>
                    <div style={__css("display:flex;gap:10px;align-items:center;flex-wrap:wrap")}>
                      <input value={V.query} onChange={V.editQuery} onKeyDown={V.queryKey} placeholder={V.L.searchOrAddPh} style={__css("flex:1;min-width:240px;padding:14px 20px;border:1px solid #e6e8e4;border-radius:16px;background:#fff;font-size:14.5px")} />
                      {V.canAddSkill ? (<>
                        <button className="hv8" onClick={V.addCustomSkill} style={__css("display:inline-flex;align-items:center;gap:8px;padding:14px 24px;border:1px solid #6fbfa5;border-radius:16px;background:#f1f8f5;color:#0f3d31;font-size:14px;font-weight:700;cursor:pointer;white-space:nowrap")}>
                          <span style={__css("font-size:17px;line-height:1")}>
                            +
                          </span>
                          {V.L.addSkill}
                        </button>
                      </>) : null}
                    </div>
                    {V.hasPicked ? (<>
                      <div style={__css("display:flex;align-items:center;flex-wrap:wrap;gap:10px;padding:12px 14px;border-radius:16px;background:#f8f4fb;border:1px dashed #c3a9d8")}>
                        {(V.pickedSkills || []).map((s, __i9) => (<React.Fragment key={__i9}>
                          <button className="hv9" onClick={s.toggle} style={__css("display:inline-flex;align-items:center;gap:8px;padding:7px 14px;border:0;border-radius:999px;background:#77519a;color:#fff;font-size:13.5px;font-weight:600;cursor:pointer")}>
                            {s.name} ×
                          </button>
                        </React.Fragment>))}
                      </div>
                    </>) : null}
                    {V.skillListHint ? (<>
                      <span style={__css("font-size:12.5px;color:#9aa8a2")}>
                        {V.skillListHint}
                      </span>
                    </>) : null}
                    {V.skillNoMatch ? (<>
                      <span style={__css("font-size:12.5px;color:#6b7a74")}>
                        {V.skillNoMatchText}
                      </span>
                    </>) : null}
                    <div style={__css("display:flex;flex-direction:column;max-height:250px;overflow-y:auto;border:1px solid #eceeea;border-radius:20px;background:#fbfbf9")}>
                      {(V.catalogueGroups || []).map((g, __i10) => (<React.Fragment key={__i10}>
                        <div style={__css("display:grid;grid-template-columns:136px 1fr;gap:16px;align-items:start;padding:14px 18px;border-bottom:1px solid #f0f1ee")}>
                          <span style={__css("font-size:12.5px;font-weight:700;color:#9aa8a2;padding-top:9px;white-space:nowrap")}>
                            {g.label}
                          </span>
                          <div style={__css("display:flex;flex-wrap:wrap;gap:8px")}>
                            {(g.skills || []).map((s, __i11) => (<React.Fragment key={__i11}>
                              <button className="hv3" onClick={s.toggle} style={__css(`display:inline-flex;align-items:center;justify-content:center;padding:9px 16px;border-radius:999px;border:1px solid ${s.border};background:${s.bg};color:${s.fg};font-size:13.5px;font-weight:600;cursor:pointer;white-space:nowrap;transition:border-color .16s,color .16s`)}>
                                {s.name}
                              </button>
                            </React.Fragment>))}
                          </div>
                        </div>
                      </React.Fragment>))}
                    </div>
                  </div>
                  <div style={__css("display:flex;align-items:center;gap:14px;flex-wrap:wrap")}>
                    <span style={__css("font-size:13px;color:#6b7a74;flex:1")}>
                      {V.filterSummary}
                    </span>
                    <button className="hv10" onClick={V.clearSkills} style={__css("padding:9px 18px;border:1px solid #e6e8e4;border-radius:999px;background:#fff;color:#3b4a45;font-size:13.5px;font-weight:600;cursor:pointer;white-space:nowrap")}>
                      {V.L.clearSkills}
                    </button>
                    <button className="hv1" onClick={V.runSearch} style={__css("padding:12px 28px;border:1px solid transparent;border-radius:999px;background:#0f3d31;color:#fff;font-weight:600;font-size:14.5px;cursor:pointer;white-space:nowrap;box-shadow:0 2px 8px rgba(11,47,38,.06)")}>
                      {V.L.findMyTeam}
                    </button>
                  </div>
                </div>
                {V.memberCountShown ? (<>
                  <div style={__css("display:flex;align-items:center;gap:12px;margin-bottom:18px")}>
                    <span style={__css("font-size:15px;font-weight:700;color:#0b2f26")}>
                      {V.memberCount}
                    </span>
                  </div>
                </>) : null}
                {V.pickFirst ? (<>
                  <div style={__css("display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center;padding:60px 28px;background:#fff;border:1px dashed #e6e8e4;border-radius:28px;animation:tu-step .4s cubic-bezier(.2,.8,.2,1) both")}>
                    <span style={__css("width:58px;height:58px;border-radius:50%;display:grid;place-items:center;background:#f1f8f5;color:#227a62;font-size:22px;font-weight:700")}>
                      1
                    </span>
                    <h3 style={__css("margin:0;font-size:20px;font-weight:700")}>
                      {V.L.pickFirstTitle}
                    </h3>
                    <p style={__css("margin:0;color:#6b7a74;max-width:52ch;font-size:14.5px;text-wrap:pretty")}>
                      {V.L.pickFirstDesc}
                    </p>
                    <button className="hv3" onClick={V.browseEveryone} style={__css("margin-top:4px;padding:11px 24px;border:1px solid #e6e8e4;border-radius:999px;background:#fff;color:#3b4a45;font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap")}>
                      {V.L.browseAll}
                    </button>
                  </div>
                </>) : null}
                {V.showPeople ? (<>
                  <div style={__css("display:grid;grid-template-columns:repeat(3,1fr);gap:22px")}>
                    {(V.people || []).map((p, __i12) => (<React.Fragment key={__i12}>
                      <div className="hv11" style={__css(`display:flex;flex-direction:column;gap:18px;padding:26px;background:#fff;border:1px solid #e6e8e4;border-radius:24px;box-shadow:0 1px 2px rgba(11,47,38,.05);transition:transform .22s cubic-bezier(.2,.8,.2,1),box-shadow .22s cubic-bezier(.2,.8,.2,1),border-color .22s;animation:tu-step .45s cubic-bezier(.2,.8,.2,1) both;animation-delay:${p.delay}`)}>
                        <div style={__css("display:flex;align-items:center;gap:14px")}>
                          <span style={__css(`width:56px;height:56px;border-radius:50%;display:grid;place-items:center;background:${p.color};color:#fff;font-weight:700;font-size:18px;flex:none`)}>
                            {p.initials}
                          </span>
                          <div style={__css("flex:1;min-width:0")}>
                            <div style={__css("font-size:19px;font-weight:700;letter-spacing:-.02em")}>
                              {p.name}
                            </div>
                            <div style={__css("font-size:14px;font-weight:600;color:#77519a;margin-top:2px")}>
                              {p.role}
                            </div>
                          </div>
                        </div>
                        <p style={__css("margin:0;font-size:14.5px;color:#6b7a74;min-height:66px;text-wrap:pretty")}>
                          {p.bio}
                        </p>
                        <div style={__css("display:flex;flex-wrap:wrap;gap:8px")}>
                          {(p.topSkills || []).map((s, __i13) => (<React.Fragment key={__i13}>
                            <span style={__css(`display:inline-flex;padding:6px 14px;border-radius:999px;font-size:13px;font-weight:600;background:#fff;border:1px solid ${s.border};color:${s.fg};white-space:nowrap`)}>
                              {s.name}
                            </span>
                          </React.Fragment>))}
                        </div>
                        <div>
                          <span style={__css(`display:inline-flex;padding:6px 14px;border-radius:999px;font-size:13px;font-weight:600;background:${p.openToBg};color:${p.openToFg};white-space:nowrap`)}>
                            {p.openToLabel}
                          </span>
                        </div>
                        {V.hasPicked ? (<>
                          <div style={__css("display:flex;align-items:center;gap:12px;padding-top:2px;border-top:1px solid #f0f1ee")}>
                            <span style={__css(`position:relative;width:52px;height:52px;flex:none;border-radius:50%;display:grid;place-items:center;background:conic-gradient(${p.ring} ${p.pct}%, #e3f1ec 0);margin-top:12px`)}>
                              <span style={__css("position:absolute;inset:5px;background:#fff;border-radius:50%")} />
                              <span style={__css(`position:relative;font-size:12.5px;font-weight:800;color:${p.ring};letter-spacing:-.02em`)}>
                                {p.pctLabel}
                              </span>
                            </span>
                            <span style={__css("flex:1;font-size:12.5px;color:#6b7a74;line-height:1.35;margin-top:12px")}>
                              {p.matchNote}
                            </span>
                          </div>
                        </>) : null}
                        <button className="hv1" onClick={p.open} style={__css("margin-top:auto;align-self:flex-start;display:inline-flex;align-items:center;gap:10px;padding:12px 26px;border:0;border-radius:999px;background:#0f3d31;color:#fff;font-size:14.5px;font-weight:600;cursor:pointer;white-space:nowrap;box-shadow:0 2px 8px rgba(11,47,38,.06)")}>
                          {V.L.viewProfile}
                          <span style={__css("font-size:16px;line-height:1")}>
                            {V.arrow}
                          </span>
                        </button>
                      </div>
                    </React.Fragment>))}
                  </div>
                </>) : null}
                {V.noPeople ? (<>
                  <div style={__css("display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center;padding:64px 28px;background:#fff;border:1px dashed #e6e8e4;border-radius:28px")}>
                    <span style={__css("width:62px;height:62px;border-radius:50%;display:grid;place-items:center;background:#f8f4fb;color:#77519a;font-size:24px;font-weight:700")}>
                      ?
                    </span>
                    <h3 style={__css("margin:0;font-size:19px;font-weight:700")}>
                      {V.L.emptyMatchTitle}
                    </h3>
                    <p style={__css("margin:0;color:#6b7a74;max-width:46ch;font-size:14.5px")}>
                      {V.L.emptyMatchDesc}
                    </p>
                    <button onClick={V.clearSkills} style={__css("padding:11px 22px;border:1px solid #e6e8e4;border-radius:999px;background:#fff;color:#3b4a45;font-weight:600;font-size:14px;cursor:pointer")}>
                      {V.L.clearSkills}
                    </button>
                  </div>
                </>) : null}
              </div>
            </>) : null}
            {V.onResults ? (<>
              <div>
                <button onClick={V.goDiscover} style={__css("padding:8px 16px;border:1px solid #e6e8e4;border-radius:999px;background:#fff;color:#3b4a45;font-size:13.5px;font-weight:600;cursor:pointer;margin-bottom:20px")}>
                  {V.L.changeSkills}
                </button>
                <div style={__css("margin-bottom:24px;animation:tu-step .4s cubic-bezier(.2,.8,.2,1) both")}>
                  <span style={__css("font-size:12.5px;font-weight:700;color:#77519a")}>
                    {V.L.resultsEyebrow}
                  </span>
                  <h1 style={__css("margin:6px 0 10px;font-size:34px;font-weight:700;letter-spacing:-.02em")}>
                    {V.matchedCount}
                  </h1>
                  <div style={__css("display:flex;align-items:center;gap:8px;flex-wrap:wrap")}>
                    <span style={__css("font-size:13.5px;color:#6b7a74")}>
                      {V.L.requiredSkills}
                    </span>
                    {(V.pickedSkills || []).map((s, __i14) => (<React.Fragment key={__i14}>
                      <span style={__css("display:inline-flex;padding:4px 11px;border-radius:999px;font-size:12.5px;font-weight:600;background:#efe7f6;color:#5d3f76")}>
                        {s.name}
                      </span>
                    </React.Fragment>))}
                  </div>
                </div>
                {(V.resultGroups || []).map((g, __i15) => (<React.Fragment key={__i15}>
                  <div style={__css("margin-bottom:34px")}>
                    <div style={__css("display:flex;align-items:center;gap:10px;margin-bottom:16px")}>
                      <h2 style={__css("margin:0;font-size:16px;font-weight:700;color:#0b2f26")}>
                        {g.label}
                      </h2>
                      <span style={__css("height:1px;flex:1;background:#e6e8e4")} />
                      <span style={__css("font-size:13px;color:#9aa8a2")}>
                        {g.count}
                      </span>
                    </div>
                    <div style={__css("display:grid;grid-template-columns:repeat(3,1fr);gap:22px")}>
                      {(g.people || []).map((p, __i16) => (<React.Fragment key={__i16}>
                        <div className="hv12" style={__css(`display:flex;flex-direction:column;gap:16px;padding:24px;background:#fff;border:1px solid ${p.cardBorder};border-radius:28px;box-shadow:0 1px 2px rgba(11,47,38,.05);transition:transform .22s cubic-bezier(.2,.8,.2,1),box-shadow .22s cubic-bezier(.2,.8,.2,1);animation:tu-step .45s cubic-bezier(.2,.8,.2,1) both;animation-delay:${p.delay}`)}>
                          <div style={__css("display:flex;align-items:flex-start;gap:14px")}>
                            <span style={__css(`width:48px;height:48px;border-radius:50%;display:grid;place-items:center;background:${p.color};color:#fff;font-weight:700;font-size:16px;flex:none`)}>
                              {p.initials}
                            </span>
                            <div style={__css("flex:1;min-width:0")}>
                              <div style={__css("font-size:17.5px;font-weight:700;letter-spacing:-.02em")}>
                                {p.name}
                              </div>
                              <div style={__css("font-size:13.5px;font-weight:600;color:#77519a;margin-top:2px")}>
                                {p.role}
                              </div>
                            </div>
                            <span style={__css(`position:relative;width:52px;height:52px;flex:none;border-radius:50%;display:grid;place-items:center;background:conic-gradient(${p.ring} ${p.pct}%, #e3f1ec 0)`)}>
                              <span style={__css("position:absolute;inset:5px;background:#fff;border-radius:50%")} />
                              <span style={__css(`position:relative;font-size:12.5px;font-weight:800;color:${p.ring}`)}>
                                {p.pctLabel}
                              </span>
                            </span>
                          </div>
                          <div style={__css("display:flex;flex-wrap:wrap;gap:7px")}>
                            {(p.topSkills || []).map((s, __i17) => (<React.Fragment key={__i17}>
                              <span style={__css(`display:inline-flex;padding:4px 11px;border-radius:999px;font-size:12.5px;font-weight:600;background:#fff;border:1px solid ${s.border};color:${s.fg};white-space:nowrap`)}>
                                {s.name}
                              </span>
                            </React.Fragment>))}
                          </div>
                          <span style={__css("font-size:12.5px;color:#6b7a74")}>
                            {p.matchNote}
                          </span>
                          <div style={__css("margin-top:auto;display:flex;gap:10px;flex-wrap:wrap")}>
                            <button className="hv3" onClick={p.open} style={__css("padding:9px 18px;border:1px solid #e6e8e4;border-radius:999px;background:#fff;color:#3b4a45;font-size:13.5px;font-weight:600;cursor:pointer;white-space:nowrap")}>
                              {V.L.viewProfile}
                            </button>
                            <button className="hv9" onClick={p.request} style={__css("padding:9px 18px;border:0;border-radius:999px;background:#77519a;color:#fff;font-size:13.5px;font-weight:600;cursor:pointer;white-space:nowrap")}>
                              {p.ctaShort}
                            </button>
                          </div>
                        </div>
                      </React.Fragment>))}
                    </div>
                  </div>
                </React.Fragment>))}
                {V.noResults ? (<>
                  <div style={__css("display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center;padding:64px 28px;background:#fff;border:1px dashed #e6e8e4;border-radius:28px")}>
                    <h3 style={__css("margin:0;font-size:19px;font-weight:700")}>
                      {V.L.emptyResultsTitle}
                    </h3>
                    <p style={__css("margin:0;color:#6b7a74;max-width:46ch;font-size:14.5px")}>
                      {V.L.emptyResultsDesc}
                    </p>
                    <button onClick={V.goDiscover} style={__css("padding:11px 22px;border:0;border-radius:999px;background:#0f3d31;color:#fff;font-weight:600;font-size:14px;cursor:pointer")}>
                      {V.L.changeSkills}
                    </button>
                  </div>
                </>) : null}
              </div>
            </>) : null}
            {V.onProfile ? (<>
              <div>
                <button onClick={V.goBackFromProfile} style={__css("padding:8px 16px;border:1px solid #e6e8e4;border-radius:999px;background:#fff;color:#3b4a45;font-size:13.5px;font-weight:600;cursor:pointer;white-space:nowrap;margin-bottom:20px")}>
                  {V.backLabel}
                </button>
                <div style={__css("display:flex;gap:22px;align-items:flex-start;padding:30px;border-radius:28px;background:linear-gradient(130deg,#f1f8f5,#f8f4fb 90%);border:1px solid #e6e8e4;flex-wrap:wrap")}>
                  <span style={__css(`width:78px;height:78px;border-radius:50%;display:grid;place-items:center;background:${V.viewed.color};color:#fff;font-weight:700;font-size:26px;flex:none`)}>
                    {V.viewed.initials}
                  </span>
                  <div style={__css("flex:1;min-width:260px")}>
                    <h1 style={__css("margin:0;font-size:32px;font-weight:700;letter-spacing:-.02em")}>
                      {V.viewed.name}
                    </h1>
                    <div style={__css("font-size:15px;font-weight:600;color:#77519a;margin-top:4px")}>
                      {V.viewed.role}
                    </div>
                    <p style={__css("margin:12px 0 0;color:#3b4a45;max-width:56ch;text-wrap:pretty")}>
                      {V.viewed.bio}
                    </p>
                    <div style={__css("display:flex;gap:8px;flex-wrap:wrap;margin-top:14px")}>
                      <span style={__css(`display:inline-flex;padding:5px 12px;border-radius:999px;font-size:12.5px;font-weight:600;background:${V.viewed.openToBg};color:${V.viewed.openToFg};white-space:nowrap`)}>
                        {V.viewed.openToLabel}
                      </span>
                      <span style={__css("display:inline-flex;padding:5px 12px;border-radius:999px;font-size:12.5px;font-weight:600;background:#f0f1ee;color:#3b4a45")}>
                        {V.viewed.memberSince}
                      </span>
                    </div>
                  </div>
                  <div style={__css("display:flex;flex-direction:column;gap:10px;align-items:stretch;min-width:210px")}>
                    {V.viewedIsOther ? (<>
                      <span style={__css(`position:relative;width:64px;height:64px;align-self:center;border-radius:50%;display:grid;place-items:center;background:conic-gradient(${V.viewed.ring} ${V.viewed.pct}%, #e3f1ec 0)`)}>
                        <span style={__css("position:absolute;inset:6px;background:#fff;border-radius:50%")} />
                        <span style={__css(`position:relative;font-size:14px;font-weight:800;color:${V.viewed.ring}`)}>
                          {V.viewed.pctLabel}
                        </span>
                      </span>
                    </>) : null}
                    {V.viewedIsOther ? (<>
                      <button className="hv2" onClick={V.openRequestModal} style={__css("padding:13px 24px;border:0;border-radius:999px;background:#0f3d31;color:#fff;font-weight:600;font-size:14.5px;cursor:pointer;white-space:nowrap;box-shadow:0 2px 8px rgba(11,47,38,.06)")}>
                        {V.viewed.ctaLabel}
                      </button>
                    </>) : null}
                    {V.viewedIsMe ? (<>
                      <button className="hv3" onClick={V.goMe} style={__css("padding:13px 24px;border:1px solid #e6e8e4;border-radius:999px;background:#fff;color:#3b4a45;font-weight:600;font-size:14.5px;cursor:pointer;white-space:nowrap")}>
                        {V.L.editMine}
                      </button>
                    </>) : null}
                  </div>
                </div>
                <div style={__css("display:grid;grid-template-columns:1.6fr 1fr;gap:22px;margin-top:22px;align-items:start")}>
                  <div style={__css("display:flex;flex-direction:column;gap:22px")}>
                    <div style={__css("background:#fff;border:1px solid #e6e8e4;border-radius:20px;padding:24px")}>
                      <div style={__css("font-size:15px;font-weight:700;color:#0b2f26;margin-bottom:14px")}>
                        {V.L.skillsLevels}
                      </div>
                      {(V.viewed.skills || []).map((s, __i18) => (<React.Fragment key={__i18}>
                        <div style={__css("display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px 0;border-bottom:1px solid #e6e8e4")}>
                          <span style={__css("font-weight:600;font-size:14.5px")}>
                            {s.name}
                          </span>
                          <span style={__css(`font-size:11.5px;font-weight:700;padding:3px 10px;border-radius:999px;background:${s.levelBg};color:${s.levelFg};white-space:nowrap`)}>
                            {s.levelLabel}
                          </span>
                        </div>
                      </React.Fragment>))}
                    </div>
                    {V.viewedHasProjects ? (<>
                    <div style={__css("background:#fff;border:1px solid #e6e8e4;border-radius:20px;padding:24px")}>
                      <div style={__css("font-size:15px;font-weight:700;color:#0b2f26;margin-bottom:14px")}>
                        {V.L.projectsTitle}
                      </div>
                      {(V.viewed.projects || []).map((pr, __i19) => (<React.Fragment key={__i19}>
                        <div style={__css("padding:16px 0;border-bottom:1px solid #e6e8e4")}>
                          <h4 style={__css("margin:0;font-size:15.5px;font-weight:700")}>
                            {pr.title}
                          </h4>
                          <p style={__css("margin:4px 0 0;font-size:14px;color:#6b7a74")}>
                            {pr.description}
                          </p>
                          <div style={__css("display:flex;gap:8px;flex-wrap:wrap;margin-top:10px")}>
                            <span style={__css("display:inline-flex;padding:4px 11px;border-radius:999px;font-size:12px;font-weight:600;background:#fff;border:1px solid #e6e8e4;color:#3b4a45;white-space:nowrap")}>
                              {pr.role}
                            </span>
                            <span style={__css("display:inline-flex;padding:4px 11px;border-radius:999px;font-size:12px;font-weight:600;background:#fff;border:1px solid #e6e8e4;color:#3b4a45;white-space:nowrap")}>
                              {pr.technologies}
                            </span>
                          </div>
                        </div>
                      </React.Fragment>))}
                    </div>
                    </>) : null}
                  </div>
                  <div style={__css("display:flex;flex-direction:column;gap:22px")}>
                    {V.viewedHasExperience ? (<>
                    <div style={__css("background:#fff;border:1px solid #e6e8e4;border-radius:20px;padding:24px")}>
                      <div style={__css("font-size:15px;font-weight:700;color:#0b2f26;margin-bottom:10px")}>
                        {V.L.experience}
                      </div>
                      <p style={__css("margin:0;color:#6b7a74;font-size:14px")}>
                        {V.viewed.experience}
                      </p>
                    </div>
                    </>) : null}
                    <div style={__css("background:#fff;border:1px solid #e6e8e4;border-radius:20px;padding:24px")}>
                      <div style={__css("font-size:15px;font-weight:700;color:#0b2f26;margin-bottom:12px")}>
                        {V.L.interests}
                      </div>
                      <div style={__css("display:flex;flex-direction:column;gap:10px")}>
                        {(V.viewed.interests || []).map((i, __i20) => (<React.Fragment key={__i20}>
                          <div style={__css("display:flex;align-items:center;gap:10px;font-size:14px;color:#3b4a45")}>
                            <span style={__css(`width:8px;height:8px;border-radius:50%;background:${i.dot};flex:none`)} />
                            {i.label}
                          </div>
                        </React.Fragment>))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>) : null}
            {V.onNotifications ? (<>
              <div>
                <div style={__css("margin-bottom:24px;animation:tu-step .4s cubic-bezier(.2,.8,.2,1) both")}>
                  <span style={__css("font-size:12.5px;font-weight:700;color:#77519a")}>
                    {V.L.notifEyebrow}
                  </span>
                  <h1 style={__css("margin:6px 0 8px;font-size:34px;font-weight:700;letter-spacing:-.02em")}>
                    {V.L.notifTitle}
                  </h1>
                  <p style={__css("margin:0;color:#6b7a74;max-width:62ch")}>
                    {V.L.notifSubtitle}
                  </p>
                </div>
                {V.hasNotifications ? (<>
                  <div style={__css("display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:20px")}>
                    {V.hasUnread ? (<>
                      <span style={__css("display:inline-flex;padding:6px 14px;border-radius:999px;font-size:12.5px;font-weight:700;background:#efe7f6;color:#5d3f76;white-space:nowrap")}>
                        {V.unreadCount}
                      </span>
                    </>) : null}
                    <span style={__css("flex:1")} />
                    {V.hasUnread ? (<>
                      <button className="hv10" onClick={V.markNotifsRead} style={__css("padding:9px 18px;border:1px solid #e6e8e4;border-radius:999px;background:#fff;color:#3b4a45;font-size:13.5px;font-weight:600;cursor:pointer;white-space:nowrap")}>
                        {V.L.notifMarkRead}
                      </button>
                    </>) : null}
                    <button className="hv4" onClick={V.clearNotifs} style={__css("padding:9px 18px;border:1px solid #eddada;border-radius:999px;background:#fff;color:#a53f3f;font-size:13.5px;font-weight:600;cursor:pointer;white-space:nowrap")}>
                      {V.L.notifClear}
                    </button>
                  </div>
                  <div style={__css("display:flex;flex-direction:column;gap:12px")}>
                    {(V.notifications || []).map((n, __nf) => (<React.Fragment key={__nf}>
                      <button onClick={n.open} style={__css(`display:flex;gap:16px;text-align:start;width:100%;padding:18px 20px;background:${n.bg};border:1px solid ${n.border};border-radius:20px;box-shadow:0 1px 2px rgba(11,47,38,.05);cursor:pointer;animation:tu-step .4s cubic-bezier(.2,.8,.2,1) both`)}>
                        <span style={__css(`width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:${n.color};color:#fff;font-weight:700;font-size:14.5px;flex:none`)}>
                          {n.initials}
                        </span>
                        <span style={__css("flex:1;min-width:0;display:flex;flex-direction:column;gap:6px")}>
                          <span style={__css("display:flex;align-items:center;gap:9px;flex-wrap:wrap")}>
                            <span style={__css(`width:8px;height:8px;border-radius:50%;background:${n.dot};flex:none`)} />
                            <strong style={__css("font-size:15px;color:#16211d")}>
                              {n.text}
                            </strong>
                          </span>
                          {n.hasBody ? (<>
                            <span style={__css("font-size:14px;color:#3b4a45")}>
                              {n.body}
                            </span>
                          </>) : null}
                          <span style={__css("font-size:12.5px;color:#9aa8a2")}>
                            {n.time}
                          </span>
                        </span>
                      </button>
                    </React.Fragment>))}
                  </div>
                </>) : null}
                {V.noNotifications ? (<>
                  <div style={__css("padding:56px 24px;text-align:center;background:#fff;border:1px dashed #e6e8e4;border-radius:24px")}>
                    <h3 style={__css("margin:0 0 8px;font-size:18px;font-weight:700")}>
                      {V.L.notifEmptyTitle}
                    </h3>
                    <p style={__css("margin:0;color:#6b7a74;font-size:14.5px")}>
                      {V.L.notifEmptyDesc}
                    </p>
                  </div>
                </>) : null}
              </div>
            </>) : null}
            {V.onRequests ? (<>
              <div>
                <div style={__css("margin-bottom:24px;animation:tu-step .4s cubic-bezier(.2,.8,.2,1) both")}>
                  <span style={__css("font-size:12.5px;font-weight:700;color:#77519a")}>
                    {V.L.requestsEyebrow}
                  </span>
                  <h1 style={__css("margin:6px 0 8px;font-size:34px;font-weight:700;letter-spacing:-.02em")}>
                    {V.L.requestsTitle}
                  </h1>
                  <p style={__css("margin:0;color:#6b7a74;max-width:62ch")}>
                    {V.L.requestsSubtitle}
                  </p>
                </div>
                <div style={__css("display:inline-flex;gap:4px;padding:5px;background:#eeefec;border-radius:999px;margin-bottom:24px")}>
                  {(V.reqTabs || []).map((tb, __i21) => (<React.Fragment key={__i21}>
                    <button onClick={tb.pick} style={__css(`border:0;background:${tb.bg};color:${tb.fg};padding:9px 22px;border-radius:999px;font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap`)}>
                      {tb.label}
                    </button>
                  </React.Fragment>))}
                </div>
                <div style={__css("display:flex;flex-direction:column;gap:14px")}>
                  {(V.visibleRequests || []).map((r, __i22) => (<React.Fragment key={__i22}>
                    <div style={__css("display:flex;gap:16px;padding:20px 22px;background:#fff;border:1px solid #e6e8e4;border-radius:20px;box-shadow:0 1px 2px rgba(11,47,38,.05);animation:tu-step .4s cubic-bezier(.2,.8,.2,1) both")}>
                      <span style={__css(`width:46px;height:46px;border-radius:50%;display:grid;place-items:center;background:${r.color};color:#fff;font-weight:700;font-size:15px;flex:none`)}>
                        {r.initials}
                      </span>
                      <div style={__css("flex:1;min-width:0;display:flex;flex-direction:column;gap:8px")}>
                        <div style={__css("display:flex;align-items:center;gap:10px;flex-wrap:wrap")}>
                          <strong style={__css("font-size:15.5px")}>
                            {r.name}
                          </strong>
                          <span style={__css("font-size:13.5px;color:#77519a;font-weight:600")}>
                            {r.role}
                          </span>
                          <span style={__css("flex:1")} />
                          <span style={__css(`display:inline-flex;padding:5px 12px;border-radius:999px;font-size:12.5px;font-weight:700;background:${r.statusBg};color:${r.statusFg};white-space:nowrap`)}>
                            {r.statusLabel}
                          </span>
                        </div>
                        <div style={__css("font-size:13px;color:#6b7a74")}>
                          {r.meta}
                        </div>
                        <div style={__css("font-size:14px;color:#3b4a45;background:#f1f8f5;border-inline-start:3px solid #6fbfa5;padding:10px 14px;border-radius:0 10px 10px 0")}>
                          {r.message}
                        </div>
                        {r.actionable ? (<>
                          <div style={__css("display:flex;gap:8px;flex-wrap:wrap;padding-top:4px")}>
                            <button className="hv2" onClick={r.accept} style={__css("padding:9px 20px;border:0;border-radius:999px;background:#0f3d31;color:#fff;font-size:13.5px;font-weight:600;cursor:pointer;white-space:nowrap")}>
                              {V.L.accept}
                            </button>
                            <button className="hv4" onClick={r.reject} style={__css("padding:9px 20px;border:1px solid #eddada;border-radius:999px;background:#fff;color:#a53f3f;font-size:13.5px;font-weight:600;cursor:pointer;white-space:nowrap")}>
                              {V.L.reject}
                            </button>
                          </div>
                        </>) : null}
                        {r.chatOpen ? (<>
                          <div style={__css("padding-top:4px")}>
                            <button className="hv7" onClick={r.openChat} style={__css("padding:9px 20px;border:1px solid #e6e8e4;border-radius:999px;background:#fff;color:#0f3d31;font-size:13.5px;font-weight:600;cursor:pointer;white-space:nowrap")}>
                              {V.L.openChat}
                            </button>
                          </div>
                        </>) : null}
                      </div>
                    </div>
                  </React.Fragment>))}
                </div>
                {V.noRequests ? (<>
                  <div style={__css("display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center;padding:64px 28px;background:#fff;border:1px dashed #e6e8e4;border-radius:28px")}>
                    <h3 style={__css("margin:0;font-size:19px;font-weight:700")}>
                      {V.L.emptyReqTitle}
                    </h3>
                    <p style={__css("margin:0;color:#6b7a74;max-width:46ch;font-size:14.5px")}>
                      {V.L.emptyReqDesc}
                    </p>
                    <button onClick={V.goDiscover} style={__css("padding:11px 22px;border:0;border-radius:999px;background:#0f3d31;color:#fff;font-weight:600;font-size:14px;cursor:pointer;white-space:nowrap")}>
                      {V.L.goDiscover}
                    </button>
                  </div>
                </>) : null}
              </div>
            </>) : null}
            {V.onTeam ? (<>
              <div>
                <div style={__css("margin-bottom:26px;animation:tu-step .4s cubic-bezier(.2,.8,.2,1) both")}>
                  <h1 style={__css("margin:0 0 8px;font-size:34px;font-weight:700;letter-spacing:-.02em")}>
                    {V.L.navTeam}
                  </h1>
                  <p style={__css("margin:0;color:#6b7a74;max-width:62ch;text-wrap:pretty")}>
                    {V.teamSubtitle}
                  </p>
                </div>
                {V.hasTeam ? (<>
                  <div style={__css("display:grid;grid-template-columns:repeat(3,1fr);gap:22px")}>
                    {(V.team || []).map((p, __i23) => (<React.Fragment key={__i23}>
                      <div className="hv11" style={__css(`display:flex;flex-direction:column;align-items:center;text-align:center;gap:14px;padding:30px 24px 26px;background:#fff;border:1px solid #e6e8e4;border-radius:24px;box-shadow:0 1px 2px rgba(11,47,38,.05);transition:transform .22s cubic-bezier(.2,.8,.2,1),box-shadow .22s,border-color .22s;animation:tu-step .45s cubic-bezier(.2,.8,.2,1) both;animation-delay:${p.delay}`)}>
                        <span style={__css(`width:84px;height:84px;border-radius:50%;display:grid;place-items:center;background:${p.color};color:#fff;font-weight:700;font-size:27px;flex:none`)}>
                          {p.initials}
                        </span>
                        <div>
                          <div style={__css("font-size:19px;font-weight:700;letter-spacing:-.02em")}>
                            {p.name}
                          </div>
                          <div style={__css("font-size:13.5px;font-weight:600;color:#77519a;margin-top:3px")}>
                            {p.role}
                          </div>
                        </div>
                        <p style={__css("margin:0;font-size:14px;color:#6b7a74;text-wrap:pretty")}>
                          {p.bio}
                        </p>
                        <div style={__css("display:flex;flex-wrap:wrap;gap:8px;justify-content:center")}>
                          {(p.interestTags || []).map((i, __i24) => (<React.Fragment key={__i24}>
                            <span style={__css(`display:inline-flex;align-items:center;gap:8px;padding:7px 16px;border-radius:999px;font-size:13px;font-weight:600;background:${i.bg};color:${i.fg};white-space:nowrap`)}>
                              <span style={__css(`width:7px;height:7px;border-radius:50%;background:${i.dot};flex:none`)} />
                              {i.label}
                            </span>
                          </React.Fragment>))}
                        </div>
                        <div style={__css("margin-top:auto;padding-top:8px;display:flex;gap:10px;align-items:center;justify-content:center")}>
                          <button className="hv13" onClick={p.open} style={__css("padding:12px 30px;border:1px solid #e6e8e4;border-radius:999px;background:#fff;color:#3b4a45;font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap;transition:border-color .16s,color .16s,transform .16s")}>
                            {V.L.viewProfile}
                          </button>
                          <button className="hv1" onClick={p.chat} style={__css("padding:12px 30px;border:1px solid transparent;border-radius:999px;background:#0f3d31;color:#fff;font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap;box-shadow:0 2px 8px rgba(11,47,38,.06)")}>
                            {V.L.directMessage}
                          </button>
                        </div>
                      </div>
                    </React.Fragment>))}
                  </div>
                </>) : null}
                {V.noTeam ? (<>
                  <div style={__css("display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center;padding:64px 28px;background:#fff;border:1px dashed #e6e8e4;border-radius:28px")}>
                    <h3 style={__css("margin:0;font-size:19px;font-weight:700")}>
                      {V.L.teamEmptyTitle}
                    </h3>
                    <p style={__css("margin:0;color:#6b7a74;max-width:48ch;font-size:14.5px;text-wrap:pretty")}>
                      {V.L.teamEmptyDesc}
                    </p>
                    <button onClick={V.goRequests} style={__css("padding:11px 22px;border:0;border-radius:999px;background:#0f3d31;color:#fff;font-weight:600;font-size:14px;cursor:pointer;white-space:nowrap")}>
                      {V.L.checkRequests}
                    </button>
                  </div>
                </>) : null}
              </div>
            </>) : null}
            {V.onSquad ? (<>
              <div>
                <div style={__css("display:flex;align-items:flex-end;gap:16px;flex-wrap:wrap;margin-bottom:26px;animation:tu-step .4s cubic-bezier(.2,.8,.2,1) both")}>
                  <div style={__css("flex:1;min-width:300px")}>
                    <span style={__css("font-size:12.5px;font-weight:700;color:#77519a")}>
                      {V.L.squadEyebrow}
                    </span>
                    <h1 style={__css("margin:6px 0 8px;font-size:34px;font-weight:700;letter-spacing:-.02em")}>
                      {V.L.squadTitle}
                    </h1>
                    <p style={__css("margin:0;color:#6b7a74;max-width:62ch;text-wrap:pretty")}>
                      {V.L.squadSubtitle}
                    </p>
                  </div>
                  <button className="hv1" onClick={V.openNewGroup} style={__css("display:inline-flex;align-items:center;gap:9px;padding:13px 26px;border:0;border-radius:999px;background:#0f3d31;color:#fff;font-weight:600;font-size:14.5px;cursor:pointer;white-space:nowrap;box-shadow:0 2px 8px rgba(11,47,38,.06);transition:background .16s,transform .16s")}>
                    <span style={__css("font-size:17px;line-height:1")}>
                      +
                    </span>
                    {V.L.newGroup}
                  </button>
                </div>
                {V.hasGroupInvites ? (<>
                  <div style={__css("margin-bottom:28px")}>
                    <div style={__css("display:flex;align-items:baseline;gap:10px;margin-bottom:14px;flex-wrap:wrap")}>
                      <span style={__css("font-size:16.5px;font-weight:700;color:#5d3f76;letter-spacing:-.015em")}>
                        {V.L.inviteTitle}
                      </span>
                      <span style={__css("font-size:13.5px;color:#6b7a74")}>
                        {V.L.inviteHint}
                      </span>
                    </div>
                    <div style={__css("display:grid;grid-template-columns:repeat(2,1fr);gap:22px")}>
                      {(V.groupInvites || []).map((g, __inv) => (<React.Fragment key={__inv}>
                        <div style={__css(`display:flex;flex-direction:column;gap:16px;padding:28px;background:linear-gradient(180deg,#faf7fd,#ffffff);border:1px solid #c3a9d8;border-radius:24px;box-shadow:0 1px 2px rgba(11,47,38,.05);animation:tu-step .45s cubic-bezier(.2,.8,.2,1) both;animation-delay:${g.delay}`)}>
                          <div>
                            <span style={__css("font-size:12.5px;font-weight:700;color:#77519a")}>
                              {g.invitedBy}
                            </span>
                            <div style={__css("margin-top:6px;font-size:18.5px;font-weight:700;letter-spacing:-.015em;color:#0b2f26")}>
                              {g.name}
                            </div>
                            <p style={__css("margin:6px 0 0;font-size:14px;color:#6b7a74;line-height:1.7")}>
                              {g.desc}
                            </p>
                          </div>
                          <div style={__css("display:flex;align-items:center;gap:12px;flex-wrap:wrap")}>
                            <div style={__css("display:flex")}>
                              {(g.members || []).map((m, __im) => (<React.Fragment key={__im}>
                                <span style={__css(`width:32px;height:32px;border-radius:50%;display:grid;place-items:center;background:${m.color};color:#fff;font-weight:700;font-size:12px;border:2px solid #fff;margin-inline-start:-8px`)}>
                                  {m.initials}
                                </span>
                              </React.Fragment>))}
                            </div>
                            <span style={__css("font-size:13px;color:#6b7a74")}>
                              {g.count}
                            </span>
                          </div>
                          <div style={__css("display:flex;gap:10px;flex-wrap:wrap")}>
                            <button className="hv2" onClick={g.accept} style={__css("flex:1;min-width:120px;padding:12px 20px;border:0;border-radius:999px;background:#0f3d31;color:#fff;font-size:14px;font-weight:700;cursor:pointer;white-space:nowrap")}>
                              {V.L.joinGroup}
                            </button>
                            <button className="hv17" onClick={g.reject} style={__css("padding:12px 22px;border:1px solid #eddada;border-radius:999px;background:#fff;color:#a53f3f;font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap")}>
                              {V.L.reject}
                            </button>
                          </div>
                        </div>
                      </React.Fragment>))}
                    </div>
                  </div>
                </>) : null}
                {V.hasGroups ? (<>
                  <div style={__css("display:grid;grid-template-columns:repeat(2,1fr);gap:22px")}>
                    {(V.groups || []).map((g, __i25) => (<React.Fragment key={__i25}>
                      <div className="hv11" style={__css(`position:relative;display:flex;flex-direction:column;gap:16px;padding:28px;background:#fff;border:1px solid #e6e8e4;border-radius:24px;box-shadow:0 1px 2px rgba(11,47,38,.05);transition:transform .22s cubic-bezier(.2,.8,.2,1),box-shadow .22s,border-color .22s;animation:tu-step .45s cubic-bezier(.2,.8,.2,1) both;animation-delay:${g.delay}`)}>
                        <div style={__css("display:flex;align-items:flex-start;gap:14px")}>
                          <div style={__css("flex:1;min-width:0")}>
                            <div style={__css("font-size:20px;font-weight:700;letter-spacing:-.02em")}>
                              {g.name}
                            </div>
                            <p style={__css("margin:6px 0 0;font-size:14px;color:#6b7a74;text-wrap:pretty")}>
                              {g.desc}
                            </p>
                          </div>
                          <button className="hv3" onClick={g.toggleMenu} aria-label={V.L.groupActions} style={__css("width:34px;height:34px;display:grid;place-items:center;border:1px solid #e6e8e4;border-radius:50%;background:#fff;color:#6b7a74;cursor:pointer;flex:none;transition:border-color .16s,color .16s")}>
                            <svg width="16" height="16" viewBox={"0 0 24 24"} fill="currentColor">
                              <circle cx="12" cy="8" r="1.9" />
                              <circle cx="12" cy="16" r="1.9" />
                            </svg>
                          </button>
                        </div>
                        {g.menuOpen ? (<>
                          <div style={__css("position:absolute;top:64px;inset-inline-end:24px;z-index:20;display:flex;flex-direction:column;min-width:186px;padding:6px;background:#fff;border:1px solid #e6e8e4;border-radius:14px;box-shadow:0 18px 48px rgba(11,47,38,.12);animation:tu-pop .18s cubic-bezier(.2,.8,.2,1) both")}>
                            <div style={__css("padding:8px 14px 6px;font-size:11.5px;font-weight:700;color:#9aa8a2")}>
                              {g.roleLabel}
                            </div>
                            {g.canManage ? (<>
                              <button className="hv14" onClick={g.manage} style={__css("padding:10px 14px;border:0;border-radius:10px;background:transparent;color:#3b4a45;font-size:14px;font-weight:600;cursor:pointer;text-align:start;white-space:nowrap")}>
                                {V.L.manageGroup}
                              </button>
                            </>) : null}
                            {g.canLeave ? (<>
                              <button className="hv4" onClick={g.leave} style={__css("padding:10px 14px;border:0;border-radius:10px;background:transparent;color:#a53f3f;font-size:14px;font-weight:600;cursor:pointer;text-align:start;white-space:nowrap")}>
                                {V.L.leaveGroup}
                              </button>
                            </>) : null}
                            {g.isOwner ? (<>
                              <button className="hv4" onClick={g.remove} style={__css("padding:10px 14px;border:0;border-radius:10px;background:transparent;color:#a53f3f;font-size:14px;font-weight:600;cursor:pointer;text-align:start;white-space:nowrap")}>
                                {V.L.deleteGroup}
                              </button>
                            </>) : null}
                          </div>
                        </>) : null}
                        <div style={__css("display:flex;align-items:center;gap:12px")}>
                          <div style={__css("display:flex;align-items:center")}>
                            {(g.members || []).map((m, __i26) => (<React.Fragment key={__i26}>
                              <span style={__css(`width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:${m.color};color:#fff;font-weight:700;font-size:12px;flex:none;border:2px solid #fff;margin-inline-start:-9px`)}>
                                {m.initials}
                              </span>
                            </React.Fragment>))}
                          </div>
                          <span style={__css("font-size:13.5px;color:#6b7a74;font-weight:600;white-space:nowrap")}>
                            {g.count}
                          </span>
                        </div>
                        <button className="hv3" onClick={g.openChat} style={__css("margin-top:auto;width:100%;display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:13px 24px;border:1px solid #e6e8e4;border-radius:999px;background:#fff;color:#3b4a45;font-size:14.5px;font-weight:600;cursor:pointer;white-space:nowrap;transition:border-color .16s,color .16s")}>
                          {V.L.groupChat}
                        </button>
                      </div>
                    </React.Fragment>))}
                  </div>
                </>) : null}
                {V.noGroups ? (<>
                  <div style={__css("display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center;padding:64px 28px;background:#fff;border:1px dashed #e6e8e4;border-radius:28px")}>
                    <h3 style={__css("margin:0;font-size:19px;font-weight:700")}>
                      {V.L.squadEmptyTitle}
                    </h3>
                    <p style={__css("margin:0;color:#6b7a74;max-width:48ch;font-size:14.5px;text-wrap:pretty")}>
                      {V.L.squadEmptyDesc}
                    </p>
                    <button onClick={V.openNewGroup} style={__css("padding:11px 24px;border:0;border-radius:999px;background:#0f3d31;color:#fff;font-weight:600;font-size:14px;cursor:pointer;white-space:nowrap")}>
                      {V.L.newGroup}
                    </button>
                  </div>
                </>) : null}
              </div>
            </>) : null}
            {V.onMessages ? (<>
              <div>
                <div style={__css("margin-bottom:24px;animation:tu-step .4s cubic-bezier(.2,.8,.2,1) both")}>
                  <span style={__css("font-size:12.5px;font-weight:700;color:#77519a")}>
                    {V.L.messagesEyebrow}
                  </span>
                  <h1 style={__css("margin:6px 0 8px;font-size:34px;font-weight:700;letter-spacing:-.02em")}>
                    {V.L.messagesTitle}
                  </h1>
                  <p style={__css("margin:0;color:#6b7a74;max-width:62ch")}>
                    {V.L.messagesSubtitle}
                  </p>
                </div>
                {V.hasConversations ? (<>
                  <div style={__css("width:100%;background:#fff;border:1px solid #e6e8e4;border-radius:28px;box-shadow:0 2px 8px rgba(11,47,38,.06);overflow:hidden;display:flex;flex-direction:column;height:640px")}>
                    {V.noActiveConv ? (<>
                      <div style={__css("display:flex;flex-direction:column;height:640px;animation:tu-step .3s cubic-bezier(.2,.8,.2,1) both")}>
                        <div style={__css("display:flex;align-items:center;gap:10px;padding:20px 24px;border-bottom:1px solid #f0f1ee")}>
                          <span style={__css("font-size:15.5px;font-weight:700;color:#0b2f26")}>
                            {V.L.allConversations}
                          </span>
                          <span style={__css("flex:1")} />
                          <span style={__css("font-size:12.5px;color:#9aa8a2;white-space:nowrap")}>
                            {V.convCount}
                          </span>
                        </div>
                        <div style={__css("flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:4px")}>
                          {(V.conversations || []).map((c, __i27) => (<React.Fragment key={__i27}>
                            <button className="hv15" onClick={c.open} style={__css("display:flex;gap:14px;align-items:center;width:100%;padding:14px 16px;border:0;border-radius:16px;background:transparent;cursor:pointer;text-align:start;transition:background .16s")}>
                              <span style={__css(`width:46px;height:46px;border-radius:50%;display:grid;place-items:center;background:${c.color};color:#fff;font-weight:700;font-size:15px;flex:none`)}>
                                {c.initials}
                              </span>
                              <span style={__css("flex:1;min-width:0;display:flex;flex-direction:column")}>
                                <span style={__css("font-weight:700;font-size:15px")}>
                                  {c.name}
                                </span>
                                <span style={__css("font-size:13.5px;color:#6b7a74;overflow:hidden;text-overflow:ellipsis;white-space:nowrap")}>
                                  {c.preview}
                                </span>
                              </span>
                              <span style={__css("display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex:none")}>
                                <span style={__css("font-size:11.5px;color:#9aa8a2")}>
                                  {c.time}
                                </span>
                                <span style={__css("font-size:15px;color:#9aa8a2;line-height:1")}>
                                  {V.arrow}
                                </span>
                              </span>
                            </button>
                          </React.Fragment>))}
                        </div>
                      </div>
                    </>) : null}
                    {V.hasActiveConv ? (<>
                      <div style={__css("display:flex;flex-direction:column;height:640px;animation:tu-step .3s cubic-bezier(.2,.8,.2,1) both")}>
                        <div style={__css("display:flex;align-items:center;gap:12px;padding:16px 20px;border-bottom:1px solid #e6e8e4;background:linear-gradient(120deg,#f1f8f5,#f8f4fb)")}>
                          <span style={__css(`width:42px;height:42px;border-radius:50%;display:grid;place-items:center;background:${V.activeConv.color};color:#fff;font-weight:700;font-size:14px;flex:none`)}>
                            {V.activeConv.initials}
                          </span>
                          <div style={__css("flex:1;min-width:0")}>
                            <div style={__css("font-weight:700;font-size:15.5px")}>
                              {V.activeConv.name}
                            </div>
                            <div style={__css("font-size:12.5px;color:#6b7a74")}>
                              {V.activeConv.role}
                            </div>
                          </div>
                          <span style={__css("display:inline-flex;align-items:center;gap:7px;font-size:12.5px;font-weight:600;color:#227a62;white-space:nowrap")}>
                            <span style={__css("width:8px;height:8px;border-radius:50%;background:#227a62")} />
                            {V.L.live}
                          </span>
                          <button className="hv3" onClick={V.closeConv} title={V.L.closeChat} aria-label={V.L.closeChat} style={__css("width:34px;height:34px;display:grid;place-items:center;border:1px solid #e6e8e4;border-radius:50%;background:#fff;color:#6b7a74;cursor:pointer;flex:none;transition:border-color .16s,color .16s")}>
                            <svg width="15" height="15" viewBox={"0 0 24 24"} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <path d="m6 6 12 12M18 6 6 18" />
                            </svg>
                          </button>
                        </div>
                        <div style={__css("flex:1;overflow-y:auto;padding:22px;display:flex;flex-direction:column;gap:12px;background:radial-gradient(700px 400px at 100% 0%, rgba(146,112,180,.05), transparent 60%), #fff")}>
                          <span style={__css("align-self:center;font-size:11.5px;font-weight:700;color:#6b7a74;background:#f0f1ee;padding:4px 14px;border-radius:999px")}>
                            {V.L.today}
                          </span>
                          {(V.activeMessages || []).map((m, __i28) => (<React.Fragment key={__i28}>
                            <div style={__css(`display:flex;justify-content:${m.align}`)}>
                              <div style={__css(`max-width:62%;padding:11px 16px;border-radius:18px;font-size:14.5px;line-height:1.55;background:${m.bg};color:${m.fg};animation:tu-pop .24s cubic-bezier(.2,.8,.2,1) both`)}>
                                {m.text}
                                <span style={__css(`display:block;font-size:11px;margin-top:5px;color:${m.timeFg}`)}>
                                  {m.time}
                                </span>
                              </div>
                            </div>
                          </React.Fragment>))}
                        </div>
                        <div style={__css("display:flex;gap:10px;padding:14px 16px;border-top:1px solid #e6e8e4")}>
                          <input value={V.draft} onChange={V.editDraft} onKeyDown={V.draftKey} placeholder={V.composePlaceholder} style={__css("flex:1;padding:12px 18px;border:1px solid #e6e8e4;border-radius:999px;background:#fff")} />
                          <button className="hv2" onClick={V.sendMessage} style={__css("padding:12px 26px;border:0;border-radius:999px;background:#0f3d31;color:#fff;font-weight:600;font-size:14px;cursor:pointer;white-space:nowrap")}>
                            {V.L.send}
                          </button>
                        </div>
                      </div>
                    </>) : null}
                  </div>
                </>) : null}
                {V.noConversations ? (<>
                  <div style={__css("display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center;padding:64px 28px;background:#fff;border:1px dashed #e6e8e4;border-radius:28px")}>
                    <h3 style={__css("margin:0;font-size:19px;font-weight:700")}>
                      {V.L.emptyChatTitle}
                    </h3>
                    <p style={__css("margin:0;color:#6b7a74;max-width:46ch;font-size:14.5px")}>
                      {V.L.emptyChatDesc}
                    </p>
                    <button onClick={V.goRequests} style={__css("padding:11px 22px;border:0;border-radius:999px;background:#0f3d31;color:#fff;font-weight:600;font-size:14px;cursor:pointer;white-space:nowrap")}>
                      {V.L.checkRequests}
                    </button>
                  </div>
                </>) : null}
              </div>
            </>) : null}
            {V.onSettings ? (<>
              <div>
                <div style={__css("margin-bottom:26px;animation:tu-step .4s cubic-bezier(.2,.8,.2,1) both")}>
                  <span style={__css("font-size:12.5px;font-weight:700;color:#77519a")}>
                    {V.L.settingsEyebrow}
                  </span>
                  <h1 style={__css("margin:6px 0 8px;font-size:34px;font-weight:700;letter-spacing:-.02em")}>
                    {V.L.settings}
                  </h1>
                  <p style={__css("margin:0;color:#6b7a74;max-width:62ch;text-wrap:pretty")}>
                    {V.L.settingsSubtitle}
                  </p>
                </div>
                <div style={__css("display:flex;flex-direction:column;gap:22px;max-width:820px")}>
                  <div style={__css("background:#fff;border:1px solid #e6e8e4;border-radius:28px;box-shadow:0 2px 8px rgba(11,47,38,.06);padding:30px;display:flex;flex-direction:column;gap:6px;animation:tu-step .4s cubic-bezier(.2,.8,.2,1) both")}>
                    <div style={__css("margin-bottom:12px")}>
                      <div style={__css("font-size:16px;font-weight:700;color:#0b2f26")}>
                        {V.L.notifCard}
                      </div>
                      <div style={__css("font-size:12.5px;color:#6b7a74;margin-top:3px")}>
                        {V.L.notifCardHint}
                      </div>
                    </div>
                    {(V.notifToggles || []).map((t, __i29) => (<React.Fragment key={__i29}>
                      <div style={__css("display:flex;align-items:center;gap:16px;padding:16px 0;border-bottom:1px solid #f0f1ee")}>
                        <div style={__css("flex:1;min-width:0")}>
                          <div style={__css("font-size:14.5px;font-weight:600;color:#16211d")}>
                            {t.label}
                          </div>
                          <div style={__css("font-size:12.5px;color:#6b7a74;margin-top:2px")}>
                            {t.hint}
                          </div>
                        </div>
                        <button onClick={t.toggle} role="switch" aria-checked={t.on} aria-label={t.label} style={__css(`width:52px;height:30px;flex:none;display:flex;align-items:center;justify-content:${t.justify};padding:3px;border:1px solid ${t.trackBorder};border-radius:999px;background:${t.track};cursor:pointer;transition:background .18s,border-color .18s`)}>
                          <span style={__css("width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(11,47,38,.2);transition:transform .18s")} />
                        </button>
                      </div>
                    </React.Fragment>))}
                  </div>
                  <div style={__css("background:#fff;border:1px solid #e6e8e4;border-radius:28px;box-shadow:0 2px 8px rgba(11,47,38,.06);padding:30px;display:flex;flex-direction:column;gap:6px;animation:tu-step .45s cubic-bezier(.2,.8,.2,1) both")}>
                    <div style={__css("margin-bottom:12px")}>
                      <div style={__css("font-size:16px;font-weight:700;color:#0b2f26")}>
                        {V.L.accountCard}
                      </div>
                      <div style={__css("font-size:12.5px;color:#6b7a74;margin-top:3px;direction:ltr;text-align:start")}>
                        {V.myEmail}
                      </div>
                    </div>
                    <div style={__css("display:flex;align-items:center;gap:16px;padding:16px 0;border-bottom:1px solid #f0f1ee;flex-wrap:wrap")}>
                      <div style={__css("flex:1;min-width:180px")}>
                        <div style={__css("font-size:14.5px;font-weight:600;color:#16211d")}>
                          {V.L.language}
                        </div>
                        <div style={__css("font-size:12.5px;color:#6b7a74;margin-top:2px")}>
                          {V.L.languageHint}
                        </div>
                      </div>
                      <div dir="ltr" style={__css("position:relative;display:inline-flex;gap:2px;padding:3px;border-radius:999px;background:#eeefec;flex:none")}>
                        <span style={__css(`position:absolute;top:3px;bottom:3px;left:3px;width:62px;border-radius:999px;background:#fff;box-shadow:0 1px 3px rgba(11,47,38,.12);transform:${V.langThumbAr};transition:transform .3s cubic-bezier(.2,.8,.2,1);pointer-events:none`)} />
                        <button onClick={V.setAr} style={__css(`position:relative;z-index:1;width:62px;flex:none;border:0;background:transparent;padding:7px 0;color:${V.arFg};padding:7px 20px;border-radius:999px;font-size:12.5px;font-weight:700;cursor:pointer;transition:color .22s;text-align:center`)}>
                          ع
                        </button>
                        <button onClick={V.setEn} style={__css(`position:relative;z-index:1;width:62px;flex:none;border:0;background:transparent;padding:7px 0;color:${V.enFg};padding:7px 20px;border-radius:999px;font-size:12.5px;font-weight:700;cursor:pointer;transition:color .22s;text-align:center`)}>
                          EN
                        </button>
                      </div>
                    </div>
                    <div style={__css("display:flex;align-items:center;gap:16px;padding:16px 0;border-bottom:1px solid #f0f1ee;flex-wrap:wrap")}>
                      <div style={__css("flex:1;min-width:180px")}>
                        <div style={__css("font-size:14.5px;font-weight:600;color:#16211d")}>
                          {V.L.changePassword}
                        </div>
                        <div style={__css("font-size:12.5px;color:#6b7a74;margin-top:2px")}>
                          {V.L.changePasswordHint}
                        </div>
                      </div>
                      <button className="hv16" onClick={V.changePassword} style={__css("padding:9px 16px;min-width:132px;justify-content:center;display:inline-flex;align-items:center;border-radius:999px;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap;transition:background .16s,border-color .16s;border:1px solid #c3a9d8;background:#f8f4fb;color:#5d3f76")}>
                        {V.L.changePassword}
                      </button>
                    </div>
                    <div style={__css("display:flex;align-items:center;gap:16px;padding:16px 0;border-bottom:1px solid #f0f1ee;flex-wrap:wrap")}>
                      <div style={__css("flex:1;min-width:180px")}>
                        <div style={__css("font-size:14.5px;font-weight:600;color:#16211d")}>
                          {V.L.logout}
                        </div>
                        <div style={__css("font-size:12.5px;color:#6b7a74;margin-top:2px")}>
                          {V.L.logoutHint}
                        </div>
                      </div>
                      <button className="hv16" onClick={V.logout} style={__css("padding:9px 16px;min-width:132px;justify-content:center;display:inline-flex;align-items:center;border-radius:999px;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap;transition:background .16s,border-color .16s;border:1px solid #c3a9d8;background:#f8f4fb;color:#5d3f76")}>
                        {V.L.logout}
                      </button>
                    </div>
                    <div style={__css("display:flex;align-items:center;gap:16px;padding:18px 0 0;flex-wrap:wrap")}>
                      <div style={__css("flex:1;min-width:180px")}>
                        <div style={__css("font-size:14.5px;font-weight:600;color:#a53f3f")}>
                          {V.L.deleteAccount}
                        </div>
                        <div style={__css("font-size:12.5px;color:#6b7a74;margin-top:2px")}>
                          {V.L.deleteAccountHint}
                        </div>
                      </div>
                      <button className="hv17" onClick={V.deleteAccount} style={__css("padding:9px 16px;min-width:132px;justify-content:center;display:inline-flex;align-items:center;border-radius:999px;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap;transition:background .16s,border-color .16s;border:1px solid #eddada;background:#fbeeee;color:#a53f3f")}>
                        {V.L.deleteAccount}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>) : null}
            {V.onMe ? (<>
              <div>
                <div style={__css("display:flex;align-items:flex-end;gap:16px;margin-bottom:24px;flex-wrap:wrap;animation:tu-step .4s cubic-bezier(.2,.8,.2,1) both")}>
                  <div style={__css("flex:1;min-width:300px")}>
                    <span style={__css("font-size:12.5px;font-weight:700;color:#77519a")}>
                      {V.L.meEyebrow}
                    </span>
                    <h1 style={__css("margin:6px 0 8px;font-size:34px;font-weight:700;letter-spacing:-.02em")}>
                      {V.L.meTitle}
                    </h1>
                    <p style={__css("margin:0;color:#6b7a74;max-width:62ch")}>
                      {V.L.meSubtitle}
                    </p>
                  </div>
                  <button className="hv3" onClick={V.viewMyProfile} style={__css("padding:11px 20px;border:1px solid #e6e8e4;border-radius:999px;background:#fff;color:#3b4a45;font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap")}>
                    {V.L.viewAsOthers}
                  </button>
                </div>
                <div style={__css("display:flex;flex-direction:column;gap:22px;max-width:820px")}>
                  <div style={__css("background:#fff;border:1px solid #e6e8e4;border-radius:28px;box-shadow:0 2px 8px rgba(11,47,38,.06);padding:30px;display:flex;flex-direction:column;gap:22px;animation:tu-step .4s cubic-bezier(.2,.8,.2,1) both")}>
                    <div>
                      <div style={__css("font-size:16px;font-weight:700;color:#0b2f26")}>
                        {V.L.aboutYou}
                      </div>
                      <div style={__css("font-size:12.5px;color:#6b7a74;margin-top:3px")}>
                        {V.L.aboutYouHint}
                      </div>
                    </div>
                    <div style={__css("display:flex;align-items:center;gap:18px;flex-wrap:wrap;padding-bottom:20px;margin-bottom:20px;border-bottom:1px solid #f0f1ee")}>
                      <span style={__css(`width:72px;height:72px;border-radius:50%;display:grid;place-items:center;background:${V.meAvatarBg};color:#fff;font-weight:700;font-size:24px;flex:none`)}>
                        {V.meInitials}
                      </span>
                      <div style={__css("flex:1;min-width:180px")}>
                        <div style={__css("font-size:14.5px;font-weight:700;color:#0b2f26")}>
                          {V.L.photo}
                        </div>
                        <p style={__css("margin:5px 0 10px;font-size:12.5px;color:#6b7a74;line-height:1.7")}>
                          {V.L.photoHint}
                        </p>
                        <div style={__css("display:flex;gap:10px;flex-wrap:wrap")}>
                          <label className="hv3" style={__css("display:inline-flex;align-items:center;gap:8px;padding:9px 18px;border:1px solid #e6e8e4;border-radius:999px;background:#fff;color:#3b4a45;font-size:13.5px;font-weight:600;cursor:pointer;white-space:nowrap")}>
                            {V.L.changePhoto}
                            <input type="file" accept="image/*" onChange={V.uploadAvatar} style={__css("display:none")} />
                          </label>
                          {V.hasAvatar ? (<>
                            <button className="hv4" onClick={V.clearAvatar} style={__css("padding:9px 18px;border:1px solid #eddada;border-radius:999px;background:#fff;color:#a53f3f;font-size:13.5px;font-weight:600;cursor:pointer;white-space:nowrap")}>
                              {V.L.removePhoto}
                            </button>
                          </>) : null}
                        </div>
                      </div>
                    </div>
                    <div style={__css("display:grid;grid-template-columns:1fr 1fr;gap:20px")}>
                      <div style={__css("display:flex;flex-direction:column;gap:7px")}>
                        <label style={__css("font-size:13.5px;font-weight:600;color:#3b4a45")}>
                          {V.L.fName}
                        </label>
                        <input value={V.meName} onChange={V.editName} style={__css("width:100%;padding:13px 16px;border:1px solid #e6e8e4;border-radius:14px;background:#fff")} />
                      </div>
                      <div style={__css("display:flex;flex-direction:column;gap:7px")}>
                        <label style={__css("font-size:13.5px;font-weight:600;color:#3b4a45")}>
                          {V.L.fRole}
                        </label>
                        <input value={V.meRole} onChange={V.editRole} style={__css("width:100%;padding:13px 16px;border:1px solid #e6e8e4;border-radius:14px;background:#fff")} />
                      </div>
                    </div>
                    <div style={__css("display:flex;flex-direction:column;gap:7px")}>
                      <label style={__css("font-size:13.5px;font-weight:600;color:#3b4a45")}>
                        {V.L.fBio}
                      </label>
                      <textarea onChange={V.editBio} value={V.meBio} style={__css("width:100%;min-height:96px;padding:13px 16px;border:1px solid #e6e8e4;border-radius:14px;background:#fff;resize:vertical;line-height:1.6")} />
                      <span style={__css("font-size:12.5px;color:#9aa8a2")}>
                        {V.bioCount}
                      </span>
                    </div>
                    <div style={__css("display:flex;flex-direction:column;gap:7px")}>
                      <label style={__css("font-size:13.5px;font-weight:600;color:#3b4a45")}>
                        {V.L.experience}
                      </label>
                      <textarea onChange={V.editExp} value={V.meExp} style={__css("width:100%;min-height:80px;padding:13px 16px;border:1px solid #e6e8e4;border-radius:14px;background:#fff;resize:vertical;line-height:1.6")} />
                    </div>
                    <div style={__css("display:flex;flex-direction:column;gap:10px")}>
                      <label style={__css("font-size:13.5px;font-weight:600;color:#3b4a45")}>
                        {V.L.fOpenTo}
                      </label>
                      <div style={__css("display:flex;gap:10px;flex-wrap:wrap")}>
                        {(V.openToOptions || []).map((o, __i30) => (<React.Fragment key={__i30}>
                          <button onClick={o.pick} style={__css(`display:inline-flex;padding:11px 20px;border-radius:999px;border:1px solid ${o.border};background:${o.bg};color:${o.fg};font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap`)}>
                            {o.label}
                          </button>
                        </React.Fragment>))}
                      </div>
                      <span style={__css("font-size:12.5px;color:#6b7a74")}>
                        {V.L.fOpenToHint}
                      </span>
                    </div>
                  </div>
                  <div style={__css("background:#fff;border:1px solid #e6e8e4;border-radius:28px;box-shadow:0 2px 8px rgba(11,47,38,.06);padding:30px;display:flex;flex-direction:column;gap:18px;animation:tu-step .45s cubic-bezier(.2,.8,.2,1) both")}>
                    <div>
                      <div style={__css("font-size:16px;font-weight:700;color:#0b2f26")}>
                        {V.L.mySkills}
                      </div>
                      <div style={__css("font-size:12.5px;color:#6b7a74;margin-top:3px")}>
                        {V.L.mySkillsHint}
                      </div>
                    </div>
                    <div style={__css("display:flex;gap:10px;align-items:center;flex-wrap:wrap")}>
                      <input value={V.meSkillQuery} onChange={V.editMeSkillQuery} onKeyDown={V.meSkillKey} placeholder={V.L.searchOrAddPh} style={__css("flex:1;min-width:240px;padding:12px 18px;border:1px solid #e6e8e4;border-radius:14px;background:#fff;font-size:14px")} />
                      {V.canAddMeSkill ? (<>
                        <button className="hv8" onClick={V.addMeSkill} style={__css("display:inline-flex;align-items:center;gap:8px;padding:12px 22px;border:1px solid #6fbfa5;border-radius:14px;background:#f1f8f5;color:#0f3d31;font-size:14px;font-weight:700;cursor:pointer;white-space:nowrap")}>
                          <span style={__css("font-size:17px;line-height:1")}>
                            +
                          </span>
                          {V.L.addSkill}
                        </button>
                      </>) : null}
                    </div>
                    {V.meSkillHint ? (<>
                      <span style={__css("font-size:12.5px;color:#9aa8a2")}>
                        {V.meSkillHint}
                      </span>
                    </>) : null}
                    {V.hasMeSuggestions ? (<>
                      <div style={__css("display:flex;flex-wrap:wrap;gap:8px;max-height:120px;overflow-y:auto;padding:14px;border:1px solid #eceeea;border-radius:16px;background:#fbfbf9")}>
                        {(V.meSuggestions || []).map((s, __i31) => (<React.Fragment key={__i31}>
                          <button className="hv3" onClick={s.addToMe} style={__css("display:inline-flex;padding:8px 16px;border-radius:999px;border:1px solid #e6e8e4;background:#fff;color:#3b4a45;font-size:13.5px;font-weight:600;cursor:pointer;white-space:nowrap;transition:border-color .16s,color .16s")}>
                            + {s.name}
                          </button>
                        </React.Fragment>))}
                      </div>
                    </>) : null}
                    <div style={__css("display:flex;flex-direction:column;gap:10px")}>
                      <span style={__css("font-size:13px;font-weight:700;color:#0b2f26")}>
                        {V.L.selectedAndLevels}
                      </span>
                      {(V.levelledSkills || []).map((s, __i32) => (<React.Fragment key={__i32}>
                        <div style={__css("display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding:12px 16px;border:1px solid #e6e8e4;border-radius:16px;background:#fff")}>
                          <span style={__css("font-size:14.5px;font-weight:700;flex:1;min-width:110px")}>
                            {s.name}
                          </span>
                          <div style={__css("display:inline-flex;gap:4px;padding:4px;background:#eeefec;border-radius:999px")}>
                            {(s.levels || []).map((lv, __i33) => (<React.Fragment key={__i33}>
                              <button onClick={lv.pick} style={__css(`border:0;background:${lv.bg};color:${lv.fg};padding:7px 15px;border-radius:999px;font-size:12.5px;font-weight:600;cursor:pointer;white-space:nowrap`)}>
                                {lv.label}
                              </button>
                            </React.Fragment>))}
                          </div>
                          <button className="hv4" onClick={s.remove} style={__css("border:1px solid #eddada;background:#fff;color:#a53f3f;padding:8px 14px;border-radius:999px;font-size:12.5px;font-weight:600;cursor:pointer;white-space:nowrap")}>
                            {V.L.remove}
                          </button>
                        </div>
                      </React.Fragment>))}
                      <span style={__css("font-size:12.5px;color:#9aa8a2")}>
                        {V.mySkillsCount}
                      </span>
                    </div>
                  </div>
                  <div style={__css("height:1px;background:#e6e8e4")} />
                  <div style={__css("display:flex;flex-direction:column;gap:16px")}>
                    <div>
                      <div style={__css("font-size:15.5px;font-weight:700;color:#0b2f26")}>
                        {V.L.projectsTitle}
                      </div>
                      <div style={__css("font-size:12.5px;color:#6b7a74;margin-top:3px")}>
                        {V.L.myProjectsHint}
                      </div>
                    </div>
                    {(V.myProjects || []).map((pr, __mp) => (<React.Fragment key={__mp}>
                      <div style={__css("display:flex;align-items:flex-start;gap:14px;flex-wrap:wrap;padding:16px;border:1px solid #e6e8e4;border-radius:16px;background:#fff")}>
                        <div style={__css("flex:1;min-width:180px")}>
                          <div style={__css("font-size:14.5px;font-weight:700")}>
                            {pr.title}
                          </div>
                          <p style={__css("margin:4px 0 0;font-size:13.5px;color:#6b7a74")}>
                            {pr.description}
                          </p>
                          <div style={__css("display:flex;gap:8px;flex-wrap:wrap;margin-top:10px")}>
                            <span style={__css("display:inline-flex;padding:4px 11px;border-radius:999px;font-size:12px;font-weight:600;background:#fff;border:1px solid #e6e8e4;color:#3b4a45;white-space:nowrap")}>
                              {pr.role}
                            </span>
                            <span style={__css("display:inline-flex;padding:4px 11px;border-radius:999px;font-size:12px;font-weight:600;background:#fff;border:1px solid #e6e8e4;color:#3b4a45;white-space:nowrap")}>
                              {pr.technologies}
                            </span>
                          </div>
                        </div>
                        <button className="hv4" onClick={pr.remove} style={__css("border:1px solid #eddada;background:#fff;color:#a53f3f;padding:8px 14px;border-radius:999px;font-size:12.5px;font-weight:600;cursor:pointer;white-space:nowrap")}>
                          {V.L.remove}
                        </button>
                      </div>
                    </React.Fragment>))}
                    <div style={__css("display:flex;flex-direction:column;gap:12px;padding:18px;border:1px dashed #e6e8e4;border-radius:16px;background:#fbfbf9")}>
                      <div style={__css("display:flex;gap:12px;flex-wrap:wrap")}>
                        <input value={V.np.title} onChange={V.editNpTitle} placeholder={V.L.projectTitlePh} style={__css("flex:1;min-width:200px;padding:12px 15px;border:1px solid #e6e8e4;border-radius:14px;background:#fff;font-size:14px")} />
                        <input value={V.np.role} onChange={V.editNpRole} placeholder={V.L.projectRolePh} style={__css("flex:1;min-width:200px;padding:12px 15px;border:1px solid #e6e8e4;border-radius:14px;background:#fff;font-size:14px")} />
                      </div>
                      <input value={V.np.description} onChange={V.editNpDesc} placeholder={V.L.projectDescPh} style={__css("padding:12px 15px;border:1px solid #e6e8e4;border-radius:14px;background:#fff;font-size:14px")} />
                      <div style={__css("display:flex;gap:12px;flex-wrap:wrap;align-items:center")}>
                        <input value={V.np.technologies} onChange={V.editNpTech} placeholder="Next.js, PostgreSQL" style={__css("flex:1;min-width:200px;padding:12px 15px;border:1px solid #e6e8e4;border-radius:14px;background:#fff;font-size:14px")} />
                        <button className="hv8" onClick={V.addProject} style={__css("display:inline-flex;align-items:center;gap:8px;padding:12px 22px;border:1px solid #6fbfa5;border-radius:14px;background:#f1f8f5;color:#0f3d31;font-size:14px;font-weight:700;cursor:pointer;white-space:nowrap")}>
                          <span style={__css("font-size:17px;line-height:1")}>
                            +
                          </span>
                          {V.L.addProject}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div style={__css("display:flex;align-items:center;gap:14px;flex-wrap:wrap")}>
                    {V.saved ? (<>
                      <span style={__css("font-size:13.5px;font-weight:600;color:#227a62")}>
                        {V.L.savedMsg}
                      </span>
                    </>) : null}
                    <span style={__css("flex:1")} />
                    <button className="hv1" onClick={V.saveProfile} style={__css("padding:13px 30px;border:0;border-radius:999px;background:#0f3d31;color:#fff;font-weight:700;font-size:15px;cursor:pointer;white-space:nowrap;transition:background .16s,transform .16s")}>
                      {V.L.save}
                    </button>
                  </div>
                </div>
              </div>
            </>) : null}
          </div>
        </div>
      </div>
    </>
  )
}
