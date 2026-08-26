import { useState } from "react";
import "./Basics.css";

const TOPICS = [
  {
    title: "What is an IP Address?",
    body:
      "An IPv4 address is a 32-bit number, written as four decimal numbers separated by dots (like 192.168.1.10), that identifies a device on a network. Every device that sends or receives traffic needs one, the same way every house on a street needs a street address for mail to find it.",
  },
  {
    title: "What is a Subnet Mask?",
    body:
      "A subnet mask marks which bits of an IP address are the network portion and which are the host portion. Wherever the mask has a 1, that bit belongs to the network; wherever it has a 0, that bit is free to identify an individual host. A mask of 255.255.255.0 means the first 24 bits are network bits.",
  },
  {
    title: "What is CIDR?",
    body:
      "CIDR (Classless Inter-Domain Routing) notation writes the subnet mask as a slash and a number, like /24, instead of spelling out the full mask. The number is simply how many leading bits are network bits — /24 is the same boundary as 255.255.255.0, just shorter to write.",
  },
  {
    title: "Network Address",
    body:
      "The network address is the address with every host bit set to 0. It identifies the subnet itself, not any device on it, so it generally can't be assigned to a host. For 192.168.1.0/24, the network address is 192.168.1.0.",
  },
  {
    title: "Broadcast Address",
    body:
      "The broadcast address is the address with every host bit set to 1. Traffic sent to it is meant to reach every device on the subnet at once, so like the network address, it generally can't be assigned to an individual host. For 192.168.1.0/24, that's 192.168.1.255.",
  },
  {
    title: "Usable Host Range",
    body:
      "The usable host range is every address between the network and broadcast addresses — the addresses you can actually assign to devices. It starts at network address + 1 and ends at broadcast address − 1. (The exception: /31 links have no reserved network or broadcast address, so both addresses are usable.)",
  },
  {
    title: "Default Gateway",
    body:
      "The default gateway is the router a device sends traffic to when the destination isn't on its own subnet. It's usually the first or last usable address in the range, but it can be any address the network administrator configures. Without it, a device can only talk to others on its own subnet.",
  },
];

export default function Basics() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="basics" className="section basics-section">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">Networking Basics</span>
          <h2>The concepts behind the math</h2>
          <p>
            The calculator tells you the answer. This is the reasoning
            behind it, in plain terms.
          </p>
        </div>

        <div className="basics-list">
          {TOPICS.map((topic, i) => {
            const isOpen = openIndex === i;
            return (
              <div className={`basics-item card ${isOpen ? "is-open" : ""}`} key={topic.title}>
                <button
                  className="basics-item-trigger"
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                >
                  <span>{topic.title}</span>
                  <span className="basics-item-icon" aria-hidden="true">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && <p className="basics-item-body">{topic.body}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
