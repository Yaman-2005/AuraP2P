const API_BASE = 'http://localhost:8000'

export async function goOnline() {
  const res = await fetch(`${API_BASE}/go-online`, { method: 'POST' })
  return res.json()
}

export async function connectToSwarm(ip: string) {
  const res = await fetch(`${API_BASE}/connect-to-swarm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ip }),
  })
  return res.json()
}

export async function getStatus() {
  const res = await fetch(`${API_BASE}/status`)
  return res.json()
}

export function openChatSocket() {
  return new WebSocket('ws://localhost:8000/chat')
}
