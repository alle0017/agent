import { Definition } from "../chat/type.js"

export type GoogleAgentResponse = |
{
      type: 'text',
      text: string,
      annotations: string[]
} 
| {
      type: 'function_call'
      annotations: string[]
      id: string,
      name: string,
      arguments: {}
}
export type GoogleUsageReport = {
      total_tokens: number,
      total_input_tokens: number,
      total_cached_tokens: number,
      total_output_tokens: number,
      total_tool_use_tokens: number,
      total_thought_tokens: number
}
export type GoogleOutput = {
      steps?: GoogleAgentResponse[]
      usage: GoogleUsageReport
}
export type GoogleGenerationConfig = {
      temperature: number
}
export type GoogleInput = {
      model: string,
      input: {}[],
      store: boolean,
      tools?: { name: string; }[],
      response_mime_type?: 'application/json',
      response_format?: Definition
      generation_config?: Partial<GoogleGenerationConfig>
}

export class GoogleAgentService {
      private static readonly ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/interactions';
      constructor(private readonly key: string) {}
      public async fetch(body: GoogleInput) {
            const res = await fetch(GoogleAgentService.ENDPOINT, {
                  method: 'POST',
                  headers: {
                        'Content-Type': 'application/json',
                        'x-goog-api-key': this.key,
                  },
                  body: JSON.stringify(body),
            });

            if (!res.ok) {
                  throw new Error(`Google API error ${res.status}: ${await res.text()}`);
            }

            const data = await res.json() as GoogleOutput;
            return data.steps ?? [];
      }
}