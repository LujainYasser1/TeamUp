import React from 'react'
import { __css } from '../lib/style'
import logo from '../assets/logo.svg'

export default function Landing({ V }) {
  if (!(V.isAuth)) return null
  return (
    <>
      <div style={__css("position:relative;min-height:100vh;display:grid;place-items:center;padding:80px 24px;background:radial-gradient(900px 520px at 12% 6%, rgba(146,112,180,.13), transparent 62%), radial-gradient(820px 480px at 88% 10%, rgba(34,122,98,.11), transparent 60%), linear-gradient(180deg,#fbfaf8,#f6f5f2)")}>
        <div dir="ltr" style={__css("position:absolute;top:28px;left:32px;display:flex;align-items:center;gap:4px;padding:4px;border-radius:999px;background:#eeefec;box-shadow:inset 0 1px 2px rgba(11,47,38,.06)")}>
          <span style={__css(`position:absolute;top:4px;bottom:4px;left:4px;width:124px;border-radius:999px;background:#fff;box-shadow:0 2px 8px rgba(11,47,38,.1);transform:${V.langThumb};transition:transform .3s cubic-bezier(.2,.8,.2,1);pointer-events:none`)} />
          <button onClick={V.setEn} style={__css(`position:relative;z-index:1;width:124px;flex:none;border:0;background:transparent;color:${V.enPillFg};padding:9px 20px;border-radius:999px;font-size:14.5px;font-weight:700;cursor:pointer;white-space:nowrap;transition:color .22s`)}>
            English
          </button>
          <button onClick={V.setAr} style={__css(`position:relative;z-index:1;width:124px;flex:none;border:0;background:transparent;color:${V.arPillFg};padding:9px 20px;border-radius:999px;font-size:14.5px;font-weight:700;cursor:pointer;white-space:nowrap;transition:color .22s`)}>
            العربية
          </button>
        </div>
        <div style={__css("display:flex;flex-direction:column;align-items:center;text-align:center;gap:26px;max-width:640px;animation:tu-rise .7s cubic-bezier(.2,.8,.2,1) both")}>
          <img src={logo} alt="TeamUp" width="118" height="118" style={__css("width:118px;height:118px")} />
          <h1 style={__css("margin:0;font-family:'Plus Jakarta Sans',sans-serif;direction:ltr;font-size:112px;line-height:1;letter-spacing:-.05em;font-weight:800;background:linear-gradient(100deg,#0b2f26 20%,#77519a 88%);-webkit-background-clip:text;background-clip:text;color:transparent")}>
            TeamUp
          </h1>
          <p style={__css("margin:0;font-size:27px;font-weight:700;letter-spacing:-.02em;color:#0f3d31;text-wrap:pretty")}>
            {V.L.tagline}
          </p>
          <p style={__css("margin:0;color:#6b7a74;max-width:46ch;font-size:16.5px;text-wrap:pretty")}>
            {V.L.support}
          </p>
          <button className="hv1" onClick={V.login} style={__css("display:inline-flex;align-items:center;gap:12px;margin-top:8px;padding:17px 40px;border:0;border-radius:999px;background:#0f3d31;color:#fff;font-weight:700;font-size:17px;cursor:pointer;white-space:nowrap;box-shadow:0 8px 24px rgba(11,47,38,.14)")}>
            {V.L.getStarted}
            <span style={__css("font-size:18px;line-height:1")}>
              {V.arrow}
            </span>
          </button>
        </div>
      </div>
    </>
  )
}
