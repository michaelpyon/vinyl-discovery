export default function StaffPick({ store }) {
  if (!store?.staffPick) return null

  const { album, artist, note } = store.staffPick

  return (
    <div className="staff-pick">
      <div className="staff-pick__label">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        House editorial
      </div>

      <div className="staff-pick__vinyl">
        <div className="staff-pick__record">
          <div className="staff-pick__grooves" />
          <div className="staff-pick__label-center" />
        </div>
      </div>

      <h4 className="staff-pick__album">{album}</h4>
      <p className="staff-pick__artist">{artist}</p>
      <p className="staff-pick__note">“{note}”</p>
      <p className="staff-pick__from">CrateDigger pick near {store.name}</p>
    </div>
  )
}
