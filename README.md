# Upload to an AWS S3 bucket

This GitHub action uploads a directory to an AWS S3 bucket.

## Usage

Add a `workflow.yml` file to `.github/workflows`. [Refer to the documentation on workflow YAML syntax here.](https://help.github.com/en/articles/workflow-syntax-for-github-actions)

```yaml
name: Uploads a directory to AWS S3 bucket

on:
  workflow_dispatch:
  pull_request:
    branches:
      - main

jobs:
  upload:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@main
      - uses: andrew-mclachlan/upload-s3-action@v1
        with:
          aws_access_key: ${{ secrets.AWS_ACCESS_KEY }}
          aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY}}
          aws_region: ${{ secrets.AWS_REGION }}
          aws_s3_bucket: ${{ secrets.AWS_S3_BUCKET }}
          source_dir: 'dirname'
```

## Action inputs

The following settings must be supplied to the action:

| Name                    | Description                                                                                                                                                                                               |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `aws_access_key`        | (Required) Your AWS access key. [More info here.](https://docs.aws.amazon.com/general/latest/gr/managing-aws-access-keys.html)                                                                            |
| `aws_secret_access_key` | (Required) Your AWS secret access key. [More info here.](https://docs.aws.amazon.com/general/latest/gr/managing-aws-access-keys.html)                                                                     |
| `aws_region`            | (Required) AWS region where the AWS S3 bucket resides.                                                                                                                                                    |
| `aws_s3_bucket`         | (Required) Name of the AWS S3 bucket to upload to.                                                                                                                                                        |
| `source_dir`            | (Required) Local directory (or file) to upload to the AWS S3 bucket.                                                                                                                                      |
| `destination_dir`       | (Optional) Destination directory in the AWS S3 bucket. If this field is excluded, then a unique identifier for the directory is used. Note: setting this field to `''` will upload to the root directory. |

## Action outputs

| name         | description                                    |
| ------------ | ---------------------------------------------- |
| `object_key` | Uploaded object key in the AWS S3 bucket.      |
| `location`   | Uploaded object location in the AWS S3 bucket. |
