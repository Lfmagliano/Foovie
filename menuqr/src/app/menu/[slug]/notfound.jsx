export default function NotFound() {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px', background: 'var(--bg)' }}>
        <span style={{ fontSize: 64, marginBottom: 24 }}>🥐</span>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 500, marginBottom: 12, color: 'var(--text)' }}>
          Cardápio não encontrado
        </h1>
        <p style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 300 }}>
          Verifique o QR Code ou peça ajuda ao atendente.
        </p>
      </div>
    )
  }