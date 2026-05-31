import lighthouse from '@lighthouse-web3/sdk'

export function useLighthouse() {
  const uploadFiles = async (files) => {
    const apiKey = import.meta.env.VITE_LIGHTHOUSE_API_KEY
    if (!apiKey) throw new Error('VITE_LIGHTHOUSE_API_KEY not set')
    const response = await lighthouse.upload(files, apiKey)
    return response.data.Hash
  }

  return { uploadFiles }
}
