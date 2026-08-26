import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span className="footer-brand mono">SubnetLab</span>
        <p className="footer-note">
          Built as a learning project for IPv4 addressing and subnetting.
          All calculations run client-side — no data leaves your browser.
        </p>
      </div>
    </footer>
  );
}
