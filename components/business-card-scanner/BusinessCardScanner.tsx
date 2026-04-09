'use client';

import { useEffect, useRef, useState } from 'react';

type ErrorReason = 'permission-denied' | 'not-supported';

interface BusinessCardScannerProps {
  onCapture: (base64: string) => void;
  onError: (reason: ErrorReason) => void;
}

const VIEWFINDER_W = 280;
const VIEWFINDER_H = 175;

export function BusinessCardScanner({ onCapture, onError }: BusinessCardScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [loading, setLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);

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
          video: {
            facingMode: 'environment',
            width: { ideal: 3840 },
            height: { ideal: 2160 },
          },
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

      const track = stream.getVideoTracks()[0];

      // Enable continuous autofocus if supported
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await track.applyConstraints({ advanced: [{ focusMode: 'continuous' } as any] });
      } catch {}

      // Detect torch support
      try {
        const caps = track.getCapabilities?.() as Record<string, unknown> | undefined;
        if (caps && 'torch' in caps) setTorchSupported(true);
      } catch {}

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

  async function toggleTorch() {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track) return;
    const next = !torchOn;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await track.applyConstraints({ advanced: [{ torch: next } as any] });
      setTorchOn(next);
    } catch {}
  }

  function handleCapture() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!video || !canvas || !container) return;

    const videoW = video.videoWidth;
    const videoH = video.videoHeight;
    const containerW = container.clientWidth;
    const containerH = container.clientHeight;

    // Compute the scale factor used by object-cover
    const scale = Math.max(containerW / videoW, containerH / videoH);
    const renderedW = videoW * scale;
    const renderedH = videoH * scale;

    // Rendered pixels cropped from each side to fill the container
    const cropX = (renderedW - containerW) / 2;
    const cropY = (renderedH - containerH) / 2;

    // Viewfinder top-left in container space
    const vfLeft = (containerW - VIEWFINDER_W) / 2;
    const vfTop = (containerH - VIEWFINDER_H) / 2;

    // Map viewfinder rect into video pixel space
    const srcX = (vfLeft + cropX) / scale;
    const srcY = (vfTop + cropY) / scale;
    const srcW = VIEWFINDER_W / scale;
    const srcH = VIEWFINDER_H / scale;

    // Output at native video resolution for the cropped region
    const outW = Math.round(srcW);
    const outH = Math.round(srcH);

    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, srcX, srcY, srcW, srcH, 0, 0, outW, outH);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
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
    <div
      ref={containerRef}
      className="relative flex-1 flex items-center justify-center bg-black overflow-hidden"
    >
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
        <div
          className="relative z-10 pointer-events-none"
          style={{ width: VIEWFINDER_W, height: VIEWFINDER_H }}
        >
          <span className="absolute top-0 left-0 w-6 h-6 border-t border-l border-white/80" />
          <span className="absolute top-0 right-0 w-6 h-6 border-t border-r border-white/80" />
          <span className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-white/80" />
          <span className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-white/80" />
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />

      {/* Torch toggle — only shown when device supports it */}
      {!loading && torchSupported && (
        <button
          onClick={toggleTorch}
          className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-black/40 flex items-center justify-center"
          aria-label={torchOn ? 'Turn off flash' : 'Turn on flash'}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke={torchOn ? '#FFD700' : 'white'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </button>
      )}

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
