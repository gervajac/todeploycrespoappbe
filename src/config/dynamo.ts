import dynamoose from "dynamoose";
import dotenv from "dotenv";
dotenv.config();

const dynamodb = new dynamoose.aws.ddb.DynamoDB({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  region: process.env.AWS_REGION!,
});
dynamoose.aws.ddb.set(dynamodb);
export default dynamodb;
