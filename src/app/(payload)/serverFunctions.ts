'use server'

import { handleServerFunctions } from '@payloadcms/next/layouts'
import configPromise from '@payload-config'
import { importMap } from './admin/importMap'

export async function payloadServerFunction(args: {
  name: string
  args?: Record<string, unknown>
}) {
  return handleServerFunctions({
    name: args.name,
    args: args.args ?? {},
    config: configPromise,
    importMap,
  })
}
