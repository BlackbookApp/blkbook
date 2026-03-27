'use client';

import { useEffect, useRef, useState } from 'react';

type ErrorReason = 'permission-denied' | 'not-supported';

interface QRScannerProps {
  onDetected: (url: string) => void;
  onError: (reason: ErrorReason) => void;
}

export function QRScanner({ onDetected, onError }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastDetectRef = useRef(0);
  const [loading, setLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        onError('not-supported');
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
      if (cancelled) return;
      setLoading(false);

      const jsqr = (await import('jsqr')).default;
      if (cancelled) return;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      function tick() {
        if (cancelled) return;
        if (video!.readyState === video!.HAVE_ENOUGH_DATA) {
          const now = Date.now();
          if (now - lastDetectRef.current > 2000) {
            canvas!.width = video!.videoWidth;
            canvas!.height = video!.videoHeight;
            ctx!.drawImage(video!, 0, 0);
            const imageData = ctx!.getImageData(0, 0, canvas!.width, canvas!.height);
            const code = jsqr(imageData.data, imageData.width, imageData.height);
            if (code?.data) {
              lastDetectRef.current = now;
              onDetected(code.data);
            }
          }
        }
        rafRef.current = requestAnimationFrame(tick);
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    start();

    return () => {
      cancelled = true;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [onDetected, onError]);

  if (permissionDenied) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 px-8 text-center gap-4">
        <p className="font-granjon text-[15px] text-white">Camera access denied</p>
        <p className="font-helvetica text-[11px] font-light text-white/50 leading-relaxed">
          To scan QR codes, allow camera access in your device settings, then return to this page.
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

      {/* Viewfinder */}
      {!loading && (
        <div className="relative z-10 w-56 h-56 pointer-events-none">
          {/* Corner brackets */}
          <span className="absolute top-0 left-0 w-6 h-6 border-t border-l border-white/80" />
          <span className="absolute top-0 right-0 w-6 h-6 border-t border-r border-white/80" />
          <span className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-white/80" />
          <span className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-white/80" />
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
