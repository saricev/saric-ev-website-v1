interface BlogContentProps {
  content: string;
}

export default function BlogContent({ content }: BlogContentProps) {
  return (
    <article className="prose prose-gray max-w-none">
      {content.split('\n\n').map((paragraph, index) => {
        if (paragraph.startsWith('## ')) {
          return (
            <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              {paragraph.replace('## ', '')}
            </h2>
          );
        }
        if (paragraph.startsWith('### ')) {
          return (
            <h3 key={index} className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              {paragraph.replace('### ', '')}
            </h3>
          );
        }
        if (paragraph.startsWith('- ')) {
          const items = paragraph.split('\n').filter((line) => line.startsWith('- '));
          return (
            <ul key={index} className="list-disc pl-6 space-y-2 my-4">
              {items.map((item, i) => (
                <li key={i} className="text-gray-600">
                  {item.replace('- ', '')}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={index} className="text-gray-600 leading-relaxed my-4">
            {paragraph}
          </p>
        );
      })}
    </article>
  );
}
