import { OpenCodeGoApi } from './OpenCodeGoApi.credentials';

describe('OpenCodeGoApi', () => {
	it('should have the correct name', () => {
		const credential = new OpenCodeGoApi();
		expect(credential.name).toBe('openCodeGoApi');
	});

	it('should have an apiKey property', () => {
		const credential = new OpenCodeGoApi();
		const apiKeyProp = credential.properties.find((p) => p.name === 'apiKey');
		expect(apiKeyProp).toBeDefined();
		expect(apiKeyProp!.required).toBe(true);
		expect(apiKeyProp!.type).toBe('string');
	});

	it('should have Bearer token authentication', () => {
		const credential = new OpenCodeGoApi();
		expect(credential.authenticate).toBeDefined();
	});

	it('should test against /models endpoint', () => {
		const credential = new OpenCodeGoApi();
		expect(credential.test.request.baseURL).toBe('https://opencode.ai/zen/go/v1');
		expect(credential.test.request.url).toBe('/models');
	});
});
