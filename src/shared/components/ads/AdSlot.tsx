// src/shared/components/ads/AdSlot.tsx
'use client'

import { useEffect, useRef } from 'react'
import Box from '@mui/material/Box'

interface AdSlotProps {
  slot: string
  format?: 'auto' | 'rectangle' | 'leaderboard'
  className?: string
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    adsbygoogle: any[]
  }
}

export function AdSlot({ slot, format = 'auto', className }: AdSlotProps) {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID
  const pushed = useRef(false)

  useEffect(() => {
    if (!publisherId || pushed.current) return
    pushed.current = true
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // AdSense script not yet loaded
    }
  }, [publisherId])

  if (!publisherId) return null

  return (
    <Box sx={{ textAlign: 'center', my: 2, overflow: 'hidden', minHeight: 0 }}>
      <ins
        className={`adsbygoogle${className ? ` ${className}` : ''}`}
        style={{ display: 'block' }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </Box>
  )
}
