/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  branches: ['main', 'next'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    [
      '@eclass/semantic-release-docker',
      {
        baseImageName: 'add-code-reviewers',
        registries: [
          {
            url: 'docker.io',
            imageName: 'docker.io/parraletz/add-code-reviewers',
            user: 'DOCKER_USER',
            password: 'DOCKER_PASSWORD'
          }
        ],
        additionalTags: ['latest', 'next']
      }
    ],
    '@semantic-release/github',
    [
      '@semantic-release/exec',
      {
        prepareCmd: 'npx rjp package.json version ${nextRelease.version}',
        successCmd: 'echo "Release ${nextRelease.version} published"',
        failCmd: 'echo "Failed to publish release ${nextRelease.version}"'
      }
    ],
    [
      '@semantic-release/git',
      {
        message: 'ci: Release <%= nextRelease.version %> [skip ci]',
        assets: ['package.json']
      }
    ]
  ]
}
