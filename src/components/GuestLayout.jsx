import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useStateContext } from '../contexts/ContextProvider'
import { Card } from 'antd'

export default function GuestLayout() {
  const { token } = useStateContext()

  if (token) {
    return <Navigate to='/' />
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card style={{ width: '100%', maxWidth: '400px' }}>
        <h3 style={{ color: "#1677ff" }}>Welcome to Comunik!</h3>
        <br/>
        <Outlet />
      </Card>
    </div>
  )
}
