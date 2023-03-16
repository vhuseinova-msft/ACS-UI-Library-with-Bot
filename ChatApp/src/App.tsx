import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import {
  AzureCommunicationTokenCredential,
  CommunicationUserIdentifier,
} from "@azure/communication-common";
import {
  ChatComposite,
  MessageProps,
  MessageRenderer,
  useAzureCommunicationChatAdapter,
  fromFlatCommunicationIdentifier,
} from "@azure/communication-react";
import { AdaptiveCard } from "adaptivecards-react";
import { Action } from "adaptivecards";

interface UserObject {
  userId: CommunicationUserIdentifier;
  credential: AzureCommunicationTokenCredential;
}
function App() {
  const [user, setUser] = useState<UserObject>();
  const [threadId, setThreadId] = useState("");
  const endpoint = ""; //Replace with your endpoint

  useEffect(() => {
    // Response returned by Chat Function
    const tmpConf: any = {
      user: {
        communicationUserId: "", // Replace with a user id for the user in a chat thread with adaptive cards bot
      },
      userToken: {
        token: "", // Replace with ACS token
        expiresOn: "", // Can be skipped, the field is returned in Chat Function response
      },
      threadId: "", // Replace with a thread id with the user and the bot
    };

    setUser({
      userId: fromFlatCommunicationIdentifier(
        tmpConf.user.communicationUserId
      ) as CommunicationUserIdentifier,
      credential: new AzureCommunicationTokenCredential(
        tmpConf.userToken.token
      ),
    });
    setThreadId(tmpConf.threadId);
  }, []);

  const credential = useMemo(() => {
    try {
      return user?.credential;
    } catch {
      console.error("Failed to construct token credential");
      return undefined;
    }
  }, [user]);

  const adapter = useAzureCommunicationChatAdapter({
    endpoint,
    userId: user?.userId,
    displayName: "Local User",
    credential,
    threadId,
  });

  const onRenderMessage = (
    messageProps: MessageProps,
    defaultOnRender?: MessageRenderer
  ): JSX.Element => {
    if (
      messageProps.message.messageType === "chat" &&
      // messageProps.message.metadata &&
      messageProps.message.content
    ) {
      try {
        // for (const [key, value] of Object.entries(
        //   messageProps.message.metadata
        // )) {
        // check if message is sent form a bot
        // if (value === "azurebotservice.adaptivecard") {
        let hostConfig = {
          fontFamily: "Times New Roman",
        };

        let adaptiveCard = JSON.parse(messageProps.message.content);
        let cardContent = adaptiveCard.attachments[0].content;

        return (
          <AdaptiveCard
            payload={cardContent}
            hostConfig={hostConfig}
            onExecuteAction={(action: Action) =>
              console.log("onExecuteAction " + action)
            }
            // onActionOpenUrl={(action: Action) =>
            //   console.log("onActionOpenUrl" + action)
            // }
            onActionShowCard={(action: Action) =>
              console.log("onActionShowCard" + action)
            }
            onError={(error: any) => console.log("onError", error)}
          />
        );
        // }
        // }
      } catch (error) {
        console.log("try/catch error", messageProps.message.content);
        return defaultOnRender ? defaultOnRender(messageProps) : <></>;
      }
    }

    return defaultOnRender ? defaultOnRender(messageProps) : <></>;
  };

  if (adapter) {
    return (
      <div style={{ height: "90vh", width: "90vw" }}>
        <ChatComposite adapter={adapter} onRenderMessage={onRenderMessage} />
      </div>
    );
  }

  if (credential === undefined) {
    return <>Failed to construct credential. Provided token is malformed.</>;
  }

  return <>Initializing...</>;
}

export default App;
