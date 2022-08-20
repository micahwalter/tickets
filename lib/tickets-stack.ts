import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';

export class TicketsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // dynamodb table for tickets
    const ticketsTable = new dynamodb.Table(this, 'TicketsTable', {
      partitionKey: { name: 'partition', type: dynamodb.AttributeType.STRING },
      tableName: "tickets",
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    // lambda function that creates a new ticket
    const ticketsFunction = new lambda.Function(this, 'TicketsFunction', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'tickets.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../src/tickets')),
    });

    // grant lambda permission to read/write to the dynamodb table
    ticketsTable.grantReadWriteData(ticketsFunction);

    // enable anonymous lambda function URL
    const fnUrl = ticketsFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });
    
  }
}
