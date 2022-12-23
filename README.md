# Bot-UI-Sample

## Chat Function 

Go into directory

``` bash

cd Chat Function

```

Insert connection String and endpoint

`index.ts`

```ts

const connectionString = 'HEEEEEEEEEERRRRRRRRRREEEEEEEEEE'
const endpoint = "HEEEEEEEEEERRRRRRRRRREEEEEEEEEE"

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

Insert endpoint

`App.tsx`

```ts

  const endpoint = "HEEEEEERRRRREEEEEEEEE";

```

Insert function URL

`App.tsx`

```ts

  useEffect(() => {
    fetch("HEEEEERRRREEEEE")
    .then(response => response.json())
    .then(data => {
      setUser({
        userId: data.user, 
        credential: new AzureCommunicationTokenCredential(data.userToken.token)
      })
      setThreadId(data.threadId)
    });
  },[])

```

Run

``` bash

npm run start

```
