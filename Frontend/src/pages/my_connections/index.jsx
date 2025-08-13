import DashboardLayout from '@/layouts/dashboardLayout'
import UserLayout from '@/layouts/userLayouts'
import React from 'react'

const MyConnections = () => {
  return (
    <UserLayout>
        <DashboardLayout>
            <h1>Myconnections</h1>
        </DashboardLayout>
    </UserLayout>
  );
}

export default MyConnections