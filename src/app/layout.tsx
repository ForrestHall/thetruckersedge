import './globals.css'
import { RootLayout as PayloadRootLayout } from '@payloadcms/next/layouts'
import configPromise from '@payload-config'
import { importMap } from './(payload)/admin/importMap'
import { payloadServerFunction } from './(payload)/serverFunctions'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <PayloadRootLayout
      config={configPromise}
      importMap={importMap}
      serverFunction={payloadServerFunction}
      htmlProps={{ lang: 'en' }}
    >
      {children}
    </PayloadRootLayout>
  )
}
