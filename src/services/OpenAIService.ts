import OpenAI from 'openai';
import { Task, TaskForm } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Required for React Native
});

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface TaskCreationRequest {
  title: string;
  description?: string;
  due_date?: string;
  category?: string;
}

export class OpenAIService {
  private static systemPrompt = `You are a helpful task management assistant for the TaskScheduler app. You can help users:

1. Query their tasks (e.g., "What are my tasks for today?")
2. Create new tasks (e.g., "Schedule a task called 'buy groceries'")
3. Ask for missing information when creating tasks

When creating tasks, always ask for:
- Due date if not specified
- Description if not specified
- Category if not specified

Keep responses concise and friendly. If you need more information, ask one question at a time.

Current date: ${new Date().toISOString().split('T')[0]}`;

  static async chat(messages: ChatMessage[]): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: this.systemPrompt },
          ...messages
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content || 'Sorry, I couldn\'t process that request.';
    } catch (error) {
      console.error('OpenAI API error:', error);
      return 'Sorry, I\'m having trouble connecting right now. Please try again.';
    }
  }

  static async createTaskFromMessage(userMessage: string, existingTasks: Task[]): Promise<{
    task?: TaskCreationRequest;
    response: string;
    needsMoreInfo: boolean;
  }> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are a task creation assistant. Analyze the user's message and extract task information. If information is missing, ask for it.

Available task fields:
- title (required)
- description (optional)
- due_date: YYYY-MM-DD format (optional)
- category (optional)

If the message is about creating a task, respond with a JSON object like:
{
  "task": {
    "title": "task title",
    "description": "task description",
    "due_date": "2024-12-19",
    "category": "work"
  },
  "response": "I'll create that task for you!",
  "needsMoreInfo": false
}

If information is missing, respond with:
{
  "task": null,
  "response": "What due date would you like for this task?",
  "needsMoreInfo": true
}

If it's not about creating a task, respond normally without JSON.`
      },
      {
        role: 'user',
        content: userMessage
      }
    ];

    const response = await this.chat(messages);
    
    // Try to parse JSON response
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          task: parsed.task,
          response: parsed.response,
          needsMoreInfo: parsed.needsMoreInfo
        };
      }
    } catch (error) {
      console.log('Could not parse JSON response:', error);
    }

    return {
      task: undefined,
      response: response,
      needsMoreInfo: false
    };
  }

  static async queryTasks(userMessage: string, tasks: Task[]): Promise<string> {
    const taskList = tasks.map(task => 
      `- ${task.title} (${task.priority}, ${task.status}, due: ${task.due_date || 'no due date'})`
    ).join('\n');

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are a task query assistant. The user is asking about their tasks. Here are their current tasks:

${taskList}

Respond helpfully about their tasks. If they ask about today's tasks, focus on tasks due today or with high priority.`
      },
      {
        role: 'user',
        content: userMessage
      }
    ];

    return await this.chat(messages);
  }
} 