'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo';

import dainaPortrait from '@/assets/daina-hazel-portrait.jpg';
import weddingVeilKiss from '@/assets/wedding-veil-kiss.jpg';
import weddingChateauFrance from '@/assets/wedding-chateau-france.jpg';
import weddingVillaGarden from '@/assets/wedding-villa-garden.jpg';

const ProfilePreview = () => {
  const router = useRouter();

  const profile = {
    name: 'Daina Hazel',
    role: 'Australian Wedding Photographer',
    location: 'Based in Switzerland & Italy',
    instagram: '@dainahazel',
    website: 'dainahazel.com',
  };

  const portfolio = [
    {
      title: 'Claire & James',
      location: 'Château de Gruyères, Switzerland',
      year: '2024',
      image: weddingVeilKiss,
    },
    {
      title: 'Sofia & Marco',
      location: 'Villa Cimbrone, Ravello',
      year: '2024',
      image: weddingChateauFrance,
    },
    {
      title: 'Bridal Details',
      location: 'Lake Como, Italy',
      year: '2023',
      image: weddingVillaGarden,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-8">
        <Logo />
        <button
          onClick={() => router.push('/create-profile')}
          className="flex items-center text-muted-foreground/50 hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Profile Preview Content */}
      <div className="max-w-md mx-auto pb-40">
        <div className="px-6 pt-4">
          {/* Name & Role */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4"
          >
            <h1 className="text-base font-normal tracking-tight uppercase text-foreground">
              {profile.name}
            </h1>
            <p className="text-xs tracking-wide uppercase text-muted-foreground">{profile.role}</p>
            <p className="text-xs font-medium tracking-wide uppercase text-foreground">
              {profile.location}
            </p>
          </motion.div>

          {/* Hero Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-4"
          >
            <div className="w-full aspect-[3/4] overflow-hidden border-2 border-foreground relative">
              <Image src={dainaPortrait} alt={profile.name} fill className="object-cover" />
            </div>
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs tracking-wide uppercase text-muted-foreground">
                {profile.instagram}
              </span>
              <span className="text-xs tracking-wide text-muted-foreground">5.5k followers</span>
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground mt-3">
              You control what the world sees. Nothing more.
            </p>
          </motion.div>

          <div className="my-6 h-px bg-border" />

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-6"
          >
            <button className="w-full py-4 uppercase tracking-[0.12em] text-[11px] font-normal [font-family:'Helvetica_Neue','Helvetica',sans-serif] mb-3 bg-foreground text-background relative overflow-hidden grain-overlay hover:opacity-90 active:scale-[0.99] transition-all">
              Save Contact
            </button>
            <div className="grid grid-cols-3 gap-2">
              {['WhatsApp', 'Enquire', 'Website'].map((label) => (
                <button
                  key={label}
                  className="py-2 text-xs tracking-wide uppercase font-medium border border-border text-foreground bg-transparent"
                >
                  {label}
                </button>
              ))}
            </div>
          </motion.div>

          <div className="my-6 h-px bg-border" />

          {/* Portfolio Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-6 mb-8"
          >
            {portfolio.map((item, i) => (
              <div key={i} className={`${i % 2 === 0 ? 'w-3/5' : 'w-1/2 ml-auto'}`}>
                <div className="overflow-hidden aspect-[3/4] mb-2 border-2 border-border relative">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex justify-between items-start">
                  <h3 className="text-xs font-medium tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  <span className="text-[10px] text-muted-foreground">{item.year}</span>
                </div>
                <p className="text-[10px] tracking-wide text-muted-foreground">{item.location}</p>
              </div>
            ))}
          </motion.div>

          <div className="my-6 h-px bg-border" />

          {/* Exchange Details */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mb-8"
          >
            <p className="text-xs tracking-wide uppercase text-center mb-4 text-muted-foreground">
              Let&apos;s stay in touch. Send your details
            </p>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Your name"
                readOnly
                className="w-full bg-transparent px-3 py-2.5 text-xs tracking-wide border border-border text-foreground focus:outline-none"
              />
              <input
                type="email"
                placeholder="Email or phone"
                readOnly
                className="w-full bg-transparent px-3 py-2.5 text-xs tracking-wide border border-border text-foreground focus:outline-none"
              />
              <button className="w-full py-4 uppercase tracking-[0.12em] text-[11px] font-normal [font-family:'Helvetica_Neue','Helvetica',sans-serif] bg-foreground text-background relative overflow-hidden grain-overlay hover:opacity-90 active:scale-[0.99] transition-all">
                Send
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div
          className="max-w-md mx-auto"
          style={{
            background: 'linear-gradient(to top, #F5F4F0 60%, transparent)',
          }}
        >
          <div className="px-6 pt-12 pb-8 flex flex-col items-center gap-3">
            <p className="text-[10px] tracking-wide text-muted-foreground/60">
              This is your first impression.
            </p>
            <button
              onClick={() => router.push('/paywall')}
              className="w-full py-4 uppercase tracking-[0.12em] text-[11px] font-normal [font-family:'Helvetica_Neue','Helvetica',sans-serif] bg-foreground text-background relative overflow-hidden grain-overlay hover:opacity-90 active:scale-[0.99] transition-all"
            >
              Activate My Blackbook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePreview;
