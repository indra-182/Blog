import { run } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import { CodeBlock } from './CodeBlock';
import { Callout } from './Callout';

const components = {
  pre: CodeBlock,
  Callout,
};

export async function PostContent({ body }: { body: string }) {
  const { default: Content } = await run(body, {
    ...runtime,
    baseUrl: import.meta.url,
    useMDXComponents: () => components,
  });

  return (
    <div className="magic-prose mx-auto">
      <Content />
    </div>
  );
}
