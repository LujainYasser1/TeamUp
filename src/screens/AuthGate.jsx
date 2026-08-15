import React from 'react'
import { __css } from '../lib/style'
import logo from '../assets/logo.svg'

/**
 * نافذة تظهر للضيف عند أي إجراء يحتاج حسابًا:
 * فتح ملف شخصي، محادثة، طلب تعاون، مجموعات… أو بعد انتهاء عمليات البحث المجانية.
 */
export default function AuthGate({ V }) {
  if (!V.gateOpen) return null
  return (
    <div
      onClick={V.closeGate}
      style={__css('position:fixed;inset:0;z-index:130;background:rgba(11,47,38,.45);display:grid;place-items:center;padding:24px;animation:tu-fade .18s ease both')}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={__css('width:100%;max-width:430px;background:#fff;border-radius:28px;box-shadow:0 18px 48px rgba(11,47,38,.2);padding:34px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:8px;animation:tu-rise .26s cubic-bezier(.2,.8,.2,1) both')}
      >
        <img src={logo} alt="TeamUp" width="56" height="56" style={__css('width:56px;height:56px')} />

        <h3 style={__css('margin:10px 0 0;font-size:22px;font-weight:700;letter-spacing:-.02em;color:#0b2f26')}>
          {V.gateTitle}
        </h3>
        <p style={__css('margin:0;font-size:14.5px;color:#6b7a74;line-height:1.8;max-width:34ch')}>
          {V.gateBody}
        </p>

        <div style={__css('display:flex;flex-direction:column;gap:10px;width:100%;margin-top:18px')}>
          <button
            className="hv2"
            onClick={V.gateSignup}
            style={__css('width:100%;padding:15px 22px;border:0;border-radius:999px;background:#0f3d31;color:#fff;font-weight:700;font-size:15.5px;cursor:pointer')}
          >
            {V.L.signup}
          </button>
          <button
            className="hv3"
            onClick={V.gateSignin}
            style={__css('width:100%;padding:13px 22px;border:1px solid #e6e8e4;border-radius:999px;background:#fff;color:#3b4a45;font-weight:600;font-size:14.5px;cursor:pointer')}
          >
            {V.L.login}
          </button>
          <button
            onClick={V.closeGate}
            style={__css('width:100%;padding:8px;border:0;background:transparent;color:#9aa8a2;font-size:13.5px;font-weight:600;cursor:pointer')}
          >
            {V.gateLater}
          </button>
        </div>
      </div>
    </div>
  )
}
