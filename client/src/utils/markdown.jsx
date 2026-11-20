// Minimal markdown-ish renderer for article content written in the admin:
// supports # / ## / ### headings, "- " bullet lists, blank-line paragraphs
// and **bold** inline text.
export function renderMarkdown(text) {
  const lines = String(text || '').split('\n');
  const blocks = [];
  let list = null;

  const pushBlock = (block) => blocks.push(block);
  const closeList = () => {
    if (list) {
      pushBlock({ type: 'ul', items: list });
      list = null;
    }
  };

  lines.forEach((raw, i) => {
    const line = raw.trimEnd();
    if (line.startsWith('- ')) {
      if (!list) list = [];
      list.push(renderInline(line.slice(2), `${i}-li`));
    } else {
      closeList();
      if (!line) return;
      if (line.startsWith('### ')) pushBlock({ type: 'h3', children: renderInline(line.slice(4), `${i}`) });
      else if (line.startsWith('## ')) pushBlock({ type: 'h2', children: renderInline(line.slice(3), `${i}`) });
      else if (line.startsWith('# ')) pushBlock({ type: 'h1', children: renderInline(line.slice(2), `${i}`) });
      else if (/^!\[[^\]]*\]\([^)]+\)$/.test(line)) {
        const m = /^!\[([^\]]*)\]\(([^)]+)\)$/.exec(line);
        pushBlock({ type: 'img', src: m[2], alt: m[1] });
      } else pushBlock({ type: 'p', children: renderInline(line, `${i}`) });
    }
  });
  closeList();
  return blocks;
}

function renderInline(text, keyPrefix) {
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={`${keyPrefix}-${i}`} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={`${keyPrefix}-${i}`}>{part}</span>;
  });
}

const blockClasses = {
  h1: 'mt-10 mb-4 text-3xl font-bold tracking-tight',
  h2: 'mt-8 mb-3 text-2xl font-bold tracking-tight',
  h3: 'mt-6 mb-2 text-xl font-semibold tracking-tight',
  p: 'mb-4 leading-7 text-neutral-600 dark:text-neutral-300',
  ul: 'mb-4 list-disc space-y-2 pl-6 leading-7 text-neutral-600 dark:text-neutral-300',
};

export function Markdown({ text }) {
  return (
    <div>
      {renderMarkdown(text).map((block, i) => {
        if (block.type === 'img') {
          return <img key={i} src={block.src} alt={block.alt} className="my-6 w-full rounded-[14px] border border-blue-100 dark:border-blue-900/60" />;
        }
        const cls = blockClasses[block.type];
        if (block.type === 'ul') {
          return (
            <ul key={i} className={cls}>
              {block.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          );
        }
        const Tag = block.type === 'p' ? 'p' : block.type;
        return (
          <Tag key={i} className={cls}>
            {block.children}
          </Tag>
        );
      })}
    </div>
  );
}
