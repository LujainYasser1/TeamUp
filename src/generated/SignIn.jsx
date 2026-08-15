import React from 'react'
import { __css } from '../lib/style'
import logo from '../assets/logo.svg'
import PasswordField from '../components/PasswordField'

export default function SignIn({ V }) {
  if (!(V.isSignin)) return null
  return (
    <>
      <div style={__css("min-height:100vh;display:grid;place-items:center;padding:56px 24px;background:radial-gradient(760px 460px at 8% 0%, rgba(146,112,180,.13), transparent 60%), radial-gradient(700px 420px at 96% 12%, rgba(34,122,98,.11), transparent 58%), linear-gradient(180deg,#fbfaf8,#f6f5f2)")}>
        <div style={__css("width:100%;max-width:440px;background:#fff;border:1px solid #e6e8e4;border-radius:28px;box-shadow:0 18px 48px rgba(11,47,38,.12);padding:36px;display:flex;flex-direction:column;gap:20px;animation:tu-rise .5s cubic-bezier(.2,.8,.2,1) both")}>
          <div style={__css("display:flex;align-items:center;justify-content:space-between;gap:12px")}>
            <div style={__css("display:inline-flex;align-items:center;gap:10px;direction:ltr")}>
              <img src={logo} alt="TeamUp" width="32" height="32" style={__css("width:32px;height:32px;flex:none")} />
              <span style={__css("font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:19px;letter-spacing:-.03em;color:#0b2f26")}>
                TeamUp
              </span>
            </div>
            <button onClick={V.toggleLang} style={__css("border:1px solid #e6e8e4;background:#fff;padding:6px 14px;border-radius:999px;font-size:12.5px;font-weight:700;color:#3b4a45;cursor:pointer;white-space:nowrap")}>
              {V.L.langToggle}
            </button>
          </div>
          <div>
            <h1 style={__css("margin:0 0 6px;font-size:27px;font-weight:700;letter-spacing:-.02em")}>
              {V.L.welcomeTitle}
            </h1>
            <p style={__css("margin:0;color:#6b7a74;font-size:14.5px")}>
              {V.L.welcomeSubtitle}
            </p>
          </div>
          <div style={__css("display:flex;flex-direction:column;gap:16px")}>
            <div style={__css("display:flex;flex-direction:column;gap:7px")}>
              <label style={__css("font-size:13.5px;font-weight:600;color:#3b4a45")}>
                {V.L.email}
              </label>
              <input value={V.signEmail} onChange={V.editSignEmail} onKeyDown={V.authKey} placeholder={V.L.emailPh} type="email" autoComplete="email" inputMode="email" style={__css("width:100%;padding:13px 16px;border:1px solid #e6e8e4;border-radius:14px;background:#fff;direction:ltr;text-align:start")} />
            </div>
            <div style={__css("display:flex;flex-direction:column;gap:7px")}>
              <label style={__css("font-size:13.5px;font-weight:600;color:#3b4a45")}>
                {V.L.password}
              </label>
              <PasswordField value={V.signPass} onChange={V.editSignPass} onKeyDown={V.authKey} placeholder={V.L.passwordPh} autoComplete="current-password" ariaLabel={V.L.togglePassword} />
              <span style={__css("font-size:12.5px;color:#6b7a74")}>
                {V.L.passwordHint}
              </span>
            </div>
            <label style={__css("display:flex;align-items:center;gap:10px;cursor:pointer;user-select:none")}>
              <span onClick={V.toggleRemember} role="checkbox" aria-checked={V.remember} tabIndex={0} style={__css(`width:20px;height:20px;flex:none;display:grid;place-items:center;border:1px solid ${V.rememberBorder};border-radius:6px;background:${V.rememberBox};color:#fff;font-size:12px;font-weight:700;transition:background .16s,border-color .16s`)}>
                {V.rememberMark}
              </span>
              <span onClick={V.toggleRemember} style={__css("font-size:13.5px;color:#3b4a45;font-weight:600")}>
                {V.L.rememberMe}
              </span>
            </label>
            <button className="hv2" onClick={V.doLogin} disabled={V.busy} style={__css("width:100%;display:inline-flex;align-items:center;justify-content:center;padding:15px 22px;border:0;border-radius:999px;background:#0f3d31;color:#fff;font-weight:700;font-size:15.5px;cursor:pointer;white-space:nowrap;box-shadow:0 2px 8px rgba(11,47,38,.06)")}>
              {V.loginLabel}
            </button>
            <button className="hv3" onClick={V.guest} style={__css("width:100%;display:inline-flex;align-items:center;justify-content:center;padding:13px 22px;border:1px solid #e6e8e4;border-radius:999px;background:#fff;color:#3b4a45;font-weight:600;font-size:14.5px;cursor:pointer;white-space:nowrap")}>
              {V.L.guestEnter}
            </button>
          </div>
          <div style={__css("height:1px;background:#e6e8e4")} />
          <p style={__css("margin:0;text-align:center;font-size:14px;color:#6b7a74")}>
            {V.L.noAccount}
            <a href="#" onClick={V.startOnboarding} style={__css("color:#14503f;font-weight:700")}>
              {V.L.signup}
            </a>
          </p>
          <button onClick={V.goLanding} style={__css("align-self:center;border:0;background:transparent;color:#9aa8a2;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap")}>
            {V.L.backHome}
          </button>
        </div>
      </div>
    </>
  )
}
