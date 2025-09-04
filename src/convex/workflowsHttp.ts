import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
import { internal } from "./_generated/api";

// HTTP Actions for workflow management
// POST /v1/workflows - Create workflow
// GET /v1/workflows/:id - Get workflow
// POST /v1/workflows/:id/activate - Activate workflow
// POST /v1/workflows/:id/deactivate - Deactivate workflow

export const create = httpAction(async (ctx, request) => {
  try {
    const body = await request.json();
    const { org_id, template_id, params, title, description } = body;

    if (!org_id || !template_id) {
      return new Response(
        JSON.stringify({ error: "org_id and template_id are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get template details
    const template = await ctx.runQuery(api.aiBuilder.getActiveTemplates);
    const selectedTemplate = template.find((t: any) => t.templateId === template_id);

    if (!selectedTemplate) {
      return new Response(
        JSON.stringify({ error: "Template not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create workflow in database
    const workflowId = await ctx.runMutation(api.workflows.createWorkflow, {
      title: title || selectedTemplate.name,
      description: description || selectedTemplate.description,
      prompt: `Generated from template: ${selectedTemplate.name}`,
      jsonConfig: JSON.stringify({ template_id, params }),
      category: "AI Generated",
    });

    // Import to n8n (simulated)
    const n8nResult = await ctx.runAction(internal.executionBroker.importN8n, {
      orgId: org_id,
      workflowId: workflowId,
      template: selectedTemplate,
      params: params || {},
    });

    // Update workflow with n8n ID
    await ctx.runMutation(api.workflows.updateWorkflowStatus, {
      workflowId,
      status: "draft",
    });

    return new Response(
      JSON.stringify({
        id: workflowId,
        template_id,
        n8n_workflow_id: n8nResult.n8nWorkflowId,
        status: "draft",
        message: "Workflow created successfully",
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

export const get = httpAction(async (ctx, request) => {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const workflowId = pathParts[pathParts.length - 1];

    if (!workflowId) {
      return new Response(
        JSON.stringify({ error: "Workflow ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const workflows = await ctx.runQuery(api.workflows.getUserWorkflows);
    const workflow = workflows.find((w: any) => w._id === workflowId);

    if (!workflow) {
      return new Response(
        JSON.stringify({ error: "Workflow not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify(workflow),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

export const activate = httpAction(async (ctx, request) => {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const workflowId = pathParts[pathParts.length - 2]; // /workflows/:id/activate

    await ctx.runMutation(api.workflows.updateWorkflowStatus, {
      workflowId: workflowId as any,
      status: "active",
    });

    return new Response(
      JSON.stringify({ message: "Workflow activated successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to activate workflow" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

export const deactivate = httpAction(async (ctx, request) => {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const workflowId = pathParts[pathParts.length - 2]; // /workflows/:id/deactivate

    await ctx.runMutation(api.workflows.updateWorkflowStatus, {
      workflowId: workflowId as any,
      status: "paused",
    });

    return new Response(
      JSON.stringify({ message: "Workflow deactivated successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to deactivate workflow" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});