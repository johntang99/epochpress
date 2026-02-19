import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0F1B2D',
          borderRadius: 7,
          border: '1.5px solid #D4A843',
          color: '#F4C861',
          fontSize: 22,
          fontWeight: 800,
          lineHeight: 1,
          fontFamily: 'Inter, Arial, sans-serif',
        }}
      >
        E
      </div>
    ),
    {
      ...size,
    }
  );
}
