// Enhanced AI Workflow Generator with Real GPT-4 Integration

import OpenAI from 'openai';
import { logger } from '../utils/logger';

export class EnhancedWorkflowGenerator {
  private openai: OpenAI;
  
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'demo-key',
    });
  }

  async generateWorkflow(description: string, businessContext?: string, userProfile?: any) {
    try {
      // Enhanced prompt with business context and user profile
      const prompt = this.buildEnhancedPrompt(description, businessContext, userProfile);
      
      if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'demo-key') {
        const completion = await this.openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert workflow automation consultant. Create detailed, practical n8n workflows that solve real business problems.'
            },
            {
              role: 'user', 
              content: prompt
            }
          ],
          temperature: 0.3, // Lower temperature for more consistent results
          max_tokens: 3000,
        });

        const responseText = completion.choices[0]?.message?.content;
        if (responseText) {
          try {
            return JSON.parse(responseText);
          } catch (parseError) {
            logger.warn('Failed to parse OpenAI response, using enhanced fallback');
            return this.createEnhancedFallback(description, businessContext);
          }
        }
      }
      
      // Enhanced fallback with better mock data
      return this.createEnhancedFallback(description, businessContext);
      
    } catch (error) {
      logger.error('Enhanced workflow generation failed:', error);
      throw new Error(`Workflow generation failed: ${error.message}`);
    }
  }

  private buildEnhancedPrompt(description: string, businessContext?: string, userProfile?: any) {
    return `
Create a complete n8n workflow for this business requirement:
"${description}"

${businessContext ? `Business Context: ${businessContext}` : ''}
${userProfile ? `User Profile: ${JSON.stringify(userProfile)}` : ''}

Please provide a comprehensive workflow with:

1. **Workflow Structure:**
   - name: Descriptive workflow name
   - description: Detailed workflow description
   - nodes: Array of n8n nodes with proper configuration
   - connections: Node connections mapping
   - triggers: Appropriate trigger configurations

2. **Business Metrics:**
   - estimatedTimeSavings: Hours saved per month
   - estimatedCostSavings: Dollar savings per month
   - roi: Return on investment percentage
   - complexity: simple/medium/complex

3. **Implementation Details:**
   - requiredIntegrations: Services needed
   - setupInstructions: Step-by-step setup guide
   - testingSteps: How to test the workflow
   - maintenanceNotes: Ongoing maintenance requirements

4. **Node Types to Consider:**
   - Triggers: Webhook, Schedule, Email, Form submission, File watch
   - Data processing: Filter, Transform, Aggregate, Validate
   - Integrations: API calls, Database operations, File operations
   - Notifications: Email, Slack, SMS, Push notifications
   - Control flow: If/else, Switch, Loop, Delay

Return ONLY valid JSON with proper escaping. Example structure:
{
  "name": "Automated Customer Onboarding",
  "description": "Complete customer onboarding automation",
  "nodes": [...],
  "connections": {...},
  "estimatedTimeSavings": 15,
  "estimatedCostSavings": 500,
  "roi": 300,
  "complexity": "medium",
  "requiredIntegrations": ["Gmail", "Google Sheets", "Slack"],
  "setupInstructions": [...],
  "testingSteps": [...],
  "maintenanceNotes": [...]
}`;
  }

  private createEnhancedFallback(description: string, businessContext?: string) {
    // Create intelligent fallback based on keywords in description
    const keywords = description.toLowerCase();
    
    let workflowTemplate;
    
    if (keywords.includes('email') || keywords.includes('notification')) {
      workflowTemplate = this.getEmailWorkflowTemplate();
    } else if (keywords.includes('data') || keywords.includes('spreadsheet') || keywords.includes('csv')) {
      workflowTemplate = this.getDataProcessingTemplate();
    } else if (keywords.includes('customer') || keywords.includes('onboard')) {
      workflowTemplate = this.getCustomerWorkflowTemplate();
    } else if (keywords.includes('social') || keywords.includes('post')) {
      workflowTemplate = this.getSocialMediaTemplate();
    } else {
      workflowTemplate = this.getGenericWorkflowTemplate();
    }

    // Customize template based on description
    workflowTemplate.name = `Generated: ${description.substring(0, 50)}${description.length > 50 ? '...' : ''}`;
    workflowTemplate.description = `Workflow created from: "${description}"`;
    
    if (businessContext) {
      workflowTemplate.description += ` Context: ${businessContext}`;
    }

    return workflowTemplate;
  }

  private getEmailWorkflowTemplate() {
    return {
      name: "Email Processing Workflow",
      description: "Automated email processing and response system",
      nodes: [
        {
          id: "webhook-1",
          type: "n8n-nodes-base.webhook",
          name: "Email Trigger",
          parameters: {
            httpMethod: "POST",
            path: "email-webhook",
            responseMode: "onReceived"
          },
          position: [250, 300]
        },
        {
          id: "filter-1", 
          type: "n8n-nodes-base.if",
          name: "Filter Important Emails",
          parameters: {
            conditions: {
              string: [
                {
                  value1: "={{$json.subject}}",
                  operation: "contains",
                  value2: "urgent"
                }
              ]
            }
          },
          position: [450, 300]
        },
        {
          id: "gmail-1",
          type: "n8n-nodes-base.gmail",
          name: "Send Auto Reply",
          parameters: {
            operation: "send",
            emailType: "text",
            toEmail: "={{$json.from}}",
            subject: "Re: {{$json.subject}}",
            message: "Thank you for your email. We'll respond within 24 hours."
          },
          position: [650, 200]
        },
        {
          id: "slack-1",
          type: "n8n-nodes-base.slack",
          name: "Notify Team",
          parameters: {
            operation: "postMessage",
            channel: "#support",
            text: "Urgent email received: {{$json.subject}}"
          },
          position: [650, 400]
        }
      ],
      connections: {
        "webhook-1": {
          "main": [
            [{"node": "filter-1", "type": "main", "index": 0}]
          ]
        },
        "filter-1": {
          "main": [
            [{"node": "gmail-1", "type": "main", "index": 0}],
            [{"node": "slack-1", "type": "main", "index": 0}]
          ]
        }
      },
      estimatedTimeSavings: 10,
      estimatedCostSavings: 400,
      roi: 200,
      complexity: "medium",
      requiredIntegrations: ["Gmail", "Slack", "Webhook"],
      setupInstructions: [
        "Configure Gmail OAuth credentials",
        "Set up Slack bot and get channel access",
        "Configure webhook endpoint",
        "Test with sample email"
      ],
      testingSteps: [
        "Send test email to webhook",
        "Verify auto-reply is sent",
        "Check Slack notification appears",
        "Monitor for any errors"
      ],
      maintenanceNotes: [
        "Monitor webhook uptime",
        "Update email templates quarterly", 
        "Review and update filter conditions",
        "Check Gmail API quota usage"
      ]
    };
  }

  private getDataProcessingTemplate() {
    return {
      name: "Data Processing Pipeline",
      description: "Automated data collection, processing, and reporting",
      nodes: [
        {
          id: "schedule-1",
          type: "n8n-nodes-base.schedule",
          name: "Daily Data Collection",
          parameters: {
            rule: {
              interval: [
                {
                  field: "cronExpression",
                  value: "0 9 * * *"
                }
              ]
            }
          },
          position: [250, 300]
        },
        {
          id: "http-1",
          type: "n8n-nodes-base.httpRequest",
          name: "Fetch Data from API",
          parameters: {
            url: "https://api.example.com/data",
            method: "GET",
            responseFormat: "json"
          },
          position: [450, 300]
        },
        {
          id: "function-1",
          type: "n8n-nodes-base.function",
          name: "Process Data",
          parameters: {
            functionCode: `
// Process and transform data
const processedData = items.map(item => ({
  date: new Date().toISOString().split('T')[0],
  value: item.json.value,
  category: item.json.type,
  processed: true
}));
return processedData;
            `
          },
          position: [650, 300]
        },
        {
          id: "sheets-1",
          type: "n8n-nodes-base.googleSheets",
          name: "Update Report Sheet",
          parameters: {
            operation: "append",
            range: "A:D",
            valueInputOption: "RAW"
          },
          position: [850, 300]
        }
      ],
      connections: {
        "schedule-1": {
          "main": [
            [{"node": "http-1", "type": "main", "index": 0}]
          ]
        },
        "http-1": {
          "main": [
            [{"node": "function-1", "type": "main", "index": 0}]
          ]
        },
        "function-1": {
          "main": [
            [{"node": "sheets-1", "type": "main", "index": 0}]
          ]
        }
      },
      estimatedTimeSavings: 20,
      estimatedCostSavings: 800,
      roi: 400,
      complexity: "medium",
      requiredIntegrations: ["HTTP Request", "Google Sheets", "Schedule Trigger"],
      setupInstructions: [
        "Configure API endpoints and authentication",
        "Set up Google Sheets access",
        "Configure schedule timing",
        "Test data transformation logic"
      ],
      testingSteps: [
        "Run manual execution",
        "Verify data is fetched correctly",
        "Check data transformation",
        "Confirm sheet is updated"
      ],
      maintenanceNotes: [
        "Monitor API rate limits",
        "Update data processing logic as needed",
        "Review schedule timing",
        "Archive old data periodically"
      ]
    };
  }

  private getCustomerWorkflowTemplate() {
    return {
      name: "Customer Onboarding Automation",
      description: "Complete automated customer onboarding process",
      nodes: [
        {
          id: "webhook-1",
          type: "n8n-nodes-base.webhook",
          name: "New Customer Signup",
          parameters: {
            httpMethod: "POST", 
            path: "customer-signup",
            responseMode: "onReceived"
          },
          position: [250, 300]
        },
        {
          id: "function-1",
          type: "n8n-nodes-base.function",
          name: "Process Customer Data",
          parameters: {
            functionCode: `
// Validate and process customer data
const customer = items[0].json;
return [{
  json: {
    customerId: customer.id,
    email: customer.email,
    name: customer.name,
    signupDate: new Date().toISOString(),
    onboardingStep: 'welcome'
  }
}];
            `
          },
          position: [450, 300]
        },
        {
          id: "gmail-1",
          type: "n8n-nodes-base.gmail",
          name: "Send Welcome Email", 
          parameters: {
            operation: "send",
            emailType: "html",
            toEmail: "={{$json.email}}",
            subject: "Welcome to Our Platform!",
            message: `
<h1>Welcome {{$json.name}}!</h1>
<p>We're excited to have you onboard. Here's what happens next:</p>
<ul>
  <li>Check your account setup</li>
  <li>Complete your profile</li>
  <li>Explore our features</li>
</ul>
            `
          },
          position: [650, 200]
        },
        {
          id: "sheets-1",
          type: "n8n-nodes-base.googleSheets",
          name: "Add to Customer List",
          parameters: {
            operation: "append",
            range: "A:E"
          },
          position: [650, 400]
        },
        {
          id: "delay-1",
          type: "n8n-nodes-base.delay",
          name: "Wait 24 Hours",
          parameters: {
            amount: 1,
            unit: "days"
          },
          position: [850, 300]
        },
        {
          id: "gmail-2",
          type: "n8n-nodes-base.gmail",
          name: "Follow-up Email",
          parameters: {
            operation: "send",
            emailType: "text",
            toEmail: "={{$json.email}}",
            subject: "How are you getting on?",
            message: "Hi {{$json.name}}, how is your first day going? Need any help?"
          },
          position: [1050, 300]
        }
      ],
      connections: {
        "webhook-1": {
          "main": [
            [{"node": "function-1", "type": "main", "index": 0}]
          ]
        },
        "function-1": {
          "main": [
            [{"node": "gmail-1", "type": "main", "index": 0}, {"node": "sheets-1", "type": "main", "index": 0}]
          ]
        },
        "gmail-1": {
          "main": [
            [{"node": "delay-1", "type": "main", "index": 0}]
          ]
        },
        "delay-1": {
          "main": [
            [{"node": "gmail-2", "type": "main", "index": 0}]
          ]
        }
      },
      estimatedTimeSavings: 25,
      estimatedCostSavings: 1000,
      roi: 500,
      complexity: "complex",
      requiredIntegrations: ["Gmail", "Google Sheets", "Webhook", "Delay"],
      setupInstructions: [
        "Configure customer signup webhook",
        "Set up Gmail templates",
        "Create customer tracking spreadsheet",
        "Test complete workflow end-to-end"
      ],
      testingSteps: [
        "Submit test customer signup",
        "Verify welcome email sent",
        "Check customer added to sheet",
        "Confirm follow-up email after delay"
      ],
      maintenanceNotes: [
        "Update email templates regularly",
        "Monitor customer feedback",
        "A/B test email timing and content",
        "Review onboarding metrics monthly"
      ]
    };
  }

  private getSocialMediaTemplate() {
    return {
      name: "Social Media Automation",
      description: "Automated social media posting and engagement",
      nodes: [
        {
          id: "schedule-1",
          type: "n8n-nodes-base.schedule", 
          name: "Daily Posting Schedule",
          parameters: {
            rule: {
              interval: [
                {
                  field: "cronExpression",
                  value: "0 10,14,18 * * *"
                }
              ]
            }
          },
          position: [250, 300]
        },
        {
          id: "sheets-1",
          type: "n8n-nodes-base.googleSheets",
          name: "Get Content Queue",
          parameters: {
            operation: "read",
            range: "A:C"
          },
          position: [450, 300]
        },
        {
          id: "function-1",
          type: "n8n-nodes-base.function",
          name: "Select Next Post",
          parameters: {
            functionCode: `
// Select next scheduled post
const posts = items.filter(item => item.json.scheduled && !item.json.posted);
const nextPost = posts[0];
return nextPost ? [{ json: nextPost.json }] : [];
            `
          },
          position: [650, 300]
        },
        {
          id: "twitter-1",
          type: "n8n-nodes-base.twitter",
          name: "Post to Twitter",
          parameters: {
            operation: "tweet",
            text: "={{$json.content}}"
          },
          position: [850, 200]
        },
        {
          id: "linkedin-1", 
          type: "n8n-nodes-base.linkedIn",
          name: "Post to LinkedIn",
          parameters: {
            operation: "post",
            text: "={{$json.content}}"
          },
          position: [850, 400]
        }
      ],
      connections: {
        "schedule-1": {
          "main": [
            [{"node": "sheets-1", "type": "main", "index": 0}]
          ]
        },
        "sheets-1": {
          "main": [
            [{"node": "function-1", "type": "main", "index": 0}]
          ]
        },
        "function-1": {
          "main": [
            [{"node": "twitter-1", "type": "main", "index": 0}, {"node": "linkedin-1", "type": "main", "index": 0}]
          ]
        }
      },
      estimatedTimeSavings: 15,
      estimatedCostSavings: 600,
      roi: 300,
      complexity: "medium",
      requiredIntegrations: ["Twitter", "LinkedIn", "Google Sheets", "Schedule"],
      setupInstructions: [
        "Set up social media API access",
        "Create content planning spreadsheet",
        "Configure posting schedule",
        "Test posts on each platform"
      ],
      testingSteps: [
        "Run manual execution",
        "Verify content is pulled correctly",
        "Check posts appear on platforms",
        "Monitor engagement metrics"
      ],
      maintenanceNotes: [
        "Update content queue regularly",
        "Monitor social media metrics",
        "Adjust posting times based on engagement",
        "Review and update content strategy"
      ]
    };
  }

  private getGenericWorkflowTemplate() {
    return {
      name: "Generic Automation Workflow",
      description: "Flexible automation template",
      nodes: [
        {
          id: "webhook-1",
          type: "n8n-nodes-base.webhook",
          name: "Trigger",
          parameters: {
            httpMethod: "POST",
            path: "automation-trigger"
          },
          position: [250, 300]
        },
        {
          id: "function-1",
          type: "n8n-nodes-base.function",
          name: "Process Data",
          parameters: {
            functionCode: `
// Basic data processing
return items.map(item => ({
  json: {
    ...item.json,
    processed: true,
    timestamp: new Date().toISOString()
  }
}));
            `
          },
          position: [450, 300]
        },
        {
          id: "http-1",
          type: "n8n-nodes-base.httpRequest",
          name: "Send to External Service",
          parameters: {
            url: "https://api.example.com/webhook",
            method: "POST"
          },
          position: [650, 300]
        }
      ],
      connections: {
        "webhook-1": {
          "main": [
            [{"node": "function-1", "type": "main", "index": 0}]
          ]
        },
        "function-1": {
          "main": [
            [{"node": "http-1", "type": "main", "index": 0}]
          ]
        }
      },
      estimatedTimeSavings: 8,
      estimatedCostSavings: 300,
      roi: 150,
      complexity: "simple",
      requiredIntegrations: ["HTTP Request", "Webhook"],
      setupInstructions: [
        "Configure webhook endpoint",
        "Set up external service connection",
        "Test data flow",
        "Configure error handling"
      ],
      testingSteps: [
        "Send test webhook",
        "Verify data processing",
        "Check external service receives data",
        "Test error scenarios"
      ],
      maintenanceNotes: [
        "Monitor webhook uptime",
        "Check external service status",
        "Review processing logic regularly",
        "Update configurations as needed"
      ]
    };
  }
}

export default EnhancedWorkflowGenerator;