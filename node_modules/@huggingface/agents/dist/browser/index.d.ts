import { HfInference } from '@huggingface/inference';

type Data = string | Blob | ArrayBuffer;

interface Tool {
	name: string;
	description: string;
	examples: Array<Example>;
	call?: (input: Promise<Data>, inference: HfInference) => Promise<Data>;
}

interface Example {
	prompt: string;
	code: string;
	tools: string[];
	inputs?: Inputs;
}

interface Update {
	message: string;
	data: undefined | string | Blob;
}

type Inputs = Partial<Record<"audio" | "image" | "text", boolean>>;

type LLM = (prompt: string) => Promise<string>;

declare class HfAgent {
    private accessToken;
    private llm;
    private tools;
    constructor(accessToken?: string, LLM?: LLM, tools?: Tool[]);
    generatePrompt(prompt: string, files?: FileList): string;
    generateCode(prompt: string, files?: FileList): Promise<string>;
    evaluateCode(code: string, files?: FileList): Promise<Update[]>;
    run(prompt: string, files?: FileList): Promise<Update[]>;
}

declare const textToImageTool: Tool;

declare const imageToTextTool: Tool;

declare const textToSpeechTool: Tool;

declare const speechToTextTool: Tool;

declare const defaultTools: Array<Tool>;

declare function LLMFromHub(accessToken?: string, model?: string): LLM;
declare function LLMFromEndpoint(acessToken: string, endpoint: string): LLM;

export { HfAgent, LLMFromEndpoint, LLMFromHub, defaultTools, imageToTextTool, speechToTextTool, textToImageTool, textToSpeechTool };
