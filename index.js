const core = require('@actions/core')
const fs = require('fs')
const klawSync = require('klaw-sync')
const {lookup} = require('mime-types')
const path = require('path')
const shortid = require('shortid')
const slash = require('slash').default
const {S3Client, PutObjectCommand, ListObjectsV2Command} = require('@aws-sdk/client-s3')

const AWS_ACCESS_KEY = core.getInput('aws_access_key', {
  required: true,
})
const AWS_SECRET_ACCESS_KEY = core.getInput('aws_secret_access_key', {
  required: true,
})
const AWS_REGION = core.getInput('aws_region', {
  required: true,
})
const AWS_S3_BUCKET = core.getInput('aws_s3_bucket', {
  required: true,
})
const SOURCE_DIR = core.getInput('source_dir', {
  required: true,
})
const DESTINATION_DIR = core.getInput('destination_dir', {
  required: false,
})

const client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
})

const destinationDir = DESTINATION_DIR === '/' ? shortid() : DESTINATION_DIR

const paths = klawSync(SOURCE_DIR, {
  nodir: true,
})

function upload(params) {
  return new Promise(async resolve => {
    const command = new PutObjectCommand(params)
    try {
      const response = await client.send(command)
      resolve(response.ETag)
    } catch (err) {
      core.error(err)
    }
  })
}

function run() {
  const sourceDir = slash(path.join(process.cwd(), SOURCE_DIR))
  return Promise.all(
    paths.map(p => {
      const fileStream = fs.createReadStream(p.path)
      const bucketPath = slash(path.join(destinationDir, slash(path.relative(sourceDir, p.path))))
      const params = {
        Bucket: AWS_S3_BUCKET,
        Body: fileStream,
        Key: bucketPath,
        ContentType: lookup(p.path) || 'text/plain',
      }
      return upload(params)
    }),
  )
}

run()
  .then(tags => {
    core.info(`object key - ${destinationDir}`)
    core.info(`object tags - ${tags}`)
    core.setOutput('object_key', destinationDir)
    core.setOutput('object_tags', tags)
  })
  .catch(err => {
    core.error(err)
    core.setFailed(err.message)
  })
