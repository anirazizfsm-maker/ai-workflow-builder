/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as admin from "../admin.js";
import type * as aiBuilder from "../aiBuilder.js";
import type * as auth_emailOtp from "../auth/emailOtp.js";
import type * as auth from "../auth.js";
import type * as billing from "../billing.js";
import type * as chat from "../chat.js";
import type * as chatHttp from "../chatHttp.js";
import type * as executionBroker from "../executionBroker.js";
import type * as faqs from "../faqs.js";
import type * as http from "../http.js";
import type * as newsletter from "../newsletter.js";
import type * as newsletterHelpers from "../newsletterHelpers.js";
import type * as subscriptions from "../subscriptions.js";
import type * as testData from "../testData.js";
import type * as users from "../users.js";
import type * as workflowActions from "../workflowActions.js";
import type * as workflows from "../workflows.js";
import type * as workflowsHttp from "../workflowsHttp.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  aiBuilder: typeof aiBuilder;
  "auth/emailOtp": typeof auth_emailOtp;
  auth: typeof auth;
  billing: typeof billing;
  chat: typeof chat;
  chatHttp: typeof chatHttp;
  executionBroker: typeof executionBroker;
  faqs: typeof faqs;
  http: typeof http;
  newsletter: typeof newsletter;
  newsletterHelpers: typeof newsletterHelpers;
  subscriptions: typeof subscriptions;
  testData: typeof testData;
  users: typeof users;
  workflowActions: typeof workflowActions;
  workflows: typeof workflows;
  workflowsHttp: typeof workflowsHttp;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
