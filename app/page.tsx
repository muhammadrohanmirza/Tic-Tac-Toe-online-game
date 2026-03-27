'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { useWindowSize } from '@/hooks/useWindowSize';

export default function HomePage() {
  const router = useRouter();
  const { isMobile, isTablet, isDesktop } = useWindowSize();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setIsLoaded(true);
    });
  }, []);

  const particlesOptions = {
    background: { color: { value: '#050505' } },
    particles: {
      number: { value: isMobile ? 30 : 60 },
      color: { value: ['#00FFFF', '#FF00FF', '#00FF41'] },
      opacity: { value: 0.4 },
      size: { value: { min: 1, max: 3 } },
      move: { enable: true, speed: 0.8, direction: 'none' as const, outModes: 'out' as const },
      links: {
        enable: true,
        color: '#00FFFF',
        opacity: 0.15,
        distance: 150,
      },
    },
    interactivity: {
      events: {
        onHover: { enable: !isMobile, mode: 'grab' as const },
      },
      modes: {
        grab: { distance: 140, links: { opacity: 0.3 } },
      },
    },
    detectRetina: true,
  };

  return (
    <div style={{
      backgroundColor: '#050505',
      minHeight: '100vh',
      width: '100%',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Particles Background */}
      {isLoaded && !isMobile && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          zIndex: 0,
        }}>
          <Particles options={particlesOptions as any} />
        </div>
      )}

      {/* Grid Background */}
      <div className="grid-bg" style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 0,
        opacity: 0.2,
      }} />

      {/* NAVBAR - Responsive */}
      <nav style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: isMobile ? '12px 16px' : '20px 40px',
        borderBottom: '1px solid #1a1a1a',
        gap: '12px',
      }}>
        {/* Logo - Responsive */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            fontFamily: 'Courier New, monospace',
            fontSize: isMobile ? '16px' : isTablet ? '18px' : '22px',
            fontWeight: 'bold',
            letterSpacing: isMobile ? '2px' : '4px',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ color: '#00FFFF', textShadow: '0 0 10px #00FFFF' }}>TIC</span>
          <span style={{ color: '#ffffff', opacity: 0.5 }}>-</span>
          <span style={{ color: '#FF00FF', textShadow: '0 0 10px #FF00FF' }}>TAC</span>
          <span style={{ color: '#ffffff', opacity: 0.5 }}>-</span>
          <span style={{ color: '#00FF41', textShadow: '0 0 10px #00FF41' }}>TOE</span>
        </motion.div>

        {/* Nav Buttons - Responsive */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            display: 'flex',
            gap: isMobile ? '8px' : '12px',
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => router.push('/login')}
            style={{
              background: 'transparent',
              border: '1px solid #00FFFF',
              color: '#00FFFF',
              padding: isMobile ? '6px 14px' : '8px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              letterSpacing: '1px',
              fontSize: isMobile ? '12px' : '14px',
              textShadow: '0 0 8px #00FFFF',
              boxShadow: '0 0 10px #00FFFF33',
              transition: 'all 0.3s',
              whiteSpace: 'nowrap',
              minHeight: '44px',
            }}
          >Login</button>
          <button
            onClick={() => router.push('/signup')}
            style={{
              background: 'transparent',
              border: '1px solid #FF00FF',
              color: '#FF00FF',
              padding: isMobile ? '6px 14px' : '8px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              letterSpacing: '1px',
              fontSize: isMobile ? '12px' : '14px',
              textShadow: '0 0 8px #FF00FF',
              boxShadow: '0 0 10px #FF00FF33',
              transition: 'all 0.3s',
              whiteSpace: 'nowrap',
              minHeight: '44px',
            }}
          >Sign Up</button>
        </motion.div>
      </nav>

      {/* HERO SECTION - Responsive */}
      <section style={{
        position: 'relative',
        zIndex: 10,
        minHeight: isMobile ? '75vh' : '85vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: isMobile ? '40px 16px' : '40px 20px',
      }}>
        {/* Main Title - Responsive with clamp */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            fontFamily: 'Courier New, monospace',
            fontSize: isMobile ? 'clamp(36px, 10vw, 48px)' : isTablet ? 'clamp(48px, 8vw, 64px)' : 'clamp(64px, 8vw, 90px)',
            fontWeight: 'bold',
            letterSpacing: isMobile ? '3px' : '6px',
            marginBottom: '16px',
            lineHeight: 1.1,
            wordBreak: 'break-word',
          }}
        >
          <span style={{ color: '#00FFFF', textShadow: isMobile ? '0 0 10px #00FFFF' : '0 0 20px #00FFFF, 0 0 40px #00FFFF55' }}>TIC</span>
          <span style={{ color: '#ffffff55' }}>-</span>
          <span style={{ color: '#FF00FF', textShadow: isMobile ? '0 0 10px #FF00FF' : '0 0 20px #FF00FF, 0 0 40px #FF00FF55' }}>TAC</span>
          <span style={{ color: '#ffffff55' }}>-</span>
          <span style={{ color: '#00FF41', textShadow: isMobile ? '0 0 10px #00FF41' : '0 0 20px #00FF41, 0 0 40px #00FF4155' }}>TOE</span>
        </motion.div>

        {/* Subtitle - Responsive */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          style={{
            color: '#00FF41',
            fontSize: isMobile ? '12px' : '14px',
            letterSpacing: isMobile ? '2px' : '4px',
            marginBottom: '16px',
            textShadow: '0 0 10px #00FF41',
            whiteSpace: 'nowrap',
          }}
        >
          REAL-TIME ONLINE MULTIPLAYER
        </motion.p>

        {/* Description - Responsive */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          style={{
            color: '#888',
            fontSize: isMobile ? '14px' : '16px',
            maxWidth: isMobile ? '100%' : '500px',
            lineHeight: 1.6,
            marginBottom: isMobile ? '32px' : '40px',
            padding: isMobile ? '0 8px' : '0',
          }}
        >
          Challenge friends or play against random opponents
          in this classic game reimagined with a neon interface.
        </motion.p>

        {/* BUTTONS - Responsive: Stack on mobile, row on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '12px' : '16px',
            justifyContent: 'center',
            alignItems: 'center',
            width: isMobile ? '100%' : 'auto',
          }}
        >
          <motion.button
            whileHover={{ scale: isMobile ? 1 : 1.05, y: isMobile ? 0 : -3 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/signup')}
            style={{
              background: 'transparent',
              border: '2px solid #00FFFF',
              color: '#00FFFF',
              padding: isMobile ? '14px 32px' : '14px 40px',
              borderRadius: '8px',
              fontSize: isMobile ? '14px' : '16px',
              fontWeight: '700',
              letterSpacing: '2px',
              cursor: 'pointer',
              textShadow: '0 0 10px #00FFFF',
              boxShadow: '0 0 15px #00FFFF33',
              transition: 'all 0.3s',
              whiteSpace: 'nowrap',
              width: isMobile ? '100%' : 'auto',
              maxWidth: isMobile ? '300px' : 'none',
              minHeight: isMobile ? '48px' : 'auto',
            }}
          >
            ⚡ PLAY NOW — FREE
          </motion.button>

          <motion.button
            whileHover={{ scale: isMobile ? 1 : 1.05, y: isMobile ? 0 : -3 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/login')}
            style={{
              background: 'transparent',
              border: '2px solid #FF00FF',
              color: '#FF00FF',
              padding: isMobile ? '14px 32px' : '14px 40px',
              borderRadius: '8px',
              fontSize: isMobile ? '14px' : '16px',
              fontWeight: '700',
              letterSpacing: '2px',
              cursor: 'pointer',
              textShadow: '0 0 10px #FF00FF',
              boxShadow: '0 0 15px #FF00FF33',
              transition: 'all 0.3s',
              whiteSpace: 'nowrap',
              width: isMobile ? '100%' : 'auto',
              maxWidth: isMobile ? '300px' : 'none',
              minHeight: isMobile ? '48px' : 'auto',
            }}
          >
            SIGN IN
          </motion.button>
        </motion.div>
      </section>

      {/* FEATURES SECTION - Responsive */}
      <section style={{
        position: 'relative',
        zIndex: 10,
        padding: isMobile ? '40px 16px' : '60px 40px',
        maxWidth: '1100px',
        margin: '0 auto',
      }}>
        <h2 style={{
          textAlign: 'center',
          color: '#ffffff',
          fontSize: isMobile ? '20px' : '28px',
          letterSpacing: isMobile ? '2px' : '4px',
          marginBottom: isMobile ? '32px' : '40px',
          fontFamily: 'Courier New, monospace',
        }}>
          WHY PLAY?
        </h2>

        {/* 3 Feature Cards - Responsive Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
          gap: isMobile ? '20px' : '24px',
        }}>

          {/* Card 1 */}
          <motion.div
            whileHover={{ scale: isMobile ? 1 : 1.03, y: isMobile ? 0 : -5 }}
            style={{
              background: '#0d0d0d',
              border: '1px solid #00FFFF44',
              borderRadius: '16px',
              padding: isMobile ? '24px 20px' : '32px 24px',
              textAlign: 'center',
              boxShadow: '0 0 20px #00FFFF11',
            }}
          >
            <div style={{ fontSize: isMobile ? '32px' : '40px', marginBottom: '16px' }}>⚡</div>
            <h3 style={{
              color: '#00FFFF',
              fontSize: isMobile ? '16px' : '18px',
              letterSpacing: '2px',
              marginBottom: '12px',
              textShadow: '0 0 8px #00FFFF',
            }}>REAL-TIME PLAY</h3>
            <p style={{ color: '#888', lineHeight: 1.6, fontSize: isMobile ? '13px' : '14px' }}>
              Instant moves via WebSocket technology.
              Zero delay gameplay.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            whileHover={{ scale: isMobile ? 1 : 1.03, y: isMobile ? 0 : -5 }}
            style={{
              background: '#0d0d0d',
              border: '1px solid #FF00FF44',
              borderRadius: '16px',
              padding: isMobile ? '24px 20px' : '32px 24px',
              textAlign: 'center',
              boxShadow: '0 0 20px #FF00FF11',
            }}
          >
            <div style={{ fontSize: isMobile ? '32px' : '40px', marginBottom: '16px' }}>🎮</div>
            <h3 style={{
              color: '#FF00FF',
              fontSize: isMobile ? '16px' : '18px',
              letterSpacing: '2px',
              marginBottom: '12px',
              textShadow: '0 0 8px #FF00FF',
            }}>PLAY WITH FRIENDS</h3>
            <p style={{ color: '#888', lineHeight: 1.6, fontSize: isMobile ? '13px' : '14px' }}>
              Create private rooms and share
              4-letter codes with anyone.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            whileHover={{ scale: isMobile ? 1 : 1.03, y: isMobile ? 0 : -5 }}
            style={{
              background: '#0d0d0d',
              border: '1px solid #FFD70044',
              borderRadius: '16px',
              padding: isMobile ? '24px 20px' : '32px 24px',
              textAlign: 'center',
              boxShadow: '0 0 20px #FFD70011',
              gridRow: isTablet ? '1' : 'auto',
            }}
          >
            <div style={{ fontSize: isMobile ? '32px' : '40px', marginBottom: '16px' }}>🏆</div>
            <h3 style={{
              color: '#FFD700',
              fontSize: isMobile ? '16px' : '18px',
              letterSpacing: '2px',
              marginBottom: '12px',
              textShadow: '0 0 8px #FFD700',
            }}>LEADERBOARDS</h3>
            <p style={{ color: '#888', lineHeight: 1.6, fontSize: isMobile ? '13px' : '14px' }}>
              Track your wins and
              climb the global rankings.
            </p>
          </motion.div>

        </div>
      </section>

      {/* HOW TO PLAY - Responsive */}
      <section style={{
        position: 'relative',
        zIndex: 10,
        padding: isMobile ? '40px 16px' : '60px 40px',
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center',
      }}>
        <h2 style={{
          color: '#ffffff',
          fontSize: isMobile ? '20px' : '28px',
          letterSpacing: isMobile ? '2px' : '4px',
          marginBottom: isMobile ? '32px' : '40px',
          fontFamily: 'Courier New, monospace',
        }}>
          HOW TO PLAY
        </h2>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: isMobile ? '24px' : '40px',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          maxWidth: isMobile ? '300px' : 'none',
          margin: '0 auto',
        }}>
          {[
            { num: '1', text: 'Sign up free', color: '#00FFFF' },
            { num: '2', text: 'Create or join a room', color: '#FF00FF' },
            { num: '3', text: 'Get 3 in a row to win!', color: '#00FF41' },
          ].map((step) => (
            <div key={step.num} style={{
              display: 'flex',
              flexDirection: isMobile ? 'row' : 'column',
              alignItems: 'center',
              gap: isMobile ? '16px' : '0',
              textAlign: 'center',
              width: isMobile ? '100%' : 'auto',
            }}>
              <div style={{
                width: isMobile ? '48px' : '60px',
                height: isMobile ? '48px' : '60px',
                borderRadius: '50%',
                border: `2px solid ${step.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isMobile ? '18px' : '24px',
                fontWeight: 'bold',
                color: step.color,
                boxShadow: `0 0 15px ${step.color}55`,
                textShadow: `0 0 10px ${step.color}`,
                flexShrink: 0,
              }}>{step.num}</div>
              <p style={{
                color: '#ccc',
                fontSize: isMobile ? '14px' : '14px',
                margin: 0,
                whiteSpace: 'nowrap',
              }}>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER - Responsive */}
      <footer style={{
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        padding: isMobile ? '24px 16px' : '30px',
        borderTop: '1px solid #1a1a1a',
        color: '#444',
        fontSize: isMobile ? '11px' : '13px',
        letterSpacing: isMobile ? '1px' : '2px',
        lineHeight: 1.5,
      }}>
        © 2026 Muhammad Rohan Mirza. All rights reserved.
        {/* Built with Next.js 14 · Socket.IO · NeonDB · TypeScript */}
      </footer>

    </div>
  );
}
