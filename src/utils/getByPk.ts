const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient();
const TableName = "Usuario222";

export async function listTable(pk, keys) {
  const params = {
    TableName,
    KeyConditionExpression: "#partitionKey = :partitionKey",
    ExpressionAttributeNames: {
      "#partitionKey": "entidad",
    },
    ExpressionAttributeValues: {
      ":partitionKey": pk,
    },
    ProjectionExpression: keys,
  };

  try {
    const result = await docClient.query(params).promise();
    return result.Items;
  } catch (error) {
    console.error("Error al listar elementos:", error);
    throw error;
  }
}
