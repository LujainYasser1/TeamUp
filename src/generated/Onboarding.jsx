import React from 'react'
import { __css } from '../lib/style'
import logo from '../assets/logo.svg'
import PasswordField from '../components/PasswordField'

export default function Onboarding({ V }) {
  if (!(V.isOnboarding)) return null
  return (
    <>
      <div style={__css("min-height:100vh;background:#f6f5f2")}>
        <div style={__css("height:70px;display:flex;align-items:center;background:rgba(255,255,255,.9);border-bottom:1px solid #e6e8e4;padding-inline:32px;gap:16px")}>
          <div style={__css("display:inline-flex;align-items:center;gap:11px;direction:ltr")}>
            <img src={logo} alt="TeamUp" width="30" height="30" style={__css("width:30px;height:30px;flex:none")} />
            <span style={__css("font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:19px;letter-spacing:-.03em;color:#0b2f26")}>
              TeamUp
            </span>
          </div>
          <span style={__css("flex:1")} />
          <div style={__css("display:inline-flex;gap:2px;padding:3px;border-radius:999px;background:#eeefec")}>
            <button onClick={V.setAr} style={__css(`border:0;background:${V.arBg};color:${V.arFg};padding:6px 14px;border-radius:999px;font-size:12.5px;font-weight:700;cursor:pointer`)}>
              ع
            </button>
            <button onClick={V.setEn} style={__css(`border:0;background:${V.enBg};color:${V.enFg};padding:6px 14px;border-radius:999px;font-size:12.5px;font-weight:700;cursor:pointer`)}>
              EN
            </button>
          </div>
        </div>
        <div style={__css("max-width:860px;margin-inline:auto;padding:44px 32px 90px")}>
          <div style={__css("display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:32px;flex-wrap:wrap")}>
            {(V.steps || []).map((st, __i1) => (<React.Fragment key={__i1}>
              <div style={__css("display:flex;align-items:center;gap:12px")}>
                {st.line ? (<>
                  <span style={__css("width:34px;height:2px;background:#e6e8e4;border-radius:2px")} />
                </>) : null}
                <span style={__css(`display:flex;align-items:center;gap:9px;font-size:13.5px;font-weight:600;color:${st.fg};white-space:nowrap`)}>
                  <span style={__css(`width:26px;height:26px;border-radius:50%;display:grid;place-items:center;background:${st.dotBg};color:${st.dotFg};font-size:12.5px;font-weight:700`)}>
                    {st.mark}
                  </span>
                  {st.label}
                </span>
              </div>
            </React.Fragment>))}
          </div>
          <div style={__css("margin-bottom:26px")}>
            <span style={__css("font-size:13px;font-weight:700;color:#77519a")}>
              {V.L.onbEyebrow}
            </span>
            <h1 style={__css("margin:8px 0 10px;font-size:37px;font-weight:700;letter-spacing:-.025em;text-wrap:pretty")}>
              {V.stepTitle}
            </h1>
            <p style={__css("margin:0;color:#6b7a74;max-width:62ch;text-wrap:pretty")}>
              {V.stepSubtitle}
            </p>
          </div>
          <div style={__css("background:#fff;border:1px solid #e6e8e4;border-radius:28px;box-shadow:0 2px 8px rgba(11,47,38,.06);padding:32px;display:flex;flex-direction:column;gap:24px")}>
            {V.atAccount ? (<>
              <div style={__css("display:flex;flex-direction:column;gap:20px;animation:tu-step .38s cubic-bezier(.2,.8,.2,1) both")}>
                <div style={__css("display:flex;align-items:center;gap:9px;font-size:15.5px;font-weight:700;color:#0b2f26")}>
                  {V.L.secAccount}
                </div>
                <div style={__css("display:flex;flex-direction:column;gap:7px")}>
                  <label style={__css("font-size:13.5px;font-weight:600;color:#3b4a45")}>
                    {V.L.fullName}
                  </label>
                  <input value={V.signName} onChange={V.editSignName} onKeyDown={V.authKey} autoComplete="name" placeholder={V.L.namePh} style={__css("width:100%;padding:13px 16px;border:1px solid #e6e8e4;border-radius:14px;background:#fff")} />
                </div>
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
                  <PasswordField value={V.signPass} onChange={V.editSignPass} onKeyDown={V.authKey} placeholder={V.L.passwordPh} autoComplete="new-password" ariaLabel={V.L.togglePassword} />
                  <span style={__css("font-size:12.5px;color:#6b7a74")}>
                    {V.L.passwordHint}
                  </span>
                </div>
              </div>
            </>) : null}
            {V.atProfile ? (<>
              <div style={__css("display:flex;flex-direction:column;gap:22px;animation:tu-step .38s cubic-bezier(.2,.8,.2,1) both")}>
                <div style={__css("display:flex;align-items:center;gap:9px;font-size:15.5px;font-weight:700;color:#0b2f26")}>
                  {V.L.aboutYou}
                </div>
                <div style={__css("display:grid;grid-template-columns:1fr 1fr;gap:20px")}>
                  <div style={__css("display:flex;flex-direction:column;gap:7px")}>
                    <label style={__css("font-size:13.5px;font-weight:600;color:#3b4a45")}>
                      {V.L.fName}
                    </label>
                    <input value={V.meName} onChange={V.editName} placeholder={V.L.namePh} style={__css("width:100%;padding:13px 16px;border:1px solid #e6e8e4;border-radius:14px;background:#fff")} />
                  </div>
                  <div style={__css("display:flex;flex-direction:column;gap:7px")}>
                    <label style={__css("font-size:13.5px;font-weight:600;color:#3b4a45")}>
                      {V.L.fRole}
                    </label>
                    <input value={V.meRole} onChange={V.editRole} placeholder={V.L.rolePh} style={__css("width:100%;padding:13px 16px;border:1px solid #e6e8e4;border-radius:14px;background:#fff")} />
                  </div>
                </div>
                <div style={__css("display:flex;flex-direction:column;gap:7px")}>
                  <label style={__css("font-size:13.5px;font-weight:600;color:#3b4a45")}>
                    {V.L.fBio}
                  </label>
                  <textarea onChange={V.editBio} value={V.meBio} placeholder={V.L.bioPh} style={__css("width:100%;min-height:110px;padding:13px 16px;border:1px solid #e6e8e4;border-radius:14px;background:#fff;resize:vertical;line-height:1.6")} />
                  <span style={__css("font-size:12.5px;color:#9aa8a2;align-self:flex-start")}>
                    {V.bioCount}
                  </span>
                </div>
                <div style={__css("display:flex;flex-direction:column;gap:7px")}>
                  <label style={__css("font-size:13.5px;font-weight:600;color:#3b4a45")}>
                    {V.L.experience}
                  </label>
                  <textarea onChange={V.editExp} value={V.meExp} placeholder={V.L.expPh} style={__css("width:100%;min-height:96px;padding:13px 16px;border:1px solid #e6e8e4;border-radius:14px;background:#fff;resize:vertical;line-height:1.6")} />
                </div>
                <div style={__css("display:flex;flex-direction:column;gap:10px")}>
                  <label style={__css("font-size:13.5px;font-weight:600;color:#3b4a45")}>
                    {V.L.fOpenTo}
                  </label>
                  <div style={__css("display:flex;gap:10px;flex-wrap:wrap")}>
                    {(V.openToOptions || []).map((o, __i2) => (<React.Fragment key={__i2}>
                      <button onClick={o.pick} style={__css(`display:inline-flex;align-items:center;gap:8px;padding:11px 20px;border-radius:999px;border:1px solid ${o.border};background:${o.bg};color:${o.fg};font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap`)}>
                        {o.label}
                      </button>
                    </React.Fragment>))}
                  </div>
                  <span style={__css("font-size:12.5px;color:#6b7a74")}>
                    {V.L.fOpenToHint}
                  </span>
                </div>
              </div>
            </>) : null}
            {V.atSkills ? (<>
              <div style={__css("display:flex;flex-direction:column;gap:22px;animation:tu-step .38s cubic-bezier(.2,.8,.2,1) both")}>
                <div>
                  <div style={__css("font-size:15.5px;font-weight:700;color:#0b2f26")}>
                    {V.L.mySkills}
                  </div>
                  <div style={__css("font-size:12.5px;color:#6b7a74;margin-top:3px")}>
                    {V.L.mySkillsHint}
                  </div>
                </div>
                <div style={__css("display:flex;flex-direction:column;gap:12px")}>
                  <div style={__css("display:flex;gap:10px;align-items:center;flex-wrap:wrap")}>
                    <input value={V.meSkillQuery} onChange={V.editMeSkillQuery} onKeyDown={V.meSkillKey} placeholder={V.L.searchOrAddPh} style={__css("flex:1;min-width:220px;padding:13px 16px;border:1px solid #e6e8e4;border-radius:14px;background:#fff;font-size:14.5px")} />
                    {V.canAddMeSkill ? (<>
                      <button className="hv8" onClick={V.addMeSkill} style={__css("display:inline-flex;align-items:center;gap:8px;padding:13px 22px;border:1px solid #6fbfa5;border-radius:14px;background:#f1f8f5;color:#0f3d31;font-size:14px;font-weight:700;cursor:pointer;white-space:nowrap")}>
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
                    <div style={__css("display:flex;flex-wrap:wrap;gap:9px")}>
                      {(V.meSuggestions || []).map((s, __sg) => (<React.Fragment key={__sg}>
                        <button className="hv3" onClick={s.addToMe} style={__css("padding:9px 16px;border:1px solid #e6e8e4;border-radius:999px;background:#fff;color:#3b4a45;font-size:13.5px;font-weight:600;cursor:pointer;white-space:nowrap")}>
                          + {s.name}
                        </button>
                      </React.Fragment>))}
                    </div>
                  </>) : null}
                </div>
                <div style={__css("display:flex;flex-direction:column;gap:10px")}>
                  <span style={__css("font-size:13.5px;font-weight:700;color:#0b2f26")}>
                    {V.L.selectedAndLevels}
                  </span>
                  {(V.levelledSkills || []).map((s, __i4) => (<React.Fragment key={__i4}>
                    <div style={__css("display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding:14px 16px;border:1px solid #e6e8e4;border-radius:16px;background:#fff")}>
                      <span style={__css("font-size:14.5px;font-weight:700;flex:1;min-width:120px")}>
                        {s.name}
                      </span>
                      <div style={__css("display:inline-flex;gap:4px;padding:4px;background:#eeefec;border-radius:999px")}>
                        {(s.levels || []).map((lv, __i5) => (<React.Fragment key={__i5}>
                          <button onClick={lv.pick} style={__css(`border:0;background:${lv.bg};color:${lv.fg};padding:7px 16px;border-radius:999px;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap`)}>
                            {lv.label}
                          </button>
                        </React.Fragment>))}
                      </div>
                      <button className="hv4" onClick={s.remove} style={__css("border:1px solid #eddada;background:#fff;color:#a53f3f;padding:8px 14px;border-radius:999px;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap")}>
                        {V.L.remove}
                      </button>
                    </div>
                  </React.Fragment>))}
                  {V.noSkillsPicked ? (<>
                    <div style={__css("padding:22px;text-align:center;border:1px dashed #e6e8e4;border-radius:16px;color:#6b7a74;font-size:14px")}>
                      {V.L.noSkillsYet}
                    </div>
                  </>) : null}
                </div>
              </div>
            </>) : null}
            {V.atProjects ? (<>
              <div style={__css("display:flex;flex-direction:column;gap:22px;animation:tu-step .38s cubic-bezier(.2,.8,.2,1) both")}>
                <div>
                  <div style={__css("font-size:15.5px;font-weight:700;color:#0b2f26")}>
                    {V.L.projects}
                  </div>
                  <div style={__css("font-size:12.5px;color:#6b7a74;margin-top:3px")}>
                    {V.L.projectsHint}
                  </div>
                </div>
                {(V.myProjects || []).map((pr, __i6) => (<React.Fragment key={__i6}>
                  <div style={__css("display:flex;gap:14px;align-items:flex-start;padding:18px 20px;border:1px solid #e6e8e4;border-radius:18px;background:#fbfbf9")}>
                    <div style={__css("flex:1;min-width:0")}>
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
                    <button className="hv4" onClick={pr.remove} style={__css("border:1px solid #eddada;background:#fff;color:#a53f3f;padding:8px 14px;border-radius:999px;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap")}>
                      {V.L.remove}
                    </button>
                  </div>
                </React.Fragment>))}
                <div style={__css("display:flex;flex-direction:column;gap:18px;padding:22px;border:1px dashed #dfe3de;border-radius:20px;background:#fbfbf9")}>
                  <span style={__css("font-size:13.5px;font-weight:700;color:#3b4a45")}>
                    {V.L.addProject}
                  </span>
                  <div style={__css("display:grid;grid-template-columns:1fr 1fr;gap:18px")}>
                    <div style={__css("display:flex;flex-direction:column;gap:7px")}>
                      <label style={__css("font-size:13.5px;font-weight:600;color:#3b4a45")}>
                        {V.L.projectTitle}
                      </label>
                      <input value={V.np.title} onChange={V.editNpTitle} placeholder={V.L.projectTitlePh} style={__css("width:100%;padding:13px 16px;border:1px solid #e6e8e4;border-radius:14px;background:#fff")} />
                    </div>
                    <div style={__css("display:flex;flex-direction:column;gap:7px")}>
                      <label style={__css("font-size:13.5px;font-weight:600;color:#3b4a45")}>
                        {V.L.projectRole}
                      </label>
                      <input value={V.np.role} onChange={V.editNpRole} placeholder={V.L.projectRolePh} style={__css("width:100%;padding:13px 16px;border:1px solid #e6e8e4;border-radius:14px;background:#fff")} />
                    </div>
                  </div>
                  <div style={__css("display:flex;flex-direction:column;gap:7px")}>
                    <label style={__css("font-size:13.5px;font-weight:600;color:#3b4a45")}>
                      {V.L.projectDescription}
                    </label>
                    <textarea onChange={V.editNpDesc} value={V.np.description} placeholder={V.L.projectDescPh} style={__css("width:100%;min-height:84px;padding:13px 16px;border:1px solid #e6e8e4;border-radius:14px;background:#fff;resize:vertical;line-height:1.6")} />
                  </div>
                  <div style={__css("display:flex;flex-direction:column;gap:7px")}>
                    <label style={__css("font-size:13.5px;font-weight:600;color:#3b4a45")}>
                      {V.L.projectTech}
                    </label>
                    <input value={V.np.technologies} onChange={V.editNpTech} placeholder="Next.js, PostgreSQL" style={__css("width:100%;padding:13px 16px;border:1px solid #e6e8e4;border-radius:14px;background:#fff")} />
                  </div>
                  <button className="hv2" onClick={V.addProject} style={__css("align-self:flex-start;padding:11px 22px;border:0;border-radius:999px;background:#0f3d31;color:#fff;font-weight:600;font-size:14px;cursor:pointer;white-space:nowrap")}>
                    {V.L.addProject}
                  </button>
                </div>
              </div>
            </>) : null}
            <div style={__css("height:1px;background:#e6e8e4")} />
            <div style={__css("display:flex;align-items:center;gap:12px;flex-wrap:wrap")}>
              <button className="hv3" onClick={V.stepBack} style={__css("padding:12px 22px;border:1px solid #e6e8e4;border-radius:999px;background:#fff;color:#3b4a45;font-weight:600;font-size:14.5px;cursor:pointer;white-space:nowrap")}>
                {V.backStepLabel}
              </button>
              <span style={__css("flex:1;font-size:13px;color:#9aa8a2")}>
                {V.stepCounter}
              </span>
              <button className="hv1" onClick={V.stepNext} disabled={V.busy || V.stepBlocked} style={__css("padding:13px 30px;border:0;border-radius:999px;background:#0f3d31;color:#fff;font-weight:700;font-size:15px;cursor:pointer;white-space:nowrap;box-shadow:0 2px 8px rgba(11,47,38,.06)")}>
                {V.busy ? V.L.working : V.nextLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
