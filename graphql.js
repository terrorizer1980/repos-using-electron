require('dotenv-safe').load()

const {GraphQLClient} = require('graphql-request')

const client = new GraphQLClient('https://api.github.com/graphql', {
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
  }
})

const query = `{
  repository(owner: "zeit", name: "hyper") {
    id
  }
}`

client.request(query).then(data => console.log(data))