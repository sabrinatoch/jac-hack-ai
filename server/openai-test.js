import OpenAI  from "openai";
const openai = new OpenAI({apiKey: 'sk-proj-eKcPtkULFLk6uU4w9YzkT3BlbkFJqFDiexYq0SxaanH5B59J'});

async function main() {
    const completion = await openai.chat.completions.create({
        messages: [{role: "system", content: "Please give me a tilda-separated list of movies like Back to the Future without responding with any other text so that I can parse through the results."}],
        model: "gpt-3.5-turbo"
    });

    console.log(completion.choices[0].message.content)
}

main()