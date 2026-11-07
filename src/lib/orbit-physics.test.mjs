/**
 * Unit tests for pure orbit physics module
 */
import {
  initialState,
  step,
  predictTrajectory,
  FIXED_DT,
} from './orbit-physics.ts'

function assert(condition, msg) {
  if (!condition) {
    throw new Error(`Assertion failed: ${msg}`)
  }
}

console.log('Running Orbit Physics Tests...')

// Test 1: 100% thrust at 500 km
{
  let state = initialState(500, 100)
  for (let i = 0; i < 4000; i++) {
    state = step(state, FIXED_DT)
    if (state.isFinished) break
  }
  console.log('Test 1 (100% thrust): outcome =', state.outcome, 'e =', state.eccentricity)
  assert(state.outcome === 'STABLE', `Expected STABLE, got ${state.outcome}`)
  assert(state.eccentricity < 0.05, `Expected near-circular e < 0.05, got ${state.eccentricity}`)
  assert(state.periapsis >= 1.02, `Expected periapsis >= 1.02, got ${state.periapsis}`)
}

// Test 2: 70% thrust crashes (Suborbital - Impact, chapter 2)
{
  let state = initialState(500, 70)
  for (let i = 0; i < 4000; i++) {
    state = step(state, FIXED_DT)
    if (state.isFinished) break
  }
  console.log('Test 2 (70% thrust): outcome =', state.outcome, 'reason =', state.outcomeReason)
  assert(state.outcome === 'CRASH', `Expected CRASH, got ${state.outcome}`)
  assert(state.outcomeReason.includes('SUBORBITAL'), `Expected SUBORBITAL, got ${state.outcomeReason}`)
  assert(state.suggestedChapter === 2, `Expected chapter 2, got ${state.suggestedChapter}`)
}

// Test 3: 150% thrust escapes (Escape Trajectory, chapter 6)
{
  let state = initialState(500, 150)
  for (let i = 0; i < 4000; i++) {
    state = step(state, FIXED_DT)
    if (state.isFinished) break
  }
  console.log('Test 3 (150% thrust): outcome =', state.outcome, 'reason =', state.outcomeReason)
  assert(state.outcome === 'ESCAPE', `Expected ESCAPE, got ${state.outcome}`)
  assert(state.outcomeReason.includes('ESCAPE'), `Expected ESCAPE, got ${state.outcomeReason}`)
  assert(state.suggestedChapter === 6, `Expected chapter 6, got ${state.suggestedChapter}`)
}

// Test 4: 85% thrust has low periapsis (Orbit Decaying, chapter 5)
{
  let state = initialState(500, 85)
  for (let i = 0; i < 4000; i++) {
    state = step(state, FIXED_DT)
    if (state.isFinished) break
  }
  console.log('Test 4 (85% thrust): outcome =', state.outcome, 'reason =', state.outcomeReason)
  assert(state.outcome === 'ELLIPTICAL_UNSAFE', `Expected ELLIPTICAL_UNSAFE, got ${state.outcome}`)
  assert(state.outcomeReason.includes('PERIAPSIS TOO LOW'), `Expected PERIAPSIS, got ${state.outcomeReason}`)
  assert(state.suggestedChapter === 5, `Expected chapter 5, got ${state.suggestedChapter}`)
}

// Test 5: Trajectory prediction produces points
{
  const pred = predictTrajectory(500, 100)
  assert(pred.points.length > 50, 'Prediction should have generated points')
  assert(pred.predictedOutcome === 'STABLE', `Predicted outcome should be STABLE, got ${pred.predictedOutcome}`)
}

// Test 6: Ball on a String (gravity cut)
{
  let state = initialState(500, 100, { gravityCut: true })
  assert(state.a.x === 0 && state.a.y === 0, 'Acceleration should be 0 when gravity cut')
  for (let i = 0; i < 1000; i++) {
    state = step(state, FIXED_DT)
  }
  assert(state.r.x === state.r0, `x should remain constant in pure tangent drift, got ${state.r.x}`)
  assert(state.r.y > 0, `y should increase in tangent direction, got ${state.r.y}`)
}

console.log('ALL PHYSICS TESTS PASSED SUCCESSFULLY! ✅')
