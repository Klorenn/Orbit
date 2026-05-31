export function useLighthouse() {
  const uploadFiles = async (files) => {
    const apiKey = import.meta.env.VITE_LIGHTHOUSE_API_KEY
    if (!apiKey) throw new Error('VITE_LIGHTHOUSE_API_KEY not set')

    const form = new FormData()
    for (const file of files) form.append('file', file)

    const res = await fetch('https://node.lighthouse.storage/api/v0/add', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
    })
    if (!res.ok) throw new Error(`Lighthouse upload failed: ${res.status}`)
    const data = await res.json()
    return data.Hash
  }

  return { uploadFiles }
}
