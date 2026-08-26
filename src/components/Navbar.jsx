import { useState } from "react";
import "./Navbar.css";

const LINKS = [
  { href: "#home", label: "Home" },
  { href: "#calculator", label: "Calculator" },
  { href: "#practice", label: "Practice" },
  { href: "#basics", label: "Networking Basics" },
  { href: "#reference", label: "CIDR Reference" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <a href="#home" className="navbar-brand" onClick={() => setOpen(false)}>
          <span className="navbar-brand-mark" aria-hidden="true">
            /24
          </span>
          <span>
            Subnet<strong>Lab</strong>
          </span>
        </a>

        <nav className="navbar-links navbar-links-desktop" aria-label="Primary">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <button
          className="navbar-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {open && (
        <nav className="navbar-links navbar-links-mobile" aria-label="Primary mobile">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
