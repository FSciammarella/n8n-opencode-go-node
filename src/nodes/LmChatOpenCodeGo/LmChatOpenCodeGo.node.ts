import { ChatOpenAI, type ClientOptions } from '@langchain/openai';
import type { Headers } from 'openai/core';
import {
	NodeConnectionType,
	type INodeType,
	type INodeTypeDescription,
	type ISupplyDataFunctions,
	type SupplyData,
} from 'n8n-workflow';

export class LmChatOpenCodeGo implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OpenCode Go Chat Model',
		name: 'lmChatOpenCodeGo',
		icon: 'file:opencodego.svg',
		group: ['transform'],
		version: [1],
		description: 'For advanced usage with an AI chain',
		defaults: {
			name: 'OpenCode Go Chat Model',
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
			baseURL: 'https://opencode.ai/zen/go/v1',
		},
		properties: [
			{
				displayName:
					'You can use this node with an AI Agent, Chain, or other root nodes. When Reasoning Effort is not "none", temperature, top_p, frequency_penalty, and presence_penalty have no effect (DeepSeek API constraint).',
				name: 'notice',
				type: 'notice',
				default: '',
				displayOptions: {
					show: {
						'/options.reasoningEffort': ['low', 'medium', 'high', 'max'],
					},
				},
			},
			{
				displayName: 'Model',
				name: 'model',
				type: 'options',
				description:
					'The model which will generate the completion.',
				typeOptions: {
					loadOptions: {
						routing: {
							request: {
								method: 'GET',
								url: '/models',
							},
							output: {
								postReceive: [
									{
										type: 'rootProperty',
										properties: {
											property: 'data',
										},
									},
									{
										type: 'setKeyValue',
										properties: {
											name: '={{$responseItem.id}}',
											value: '={{$responseItem.id}}',
										},
									},
									{
										type: 'sort',
										properties: {
											key: 'name',
										},
									},
								],
							},
						},
					},
				},
				routing: {
					send: {
						type: 'body',
						property: 'model',
					},
				},
				default: '',
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
						displayName: 'Frequency Penalty',
						name: 'frequencyPenalty',
						default: 0,
						typeOptions: { maxValue: 2, minValue: -2, numberPrecision: 1 },
						description:
							"Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim",
						type: 'number',
					},
					{
						displayName: 'Max Retries',
						name: 'maxRetries',
						default: 2,
						description: 'Maximum number of retries to attempt',
						type: 'number',
					},
					{
						displayName: 'Maximum Number of Tokens',
						name: 'maxTokens',
						default: -1,
						description:
							'The maximum number of tokens to generate in the completion.',
						type: 'number',
						typeOptions: {
							maxValue: 32768,
						},
					},
					{
						displayName: 'Presence Penalty',
						name: 'presencePenalty',
						default: 0,
						typeOptions: { maxValue: 2, minValue: -2, numberPrecision: 1 },
						description:
							"Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics",
						type: 'number',
					},
					{
						displayName: 'Reasoning Effort',
						name: 'reasoningEffort',
						default: 'none',
						type: 'options',
						options: [
							{
								name: 'None',
								value: 'none',
								description:
									'Disable reasoning. Sends thinking: disabled to the API.',
							},
							{
								name: 'Low',
								value: 'low',
								description: 'Low reasoning effort (mapped to high by proxy)',
							},
							{
								name: 'Medium',
								value: 'medium',
								description: 'Medium reasoning effort (mapped to high by proxy)',
							},
							{
								name: 'High',
								value: 'high',
								description: 'High reasoning effort',
							},
							{
								name: 'Max',
								value: 'max',
								description: 'Maximum reasoning effort (mapped from xhigh by proxy)',
							},
						],
					},
					{
						displayName: 'Response Format',
						name: 'responseFormat',
						default: 'text',
						type: 'options',
						options: [
							{
								name: 'Text',
								value: 'text',
								description: 'Regular text response',
							},
							{
								name: 'JSON',
								value: 'json_object',
								description:
									'Enables JSON mode, which should guarantee the message the model generates is valid JSON',
							},
						],
					},
					{
						displayName: 'Sampling Temperature',
						name: 'temperature',
						default: 0.7,
						typeOptions: { maxValue: 2, minValue: 0, numberPrecision: 1 },
						description:
							'Controls randomness: Lowering results in less random completions. As the temperature approaches zero, the model will become deterministic and repetitive.',
						type: 'number',
					},
					{
						displayName: 'Timeout',
						name: 'timeout',
						default: 360000,
						description: 'Maximum amount of time a request is allowed to take in milliseconds',
						type: 'number',
					},
					{
						displayName: 'Top K',
						name: 'topK',
						default: 0,
						description:
							'Limits the model to consider only the K most likely next tokens at each step. Lower values make output more focused and deterministic.',
						type: 'number',
					},
					{
						displayName: 'Top P',
						name: 'topP',
						default: 1,
						typeOptions: { maxValue: 1, minValue: 0, numberPrecision: 1 },
						description:
							'Controls diversity via nucleus sampling: 0.5 means half of all likelihood-weighted options are considered. We generally recommend altering this or temperature but not both.',
						type: 'number',
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

		const options = this.getNodeParameter('options', itemIndex, {}) as {
			customHeaders?: {
				header: Array<{
					name: string;
					value: string;
				}>;
			};
			frequencyPenalty?: number;
			maxRetries: number;
			maxTokens?: number;
			presencePenalty?: number;
			reasoningEffort?: 'none' | 'low' | 'medium' | 'high' | 'max';
			responseFormat?: 'text' | 'json_object';
			temperature?: number;
			timeout: number;
			topK?: number;
			topP?: number;
		};

		const timeout = options.timeout;

		const modelKwargs: Record<string, unknown> = {};

		if (options.topK !== undefined && options.topK > 0) {
			modelKwargs.top_k = options.topK;
		}

		if (options.frequencyPenalty !== undefined) {
			modelKwargs.frequency_penalty = options.frequencyPenalty;
		}

		if (options.presencePenalty !== undefined) {
			modelKwargs.presence_penalty = options.presencePenalty;
		}

		if (options.reasoningEffort && options.reasoningEffort !== 'none') {
			modelKwargs.reasoning_effort = options.reasoningEffort;
			modelKwargs.thinking = { type: 'enabled' };
		} else if (options.reasoningEffort === 'none') {
			modelKwargs.thinking = { type: 'disabled' };
		}

		let defaultHeaders: Headers | undefined;

		const customHeaders = options.customHeaders?.header;
		if (customHeaders && customHeaders.length > 0) {
			const headers: Record<string, string> = {};
			for (const h of customHeaders) {
				if (h.name) {
					headers[h.name] = h.value;
				}
			}
			if (Object.keys(headers).length > 0) {
				defaultHeaders = headers as Headers;
			}
		}

		const configuration: ClientOptions = {
			baseURL: 'https://opencode.ai/zen/go/v1',
			defaultHeaders,
		};

		const model = new ChatOpenAI({
			apiKey: credentials.apiKey,
			model: modelName,
			temperature: options.temperature,
			topP: options.topP,
			maxTokens: options.maxTokens && options.maxTokens > 0 ? options.maxTokens : undefined,
			timeout,
			maxRetries: options.maxRetries ?? 2,
			configuration,
			modelKwargs: Object.keys(modelKwargs).length > 0 ? modelKwargs : undefined,
		});

		return {
			response: model,
		};
	}
}
