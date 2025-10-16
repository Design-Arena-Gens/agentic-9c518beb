import { NextResponse } from 'next/server';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const responses = [
  "I'm an AI assistant here to help you with your questions and tasks. Feel free to ask me anything!",
  "That's an interesting question! Let me help you with that.",
  "I understand what you're asking. Here's my take on it:",
  "Great question! Let me break this down for you:",
  "I'd be happy to help you with that. Here's what I think:",
];

const topicResponses: { [key: string]: string } = {
  code: "I can help you with coding! Whether it's JavaScript, Python, or any other language, I'm here to assist with debugging, writing functions, or explaining concepts.",
  programming: "Programming is a powerful skill! I can help you learn new languages, debug issues, or discuss best practices.",
  hello: "Hello! I'm your AI assistant. How can I help you today?",
  hi: "Hi there! What can I do for you?",
  help: "I'm here to help! You can ask me questions about various topics including:\n- Programming and coding\n- General knowledge\n- Writing and content creation\n- Problem solving\n- And much more!",
  weather: "I don't have real-time weather data, but I can help you understand weather patterns, climate concepts, or suggest weather apps you might find useful!",
  time: "I don't have access to real-time information, but you can check your device's clock for the current time.",
  thanks: "You're welcome! Is there anything else I can help you with?",
  thank: "You're welcome! Feel free to ask if you need anything else.",
};

function generateResponse(messages: Message[]): string {
  const lastMessage = messages[messages.length - 1];
  const userInput = lastMessage.content.toLowerCase();

  // Check for specific topics
  for (const [key, response] of Object.entries(topicResponses)) {
    if (userInput.includes(key)) {
      return response;
    }
  }

  // Check for questions
  if (userInput.includes('?')) {
    if (userInput.includes('how')) {
      return "That's a great 'how' question! The approach depends on the specific context, but generally speaking, it involves breaking down the problem into smaller steps and tackling each one methodically.";
    }
    if (userInput.includes('what')) {
      return "That's a good question about 'what'. To give you a comprehensive answer, I'd need to consider various aspects of the topic you're asking about.";
    }
    if (userInput.includes('why')) {
      return "That's an insightful 'why' question! The reasons can be complex and multifaceted, often involving various factors that interact with each other.";
    }
    if (userInput.includes('when')) {
      return "Timing is an interesting aspect to consider. The 'when' often depends on multiple factors and conditions.";
    }
    if (userInput.includes('where')) {
      return "The 'where' aspect is important! Location and context can significantly impact the answer to your question.";
    }
  }

  // Check for code-related keywords
  if (userInput.includes('function') || userInput.includes('class') || userInput.includes('variable')) {
    return "I notice you're asking about programming concepts. I'd be happy to help you understand or write code. Could you provide more details about what you're trying to accomplish?";
  }

  // Check for math
  if (userInput.match(/\d+\s*[\+\-\*\/]\s*\d+/)) {
    try {
      // Simple math evaluation (be careful with eval in production!)
      const result = userInput.match(/(\d+)\s*([\+\-\*\/])\s*(\d+)/);
      if (result) {
        const [_, num1, operator, num2] = result;
        let answer = 0;
        switch (operator) {
          case '+': answer = parseInt(num1) + parseInt(num2); break;
          case '-': answer = parseInt(num1) - parseInt(num2); break;
          case '*': answer = parseInt(num1) * parseInt(num2); break;
          case '/': answer = parseInt(num1) / parseInt(num2); break;
        }
        return `The answer is ${answer}.`;
      }
    } catch (e) {
      // Continue to default response
    }
  }

  // Generate contextual response based on conversation history
  if (messages.length > 3) {
    return "That's a good follow-up question! Based on our conversation, I can provide more insights on this topic.";
  }

  // Random response
  return responses[Math.floor(Math.random() * responses.length)] + " " +
    "While I'm a simulated AI for this demo, I'm designed to help with a wide variety of topics. What would you like to explore?";
}

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    const responseMessage = generateResponse(messages);

    return NextResponse.json({ message: responseMessage });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
