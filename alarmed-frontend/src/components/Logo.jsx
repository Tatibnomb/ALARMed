function Logo() {
  return (
    <div className="header">
      <div className="logo-icon">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0f6e73" />
              <stop offset="100%" stopColor="#4c5cf0" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="46" fill="url(#logoGrad)" />
          <g transform="translate(50,50) rotate(-40)">
            <rect x="-7" y="-26" width="14" height="26" rx="7" fill="white" />
            <rect x="-7" y="0" width="14" height="26" rx="7" fill="#f4645f" />
          </g>
          <circle cx="50" cy="50" r="3.5" fill="white" />
        </svg>
      </div>

      <span className="logo-text">
        ALARMed
      </span>
    </div>
  );
}

export default Logo;