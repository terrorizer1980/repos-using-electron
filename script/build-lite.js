#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const repos = require('..').map(repo => {
  return {
    fullName: repo.fullName,
    description: repo.description,
    forksCount: repo.forksCount,
    stargazersCount: repo.stargazersCount,
    subscribersCount: repo.subscribersCount//,
    // depNames: repo.pkg.depNames,
    // devDepNames: repo.pkg.devDepNames,
  }
})

fs.writeFileSync(
  path.join(__dirname, '../lite.json'),
  JSON.stringify(repos, null, 2)
)