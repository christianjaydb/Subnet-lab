import BitRuler from "./BitRuler";
import { calculateSubnet } from "../utils/subnetCalculator";
import "./Hero.css";

const SAMPLE = calculateSubnet("192.168.1.10", 28);

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="container hero-inner">
        <div className="hero-copy">
          <span className="eyebrow">Subnetting, made visible</span>
          <h1 className="hero-title">
            Every subnet is a line drawn across 32 bits.
          </h1>
          <p className="hero-subtitle">
            SubnetLab is a hands-on IPv4 subnetting tool for students and
            aspiring network techs. Calculate real subnets, see the bit
            boundary that defines them, and practice until it's automatic.
          </p>
          <div className="hero-actions">
            <a href="#calculator" className="btn btn-primary">
              Open the calculator
            </a>
            <a href="#practice" className="btn btn-secondary">
              Practice subnetting
            </a>
          </div>
        </div>

        <div className="hero-demo card">
          <div className="hero-demo-header">
            <span className="mono hero-demo-address">
              {SAMPLE.ip}{SAMPLE.cidr}
            </span>
            <span className="hero-demo-tag">example</span>
          </div>
          <BitRuler binary={SAMPLE.binaryIp} prefix={SAMPLE.prefix} />
          <div className="hero-demo-stats">
            <div>
              <span className="hero-demo-stat-label">Network</span>
              <span className="mono">{SAMPLE.networkAddress}</span>
            </div>
            <div>
              <span className="hero-demo-stat-label">Broadcast</span>
              <span className="mono">{SAMPLE.broadcastAddress}</span>
            </div>
            <div>
              <span className="hero-demo-stat-label">Usable hosts</span>
              <span className="mono">{SAMPLE.usableHosts}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
