import { home } from "@/lib/copy";

export function Ticker({ items: sourceItems = home.ticker }: { items?: readonly string[] }) {
  const items = [...sourceItems, ...sourceItems];

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
