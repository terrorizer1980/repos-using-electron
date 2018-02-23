require('dotenv-safe').load()
require('make-promises-safe')

const {GraphQLClient} = require('graphql-request')
const fs = require('fs')
const path = require('path')

const client = new GraphQLClient('https://api.github.com/graphql', {
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
  }
})

function buildQuery(fullName) {
  const [owner, repo] = fullName.split('/')
  return `{
    repository(owner: "${owner}", name: "${repo}") {
      id
    }
  }`
}

// const repoNames = [
//   'zeit/hyper',
//   'desktop/desktop',
//   'beakerbrowser/beaker'
// ]

const repoNames = fs.readFileSync(path.join(__dirname, 'data/buffett/electron.txt'), 'utf8')
  .split('\n')
  .filter(Boolean)
  .map(name => name.trim())
  .slice(0, 3)

function getRepo(fullName) {
  return client.request(buildQuery(fullName))
}

Promise.all(repoNames.map(getRepo))
  // same as repoNames.map(repoName => getRepo(repoName))
  .then(repos => console.log('got them repos', repos))
  