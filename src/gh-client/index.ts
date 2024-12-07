import { Octokit } from "@octokit/core";
import { restEndpointMethods } from "@octokit/plugin-rest-endpoint-methods";
const MyOctokit = Octokit.plugin(restEndpointMethods);

export const GHClient = new MyOctokit({ auth: process.env.GITHUB_OAUTH_TOKEN });

