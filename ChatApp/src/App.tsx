import React, { useEffect, useMemo, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {ChatComposite, MessageProps, MessageRenderer, useAzureCommunicationChatAdapter} from '@azure/communication-react';
import { AdaptiveCard } from "adaptivecards-react";

interface UserObject {
  userId: CommunicationUserIdentifier,
  credential: AzureCommunicationTokenCredential,
}

function App() {

  const [user, setUser] = useState<UserObject>();
  const [threadId, setThreadId] = useState();
  const endpoint = process.env.REACT_APP_ENDPOINT; //Replace with your endpoint

  useEffect(() => {
    if(process.env.REACT_APP_FUNCTION_URL) {
      fetch(process.env.REACT_APP_FUNCTION_URL)
      .then(response => response.json())
      .then(data => {
        setUser({
          userId: data.user, 
          credential: new AzureCommunicationTokenCredential(data.userToken.token)
        })
        setThreadId(data.threadId)
      });
    }
  },[])

  const credential = useMemo(() => {
    try {
      return user?.credential;
    } catch {
      console.error('Failed to construct token credential');
      return undefined;
    }
  }, [user]);

  const userId = useMemo(() => {
    try {
      return user?.userId;
    } catch {
      console.error('Failed to construct token credential');
      return undefined;
    }
  }, [user])

  const adapter = useAzureCommunicationChatAdapter({
    endpoint,
    userId: user?.userId,
    displayName: "Local User",
    credential,
    threadId
  });

  const onRenderMessage = (messageProps: MessageProps, defaultOnRender?: MessageRenderer): JSX.Element => {

    if (messageProps.message.messageType === 'chat' && messageProps.message.metadata && messageProps.message.content) {
      for (const [key, value] of Object.entries(messageProps.message.metadata))
      {
        if(value === "azurebotservice.adaptivecard") {
          let hostConfig = {
            fontFamily: "Segoe UI, Helvetica Neue, sans-serif"
          };
          let card = JSON.parse(messageProps.message.content).attachments[0].content
          return <AdaptiveCard payload={card} hostConfig={hostConfig} />
        }
      }
    }

    return defaultOnRender ? defaultOnRender(messageProps) : <></>;
  };

  if (adapter) {
    return (
      <div style={{ height: '90vh', width: '90vw' }}>
        <ChatComposite
          adapter={adapter}
          onRenderMessage={onRenderMessage}
        />
      </div>
    );
  }

  if (credential === undefined) {
    return <>Failed to construct credential. Provided token is malformed.</>;
  }

  return <>Initializing...</>;
}

export default App;
