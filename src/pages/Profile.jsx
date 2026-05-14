import { useAuth } from '../contexts/AuthContext'

export default function Profile() {
  const { user, profile, signOut } = useAuth()

  return (
    <div className="page">
      <div className="page-header">
        <h2>Profil</h2>
      </div>
      <div className="card">
        <p className="label">E-Mail</p>
        <p>{user?.email}</p>
        {profile?.full_name && (
          <>
            <p className="label" style={{ marginTop: 12 }}>Name</p>
            <p>{profile.full_name}</p>
          </>
        )}
        <p className="label" style={{ marginTop: 12 }}>Rolle</p>
        <p className="badge badge-accent">{profile?.role ?? '–'}</p>
        <div className="divider" />
        <button className="btn btn-danger" onClick={signOut}>Abmelden</button>
      </div>
    </div>
  )
}
