import React, { useEffect, useRef, useState } from 'react';
import { 
  Download, 
  Smartphone, 
  Monitor, 
  Laptop, 
  Play, 
  Pause,
  CheckCircle2, 
  ArrowDown, 
  Volume2,
  Sparkles,
  Sliders
} from 'lucide-react';
import { AppPlatformRelease } from '../types';
import { detectUserDevice, DeviceInfo } from '../utils/deviceDetector';
import { handleDownloadWithSponsor, triggerDownloadCelebration } from '../utils/downloadHelper';
import { DOWNLOAD_LINKS } from '../data/downloadLinks';

interface HeroSectionProps {
  platforms: AppPlatformRelease[];
  onSelectPlatformDownload: (platformId?: string) => void;
  onViewFeatures: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  platforms,
  onSelectPlatformDownload,
}) => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    platform: 'android',
    recommendedFileFormat: '.apk',
    platformName: 'Android',
    isMobile: true,
    rawOS: 'Android',
  });
  const [isHeroDownloading, setIsHeroDownloading] = useState(false);
  const [heroSuccessMsg, setHeroSuccessMsg] = useState<string | null>(null);
  const [isPlayingMockup, setIsPlayingMockup] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setDeviceInfo(detectUserDevice());
  }, []);

  // Equalizer canvas animation on the device mockup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const barCount = 28;
    const barWidth = 3;
    const gap = (width - barCount * barWidth) / (barCount - 1);
    const bars = Array.from({ length: barCount }, (_, i) => ({
      height: Math.random() * 0.8 + 0.2,
      speed: 0.04 + Math.random() * 0.04,
      offset: Math.random() * Math.PI * 2,
    }));

    let tick = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      bars.forEach((bar, i) => {
        let hRatio = 0.15;
        if (isPlayingMockup) {
          hRatio = 0.2 + 0.7 * Math.abs(Math.sin(tick * bar.speed + bar.offset));
        }
        const barHeight = Math.max(4, hRatio * (height - 6));
        const x = i * (barWidth + gap);
        const y = height - barHeight;

        // Elegant gradient from sky-400 to sky-600
        const gradient = ctx.createLinearGradient(0, y, 0, height);
        gradient.addColorStop(0, '#38bdf8');
        gradient.addColorStop(1, '#0284c7');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      });

      tick += 1;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [isPlayingMockup]);

  const androidApp = platforms.find((p) => p.platform === 'android') || platforms[0];
  const macApp = platforms.find((p) => p.platform === 'mac') || platforms[1];
  const winApp = platforms.find((p) => p.platform === 'windows') || platforms[2];

  const suggestedApp = 
    deviceInfo.platform === 'windows' ? winApp :
    deviceInfo.platform === 'macos' ? macApp :
    androidApp;

  const handleHeroDownload = () => {
    let target = suggestedApp?.downloadUrl || DOWNLOAD_LINKS.android.downloadUrl;
    let filename = 
      deviceInfo.platform === 'windows' ? 'Gen-Music.exe' :
      deviceInfo.platform === 'macos' ? 'Gen-Music.dmg' :
      'GEN-Music.apk';

    setIsHeroDownloading(true);
    triggerDownloadCelebration();

    // Centralized handler: opens sponsor link in new tab and triggers direct download
    handleDownloadWithSponsor(target, filename);

    setHeroSuccessMsg(`Download initiated: ${filename}`);

    setTimeout(() => {
      setIsHeroDownloading(false);
    }, 2500);

    setTimeout(() => {
      setHeroSuccessMsg(null);
    }, 7000);
  };

  const scrollToDownloadsGrid = () => {
    const el = document.getElementById('download');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const ctaButtonLabel = 
    deviceInfo.platform === 'windows' ? 'Download for Windows (.exe)' :
    deviceInfo.platform === 'macos' ? 'Download for macOS (.dmg)' :
    'Download for Android (.apk)';

  return (
    <section 
      id="home"
      aria-label="Hero Section" 
      className="relative pt-12 pb-20 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left Column: Value Proposition & Primary Action */}
        <div className="lg:col-span-7 space-y-8 text-left">
          
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] font-heading text-balance">
              Pure Music Streaming. Zero Ads.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl font-normal">
              A modern Android music app leveraging YouTube Music's vast catalog — completely ad-free with real-time synchronized lyrics, offline downloads, Listen Together, and retro iPod mode.
            </p>
          </div>

          {/* Action Group */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                onClick={handleHeroDownload}
                id="hero-primary-download-btn"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-sm sm:text-base shadow-sm transition-all transform active:scale-98 cursor-pointer"
              >
                {deviceInfo.platform === 'windows' ? (
                  <Monitor className="w-5 h-5 shrink-0" />
                ) : deviceInfo.platform === 'macos' ? (
                  <Laptop className="w-5 h-5 shrink-0" />
                ) : (
                  <Smartphone className="w-5 h-5 shrink-0" />
                )}
                <span>{isHeroDownloading ? 'Starting Download...' : ctaButtonLabel}</span>
              </button>

              <button
                onClick={scrollToDownloadsGrid}
                id="hero-see-all-platforms-btn"
                className="inline-flex items-center justify-center gap-1.5 px-5 py-4 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 font-semibold text-sm transition-colors border border-white/10 cursor-pointer"
              >
                <span>See all platforms</span>
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>

            {/* Success notification */}
            {heroSuccessMsg && (
              <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3.5 py-2 rounded-lg">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{heroSuccessMsg}</span>
              </div>
            )}

            {/* Small trust points: clean unboxed metadata with separators */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 pt-2 font-medium">
              <span>100% free</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>No subscription</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Zero audio ads</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>320kbps / FLAC</span>
            </div>
          </div>

        </div>

        {/* Right Column: Realistic Device Mockup with Equalizer */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[340px] sm:max-w-[360px]">
            
            {/* Subtle shadow ring */}
            <div className="relative rounded-[36px] bg-[#0c101a] border-4 border-slate-800 p-4 shadow-2xl shadow-black/80">
              
              {/* Speaker / Notch bar */}
              <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto mb-4 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-slate-800 mr-2" />
                <div className="w-10 h-1 bg-slate-800 rounded-full" />
              </div>

              {/* Real App Screenshot Inside Frame */}
              <div className="relative aspect-[9/19] w-full rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/10">
                <img
                  src="/screenshots/Material you music page.png"
                  alt="GEN Music Material You Player"
                  className="w-full h-full object-cover object-top"
                />
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
