const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient();
const TableName = "CrespoApp-Calle";

export async function getByPkShort(partitionKey, sortKey) {
    const params = {
        TableName,
        KeyConditionExpression:
            "#partitionKey = :partitionKey AND #sortKey = :sortKey",
        ExpressionAttributeNames: {
            "#partitionKey": "entidad",
            "#sortKey": "id",
        },
        ExpressionAttributeValues: {
            ":partitionKey": partitionKey,
            ":sortKey": sortKey,
        },
    };

    try {
        const result = await docClient.query(params).promise();
        return result.Items;
    } catch (error) {
        console.error("Error al listar elementos:", error);
        throw error;
    }
}
