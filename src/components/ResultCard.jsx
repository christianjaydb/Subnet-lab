import { formatNumber } from "../utils/subnetCalculator";
import "./ResultCard.css";

const ROWS = [
  { key: "ip", label: "IP Address" },
  { key: "cidr", label: "CIDR Notation" },
  { key: "subnetMask", label: "Subnet Mask" },
  { key: "wildcardMask", label: "Wildcard Mask" },
  { key: "networkAddress", label: "Network Address" },
  { key: "broadcastAddress", label: "Broadcast Address" },
  { key: "firstHost", label: "First Usable Host" },
  { key: "lastHost", label: "Last Usable Host" },
  { key: "totalAddresses", label: "Total Addresses", format: formatNumber },
  { key: "usableHosts", label: "Usable Hosts", format: formatNumber },
  { key: "ipClass", label: "IP Address Class", format: (v) => `Class ${v}` },
];

export default function ResultCard({ result }) {
  return (
    <div className="result-card card">
      <dl className="result-grid">
        {ROWS.map((row) => (
          <div className="result-row" key={row.key}>
            <dt>{row.label}</dt>
            <dd className="mono">
              {row.format ? row.format(result[row.key]) : result[row.key]}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
