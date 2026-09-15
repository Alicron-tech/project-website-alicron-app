export default async function Gate({searchParams}: {searchParams: Promise<{next?: string; error?: string}>}) {
  const {next = '/', error} = await searchParams
  return (
    <div className="gate">
      <form className="gate__box" method="post" action="/api/gate">
        <div className="brand" style={{color: '#fff'}}><span className="brand__mark" style={{background: '#fff'}} /> ALICRON</div>
        <p style={{color: '#B7BAC1', fontSize: 14, lineHeight: 1.5}}>Private preview. Enter the access password to continue. / Vista previa privada. Introduzca la contraseña de acceso.</p>
        <input type="hidden" name="next" value={next} />
        <input type="password" name="password" placeholder="Password / Contraseña" autoFocus required />
        {error && <div className="err">That password did not match. / La contraseña no coincide.</div>}
        <button className="btn btn--accent" type="submit">Enter →</button>
      </form>
    </div>
  )
}
