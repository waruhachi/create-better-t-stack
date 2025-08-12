import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import { remarkInclude } from "fumadocs-mdx/config";
// Avoid importing `source` at runtime to keep bundle small
// import { source } from '@/lib/source';
// import type { InferPageType } from 'fumadocs-core/source';

type LLMPage = {
	url: string;
	data: {
		title: string;
		description?: string;
		content: string;
		_file: { absolutePath: string; path: string };
	};
};

const processor = remark()
	.use(remarkMdx)
	// needed for Fumadocs MDX
	.use(remarkInclude)
	.use(remarkGfm);

export async function getLLMText(page: LLMPage) {
	const processed = await processor.process({
		path: page.data._file.absolutePath,
		value: page.data.content,
	});

	return `# ${page.data.title}
URL: ${page.url}

${page.data.description}

${processed.value}`;
}
