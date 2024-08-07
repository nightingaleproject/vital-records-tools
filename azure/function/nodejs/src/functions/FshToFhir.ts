import { app, HttpFunctionOptions, HttpRequest, HttpResponse, HttpResponseInit, InvocationContext } from "@azure/functions";
import { sushiClient } from "fsh-sushi";

const Handler = async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    context.log(`Http function processed request for url "${request.url}"`);

    const fhir = await sushiClient.fshToFhir((await request.json())["fsh"], {
        dependencies:[
            {
                packageId: "hl7.fhir.us.vrdr",
                version: "2.2.0"
            },
            {
                packageId: "hl7.fhir.us.core",
                version: "current"
            }
        ]
    })

    const response: HttpResponseInit = {
        status: 200,
        jsonBody: fhir
    };
    return response
}

app.http('FshToFhir', <HttpFunctionOptions>{
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: Handler
});
