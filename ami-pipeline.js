#!/usr/bin/env node
/*--------------------------------------------------------------------------------------------------------------------*/

import fs from 'fs';
import url from 'url';
import path from 'path';
import env from 'process';

/*--------------------------------------------------------------------------------------------------------------------*/

import http from 'http';
import https from 'https';
import express from 'express';
import nodeRed from 'node-red';

/*--------------------------------------------------------------------------------------------------------------------*/
/* CONSTANTS                                                                                                          */
/*--------------------------------------------------------------------------------------------------------------------*/

const DIR_PATH = path.dirname(url.fileURLToPath(import.meta.url));

/*--------------------------------------------------------------------------------------------------------------------*/

console.log(`NODE_RED_CREDENTIAL_SECRET: ${env.NODE_RED_CREDENTIAL_SECRET}`);

const NODE_RED_SETTINGS = {
    uiPort: 1880,
    uiHost: '0.0.0.0',
    httpNodeRoot: '/api',
    httpAdminRoot: '/',
    credentialSecret: env.NODE_RED_CREDENTIAL_SECRET || null,
    userDir: path.join(DIR_PATH, 'data', 'node-red'),
    flowFile: 'flows.json',
    flowFilePretty: true,
    editorTheme: {
        page: {
            css: path.join(DIR_PATH, 'node_modules', 'node-red-contrib-ami', 'style', 'ami.css'),
        },
        header: {
            title: 'pipeline',
            image: path.join(DIR_PATH, 'node_modules', 'node-red-contrib-ami', 'style', 'logo.png'),
        },
        login: {
            image: path.join(DIR_PATH, 'node_modules', 'node-red-contrib-ami', 'style', 'login.png'),
        },
        palette: {
            categories: ['AMI', 'subflows', 'common', 'function', 'network', 'sequence', 'parser', 'storage'],
        },
    },
};

console.log(`NODE_RED_SETTINGS.credentialSecret: ${NODE_RED_SETTINGS.credentialSecret}`);

/*--------------------------------------------------------------------------------------------------------------------*/
/* APPLICATION                                                                                                        */
/*--------------------------------------------------------------------------------------------------------------------*/

const app = express();

/*--------------------------------------------------------------------------------------------------------------------*/

let httpsServer;

if(env.NODE_RED_SECURED === 'TRUE' || env.NODE_RED_SECURED === 'true')
{
    /*----------------------------------------------------------------------------------------------------------------*/

    const HTTPS_SETTINGS = {};

    const KEY_PATH = path.join(DIR_PATH, 'data', 'key.pem');
    const CERT_PATH = path.join(DIR_PATH, 'data', 'cert.pem');

    /*----------------------------------------------------------------------------------------------------------------*/

    try
    {
        HTTPS_SETTINGS['key'] = fs.readFileSync(KEY_PATH, 'utf8');
    }
    catch(e)
    {
        console.error(`Error opening "${KEY_PATH}"`);

        process.exit(1);
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    try
    {
        HTTPS_SETTINGS['cert'] = fs.readFileSync(CERT_PATH, 'utf8');
    }
    catch(e)
    {
        console.error(`Error opening "${CERT_PATH}"`);

        process.exit(1);
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    httpsServer = https.createServer(HTTPS_SETTINGS, app);

    /*----------------------------------------------------------------------------------------------------------------*/
}
else
{
    /*----------------------------------------------------------------------------------------------------------------*/

    httpsServer = http.createServer(app);

    /*----------------------------------------------------------------------------------------------------------------*/
}

/*--------------------------------------------------------------------------------------------------------------------*/
/* NOD-RED                                                                                                            */
/*--------------------------------------------------------------------------------------------------------------------*/

nodeRed.init(httpsServer, NODE_RED_SETTINGS);

/*--------------------------------------------------------------------------------------------------------------------*/
/* ROUTES                                                                                                             */
/*--------------------------------------------------------------------------------------------------------------------*/

app.use(NODE_RED_SETTINGS.httpAdminRoot, nodeRed.httpAdmin);

app.use(NODE_RED_SETTINGS.httpNodeRoot, nodeRed.httpNode);

/*--------------------------------------------------------------------------------------------------------------------*/
/* LOOP                                                                                                               */
/*--------------------------------------------------------------------------------------------------------------------*/

httpsServer.listen(1880);

/*--------------------------------------------------------------------------------------------------------------------*/

nodeRed.start().catch((e) => {

    console.log(`Error starting frontend: ${e}`);

    process.exit(1);
});

/*--------------------------------------------------------------------------------------------------------------------*/
