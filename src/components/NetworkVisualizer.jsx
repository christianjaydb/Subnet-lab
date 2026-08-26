import BitRuler from "./BitRuler";
import "./NetworkVisualizer.css";

export default function NetworkVisualizer({ result }) {
  const hasUsableRange = result.prefix < 31;

  return (
    <div className="visualizer card">
      <h3 className="visualizer-title">Address allocation</h3>

      <div className="range-diagram">
        <div className="range-point range-point-network">
          <span className="mono">{result.networkAddress}</span>
          <span className="range-caption">Network Address</span>
        </div>

        {hasUsableRange ? (
          <div className="range-bar" role="img" aria-label={`Usable host range from ${result.firstHost} to ${result.lastHost}`}>
            <span className="range-bar-line" />
            <span className="range-bar-label">
              <span className="mono">{result.firstHost}</span>
              <span className="range-bar-arrow">──────</span>
              <span className="mono">{result.lastHost}</span>
            </span>
            <span className="range-caption range-caption-center">Usable Host Range</span>
          </div>
        ) : (
          <div className="range-bar range-bar-note">
            <span className="range-caption range-caption-center">
              {result.prefix === 31
                ? "No reserved network/broadcast — both addresses are usable (RFC 3021 point-to-point link)"
                : "Single-host route — no separate usable range"}
            </span>
          </div>
        )}

        <div className="range-point range-point-broadcast">
          <span className="mono">{result.broadcastAddress}</span>
          <span className="range-caption">Broadcast Address</span>
        </div>
      </div>

      <h3 className="visualizer-title visualizer-title-spaced">
        Network bits vs. host bits
      </h3>
      <p className="visualizer-hint">
        The first {result.prefix} bits identify the network; the remaining{" "}
        {32 - result.prefix} identify the host within it.
      </p>
      <BitRuler binary={result.binaryIp} prefix={result.prefix} />
    </div>
  );
}
