require('dotenv-safe').load()

const repos = require('../all-repos')
const RateLimiter = require('limiter').RateLimiter
const limiter = new RateLimiter(Math.floor(5000/60/60), 'second')
const getPackageJSON = require('get-repo-package-json')
const NOW = new Date()
const TTL = 1000 * 60 * 60 * 24 * 7

console.log('Filling repos with package.json metadata')

repos.forEach(repo => {
  if (repo.status === 404 || repo.packageStatus === 404) {
    console.log(`${repo.fullName} (404, skipping)`)
    return
  }

  if (NOW - new Date(repo.packageLastFetchedAt) < TTL  ) {
    console.log(`${repo.fullName} (skipping; package updated ${repo.packageLastFetchedAt})`)
    return
  }

  limiter.removeTokens(1, function () {
    getPackageJSON(repo.fullName, function (err, pkg) {
      if (err) {
        Object.assign(repo, {packageStatus: 404, packageLastFetchedAt: new Date()})
      } else {
        Object.assign(repo, {packageJSON: pkg, packageStatus: 200, packageLastFetchedAt: new Date()})
      }
      repo.save(`status: ${repo.packageStatus}`)
    })
  })
})
