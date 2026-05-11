"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenCodeGoApi = void 0;
class OpenCodeGoApi {
    name = 'openCodeGoApi';
    displayName = 'OpenCode Go';
    properties = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            required: true,
            default: '',
        },
    ];
    authenticate = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '=Bearer {{$credentials.apiKey}}',
            },
        },
    };
    test = {
        request: {
            baseURL: 'https://opencode.ai/zen/go/v1',
            url: '/models',
        },
    };
}
exports.OpenCodeGoApi = OpenCodeGoApi;
//# sourceMappingURL=OpenCodeGoApi.credentials.js.map