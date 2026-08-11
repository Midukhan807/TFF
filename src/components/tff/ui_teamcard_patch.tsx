export function TeamCard({ team }: { team: Team }) {
  const primaryColor = team.team_color || "#D4A017";
  const foundedYear = team.created_at ? new Date(team.created_at).getFullYear() : 2026;

  const borderStyle = {
    borderColor: `${primaryColor}44`,
    boxShadow: `0 4px 20px rgba(0,0,0,0.5), inset 0 0 20px ${primaryColor}08`,
  };

  return (
    <Link
      to="/team/$teamId"
      params={{ teamId: team.id }}
      className="group relative flex rounded-2xl bg-zinc-950/90 border transition-all duration-500
        flex-row items-center gap-3 p-3
        sm:flex-col sm:items-center sm:p-6 sm:hover:-translate-y-2"
      style={borderStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = primaryColor;
        e.currentTarget.style.boxShadow = `0 10px 30px ${primaryColor}22, inset 0 0 25px ${primaryColor}15`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${primaryColor}44`;
        e.currentTarget.style.boxShadow = `0 4px 20px rgba(0,0,0,0.5), inset 0 0 20px ${primaryColor}08`;
      }}
    >
      {/* Glow border overlay */}
      <span
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ border: `1px solid ${primaryColor}`, boxShadow: `0 0 15px ${primaryColor}33` }}
      />

      {/* Logo */}
      <div className="relative shrink-0 sm:mb-6">
        <div
          className="absolute -inset-1 rounded-full blur-sm opacity-40 group-hover:opacity-80 transition-opacity duration-300"
          style={{ backgroundColor: primaryColor }}
        />
        <TeamLogo
          name={team.name}
          shortName={team.short_name}
          color={team.team_color}
          logoUrl={team.logo_url}
          size="lg"
          className="relative size-14 sm:size-32 rounded-full border-2 sm:border-4 border-zinc-950 object-cover shadow-2xl transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Main content — stacks differently on mobile vs desktop */}
      <div className="flex-1 min-w-0 sm:w-full sm:text-center sm:space-y-3">
        <h3 className="font-display text-base sm:text-3xl uppercase tracking-wider text-white group-hover:text-primary transition-colors duration-200 truncate sm:whitespace-normal leading-tight">
          {team.name}
        </h3>

        {/* Short name + founded — compact row on mobile */}
        <div className="flex items-center gap-2 mt-1 sm:hidden">
          <span
            className="font-display text-[10px] tracking-widest px-2 py-0.5 rounded border font-semibold uppercase shrink-0"
            style={{ color: primaryColor, borderColor: `${primaryColor}55`, backgroundColor: `${primaryColor}11` }}
          >
            {team.short_name}
          </span>
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Est. {foundedYear}</span>
        </div>

        {/* Manager — compact on mobile */}
        {team.manager_name && (
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1 sm:justify-center">
            <User className="size-3 shrink-0" style={{ color: primaryColor }} />
            <span className="truncate">{team.manager_name}</span>
          </div>
        )}

        {/* Desktop decorative short-name with lines */}
        <div className="hidden sm:flex items-center justify-center gap-3">
          <span className="h-[1px] w-8 bg-zinc-800" />
          <span
            className="font-display text-xs tracking-widest px-2.5 py-0.5 rounded border font-semibold uppercase"
            style={{ color: primaryColor, borderColor: `${primaryColor}55`, backgroundColor: `${primaryColor}11` }}
          >
            {team.short_name}
          </span>
          <span className="h-[1px] w-8 bg-zinc-800" />
        </div>
      </div>

      {/* Mobile: chevron arrow */}
      <div className="sm:hidden shrink-0 text-zinc-600">
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>

      {/* Desktop-only: stats list */}
      <div className="hidden sm:block w-full mt-6 border-t border-zinc-900 pt-6 space-y-4 text-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Shield className="size-4" style={{ color: primaryColor }} />
            <span className="text-xs uppercase tracking-wider font-medium text-zinc-500">Founded</span>
          </div>
          <span className="font-display text-white font-medium">{foundedYear}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Shirt className="size-4" style={{ color: primaryColor }} />
            <span className="text-xs uppercase tracking-wider font-medium text-zinc-500">Home Kit</span>
          </div>
          <span className="font-display text-white font-medium uppercase flex items-center gap-1.5">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: primaryColor }} />Primary
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Activity className="size-4" style={{ color: primaryColor }} />
            <span className="text-xs uppercase tracking-wider font-medium text-zinc-500">Matches Played</span>
          </div>
          <span className="font-display text-white font-medium">--</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Trophy className="size-4" style={{ color: primaryColor }} />
            <span className="text-xs uppercase tracking-wider font-medium text-zinc-500">Titles</span>
          </div>
          <span className="font-display text-white font-medium">00</span>
        </div>
      </div>

      {/* Desktop-only: view button */}
      <div
        className="hidden sm:flex w-full mt-6 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-semibold uppercase tracking-wider transition-all duration-300 bg-zinc-950 text-zinc-300"
        style={{ borderColor: `${primaryColor}22` }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = primaryColor;
          e.currentTarget.style.backgroundColor = `${primaryColor}11`;
          e.currentTarget.style.color = primaryColor;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = `${primaryColor}22`;
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = "";
        }}
      >
        <Eye className="size-4" />
        View Team Profile
      </div>
    </Link>
  );
}
