import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { CommunicationIdentityClient } from "@azure/communication-identity"
import { ChatClient } from "@azure/communication-chat";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";

const connectionString = process.env.ACS_CONNECTION_STRING; //Replace with your connection string
const endpoint = process.env.ACS_ENDPOINT; //Replace with your endpoint

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    let tokenClient = new CommunicationIdentityClient(connectionString);
    const user = await tokenClient.createUser();
    const userToken = await tokenClient.getToken(user, ["chat"]);

    let chatClient =  new ChatClient(endpoint, new AzureCommunicationTokenCredential(userToken.token))

    const createChatThreadRequest = {
        topic: "Bot Interaction"
    };

    const createChatThreadOptions = {
        participants: [
            {
                id: { communicationUserId: user.communicationUserId },
                displayName: 'Local User'
            },
            {
                id: { communicationUserId: process.env.BOT_USER_ID }, //Replace with your bot user id
                displayName: 'Bot'
            }
        ]
    };

    const createChatThreadResult = await chatClient.createChatThread(
        createChatThreadRequest,
        createChatThreadOptions
    );
    
    const threadId = createChatThreadResult.chatThread.id;

    context.res = {
        body: { user, userToken, threadId}
    };

};

export default httpTrigger;