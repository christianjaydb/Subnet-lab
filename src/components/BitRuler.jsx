import "./BitRuler.css";

/**
 * Renders a 32-bit address as four 8-bit "cell blocks" (one per octet),
 * with network bits and host bits colored distinctly and a divider mark
 * at the prefix boundary. This is SubnetLab's signature element: the
 * whole idea of subnetting is "where do you draw the line," so the line
 * is the thing you actually see.
 */
export default function BitRuler({ binary, prefix, compact = false }) {
  const bits = binary.replace(/\./g, "").split("");

  return (
    <div className={`bit-ruler ${compact ? "bit-ruler-compact" : ""}`}>
      <div className="bit-ruler-track">
        {bits.map((bit, i) => {
          const isNetwork = i < prefix;
          const isBoundary = i === prefix - 1;
          const octetEnd = i % 8 === 7 && i !== 31;
          return (
            <span
              key={i}
              className={`bit-cell ${isNetwork ? "bit-network" : "bit-host"} ${
                isBoundary ? "bit-boundary" : ""
              } ${octetEnd ? "bit-octet-end" : ""}`}
              title={`Bit ${i + 1}: ${isNetwork ? "network" : "host"}`}
            >
              {bit}
            </span>
          );
        })}
        <span
          className="bit-divider"
          style={{ left: `${(prefix / 32) * 100}%` }}
          aria-hidden="true"
        />
      </div>
      {!compact && (
        <div className="bit-ruler-legend">
          <span className="legend-item">
            <span className="legend-swatch bit-network" /> Network bits ({prefix})
          </span>
          <span className="legend-item">
            <span className="legend-swatch bit-host" /> Host bits ({32 - prefix})
          </span>
        </div>
      )}
    </div>
  );
}
