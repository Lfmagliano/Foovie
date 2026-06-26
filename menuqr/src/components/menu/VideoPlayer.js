'use client'

import { useEffect, useRef, useState } from 'react'

export default function VideoPlayer({ item }) {
  const videoRef  = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [loaded,  setLoaded]  = useState(false)

  const thumb    = item.cf_thumbnail_url ?? item.thumbnail_url
  const hasVideo = Boolean(item.cf_video_url)

  async function loadAndPlay() {
    if (!videoRef.current || !item.cf_video_url) return
    const { default: Hls } = await import('hls.js')

    if (Hls.isSupported()) {
      const hls = new Hls({ maxMaxBufferLength: 30 })
      hls.loadSource(item.cf_video_url)
      hls.attachMedia(videoRef.current)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current?.play()
        setPlaying(true)
        setLoaded(true)
      })
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = item.cf_video_url
      await videoRef.current.play()
      setPlaying(true)
      setLoaded(true)
    }
  }

  useEffect(() => () => { videoRef.current?.pause() }, [])

  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#1C1208', overflow: 'hidden' }}>
      {thumb && !loaded && (
        <img src={thumb} alt={item.name}
             style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      )}
      {hasVideo && (
        <video ref={videoRef} loop muted playsInline
               style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: loaded ? 1 : 0, transition: 'opacity .5s' }} />
      )}
      {hasVideo && !playing && (
        <div onClick={loadAndPlay} style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 10,
          background: 'rgba(28,18,8,0.28)', cursor: 'pointer',
        }}>
          <div style={{
            width: 60, height: 60, borderRadius: '50%', background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(200,84,26,.5)',
          }}>
            <span style={{
              display: 'inline-block', width: 0, height: 0, marginLeft: 4,
              borderTop: '11px solid transparent', borderBottom: '11px solid transparent',
              borderLeft: '19px solid #fff',
            }} />
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,248,240,0.85)', fontWeight: 300 }}>
            Toque para ver o preparo
          </p>
        </div>
      )}
      {!hasVideo && thumb && (
        <img src={thumb} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      )}
      {!hasVideo && !thumb && (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, opacity: 0.2 }}>
          🥐
        </div>
      )}
    </div>
  )
}