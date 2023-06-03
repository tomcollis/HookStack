![PPHook](https://github.com/tomcollis/PPHook/blob/main/img/PPHook-Banner.png?raw=true)

# PPHook = **P**(ush)**P**(ull)(Web)**Hook**
[![Buy me coffee](https://img.shields.io/badge/Buy%20me%20-coffee!-orange.svg?logo=buy-me-a-coffee&color=795548)](https://paypal.me/TomCollisUK/2)
[![GitHub stars](https://img.shields.io/github/stars/tomcollis/PPHook)](https://github.com/tomcollis/PPHook/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/tomcollis/PPHook)](https://github.com/tomcollis/PPHook/issues)
[![Github All Releases download count](https://img.shields.io/github/downloads/tomcollis/PPHook/total.svg?style=flat)](https://github.com/tomcollis/PPHook/releases/latest)
[![GitHub latest release version](https://img.shields.io/github/v/release/tomcollis/PPHook.svg?style=flat)](https://github.com/tomcollis/PPHook/releases/latest)

[![Deploy](https://button.deta.dev/1/svg)](https://go.deta.dev/deploy)

This app/service was created because I wanted to use webhooks with self-hosted apps and did not want the requirements of installing agents, opening firewall ports or needing a static IP and having the system be available 24/7 to ensure no webhooks are missed. There are many services (free and chargeable) that provide a webhook relay service, but the ones I looked at just relayed the information to another webhook, which did not solve my problem.

This service allows webhooks to be **Pushed** (submitted) and saved, and then **Pulled** (retrieved) at any time in the future. The webhooks can be tagged with a source system identifier (source-id), and then downloaded by source system, this allows different processes or tools to download the webhooks from specific systems.

This service can also be used with some cloud hosted automation services that do not allow webhooks but do allow scheduled get requests (e.g., Microsoft Power Automate).

___
## Environment Variables

To run this code, you will need to provide following environment variables, you will be prompted automatically when using Deploy to [Deta](https://www.deta.sh/).

`DETA_PROJECT_KEY` - automatically populate when deployed to [Deta Micro](https://www.deta.sh/) or [Deta Space](https://deta.space/)

`API_KEY` - can be generated at [keycdn Tools](https://tools.keycdn.com/sha256-online-generator)

___
## Deploy to [Deta](https://www.deta.sh/)

To deploy this project on Deta, click the button below:

[![Deploy](https://button.deta.dev/1/svg)](https://go.deta.dev/deploy)

You will automatically be prompted to enter the required environment variables.
All data will be private in your own account.

___
## API Reference

#### Post Webhook

```http
  POST /p
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `source` | `string` | **Optional but Recommended**. Source System Key, can be anything you want or left blank .|

All data is stored in your [Deta](https://www.deta.sh/) account in a [Deta](https://www.deta.sh/) Base called 'PPHook'. This means your data is not available for me or anyone else to see, but do not forget it is only protected by your API key. Your API Key is not required to post data.

###### Example

```http
  POST /p?source=system-name
  BODY {
        "value1": "a-to-z",
        "value2": "1-to-9",
        "value3": "500"
        }
```

The BODY data can be in any format, with as many or as few fields as you want. The service will reply in the following format.

```http
  RESPONSE 200
  BODY {
          "success": "data received",
          "key": 1628781752490,
          "body": {
            "value1": "a-to-z",
            "value2": "1-to-9",
            "value3": "500"
          },
          "source": "system-2"
        }
```
This response is what is stored in the [Deta](https://www.deta.sh/) Base:

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `key`     | `string` | This is automatically generated with a UNIX Timestamp. |
| `body`    | `JSON`   | This is the body of your POST, no validation or modification is performed. |
| `source`  | `string` | This is the key used to collate the webhooks that are stored. If this field is left blank (not recommended) when posting, it will be modified to 'unknown'. |

___

#### Get items for source system by id

```http
  GET /webhooks/$source
```
This will return all webhooks from the system with a matching source key and delete all corresponding results from the [Deta](https://www.deta.sh/) Base by design to minimise the length of time your data is stored online.

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api-key` | `string` | **Required**. Your API key |

###### Example Response

```http
  GET /webhooks/system-2?api-key=verysecure
  BODY
  {
      "items": [
          {
              "body": {
                  "value1": "a-to-z",
                  "value2": "1-to-9",
                  "value3": "500"
              },
              "key": "1628782459290",
              "source": "system2"
          },
          {
              "body": {
                  "value1": "a-to-z",
                  "value2": "1-to-9",
                  "value3": "500"
              },
              "key": "1628782460100",
              "source": "system2"
          }
      ]
  }
```

The webhooks received are returned in an array called 'items', this means they can be processed through another application.

#### Get items for source system unknown

```http
  GET /webhooks
```
This will retrieve all webhooks posted without a source key, it will also delete all corresponding results from the database by design.

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api-key` | `string` | **Required**. Your API key |

The responses are the same as the above request with the included system-id.

___
## Feedback

If you have any feedback, you can:

[![](https://img.shields.io/static/v1?label=Message%20on&message=Telegram&color=27A7E7&logo=telegram&style=for-the-badge)](https://t.me/tomcollis)

or

[![](https://img.shields.io/static/v1?label=Create%20New&message=Issue&color=4EC820&logo=github&style=for-the-badge)](https://github.com/tomcollis/PPHook/issues)

___
## Acknowledgements
 - This was a sample app, used as my starting point. [ExpressJS Example - Simple Web API](https://github.com/expressjs/express/blob/28db2c2c5cf992c897d1fbbc6b119ee02fe32ab1/examples/web-service/index.js)
