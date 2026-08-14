import { home } from "@/lib/copy";

export function Ticker() {
  const items = [...home.ticker, ...home.ticker];

  return (
    <div className="ticker" aria-hidden="true">
      <div className="run">
        {items.map((item, index) => {
          const parts = item.split(/(kloofstreetnights|owe nothing|no reissues|start being|one thought each)/i);
          return (
            <span key={`${item}-${index}`}>
              {parts.map((part, partIndex) => {
                const bold =
                  /kloofstreetnights|owe nothing|no reissues|start being|one thought each/i.test(
                    part,
                  );
                return bold ? <b key={partIndex}>{part}</b> : part;
              })}
            </span>
          );
        })}
      </div>
    </div>
  );
}
