import React from 'react'
import { __css } from '../lib/style'
import AuthGate from '../screens/AuthGate'
import Landing from './Landing'
import SignIn from './SignIn'
import Onboarding from './Onboarding'
import AppShell from './AppShell'
import LogoutDialog from './LogoutDialog'
import GroupChat from './GroupChat'
import GroupEditor from './GroupEditor'
import RequestModal from './RequestModal'
import Toast from './Toast'

export default function Root({ V }) {
  return (
    <div dir={V.dir} style={__css("min-height:100vh;background:#f6f5f2;color:#16211d;font-family:'IBM Plex Sans Arabic','Plus Jakarta Sans',system-ui,sans-serif;font-size:15.5px;line-height:1.6;-webkit-font-smoothing:antialiased")}>
      <Landing V={V} />
      <SignIn V={V} />
      <Onboarding V={V} />
      <AppShell V={V} />
      <LogoutDialog V={V} />
      <GroupChat V={V} />
      <GroupEditor V={V} />
      <RequestModal V={V} />
      <Toast V={V} />
      <AuthGate V={V} />
    </div>
  )
}
