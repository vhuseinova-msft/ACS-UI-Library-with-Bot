# Bot-UI-Sample

## Chat Function 

Go into directory

``` bash

cd Chat Function

```

Insert connection String and endpoint

`index.ts`

```ts

const connectionString = ''
const endpoint = ""

```

Run with `F5`

## Chat App

Go into directory

``` bash

cd Chat App/chatapp

```

Install dependencies

``` bash

npm i

```

Insert auth data

`App.tsx`

```ts

  const endpoint = ""; //Replace with your endpoint
  
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

```

Run

``` bash

npm run start

```
