export default async function Gate({searchParams}: {searchParams: Promise<{next?: string; error?: string}>}) {
  const {next = '/', error} = await searchParams
  return (
    <div className="gate">
      <form className="gate__box" method="post" action="/api/gate">
        <span className="wordmark" style={{color: '#fff'}}>ALICRON</span>
        <p>Vista previa privada. Introduce la contraseña de acceso. / Private preview. Enter the access password.</p>
        <input type="hidden" name="next" value={next} />
        <input type="password" name="password" placeholder="Contraseña / Password" autoFocus required />
        {error && <div className="err">La contraseña no coincide. / That password did not match.</div>}
        <button className="tbtn tbtn--accent" type="submit">Entrar / Enter</button>
      </form>
    </div>
  )
}
