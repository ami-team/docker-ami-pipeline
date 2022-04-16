#!/bin/bash

########################################################################################################################

sed -i "s/\/\/\s*theme\s*:.*$/page: {css: \"\/usr\/src\/node-red\/node_modules\/node-red-contrib-ami\/style\/ami.css\"}, header: {image: \"\/usr\/src\/node-red\/node_modules\/node-red-contrib-ami\/style\/ami.png\", title: 'pipeline'},/g" /data/settings.js

sed -i "s/\/\/\s*categories\s*:\s*\[/categories: ['AMI', /g" /data/settings.js

########################################################################################################################

if [ ! -f /data/flows.json ]
then
  UUID=$(node -e 'console.log(require("crypto").randomUUID());')

  cat > /data/flows.json << EOF
[
    {
        "id": "7ba8d1fbe3577553",
        "type": "tab",
        "label": "AMI Supervisor",
        "disabled": false,
        "info": "",
        "env": []
    },
    {
        "id": "9f7511e86e72a8f9",
        "type": "supervisor",
        "z": "7ba8d1fbe3577553",
        "name": "",
        "topic": "${UUID}",
        "x": 370,
        "y": 120,
        "wires": [
            [
                "247c7b8f7530815a"
            ]
        ]
    },
    {
        "id": "bc9bcef5f75eb068",
        "type": "mqtt in",
        "z": "7ba8d1fbe3577553",
        "name": "",
        "topic": "ami/taskserver/task",
        "qos": "2",
        "datatype": "auto",
        "broker": "",
        "nl": false,
        "rap": true,
        "rh": 0,
        "inputs": 0,
        "x": 130,
        "y": 120,
        "wires": [
            [
                "9f7511e86e72a8f9"
            ]
        ]
    },
    {
        "id": "a8b583288f8ed783",
        "type": "mqtt in",
        "z": "7ba8d1fbe3577553",
        "name": "topic",
        "topic": "${UUID}",
        "qos": "2",
        "datatype": "auto",
        "broker": "",
        "nl": false,
        "rap": true,
        "rh": 0,
        "inputs": 0,
        "x": 90,
        "y": 190,
        "wires": [
            [
                "9f7511e86e72a8f9"
            ]
        ]
    },
    {
        "id": "cca4959c8ad7dc37",
        "type": "comment",
        "z": "7ba8d1fbe3577553",
        "name": "AMI Supervisor",
        "info": "",
        "x": 120,
        "y": 40,
        "wires": []
    },
    {
        "id": "247c7b8f7530815a",
        "type": "mqtt out",
        "z": "7ba8d1fbe3577553",
        "name": "ami/<server_name>/command/json",
        "topic": "",
        "qos": "",
        "retain": "",
        "respTopic": "",
        "contentType": "",
        "userProps": "",
        "correl": "",
        "expiry": "",
        "broker": "",
        "x": 660,
        "y": 120,
        "wires": []
    }
]
EOF
fi

########################################################################################################################

npm --no-update-notifier --no-fund start --cache /data/.npm -- --userDir /data

########################################################################################################################
