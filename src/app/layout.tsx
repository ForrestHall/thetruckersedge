import './globals.css'
import { RootLayout as PayloadRootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import configPromise from '@payload-config'
import { importMap } from './(payload)/admin/importMap'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const serverFunction = async (args: { name: string; args?: Record<string, unknown> }) => {
    'use server'
    return handleServerFunctions({
      name: args.name,
      args: args.args ?? {},
      config: configPromise,
      importMap,
    })
  }

  return (
    <PayloadRootLayout
      config={configPromise}
      importMap={importMap}
      serverFunction={serverFunction}
      htmlProps={{ lang: 'en' }}
    >
      {children}
    </PayloadRootLayout>
  )
}
