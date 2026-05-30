interface TesseractResult {
  text: string
  confidence: number
}

export async function processWithTesseract(imageBuffer: Buffer): Promise<TesseractResult> {
  const Tesseract = await import('tesseract.js')
  const worker = await Tesseract.createWorker('eng+chi_tra')

  const result = await worker.recognize(imageBuffer)
  await worker.terminate()

  return {
    text: result.data.text,
    confidence: Math.round(result.data.confidence) / 100,
  }
}
