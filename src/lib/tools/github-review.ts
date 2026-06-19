import { tool } from "ai";
import { z } from "zod";
import { StudentLevel } from "@/lib/types";

interface GitHubRepoData {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  topics: string[];
  defaultBranch: string;
  hasReadme: boolean;
  license: string | null;
  size: number;
  createdAt: string;
  updatedAt: string;
  files: string[];
  packageJson: Record<string, unknown> | null;
  readmeContent: string | null;
}

async function fetchGitHubData(
  owner: string,
  repo: string,
  token?: string
): Promise<GitHubRepoData> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "LandchainProject-Educational-Assistant",
  };

  if (token) {
    headers["Authorization"] = `token ${token}`;
  }

  const baseUrl = `https://api.github.com/repos/${owner}/${repo}`;

  const repoRes = await fetch(baseUrl, { headers });
  if (!repoRes.ok) {
    throw new Error(
      `GitHub API error: ${repoRes.status} - Repository not found or private`
    );
  }
  const repoData = await repoRes.json();

  // Fetch root contents
  const contentsRes = await fetch(`${baseUrl}/contents`, { headers });
  const contents = contentsRes.ok ? await contentsRes.json() : [];
  const files = Array.isArray(contents)
    ? contents.map((f: { name: string }) => f.name)
    : [];

  // Fetch README
  let readmeContent: string | null = null;
  const readmeRes = await fetch(`${baseUrl}/readme`, { headers });
  if (readmeRes.ok) {
    const readmeData = await readmeRes.json();
    readmeContent = Buffer.from(readmeData.content, "base64")
      .toString("utf-8")
      .slice(0, 2000);
  }

  // Fetch package.json if it exists
  let packageJson: Record<string, unknown> | null = null;
  if (files.includes("package.json")) {
    const pkgRes = await fetch(`${baseUrl}/contents/package.json`, { headers });
    if (pkgRes.ok) {
      const pkgData = await pkgRes.json();
      try {
        packageJson = JSON.parse(
          Buffer.from(pkgData.content, "base64").toString("utf-8")
        );
      } catch {
        // ignore parse errors
      }
    }
  }

  return {
    name: repoData.name,
    description: repoData.description,
    language: repoData.language,
    stars: repoData.stargazers_count,
    forks: repoData.forks_count,
    openIssues: repoData.open_issues_count,
    topics: repoData.topics || [],
    defaultBranch: repoData.default_branch,
    hasReadme: files.some((f) =>
      f.toLowerCase().startsWith("readme")
    ),
    license: repoData.license?.name || null,
    size: repoData.size,
    createdAt: repoData.created_at,
    updatedAt: repoData.updated_at,
    files,
    packageJson,
    readmeContent,
  };
}

function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const patterns = [
    /github\.com\/([^/]+)\/([^/\s]+)/,
    /^([^/]+)\/([^/]+)$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return {
        owner: match[1],
        repo: match[2].replace(/\.git$/, ""),
      };
    }
  }
  return null;
}

export function createGitHubReviewTool(level: StudentLevel) {
  return tool({
    description:
      "Review a GitHub repository and provide educational feedback on code quality, structure, best practices, and improvements. Analyzes repository structure, README, dependencies, and overall project organization.",
    parameters: z.object({
      repositoryUrl: z
        .string()
        .describe(
          "GitHub repository URL (e.g., https://github.com/username/project) or owner/repo format"
        ),
    }),
    execute: async ({ repositoryUrl }) => {
      const parsed = parseGitHubUrl(repositoryUrl);
      if (!parsed) {
        return {
          type: "github_review",
          error: "Invalid GitHub URL. Please provide a valid GitHub repository URL.",
        };
      }

      const { owner, repo } = parsed;
      const token = process.env.GITHUB_TOKEN;

      let repoData: GitHubRepoData;
      try {
        repoData = await fetchGitHubData(owner, repo, token);
      } catch (error) {
        return {
          type: "github_review",
          error: `Failed to fetch repository: ${error instanceof Error ? error.message : "Unknown error"}`,
          repositoryUrl,
        };
      }

      const levelInstructions = {
        beginner: `Review this GitHub repository as a beginner-friendly educational review:
          - Explain what the project does in simple terms
          - Check if README is clear and beginner-friendly
          - Look for good code organization basics (folders, naming)
          - Give encouraging feedback with simple actionable suggestions
          - Explain WHY each suggestion matters in simple terms`,

        intermediate: `Review this GitHub repository with intermediate-level depth:
          - Evaluate project architecture and folder structure
          - Check for proper error handling and input validation
          - Review dependency choices and versions
          - Assess code organization and separation of concerns
          - Suggest design patterns that could improve the code
          - Check for testing setup`,

        advanced: `Review this GitHub repository with expert-level depth:
          - Evaluate architectural decisions and scalability
          - Identify performance bottlenecks or security concerns
          - Review dependency graph for unnecessary bloat or outdated packages
          - Check for advanced patterns: SOLID principles, DRY, KISS
          - Assess CI/CD setup, testing coverage, and documentation quality
          - Provide specific code-level refactoring suggestions`,
      };

      return {
        type: "github_review",
        repositoryUrl,
        owner,
        repo,
        level,
        repoData: {
          ...repoData,
          dependencies: repoData.packageJson?.dependencies
            ? Object.keys(repoData.packageJson.dependencies as Record<string, string>)
            : [],
          devDependencies: repoData.packageJson?.devDependencies
            ? Object.keys(repoData.packageJson.devDependencies as Record<string, string>)
            : [],
        },
        instructions: levelInstructions[level],
        prompt: `You are an expert code reviewer and educator. Analyze the following GitHub repository data and provide a structured review.

Repository: ${owner}/${repo}
Language: ${repoData.language || "Not specified"}
Description: ${repoData.description || "No description"}
Stars: ${repoData.stars} | Forks: ${repoData.forks} | Open Issues: ${repoData.openIssues}
Topics: ${repoData.topics.join(", ") || "None"}
Files in root: ${repoData.files.join(", ")}
Has README: ${repoData.hasReadme}
License: ${repoData.license || "None"}
Size: ${repoData.size} KB
Dependencies: ${repoData.packageJson?.dependencies ? Object.keys(repoData.packageJson.dependencies as Record<string, string>).join(", ") : "N/A"}
Dev Dependencies: ${repoData.packageJson?.devDependencies ? Object.keys(repoData.packageJson.devDependencies as Record<string, string>).join(", ") : "N/A"}

README Preview:
${repoData.readmeContent || "No README found"}

${levelInstructions[level]}

Provide your review with these sections:
## 📊 Project Overview
## ✅ Strengths
## 🔧 Areas for Improvement
## 📋 Action Items (prioritized list)
## 🎯 Overall Score: X/10`,
      };
    },
  });
}
