'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, Camera, FileImage, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

interface ReceiptUploadProps {
  onUploadComplete: (data: any) => void
}

type UploadStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error'

export default function ReceiptUpload({ onUploadComplete }: ReceiptUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      setErrorMessage('Please select an image file')
      setStatus('error')
      return
    }

    setFile(selectedFile)
    setErrorMessage('')
    setStatus('idle')

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) handleFile(droppedFile)
  }, [handleFile])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) handleFile(selectedFile)
  }, [handleFile])

  const handleUpload = useCallback(async () => {
    if (!file) return

    setStatus('uploading')
    setProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const uploadRes = await fetch('/api/receipts/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadRes.ok) throw new Error('Upload failed')

      const uploadData = await uploadRes.json()
      setProgress(50)

      setStatus('processing')

      const processRes = await fetch('/api/receipts/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: uploadData.imageUrl,
          fileName: uploadData.fileName,
        }),
      })

      if (!processRes.ok) throw new Error('Processing failed')

      const processData = await processRes.json()
      setProgress(100)
      setStatus('success')
      onUploadComplete(processData)
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Upload failed')
      setStatus('error')
    }
  }, [file, onUploadComplete])

  const handleReset = useCallback(() => {
    setFile(null)
    setPreview(null)
    setStatus('idle')
    setProgress(0)
    setErrorMessage('')
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
  }, [])

  return (
    <div className="space-y-4">
      {!preview ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <Upload className="h-10 w-10 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 mb-2">Drag and drop your receipt image here</p>
          <p className="text-sm text-gray-400 mb-4">Supports JPG, PNG, HEIC</p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FileImage className="h-4 w-4" />
              Choose File
            </button>
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Camera className="h-4 w-4" />
              Camera
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-xl overflow-hidden border border-gray-200">
            <img
              src={preview}
              alt="Receipt preview"
              className="w-full max-h-96 object-contain bg-gray-50"
            />
            {status !== 'idle' && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                {status === 'uploading' && (
                  <div className="text-white text-center">
                    <Loader2 className="h-8 w-8 mx-auto animate-spin mb-2" />
                    <p>Uploading...</p>
                  </div>
                )}
                {status === 'processing' && (
                  <div className="text-white text-center">
                    <Loader2 className="h-8 w-8 mx-auto animate-spin mb-2" />
                    <p>Processing OCR...</p>
                  </div>
                )}
                {status === 'success' && (
                  <CheckCircle className="h-12 w-12 text-green-400" />
                )}
                {status === 'error' && (
                  <AlertCircle className="h-12 w-12 text-red-400" />
                )}
              </div>
            )}
          </div>

          {(status === 'uploading' || status === 'processing') && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {status === 'error' && errorMessage && (
            <p className="text-sm text-red-600">{errorMessage}</p>
          )}

          <div className="flex items-center gap-3">
            {status === 'idle' && (
              <button
                type="button"
                onClick={handleUpload}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Upload className="h-4 w-4" />
                Upload & Process
              </button>
            )}
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {status === 'success' ? 'Upload Another' : 'Cancel'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
