/**
 * Seeds RSS feed sources for the Truckers News page.
 * Run: npx tsx scripts/seed-news-feeds.ts
 */
process.env.NODE_ENV = 'development'

import { getPayload } from 'payload'
import config from '../src/payload.config'

const FEEDS: { name: string; feedUrl: string; category?: string }[] = [
  { name: 'Fleet Owner', feedUrl: 'https://www.fleetowner.com/rss/rss.xml-0', category: 'equipment' },
  { name: 'FMCSA Newsroom', feedUrl: 'https://www.fmcsa.dot.gov/newsroom.xml', category: 'regulations' },
  { name: 'Transportation.gov', feedUrl: 'https://www.transportation.gov/rss', category: 'regulations' },
  { name: 'Overdrive', feedUrl: 'https://www.overdriveonline.com/feed/', category: 'general' },
  { name: 'CCJ Digital', feedUrl: 'https://www.ccjdigital.com/feed/', category: 'equipment' },
  { name: 'Trucking Info', feedUrl: 'https://www.truckinginfo.com/feed/', category: 'equipment' },
  { name: 'FreightWaves', feedUrl: 'https://www.freightwaves.com/feed', category: 'freight' },
  { name: 'Transport Topics', feedUrl: 'https://www.ttnews.com/rss', category: 'freight' },
  { name: 'HDT Magazine', feedUrl: 'https://www.truckinginfo.com/rss', category: 'equipment' },
  { name: 'Pedigree Truck Sales Blog', feedUrl: 'https://pedigreetrucksales.com/blog/feed/', category: 'general' },
  { name: 'DAT Blog', feedUrl: 'https://www.dat.com/blog/feed/', category: 'freight' },
  { name: 'CDLLife', feedUrl: 'https://cdllife.com/feed/', category: 'general' },
  { name: 'PrePass Trucking Blog', feedUrl: 'https://prepass.com/blog/feed/', category: 'safety' },
  { name: 'Roadmaster Blog', feedUrl: 'https://www.roadmaster.com/blog/feed/', category: 'general' },
  { name: 'Truckers News', feedUrl: 'https://www.truckersnews.com/feed/', category: 'general' },
  { name: 'Truck News', feedUrl: 'https://www.trucknews.com/rss/', category: 'general' },
  { name: 'AllTruckJobs Blog', feedUrl: 'https://www.alltruckjobs.com/blog/feed/', category: 'general' },
  { name: 'Truck Report Geeks', feedUrl: 'https://truckreportgeeks.com/feed/', category: 'equipment' },
  { name: 'The Truckers Report', feedUrl: 'https://www.thetruckersreport.com/feed/', category: 'general' },
  { name: 'Ask the Trucker', feedUrl: 'https://askthetrucker.com/feed/', category: 'general' },
  { name: 'LiveTrucking', feedUrl: 'https://livetrucking.com/feed/', category: 'general' },
  { name: 'Truckers Logic', feedUrl: 'https://truckerslogic.com/feed/', category: 'general' },
]

async function main() {
  try {
    const payload = await getPayload({ config })

    const { docs: existingFeeds } = await payload.find({
      collection: 'feed-sources',
      limit: 500,
    })
    const existingUrls = new Set(existingFeeds.map((f) => f.feedUrl))

    let added = 0
    for (let i = 0; i < FEEDS.length; i++) {
      const feed = FEEDS[i]
      if (existingUrls.has(feed.feedUrl)) continue

      await payload.create({
        collection: 'feed-sources',
        data: {
          name: feed.name,
          feedUrl: feed.feedUrl,
          category: feed.category,
          enabled: true,
          sortOrder: existingFeeds.length + added,
        },
      })
      console.log(`[seed-news-feeds] Added: ${feed.name}`)
      added++
    }

    if (added === 0 && existingFeeds.length > 0) {
      console.log('[seed-news-feeds] All feeds already exist. Add new sources via Admin.')
    }

    console.log('[seed-news-feeds] Done.')
  } catch (err) {
    console.error('[seed-news-feeds] Error:', err)
    process.exit(1)
  } finally {
    process.exit(0)
  }
}

main()
