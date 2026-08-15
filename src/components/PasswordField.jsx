import React, { useState } from 'react'
import { __css } from '../lib/style'

/* الحقل نفسه دائمًا LTR (كلمات المرور والبريد لاتينية)، والعين ثابتة على يمينه
   في اللغتين — عشان ما يركب الزر فوق النص عند تبديل اتجاه الصفحة. */
const BOX =
  'width:100%;padding:13px 16px;padding-right:48px;border:1px solid #e6e8e4;' +
  'border-radius:14px;background:#fff;direction:ltr;text-align:left'

/**
 * حقل كلمة المرور مع زر «عين» لإظهارها وإخفائها.
 * شكل الأيقونة يتغيّر: عين مفتوحة = مخفية (اضغط لتظهر)، عين مشطوبة = ظاهرة.
 */
export default function PasswordField({ value, onChange, onKeyDown, placeholder, autoComplete, ariaLabel }) {
  const [shown, setShown] = useState(false)
  return (
    <div style={__css('position:relative;display:flex;align-items:center;direction:ltr')}>
      <input
        type={shown ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoComplete={autoComplete || 'current-password'}
        style={__css(BOX)}
      />
      <button
        type="button"
        onClick={() => setShown((v) => !v)}
        aria-label={ariaLabel || (shown ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور')}
        title={ariaLabel || (shown ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور')}
        style={__css(
          'position:absolute;right:6px;width:36px;height:36px;display:grid;place-items:center;' +
            'border:0;background:transparent;color:' +
            (shown ? '#0f3d31' : '#9aa8a2') +
            ';cursor:pointer;border-radius:10px;transition:color .16s,background .16s'
        )}
        className="hv-eye"
      >
        {shown ? (
          /* عين مشطوبة — كلمة المرور ظاهرة الآن */
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.9 5.1A9.8 9.8 0 0 1 12 4.9c5 0 8.4 4 9.4 5.6.3.4.3 1 0 1.4-.4.7-1.3 1.9-2.6 3" />
            <path d="M6.3 6.7C4.3 8 3 9.8 2.6 10.5c-.3.4-.3 1 0 1.4C3.6 13.5 7 17.5 12 17.5c1.6 0 3-.4 4.2-1" />
            <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
            <path d="M3.5 3.5 20.5 20.5" />
          </svg>
        ) : (
          /* عين مفتوحة — كلمة المرور مخفية */
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.6 11.3C3.6 9.7 7 5.7 12 5.7s8.4 4 9.4 5.6c.3.4.3 1 0 1.4-1 1.6-4.4 5.6-9.4 5.6s-8.4-4-9.4-5.6a1.3 1.3 0 0 1 0-1.4" />
            <path d="M12 9a3 3 0 1 0 0 6 3 3 0 1 0 0-6" />
          </svg>
        )}
      </button>
    </div>
  )
}
