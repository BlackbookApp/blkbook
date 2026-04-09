'use client';

import { useEffect, useRef, useState } from 'react';

type ErrorReason = 'permission-denied' | 'not-supported';

interface BusinessCardScannerProps {
  onCapture: (base64: string) => void;
  onError: (reason: ErrorReason) => void;
}

export function BusinessCardScanner({ onCapture, onError }: BusinessCardScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [loading, setLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        onError('not-supported');
        setLoading(false);
        return;
      }

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
      } catch (err) {
        if (cancelled) return;
        const name = err instanceof Error ? err.name : '';
        if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
          setPermissionDenied(true);
          onError('permission-denied');
        } else {
          onError('not-supported');
        }
        setLoading(false);
        return;
      }

      if (cancelled) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      await video.play().catch(() => {});
      if (!cancelled) setLoading(false);
    }

    start();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [onError]);

  function handleCapture() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);

    // Strip the data URL prefix — send raw base64 only
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    const base64 = dataUrl.split(',')[1];
    onCapture(base64);
  }

  if (permissionDenied) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 px-8 text-center gap-4">
        <p className="font-granjon text-[15px] text-white">Camera access denied</p>
        <p className="font-helvetica text-[11px] font-light text-white/50 leading-relaxed">
          To scan business cards, allow camera access in your device settings, then return to this
          page.
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex-1 flex items-center justify-center bg-black overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <p className="font-helvetica text-[11px] font-light text-white/60 tracking-widest uppercase">
            Starting camera…
          </p>
        </div>
      )}

      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        autoPlay
        muted
      />

      {/* Card-shaped viewfinder overlay */}
      {!loading && (
        <div className="relative z-10 pointer-events-none" style={{ width: 280, height: 175 }}>
          <span className="absolute top-0 left-0 w-6 h-6 border-t border-l border-white/80" />
          <span className="absolute top-0 right-0 w-6 h-6 border-t border-r border-white/80" />
          <span className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-white/80" />
          <span className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-white/80" />
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />

      {/* Capture button */}
      {!loading && (
        <button
          onClick={handleCapture}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 w-16 h-16 rounded-full border-2 border-white/80 flex items-center justify-center"
          aria-label="Capture"
        >
          <span className="w-12 h-12 rounded-full bg-white/90" />
        </button>
      )}
    </div>
  );
}
