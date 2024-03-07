import openai from './config/open-ai.js';
import readlineSync from 'readline-sync';
import colors from 'colors';

async function main() {
    console.log(colors.bold.green("Welcome to the Chatbot Program!"));
    console.log(colors.bold.green("What would you like to ask?"));

    let chatHistory = []; //store chat history

    while (true) {
        let userInput = readlineSync.question(colors.blue('You: '));

        try { 
            //create messages by iterating over history
            let messageHistory = chatHistory.map(([role, content ]) => ({ role, content }));

            // add latest input
            messageHistory.push({ role: 'user', content: userInput });

            //call api with user input
            let completion = await openai.chat.completions.create({
                model:'gpt-3.5-turbo',
                messages: messageHistory,
            });

            let response = completion.choices[0].message.content;

            //user exit
            if (userInput.toLowerCase() == 'exit') {
                console.log(colors.green('Bot: ') + response);
                return;
            }

            console.log(colors.green('Bot: ') + response);

            //update history with user input and response
            chatHistory.push(['user', userInput]);
            chatHistory.push(['assistant', response]);
            
        } catch (error) {
            console.error(colors.red(error));
        }
    }
}

main();

/* Calling chatgpt
    const chatCompletion = await openai.chat.completions.create({
        model:'gpt-3.5-turbo',
        messages: [
            { role: 'user', content: 'What is the capital of Massachuesetts?' }
        ]
    });

    console.log(chatCompletion.choices[0].message.content);
*/