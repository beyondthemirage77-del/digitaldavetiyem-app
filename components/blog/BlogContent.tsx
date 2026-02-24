"use client";

function parseContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let tableRows: string[][] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={elements.length} className="list-disc pl-6 space-y-2 my-4">
          {listItems.map((item, i) => (
            <li key={i} className="text-[#525252] leading-relaxed">
              {item.split(/\*\*(.+?)\*\*/g).map((part, j) =>
                j % 2 === 1 ? (
                  <strong key={j} className="text-[#171717] font-medium">
                    {part}
                  </strong>
                ) : (
                  part
                )
              )}
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  const flushTable = () => {
    if (tableRows.length > 0) {
      elements.push(
        <div key={elements.length} className="overflow-x-auto my-4">
          <table className="min-w-full border border-[#eee] rounded-lg overflow-hidden">
            <tbody>
              {tableRows.map((row, i) => (
                <tr
                  key={i}
                  className={i === 0 ? "bg-[#f5f5f5] font-medium" : ""}
                >
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className="px-4 py-3 border-b border-[#eee] text-sm text-[#525252]"
                    >
                      {cell.trim()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith("## ")) {
      flushList();
      flushTable();
      elements.push(
        <h2
          key={elements.length}
          className="text-xl font-semibold text-[#171717] mt-8 mb-4"
        >
          {trimmed.slice(3)}
        </h2>
      );
    } else if (trimmed.startsWith("### ")) {
      flushList();
      flushTable();
      elements.push(
        <h3
          key={elements.length}
          className="text-lg font-semibold text-[#171717] mt-6 mb-3"
        >
          {trimmed.slice(4)}
        </h3>
      );
    } else if (trimmed.startsWith("- ")) {
      flushTable();
      listItems.push(trimmed.slice(2));
    } else if (trimmed.includes("|") && trimmed.split("|").length >= 2) {
      flushList();
      const cells = trimmed
        .split("|")
        .map((c) => c.trim())
        .filter(Boolean);
      if (cells.some((c) => c === "---")) continue;
      tableRows.push(cells);
    } else if (trimmed) {
      flushList();
      flushTable();
      elements.push(
        <p key={elements.length} className="text-[#525252] my-3 leading-relaxed">
          {trimmed.split(/\*\*(.+?)\*\*/g).map((part, j) =>
            j % 2 === 1 ? (
              <strong key={j} className="text-[#171717] font-medium">
                {part}
              </strong>
            ) : (
              part
            )
          )}
        </p>
      );
    }
  }
  flushList();
  flushTable();
  return elements;
}

export function BlogContent({ content }: { content: string }) {
  return (
    <article className="prose prose-lg max-w-none">
      {parseContent(content)}
    </article>
  );
}
