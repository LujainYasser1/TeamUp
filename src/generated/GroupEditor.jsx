import React from 'react'
import { __css } from '../lib/style'
import logo from '../assets/logo.svg'

export default function GroupEditor({ V }) {
  if (!(V.newGroupOpen)) return null
  return (
    <>
      <div style={__css("position:fixed;inset:0;z-index:100;background:rgba(11,47,38,.4);display:grid;place-items:center;padding:24px")}>
        <div style={__css("width:100%;max-width:520px;background:#fff;border-radius:28px;box-shadow:0 18px 48px rgba(11,47,38,.12);padding:28px;animation:tu-rise .26s cubic-bezier(.2,.8,.2,1) both")}>
          <span style={__css("font-size:12.5px;font-weight:700;color:#77519a")}>
            {V.L.squadEyebrow}
          </span>
          <h3 style={__css("margin:6px 0 20px;font-size:22px;font-weight:700;letter-spacing:-.02em")}>
            {V.groupEditorTitle}
          </h3>
          <div style={__css("display:flex;flex-direction:column;gap:18px")}>
            <div style={__css("display:flex;flex-direction:column;gap:7px")}>
              <label style={__css("font-size:13.5px;font-weight:600;color:#3b4a45")}>
                {V.L.groupName}
              </label>
              <input value={V.ng.name} onChange={V.editNgName} placeholder={V.L.groupNamePh} style={__css("width:100%;padding:13px 16px;border:1px solid #e6e8e4;border-radius:14px;background:#fff")} />
            </div>
            <div style={__css("display:flex;flex-direction:column;gap:7px")}>
              <label style={__css("font-size:13.5px;font-weight:600;color:#3b4a45")}>
                {V.L.groupDesc}
              </label>
              <textarea onChange={V.editNgDesc} value={V.ng.desc} placeholder={V.L.groupDescPh} style={__css("width:100%;min-height:84px;padding:13px 16px;border:1px solid #e6e8e4;border-radius:14px;background:#fff;resize:vertical;line-height:1.6")} />
            </div>
            <div style={__css("display:flex;flex-direction:column;gap:10px")}>
              <label style={__css("font-size:13.5px;font-weight:600;color:#3b4a45")}>
                {V.L.groupMembers}
              </label>
              <div style={__css("display:flex;flex-wrap:wrap;gap:8px")}>
                {(V.groupCandidates || []).map((c, __i35) => (<React.Fragment key={__i35}>
                  <button onClick={c.toggle} style={__css(`display:inline-flex;align-items:center;gap:9px;padding:8px 16px;border-radius:999px;border:1px solid ${c.border};background:${c.bg};color:${c.fg};font-size:13.5px;font-weight:600;cursor:pointer;white-space:nowrap`)}>
                    {c.name}
                  </button>
                </React.Fragment>))}
              </div>
            </div>
            {V.showAllowManage ? (<>
              <div style={__css("display:flex;align-items:flex-start;gap:14px;padding:16px 18px;border:1px solid #e6e8e4;border-radius:18px;background:#fbfaf8")}>
                <div style={__css("flex:1;min-width:0")}>
                  <div style={__css("font-size:14.5px;font-weight:700;color:#0b2f26")}>
                    {V.L.allowMembers}
                  </div>
                  <p style={__css("margin:5px 0 0;font-size:12.5px;color:#6b7a74;line-height:1.7")}>
                    {V.L.allowMembersHint}
                  </p>
                </div>
                <button onClick={V.toggleAllowManage} role="switch" aria-checked={V.allowManage} aria-label={V.L.allowMembers} style={__css(`flex:none;width:52px;height:30px;padding:3px;display:flex;align-items:center;justify-content:${V.allowJustify};border:1px solid ${V.allowTrackBorder};border-radius:999px;background:${V.allowTrack};cursor:pointer;transition:background .2s,border-color .2s`)}>
                  <span style={__css("width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(11,47,38,.25)")} />
                </button>
              </div>
            </>) : null}
            <div style={__css("display:flex;justify-content:flex-end;gap:12px")}>
              <button onClick={V.closeNewGroup} style={__css("padding:11px 20px;border:1px solid #e6e8e4;border-radius:999px;background:#fff;color:#3b4a45;font-weight:600;font-size:14px;cursor:pointer;white-space:nowrap")}>
                {V.L.cancel}
              </button>
              <button className="hv2" onClick={V.createGroup} style={__css("padding:11px 24px;border:0;border-radius:999px;background:#0f3d31;color:#fff;font-weight:600;font-size:14px;cursor:pointer;white-space:nowrap")}>
                {V.groupEditorCta}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
