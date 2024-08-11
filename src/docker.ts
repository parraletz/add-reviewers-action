import { Octokit } from '@octokit/rest'
import * as fs from 'fs'
import yaml from 'js-yaml'

const prNumber = process.env.PR_NUMBER
const reviewersFilePath = process.env.REVIEWERS_FILE_PATH as string
const fileContent = fs.readFileSync(reviewersFilePath, 'utf8')

const reviewersData = yaml.load(fileContent) as { reviewers: string[] }
const reviewers = reviewersData.reviewers

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
})

const remoteUrl =
  (process.env.CI_REMOTE_URL as string) ||
  (process.env.DRONE_REPO_LINK as string)

const repoMatch = remoteUrl.match(/github\.com\/([^\/]+)\/([^\/]+)(\.git)?$/)

if (!repoMatch) {
  console.error('Error to get owner and repo from remote url')
  process.exit(1)
}

const owner = repoMatch[1]
const repo = repoMatch[2]

async function addReviewers() {
  try {
    if (!prNumber) {
      throw new Error('PR_NUMBER is not defined')
    } else if (!reviewers) {
      throw new Error('REVIEWERS is not defined')
    } else if (!owner) {
      throw new Error('OWNER is not defined')
    } else if (!repo) {
      throw new Error('REPO is not defined')
    } else {
      const response = await octokit.pulls.requestReviewers({
        owner,
        repo,
        pull_number: +prNumber,
        reviewers
      })
      console.log('Code reviewers added:', response.data)
    }
  } catch (error) {
    console.error('Error to added code reviewers:', error)
  }
}

addReviewers()
