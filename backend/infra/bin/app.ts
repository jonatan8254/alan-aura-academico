import { App } from "aws-cdk-lib";
import { DataStack } from "../lib/data-stack";
import { ApiStack } from "../lib/api-stack";

const app = new App();

new DataStack(app, "AlanAuraDataStack");
new ApiStack(app, "AlanAuraApiStack");

app.synth();
