const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {

    let body;
    let statusCode = '200';
    
    const headers = {
        'Content-Type': 'application/json',
    };

    const params = {
        TableName: "tickets",
        Key: {
            "partition": "a"
        },
        UpdateExpression: "SET hand_crafted_int = if_not_exists(hand_crafted_int, :start) + :inc",

        ExpressionAttributeValues: {
            ":inc": 1,
            ":start": 0,
        },
        ReturnValues: "UPDATED_NEW"
    };

    try {
        switch (event.httpMethod) {
            case "GET":
                body = await dynamo.update(params)
                .promise()
                break;
            default:
                throw new Error(`Unsupported method "${event.httpMethod}"`);
        }
    } catch (err) {
        statusCode = '400';
        body = err.message;
    } finally {
        if (Object.keys(body).length === 0) {
            statusCode = '404';
            body = `Item matching "${event.pathParameters.proxy}" not found`;
        } 
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers,
    };
};