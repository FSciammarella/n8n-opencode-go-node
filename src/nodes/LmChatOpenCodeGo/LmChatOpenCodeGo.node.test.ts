import { NodeConnectionType } from 'n8n-workflow';
import { LmChatOpenCodeGo } from './LmChatOpenCodeGo.node';

describe('LmChatOpenCodeGo', () => {
	const node = new LmChatOpenCodeGo();

	it('should have the correct name', () => {
		expect(node.description.name).toBe('lmChatOpenCodeGo');
	});

	it('should require openCodeGoApi credential', () => {
		expect(node.description.credentials).toBeDefined();
		expect(node.description.credentials![0].name).toBe('openCodeGoApi');
		expect(node.description.credentials![0].required).toBe(true);
	});

	it('should output AiLanguageModel', () => {
		expect(node.description.outputs).toBeDefined();
		expect(node.description.outputs![0]).toBe(NodeConnectionType.AiLanguageModel);
	});

	it('should have no inputs (root node)', () => {
		expect(node.description.inputs).toEqual([]);
	});

	it('should have options collection with reasoning effort', () => {
		const options = node.description.properties.find((p) => p.name === 'options') as any;
		expect(options).toBeDefined();
		const reasoningEffort = options?.options?.find(
			(o: any) => o.name === 'reasoningEffort',
		);
		expect(reasoningEffort).toBeDefined();
		expect(reasoningEffort?.default).toBe('none');
	});

	it('should have options collection with custom headers', () => {
		const options = node.description.properties.find((p) => p.name === 'options') as any;
		expect(options).toBeDefined();
		const customHeaders = options?.options?.find(
			(o: any) => o.name === 'customHeaders',
		);
		expect(customHeaders).toBeDefined();
	});
});
