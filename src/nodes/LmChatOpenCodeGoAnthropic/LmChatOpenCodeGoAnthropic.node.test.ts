import { NodeConnectionType } from 'n8n-workflow';
import { LmChatOpenCodeGoAnthropic } from './LmChatOpenCodeGoAnthropic.node';

describe('LmChatOpenCodeGoAnthropic', () => {
	const node = new LmChatOpenCodeGoAnthropic();

	it('should have the correct name', () => {
		expect(node.description.name).toBe('lmChatOpenCodeGoAnthropic');
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

	it('should have minimax models in options', () => {
		const modelProp = node.description.properties.find((p) => p.name === 'model') as any;
		expect(modelProp).toBeDefined();
		const modelValues = modelProp?.options?.map((o: any) => o.value);
		expect(modelValues).toContain('minimax-m2.5');
		expect(modelValues).toContain('minimax-m2.7');
	});

	it('should have thinking mode option', () => {
		const options = node.description.properties.find((p) => p.name === 'options') as any;
		expect(options).toBeDefined();
		const thinking = options?.options?.find(
			(o: any) => o.name === 'extendedThinking',
		);
		expect(thinking).toBeDefined();
		expect(thinking?.type).toBe('boolean');
	});
});
