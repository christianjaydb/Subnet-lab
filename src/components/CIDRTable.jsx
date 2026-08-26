import { CIDR_REFERENCE, formatNumber } from "../utils/subnetCalculator";
import "./CIDRTable.css";

// Show the practically useful range of prefixes; the full /0-/32 table
// is available via the calculator for anything outside this range.
const COMMON_PREFIXES = [8, 16, 24, 25, 26, 27, 28, 29, 30, 31, 32];
const ROWS = CIDR_REFERENCE.filter((row) => COMMON_PREFIXES.includes(row.prefix));

export default function CIDRTable() {
  return (
    <section id="reference" className="section reference-section">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">CIDR Reference</span>
          <h2>Common CIDR prefixes at a glance</h2>
          <p>Every row is calculated the same way the calculator above works — nothing here is a hardcoded lookup.</p>
        </div>

        <div className="reference-table-wrap card">
          <table className="reference-table">
            <thead>
              <tr>
                <th>CIDR</th>
                <th>Subnet Mask</th>
                <th className="align-right">Total Addresses</th>
                <th className="align-right">Usable Hosts</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.prefix}>
                  <td className="mono reference-cidr">{row.cidr}</td>
                  <td className="mono">{row.mask}</td>
                  <td className="mono align-right">{formatNumber(row.total)}</td>
                  <td className="mono align-right">{formatNumber(row.usable)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
