# Labeling Tool

_Author: Dennis Loska, 21.02.2021_

## Demo

You can find a running demo of this application here:

https://labeling-tool.dennisloska.com/

The source code for this application is also available on my Github:

https://github.com/DennisLoska/ReactLabelingTool
## Setup

You can use this tool to label your JSON datasets.

![Labeling Tool Preview](labeling_tool.png)

Simply put your JSON file in **server/data** and name it **dataset.json** and then change the configuration file in the frontend to map your label and your data fields.

Here is an example of the expected format for the dataset:

```json
[
    {
        "message": "I am a spam message",
        "label": "spam"
    },
    {
        "message": "I am an important message",
        "label": "valid"
    }
]
```

In the configuration file of the frontend you need to add the fields **message** and **label** (in case of the example) to the config file and also list all the labels you plan to use. Here is an example:

```js
{
  labels: ['spam', 'valid'],
  label: 'label',
  value: 'message'
}
```

That's it! now you can start labeling after a few quick commands. First install all dependecies:

```s
npm install
```

Now build the project:

```s
npm run build
```

And to start the application just run:

```s
npm start
```

If you want to run the setup in a docker container make sure to set appropriate file permissions on your host system to be able to save the changes on your data for example:

```s
sudo chmod 777 -R src/
```

Now you can go to **http://localhost:5000** and start labeling your data!
