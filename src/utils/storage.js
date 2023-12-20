const aws = require('aws-sdk')

const endpoint = new aws.Endpoint(process.env.ENDPOINT_S3)

const s3 = new aws.S3({
  endpoint,
  credentials: {
    accessKeyId: process.env.KEY_ID,
    secretAccessKey: process.env.APP_KEY,
  },
})

const Bucket = process.env.BACKBLAZE_BUCKET

const uploadFile = async (path, buffer, mimetype) => {
  const file = await s3
    .upload({
      Bucket,
      Key: path,
      Body: buffer,
      ContentType: mimetype,
    })
    .promise()

  return {
    url: file.Location,
    path: file.Key,
  }
}

async function deleteImage(path) {
  await s3
    .deleteObject({
      Bucket,
      Key: path,
    })
    .promise()
}

module.exports = {
  uploadFile,
  deleteImage,
}
