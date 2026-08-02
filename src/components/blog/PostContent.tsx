import { run } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import { Callout } from './Callout';
import { CodeBlock } from './CodeBlock';

function TableWrapper({ children, ...props }: React.ComponentProps<'table'>) {
  return (
    <div className="reader-table-wrap">
      <table {...props}>{children}</table>
    </div>
  );
}

const components = {
  pre: CodeBlock,
  Callout,
  table: TableWrapper,
};

export async function PostContent({ body }: { body: string }) {
  const { default: Content } = await run(body, {
    ...runtime,
    baseUrl: import.meta.url,
    useMDXComponents: () => components,
  });

  return (
    <div className="reader-prose">
      <Content components={components} />
    </div>
  );
}
