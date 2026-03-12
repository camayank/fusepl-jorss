import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'First Unicorn Startup — India\'s Most Rigorous Startup Valuation'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f0f14 0%, #151518 50%, #0f0f14 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Gold gradient glow */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            width: '600px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(200, 160, 60, 0.12) 0%, transparent 70%)',
          }}
        />

        {/* Logo */}
        <div style={{ fontSize: 48, marginBottom: 16, display: 'flex' }}>
          🦄
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #c8a03c, #e0c068, #c8a03c)',
            backgroundClip: 'text',
            color: 'transparent',
            marginBottom: 12,
            display: 'flex',
          }}
        >
          First Unicorn Startup
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 24,
            color: '#e8e4dc',
            marginBottom: 32,
            display: 'flex',
          }}
        >
          India&apos;s Most Rigorous Startup Valuation
        </div>

        {/* Stats row */}
        <div
          style={{
            display: 'flex',
            gap: 48,
            alignItems: 'center',
          }}
        >
          {[
            { value: '10', label: 'Methods' },
            { value: '4', label: 'Approaches' },
            { value: '10K', label: 'Simulations' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  color: '#c8a03c',
                  display: 'flex',
                }}
              >
                {stat.value}
              </span>
              <span
                style={{
                  fontSize: 12,
                  color: '#888',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  display: 'flex',
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            fontSize: 13,
            color: '#555',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            display: 'flex',
          }}
        >
          IVS 105 Aligned &bull; Damodaran India Data &bull; IBBI Registered
        </div>
      </div>
    ),
    { ...size }
  )
}
