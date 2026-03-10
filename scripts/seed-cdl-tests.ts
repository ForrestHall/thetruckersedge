/**
 * Seeds the CDL General Knowledge practice test.
 * Run: npx tsx scripts/seed-cdl-tests.ts
 */
process.env.NODE_ENV = 'development'

import { getPayload } from 'payload'
import config from '../src/payload.config'

const GENERAL_KNOWLEDGE_QUESTIONS = [
  { q: 'What is the minimum tread depth required for front tires on a commercial vehicle?', answers: [['4/32 inch', true], ['2/32 inch', false], ['6/32 inch', false], ['1/32 inch', false]], exp: 'Front tires must have at least 4/32 inch tread depth. All other tires require a minimum of 2/32 inch.' },
  { q: 'During a pre-trip inspection, you discover an oil leak. What should you do?', answers: [['Do not drive until the problem is fixed', true], ['Drive carefully and monitor the leak', false], ['Add more oil and continue your route', false], ['Report it after completing your delivery', false]], exp: 'Any defects that could affect safety must be repaired before driving. An oil leak can lead to engine failure or a fire.' },
  { q: 'What is the most important reason for doing a vehicle inspection?', answers: [['Your safety and the safety of others', true], ['To comply with DOT regulations', false], ['To avoid fines at weigh stations', false], ['To keep a record for your employer', false]], exp: 'While compliance matters, the primary reason is safety — yours and everyone else on the road.' },
  { q: 'How far ahead should you look when driving on a highway?', answers: [['12–15 seconds', true], ['5–8 seconds', false], ['3–4 seconds', false], ['20–25 seconds', false]], exp: 'At highway speeds, looking 12–15 seconds ahead gives you time to identify and respond to hazards. At 60 mph, that\'s roughly a quarter mile.' },
  { q: 'What does "controlled braking" mean?', answers: [['Applying firm, steady brake pressure without locking wheels', true], ['Using the parking brake to slow down', false], ['Applying brakes hard enough to lock the wheels', false], ['Pumping the brakes rapidly', false]], exp: 'Controlled braking means applying the maximum braking force without locking the wheels, which maintains steering control.' },
  { q: 'When should you downshift before going down a long, steep grade?', answers: [['Before you start down the hill', true], ['Halfway down the hill', false], ['When you feel your speed increasing', false], ['At the bottom of the hill', false]], exp: 'You must select the correct gear before starting down. Once you\'re moving fast, it may be impossible to shift.' },
  { q: 'What is the proper way to use the brake pedal when driving on a slippery road?', answers: [['Apply light, steady pressure', true], ['Pump the brakes quickly', false], ['Apply hard pressure immediately', false], ['Use only the engine brake', false]], exp: 'Hard or sudden braking on slippery roads can cause skids. Light, steady pressure gives you more control.' },
  { q: 'How many hours of off-duty time are required before a driver can reset their 60/70-hour clock?', answers: [['34 consecutive hours', true], ['24 consecutive hours', false], ['10 consecutive hours', false], ['48 consecutive hours', false]], exp: 'A 34-hour restart allows drivers to reset their 60-hour/7-day or 70-hour/8-day clock after taking 34 consecutive hours off duty.' },
  { q: 'What is the "danger zone" around a truck where the driver cannot see other vehicles?', answers: [['The blind spots on all four sides of the vehicle', true], ['The area directly behind the trailer', false], ['Only the right side of the truck', false], ['The area directly in front of the cab', false]], exp: 'Large trucks have blind spots on all four sides — directly in front, directly behind, and along both sides.' },
  { q: 'When backing a truck, you should:', answers: [['Use a spotter when available and back slowly', true], ['Back as quickly as possible', false], ['Always use only your mirrors', false], ['Avoid using your horn', false]], exp: 'You should use a spotter whenever possible, back slowly, and use all mirrors. If you must back without a spotter, get out and walk the area first.' },
  { q: 'What is the minimum following distance for a truck under normal conditions at highway speeds?', answers: [['1 second for every 10 feet of vehicle length', true], ['2 car lengths', false], ['3 seconds', false], ['4 seconds for every 10 feet of vehicle length', false]], exp: 'The rule is one second for every 10 feet of vehicle length at speeds under 40 mph. Add one more second for speeds over 40 mph.' },
  { q: 'If your vehicle has a manual transmission, when is it OK to coast in neutral downhill?', answers: [['Never — it is illegal and dangerous', true], ['Only on grades steeper than 6%', false], ['Only for short distances', false], ['Only when your brakes are overheating', false]], exp: 'Coasting in neutral removes engine braking and reduces your control. It is illegal in most states and always dangerous.' },
  { q: 'What should you do if a tire blows out while driving?', answers: [['Hold the steering wheel firmly, stay off the brakes, and let the vehicle slow down', true], ['Brake hard immediately', false], ['Pull the parking brake', false], ['Swerve to the shoulder immediately', false]], exp: 'Sudden braking after a blowout can cause a loss of control. Hold the wheel firmly, avoid braking, and allow the vehicle to slow gradually.' },
  { q: 'The total stopping distance of a truck is made up of:', answers: [['Perception distance, reaction distance, and braking distance', true], ['Reaction distance only', false], ['Braking distance only', false], ['Reaction distance and braking distance only', false]], exp: 'Total stopping distance includes perception time (seeing the hazard), reaction time (foot to brake), and actual braking distance.' },
  { q: 'What is the maximum number of hours a property-carrying driver can drive in a 14-hour window?', answers: [['10 hours', true], ['11 hours', false], ['12 hours', false], ['14 hours', false]], exp: 'Under FMCSA HOS rules, a property-carrying driver may drive a maximum of 11 hours after 10 consecutive hours off duty, but only within a 14-hour window.' },
  { q: 'When is it safe to remove the radiator cap to check coolant level?', answers: [['Only when the engine has cooled down', true], ['Only when the engine is running', false], ['Any time, as long as you use a cloth', false], ['Only after driving at least 30 minutes', false]], exp: 'Never remove the radiator cap on a hot engine — steam and boiling coolant can cause severe burns.' },
  { q: 'What does a "placarded" vehicle mean?', answers: [['The vehicle is carrying hazardous materials', true], ['The vehicle has passed DOT inspection', false], ['The vehicle has oversized cargo', false], ['The vehicle is exempt from weigh station stops', false]], exp: 'Placards are diamond-shaped signs required on vehicles carrying hazardous materials.' },
  { q: 'What should you do when you are being tailgated?', answers: [['Increase your following distance from the vehicle ahead', true], ['Tap your brakes to warn the driver', false], ['Speed up to create more distance', false], ['Slow down abruptly', false]], exp: 'Increasing your following distance gives you more time to brake gradually, reducing the chance the tailgater will rear-end you.' },
  { q: 'Cargo must be secured to prevent it from shifting. How often must you check cargo securement during a trip?', answers: [['Within the first 50 miles, then every 3 hours or 150 miles', true], ['Only at the start of the trip', false], ['Every hour', false], ['Only when you stop for fuel', false]], exp: 'FMCSA requires a cargo check within the first 50 miles, and then at every change of duty status, every 3 hours of driving, or every 150 miles.' },
  { q: 'What is "black ice"?', answers: [['A thin, nearly invisible layer of ice on the road surface', true], ['Ice that forms in shaded areas only', false], ['Ice mixed with road debris', false], ['Ice that only forms at night', false]], exp: 'Black ice is a thin transparent layer of ice that looks like wet pavement. It is extremely dangerous because it is very difficult to see.' },
  { q: 'Which of the following is NOT a sign of tire failure?', answers: [['Increased fuel efficiency', true], ['Steering that feels heavy or pulling to one side', false], ['A loud bang or pop', false], ['Vibration or thumping sounds', false]], exp: 'Increased fuel efficiency has no connection to tire failure. All other options are classic warning signs.' },
  { q: 'When driving through a curve, you should:', answers: [['Slow down before the curve and accelerate gradually coming out', true], ['Accelerate through the curve to maintain momentum', false], ['Brake while in the curve to control speed', false], ['Stay in the center of the lane at all times', false]], exp: 'Braking in a curve can cause skids. The correct technique is to reduce speed before entering the curve and gently accelerate as you exit.' },
  { q: 'What is the correct procedure if your brakes fail on a downgrade?', answers: [['Downshift and steer to an escape ramp or open area', true], ['Turn off the engine', false], ['Pump the brakes rapidly', false], ['Swerve side to side to slow down', false]], exp: 'If brakes fail on a downgrade, downshift to use engine braking, look for an escape ramp, and steer toward any open area.' },
  { q: 'Which statement about speed and stopping distance is correct?', answers: [['Doubling your speed quadruples your stopping distance', true], ['Doubling your speed doubles your stopping distance', false], ['Doubling your speed triples your stopping distance', false], ['Speed has no effect on stopping distance', false]], exp: 'Stopping distance increases with the square of your speed. Double your speed, and stopping distance increases four times.' },
  { q: 'After fueling, what should you do before driving away?', answers: [['Check that all fuel caps are secured', true], ['Run the engine for 5 minutes', false], ['Check your mirrors only', false], ['Log the fuel purchase in your logbook first', false]], exp: 'Unsecured fuel caps can cause fuel spills, fire hazards, and failed inspections. Always verify caps are tight before moving.' },
]

async function main() {
  try {
    const payload = await getPayload({ config })

    const existing = await payload.find({
      collection: 'practice-tests',
      where: { slug: { equals: 'cdl-general-knowledge-practice-test' } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log('[seed] CDL General Knowledge test already exists. Skipping.')
      process.exit(0)
      return
    }

    const questions = GENERAL_KNOWLEDGE_QUESTIONS.map((item) => ({
      question: item.q,
      answers: item.answers.map(([text, correct]) => ({ text, correct })),
      explanation: item.exp,
    }))

    await payload.create({
      collection: 'practice-tests',
      data: {
        title: 'CDL General Knowledge Practice Test — 25 Questions (2026)',
        slug: 'cdl-general-knowledge-practice-test',
        endorsement: 'general-knowledge',
        description: 'Practice the most commonly tested topics from the CDL General Knowledge exam. Covers vehicle inspection, cargo, braking, and driving safely.',
        questions,
        status: 'published',
      },
    })

    console.log('[seed] CDL General Knowledge practice test created with 25 questions.')
    process.exit(0)
  } catch (err: any) {
    console.error('[seed] Error:', err?.message ?? err)
    process.exit(1)
  }
}

main()
