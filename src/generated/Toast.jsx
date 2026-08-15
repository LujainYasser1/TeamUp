import React from 'react'
import { __css } from '../lib/style'
import logo from '../assets/logo.svg'

export default function Toast({ V }) {
  if (!(V.toast)) return null
  return (
    <>
      <div style={__css("position:fixed;bottom:28px;inset-inline-start:50%;transform:translateX(-50%);z-index:120;padding:12px 22px;border-radius:999px;background:#0b2f26;color:#fff;font-size:14px;font-weight:600;box-shadow:0 18px 48px rgba(11,47,38,.12);animation:tu-pop .24s cubic-bezier(.2,.8,.2,1) both")}>
        {V.toast}
      </div>
    </>
  )
}
