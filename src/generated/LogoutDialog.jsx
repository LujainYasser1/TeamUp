import React from 'react'
import { __css } from '../lib/style'
import logo from '../assets/logo.svg'

export default function LogoutDialog({ V }) {
  if (!(V.logoutAsk)) return null
  return (
    <>
      <div style={__css("position:fixed;inset:0;z-index:120;background:rgba(11,47,38,.4);display:grid;place-items:center;padding:24px")}>
        <div style={__css("width:100%;max-width:420px;background:#fff;border-radius:28px;box-shadow:0 18px 48px rgba(11,47,38,.12);padding:30px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:12px;animation:tu-rise .24s cubic-bezier(.2,.8,.2,1) both")}>
          <span style={__css("width:54px;height:54px;border-radius:50%;display:grid;place-items:center;background:#fbeeee;color:#a53f3f")}>
            <svg width="22" height="22" viewBox={"0 0 24 24"} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 4.5h3a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-3" />
              <path d="M10.5 8 14.5 12l-4 4M14 12H4" />
            </svg>
          </span>
          <h3 style={__css("margin:4px 0 0;font-size:20px;font-weight:700;letter-spacing:-.02em")}>
            {V.L.logoutConfirm}
          </h3>
          <p style={__css("margin:0;color:#6b7a74;font-size:14px;text-wrap:pretty")}>
            {V.L.logoutConfirmDesc}
          </p>
          <div style={__css("display:flex;gap:10px;margin-top:10px")}>
            <button className="hv3" onClick={V.cancelLogout} style={__css("padding:11px 26px;min-width:110px;border:1px solid #e6e8e4;border-radius:999px;background:#fff;color:#3b4a45;font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap")}>
              {V.L.no}
            </button>
            <button className="hv18" onClick={V.logout} style={__css("padding:11px 26px;min-width:110px;border:1px solid #eddada;border-radius:999px;background:#fbeeee;color:#a53f3f;font-size:14px;font-weight:700;cursor:pointer;white-space:nowrap")}>
              {V.L.yes}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
