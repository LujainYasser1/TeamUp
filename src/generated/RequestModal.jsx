import React from 'react'
import { __css } from '../lib/style'
import logo from '../assets/logo.svg'

export default function RequestModal({ V }) {
  if (!(V.modalOpen)) return null
  return (
    <>
      <div style={__css("position:fixed;inset:0;z-index:100;background:rgba(11,47,38,.4);display:grid;place-items:center;padding:24px")}>
        <div style={__css("width:100%;max-width:480px;background:#fff;border-radius:28px;box-shadow:0 18px 48px rgba(11,47,38,.12);padding:28px;animation:tu-rise .26s cubic-bezier(.2,.8,.2,1) both")}>
          <span style={__css("font-size:12.5px;font-weight:700;color:#77519a")}>
            {V.L.reqModalEyebrow}
          </span>
          <h3 style={__css("margin:6px 0 18px;font-size:22px;font-weight:700;letter-spacing:-.02em")}>
            {V.modalTitle}
          </h3>
          <div style={__css("display:flex;flex-direction:column;gap:18px")}>
            <div style={__css("display:flex;flex-direction:column;gap:8px")}>
              <label style={__css("font-size:13.5px;font-weight:600;color:#3b4a45")}>
                {V.L.reqType}
              </label>
              <div style={__css("display:flex;gap:10px;flex-wrap:wrap")}>
                {(V.modalTypes || []).map((tp, __i36) => (<React.Fragment key={__i36}>
                  <button onClick={tp.pick} style={__css(`padding:9px 18px;border-radius:999px;border:1px solid ${tp.border};background:${tp.bg};color:${tp.fg};font-size:13.5px;font-weight:600;cursor:pointer`)}>
                    {tp.label}
                  </button>
                </React.Fragment>))}
              </div>
            </div>
            <div style={__css("display:flex;flex-direction:column;gap:7px")}>
              <label style={__css("font-size:13.5px;font-weight:600;color:#3b4a45")}>
                {V.L.reqMessage}
              </label>
              <textarea onChange={V.editReqMsg} value={V.reqMsg} placeholder={V.modalPlaceholder} style={__css("width:100%;min-height:96px;padding:12px 14px;border:1px solid #e6e8e4;border-radius:14px;background:#fff;resize:vertical;line-height:1.6")} />
            </div>
            <div style={__css("display:flex;justify-content:flex-end;gap:12px")}>
              <button onClick={V.closeModal} style={__css("padding:11px 20px;border:1px solid #e6e8e4;border-radius:999px;background:#fff;color:#3b4a45;font-weight:600;font-size:14px;cursor:pointer")}>
                {V.L.cancel}
              </button>
              <button className="hv2" onClick={V.sendRequest} style={__css("padding:11px 24px;border:0;border-radius:999px;background:#0f3d31;color:#fff;font-weight:600;font-size:14px;cursor:pointer")}>
                {V.L.sendShort}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
