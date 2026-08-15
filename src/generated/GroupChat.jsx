import React from 'react'
import { __css } from '../lib/style'
import logo from '../assets/logo.svg'

export default function GroupChat({ V }) {
  if (!(V.groupChatOpen)) return null
  return (
    <>
      <div style={__css("position:fixed;inset:0;z-index:100;background:rgba(11,47,38,.4);display:grid;place-items:center;padding:32px")}>
        <div style={__css("width:100%;max-width:720px;height:min(78vh,640px);display:flex;flex-direction:column;background:#fff;border-radius:28px;box-shadow:0 18px 48px rgba(11,47,38,.12);overflow:hidden;animation:tu-rise .26s cubic-bezier(.2,.8,.2,1) both")}>
          <div style={__css("display:flex;align-items:center;gap:14px;padding:18px 22px;border-bottom:1px solid #e6e8e4;background:linear-gradient(120deg,#f1f8f5,#f8f4fb)")}>
            <div style={__css("flex:1;min-width:0")}>
              <div style={__css("font-weight:700;font-size:16.5px")}>
                {V.activeGroup.name}
              </div>
              <div style={__css("font-size:12.5px;color:#6b7a74")}>
                {V.activeGroup.count}
              </div>
            </div>
            <button className="hv3" onClick={V.closeGroupChat} aria-label={V.L.cancel} style={__css("width:36px;height:36px;display:grid;place-items:center;border:1px solid #e6e8e4;border-radius:50%;background:#fff;color:#6b7a74;cursor:pointer")}>
              <svg width="16" height="16" viewBox={"0 0 24 24"} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          <div style={__css("flex:1;overflow-y:auto;padding:22px;display:flex;flex-direction:column;gap:12px;background:radial-gradient(700px 400px at 100% 0%, rgba(146,112,180,.05), transparent 60%), #fff")}>
            {(V.groupMessages || []).map((m, __i34) => (<React.Fragment key={__i34}>
              <div style={__css(`display:flex;justify-content:${m.align}`)}>
                <div style={__css(`max-width:74%;padding:11px 16px;border-radius:18px;font-size:14.5px;line-height:1.55;background:${m.bg};color:${m.fg};animation:tu-pop .24s cubic-bezier(.2,.8,.2,1) both`)}>
                  <span style={__css(`display:block;font-size:12px;font-weight:700;color:${m.nameFg};margin-bottom:3px`)}>
                    {m.who}
                  </span>
                  {m.text}
                  <span style={__css(`display:block;font-size:11px;margin-top:5px;color:${m.timeFg}`)}>
                    {m.time}
                  </span>
                </div>
              </div>
            </React.Fragment>))}
          </div>
          <div style={__css("display:flex;gap:10px;padding:14px 16px;border-top:1px solid #e6e8e4")}>
            <input value={V.groupDraft} onChange={V.editGroupDraft} onKeyDown={V.groupDraftKey} placeholder={V.groupPlaceholder} style={__css("flex:1;padding:12px 18px;border:1px solid #e6e8e4;border-radius:999px;background:#fff")} />
            <button className="hv2" onClick={V.sendGroupMessage} style={__css("padding:12px 26px;border:0;border-radius:999px;background:#0f3d31;color:#fff;font-weight:600;font-size:14px;cursor:pointer;white-space:nowrap")}>
              {V.L.send}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
