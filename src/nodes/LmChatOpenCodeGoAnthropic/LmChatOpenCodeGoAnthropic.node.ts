import { ChatAnthropic } from '@langchain/anthropic';
import {
	NodeConnectionType,
	type INodeType,
	type INodeTypeDescription,
	type ISupplyDataFunctions,
	type SupplyData,
} from 'n8n-workflow';

const ANTHROPIC_BASE_URL = 'https://opencode.ai/zen/go/v1/messages';

export class LmChatOpenCodeGoAnthropic implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OpenCode Go Chat Model (Anthropic)',
		name: 'lmChatOpenCodeGoAnthropic',
		icon: 'file:opencodego.svg',
		group: ['transform'],
		version: [1],
		description: 'For MiniMax models via Anthropic-compatible API',
		defaults: {
			name: 'OpenCode Go Chat Model (Anthropic)',
		},
		codex: {
			categories: ['AI'],
			subcategories: {
				AI: ['Language Models', 'Root Nodes'],
				'Language Models': ['Chat Models (Recommended)'],
			},
			resources: {
				primaryDocumentation: [
					{
						url: 'https://opencode.ai/go',
					},
				],
			},
		},
		inputs: [],
		outputs: [NodeConnectionType.AiLanguageModel],
		outputNames: ['Model'],
		credentials: [
			{
				name: 'openCodeGoApi',
				required: true,
			},
		],
		requestDefaults: {
			ignoreHttpStatusErrors: true,
			baseURL: ANTHROPIC_BASE_URL,
		},
		properties: [
			{
				displayName: 'Model',
				name: 'model',
				type: 'options',
				description: 'The model which will generate the completion.',
				typeOptions: {
					loadOptionsMethod: 'getModels',
				},
				options: [
					{
						name: 'MiniMax M2.5',
						value: 'minimax-m2.5',
					},
					{
						name: 'MiniMax M2.7',
						value: 'minimax-m2.7',
					},
				],
				default: 'minimax-m2.5',
			},
			{
				displayName: 'Options',
				name: 'options',
				placeholder: 'Add Option',
				description: 'Additional options to add',
				type: 'collection',
				default: {},
				options: [
					{
						displayName: 'Max Tokens',
						name: 'maxTokens',
						default: -1,
						description:
							'The maximum number of tokens to generate in the completion.',
						type: 'number',
					},
					{
						displayName: 'Sampling Temperature',
						name: 'temperature',
						default: 0.7,
						typeOptions: { maxValue: 1, minValue: 0, numberPrecision: 1 },
						description:
							'Controls randomness: Lowering results in less random completions.',
						type: 'number',
					},
				{
					displayName: 'Top K',
					name: 'topK',
					default: 0,
					description:
						'Limits the model to consider only the K most likely next tokens at each step.',
					type: 'number',
					typeOptions: { maxValue: 32768, minValue: 0 },
				},
				{
					displayName: 'Thinking Mode',
					name: 'extendedThinking',
					default: false,
					type: 'boolean',
				},
				{
					displayName: 'Thinking Budget Tokens',
					name: 'budgetTokens',
					default: 1024,
					description:
						'Maximum number of tokens to use for extended thinking.',
					type: 'number',
					displayOptions: {
						show: {
							'/options.extendedThinking': [true],
						},
					},
				},
				{
					displayName: 'Custom Headers',
						name: 'customHeaders',
						placeholder: 'Add Header',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						default: {},
						options: [
							{
								name: 'header',
								displayName: 'Header',
								values: [
									{
										displayName: 'Name',
										name: 'name',
										type: 'string',
										default: '',
									},
									{
										displayName: 'Value',
										name: 'value',
										type: 'string',
										default: '',
									},
								],
							},
						],
					},
				],
			},
		],
	};

	async supplyData(this: ISupplyDataFunctions, itemIndex: number): Promise<SupplyData> {
		const credentials = await this.getCredentials<{ apiKey: string }>('openCodeGoApi');

		const modelName = this.getNodeParameter('model', itemIndex) as string;

		if (!modelName) {
			throw new Error('Model must be selected');
		}

		const options = this.getNodeParameter('options', itemIndex, {}) as {
			budgetTokens?: number;
			customHeaders?: {
				header: Array<{
					name: string;
					value: string;
				}>;
			};
			extendedThinking?: boolean;
			maxTokens?: number;
			temperature?: number;
			topK?: number;
		};

		let defaultHeaders: Record<string, string> | undefined;

		const customHeaders = options.customHeaders?.header;
		if (customHeaders && customHeaders.length > 0) {
			const headers: Record<string, string> = {};
			for (const h of customHeaders) {
				if (h.name) {
					headers[h.name] = h.value;
				}
			}
			if (Object.keys(headers).length > 0) {
				defaultHeaders = headers;
			}
		}

		const model = new ChatAnthropic({
			anthropicApiKey: credentials.apiKey,
			anthropicApiUrl: ANTHROPIC_BASE_URL,
			model: modelName,
			temperature: options.temperature,
			maxTokens: options.maxTokens && options.maxTokens > 0 ? options.maxTokens : undefined,
			topK: options.topK && options.topK > 0 ? options.topK : undefined,
			clientOptions: defaultHeaders ? { defaultHeaders } : undefined,
			thinking: options.extendedThinking
				? {
						type: 'enabled',
						budget_tokens: options.budgetTokens ?? 1024,
					}
				: undefined,
		});

		return {
			response: model,
		};
	}
}
