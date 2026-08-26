import { useState } from "react";
import { calculateSubnet } from "../utils/subnetCalculator";
import ResultCard from "./ResultCard";
import NetworkVisualizer from "./NetworkVisualizer";
import "./Calculator.css";

export default function Calculator() {
  const [ip, setIp] = useState("192.168.1.10");
  const [prefix, setPrefix] = useState("28");
  const [result, setResult] = useState(() => calculateSubnet("192.168.1.10", 28));
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    try {
      const calculated = calculateSubnet(ip, prefix);
      setResult(calculated);
      setError("");
    } catch (err) {
      setError(err.message);
      setResult(null);
    }
  }

  return (
    <section id="calculator" className="section calculator-section">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">Calculator</span>
          <h2>Break down any IPv4 subnet</h2>
          <p>
            Enter an address and a CIDR prefix. Every value below is
            calculated live from your input — nothing here is looked up
            from a table.
          </p>
        </div>

        <form className="calculator-form card" onSubmit={handleSubmit}>
          <div className="calculator-field">
            <label className="field-label" htmlFor="ip-input">
              IPv4 Address
            </label>
            <input
              id="ip-input"
              className={`text-input ${error ? "is-error" : ""}`}
              type="text"
              inputMode="decimal"
              placeholder="192.168.1.10"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="calculator-field calculator-field-prefix">
            <label className="field-label" htmlFor="cidr-input">
              CIDR Prefix
            </label>
            <div className="prefix-input-wrap">
              <span className="prefix-slash">/</span>
              <input
                id="cidr-input"
                className={`text-input ${error ? "is-error" : ""}`}
                type="text"
                inputMode="numeric"
                placeholder="24"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value.replace("/", ""))}
                autoComplete="off"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary calculator-submit">
            Calculate
          </button>
        </form>

        {error && (
          <p className="calculator-error" role="alert">
            {error}
          </p>
        )}

        {result && (
          <div className="calculator-results">
            <ResultCard result={result} />
            <NetworkVisualizer result={result} />
          </div>
        )}
      </div>
    </section>
  );
}
