// src/lib/evalBuilder.ts
import { HfInference } from "@huggingface/inference";
async function evalBuilder(code, tools, files, updateCallback, accessToken) {
  async function wrapperEval() {
    if (files && files.length > 0) {
      globalThis["file"] = await files[0];
    }
    for (const tool of tools) {
      const toolCall = (input) => tool.call?.(input, new HfInference(accessToken ?? ""));
      globalThis[tool.name] = toolCall;
    }
    globalThis["message"] = updateCallback;
    let returnString = "";
    if (files && files.length > 0) {
      returnString = "\nreturn await generate(file);";
    } else {
      returnString = "\n return await generate();";
    }
    await Object.getPrototypeOf(async function() {
    }).constructor(code + returnString)();
    for (const tool of tools) {
      delete globalThis[tool.name];
      delete globalThis["file"];
      delete globalThis["message"];
    }
  }
  return wrapperEval;
}

// src/lib/examples.ts
var examples = [
  {
    prompt: "Caption the image and give me the caption read out loud.",
    code: `async function generate(image) {
    const caption = await imageToText(image);
    message("First we caption the image", caption);
    const output = await textToSpeech(caption);
    message("Then we read the caption out loud", output);
    return output;
}`,
    tools: ["imageToText", "textToSpeech"],
    inputs: { image: true }
  },
  {
    prompt: "Display an image of a yellow dog wearing a top hat",
    code: `async function generate() {
        const output = await textToImage("yellow dog wearing a top hat");
        message("We generate the dog picture", output);
        return output;
}`,
    tools: ["textToImage"]
  },
  {
    prompt: "transcribe the attached audio and only if it contains the word 'dog' generate an image of a dog wearing a top hat",
    code: `async function generate(audio) {
const output = await speechToText(audio);
message("We read the text", output);

if (output.includes("dog")) {
    const image = await textToImage("dog wearing a top hat");
    message("We generate the dog picture", image);
    return image;
} else {
    return null;
}};`,
    tools: ["speechToText", "textToImage"],
    inputs: { audio: true }
  },
  {
    prompt: "Caption the image and generate an image based on the caption, but in a medieval fantasy style.",
    code: `async function generate(image) {
    const caption = await imageToText(image);
    message("First we caption the image", caption);
    const output = await textToImage(caption + " medieval fantasy");
    message("Then we generate an image based on the caption", output);
    return output;
}`,
    tools: ["imageToText", "textToImage"],
    inputs: { image: true }
  },
  {
    prompt: "Who Was Napol\xE9on Bonaparte?",
    code: `async function generate() {
	message("Napol\xE9on Bonaparte was a French military and political leader.");
}`,
    tools: ["message"]
  },
  {
    prompt: "What is 5+5?",
    code: `async function generate() {
	message(\`5+5 is equal to ${5 + 5}\`);
}`,
    tools: ["message"]
  },
  {
    prompt: "Can you draw the current president of France?",
    code: `async function generate() {
	const output = await textToImage("Emmanuel Macron");
	message("The current president of France", output);
	return output
}`,
    tools: ["textToImage", "message"]
  }
];
var examples_default = examples;

// src/lib/promptGeneration.ts
function toolDescription(tool) {
  let prompt = `name: ${tool.name} 
description: ${tool.description}`;
  const examples2 = tool.examples.slice(0, 1).map((example) => {
    return `prompt: ${example.prompt} 
command generated: \`${example.code}\``;
  });
  prompt += `
` + examples2.join("\n");
  return prompt;
}
function generatePrompt(prompt, tools, inputs) {
  if (tools.length === 0) {
    throw new Error("no tools selected");
  }
  let params = "";
  if (inputs.image) {
    params += `image`;
  }
  if (inputs.audio) {
    params += params ? "," : "";
    params += `audio`;
  }
  const exampleSnippet = examples_default.map(
    (example) => `
user: ${example.prompt}
function: 
\`\`\`js
${example.code}
\`\`\``
  ).join("\n-------\n");
  const toolSnippet = tools.map((tool) => toolDescription(tool)).join("\n-------\n");
  const fullPrompt = `
Create a javascript function that does the following: "${prompt}" 

In order to help in answering the above prompt, the function has access to the following methods to generate outputs.

${toolSnippet}

Examples:
${exampleSnippet}

If you need to send information to the user use \`message("message", data)\` and NOT \`console.log\`.

Use the above methods and only the above methods to answer the prompt: ${prompt}.

The generated function must match the following signature:
\`\`\`js
async function generate(${params}) {
// your code here
return output;
};
\`\`\`

If you are not sure how to do it, try anyway and give it your best shot, as the user can always correct you later.`;
  return fullPrompt;
}

// src/tools/message.ts
var messageTool = {
  name: "message",
  description: "Send data back to the user.",
  examples: [
    {
      prompt: "Display the created image",
      code: 'message("we display the image", image)',
      tools: ["message"],
      inputs: { image: true }
    },
    {
      prompt: "Display the generated text",
      code: 'message("we render the text", text)',
      tools: ["message"]
    },
    {
      prompt: 'Display the text "hello world"',
      code: 'message("hello world")',
      tools: ["message"]
    }
  ]
};

// src/lib/generateCode.ts
async function generateCode(prompt, tools, files, llm) {
  const fullprompt = generatePrompt(prompt, [...tools, messageTool], {
    image: !!files && files[0].type.startsWith("image"),
    audio: !!files && files[0].type.startsWith("audio")
  });
  const textAnswer = await llm(fullprompt);
  try {
    const regex = /```(.*?)```/gs;
    const matches = [...textAnswer.matchAll(regex)];
    const codeBlocks = matches.map((match) => match[1]);
    return codeBlocks[0].replace("js", "").replace("javascript", "").trim() ?? "nothing";
  } catch {
    throw new Error("The generated text doesn't contain any code blocks.");
  }
}

// src/tools/textToImage.ts
var textToImageTool = {
  name: "textToImage",
  description: "Generate an image from a text prompt.",
  examples: [
    {
      prompt: "Generate an image of a cat wearing a top hat",
      code: "textToImage('cat wearing a top hat')",
      tools: ["textToImage"]
    },
    {
      prompt: "Draw a brown dog on a beach",
      code: "textToImage('drawing of a brown dog on a beach')",
      tools: ["textToImage"]
    }
  ],
  call: async (input, inference) => {
    const data = await input;
    if (typeof data !== "string")
      throw "Input must be a string.";
    return await inference.textToImage(
      {
        inputs: data
      },
      { wait_for_model: true }
    );
  }
};

// src/tools/imageToText.ts
var imageToTextTool = {
  name: "imageToText",
  description: "Caption an image.",
  examples: [
    {
      prompt: "Describe the image",
      code: "imageToText(image)",
      tools: ["imageToText"]
    }
  ],
  call: async (input, inference) => {
    const data = await input;
    if (typeof data === "string")
      throw "Input must be a blob.";
    return (await inference.imageToText(
      {
        data
      },
      { wait_for_model: true }
    )).generated_text;
  }
};

// src/tools/textToSpeech.ts
var textToSpeechTool = {
  name: "textToSpeech",
  description: "This tool takes a text input and turns it into an audio file.",
  examples: [
    {
      prompt: 'Say the following out loud:"Hello world!"',
      code: "textToSpeech('Hello world!')",
      tools: ["textToSpeech"]
    },
    {
      prompt: "Say the content of the string txt out loud",
      code: "textToSpeech(txt)",
      tools: ["textToSpeech"]
    }
  ],
  call: async (input, inference) => {
    const data = await input;
    if (typeof data !== "string")
      throw "Input must be a string.";
    return inference.textToSpeech(
      {
        inputs: data,
        model: "espnet/kan-bayashi_ljspeech_vits"
      },
      { wait_for_model: true }
    );
  }
};

// src/tools/speechToText.ts
var speechToTextTool = {
  name: "speechToText",
  description: "Transcribe an audio file and returns its text content.",
  examples: [
    {
      prompt: "Transcribe the sound file",
      code: "speechToText(audio)",
      tools: ["speechToText"]
    }
  ],
  call: async (input, inference) => {
    const data = await input;
    if (typeof data === "string")
      throw "Input must be a blob.";
    return (await inference.automaticSpeechRecognition(
      {
        data
      },
      { wait_for_model: true }
    )).text;
  }
};

// src/tools/index.ts
var defaultTools = [textToImageTool, imageToTextTool, textToSpeechTool, speechToTextTool];

// src/llms/LLMHF.ts
import { HfInference as HfInference2 } from "@huggingface/inference";
function LLMFromHub(accessToken, model) {
  const inference = new HfInference2(accessToken);
  return async (prompt) => {
    const formattedPrompt = "<|user|>" + prompt + "<|end|><|assistant|>";
    const output = await inference.textGeneration({
      inputs: formattedPrompt,
      model: model ?? "OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5",
      parameters: {
        max_new_tokens: 900
      }
    });
    return output.generated_text.slice(formattedPrompt.length);
  };
}
function LLMFromEndpoint(acessToken, endpoint) {
  const inference = new HfInference2(acessToken).endpoint(endpoint);
  return async (prompt) => {
    const formattedPrompt = "<|user|>" + prompt + "<|end|><|assistant|>";
    const output = await inference.textGeneration({
      inputs: formattedPrompt,
      parameters: {
        max_new_tokens: 900
      }
    });
    return output.generated_text.slice(formattedPrompt.length);
  };
}

// src/HfAgent.ts
var HfAgent = class {
  accessToken;
  llm;
  tools;
  constructor(accessToken = "", LLM, tools) {
    this.accessToken = accessToken;
    this.llm = LLM ?? LLMFromHub(accessToken);
    this.tools = tools ?? defaultTools;
  }
  generatePrompt(prompt, files) {
    return generatePrompt(prompt, [...this.tools, messageTool], {
      image: !!files && files[0].type.startsWith("image"),
      audio: !!files && files[0].type.startsWith("audio")
    });
  }
  async generateCode(prompt, files) {
    return await generateCode(prompt, this.tools, files, this.llm.bind(this));
  }
  async evaluateCode(code, files) {
    const updates = [];
    const callback = (message, data) => {
      updates.push({ message, data });
    };
    const wrapperEval = await evalBuilder(code, this.tools, files, callback, this.accessToken);
    try {
      await wrapperEval();
    } catch (e) {
      if (e instanceof Error) {
        updates.push({ message: "An error occurred", data: e.message });
      }
    }
    return updates;
  }
  async run(prompt, files) {
    const code = await this.generateCode(prompt, files);
    const updates = await this.evaluateCode(code, files);
    return updates;
  }
};
export {
  HfAgent,
  LLMFromEndpoint,
  LLMFromHub,
  defaultTools,
  imageToTextTool,
  speechToTextTool,
  textToImageTool,
  textToSpeechTool
};
