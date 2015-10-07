#!/usr/bin/env babel-node --optional es7.asyncFunctions

import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import mongoose from 'mongoose';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import {Schema} from './data/schema';

const APP_PORT = 3000;
const GRAPHQL_PORT = 8080;

async () => {
  var results = await (mongoose.connect('mongodb://172.16.1.231/graphql'));
  console.log('mongodb connected');

  // Expose a GraphQL endpoint
  var graphQLServer = express();
  graphQLServer.use('/', graphQLHTTP({schema: Schema, pretty: true}));
  graphQLServer.listen(GRAPHQL_PORT, () => console.log(
    `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
  ));

  // Serve the Relay app
  var compiler = webpack({
    entry: path.resolve(__dirname, 'js', 'app.js'),
    module: {
      loaders: [
        {
          exclude: /node_modules/,
          loader: 'babel',
          query: {stage: 0, plugins: ['./build/babelRelayPlugin']},
          test: /\.js$/,
        },
        {
          test: /\.css$/,
          loader: 'style!css'
        },
        {
          test: /\.scss$/,
          loader: 'style!css!sass'
        },
        {
          test: /\.(png|jpg|gif)$/,
          loader: 'url?limit=25000'
        },
        {
          test: /\.(woff|woff2|svg|ttf|eot)(\?.+)?$/,
          loader: 'url?limit=100000'
        }
      ]
    },
    output: {filename: 'app.js', path: '/'}
  });
  var app = new WebpackDevServer(compiler, {
    contentBase: '/public/',
    proxy: {'/graphql': `http://localhost:${GRAPHQL_PORT}`},
    publicPath: '/js/',
    stats: {colors: true}
  });
  // Serve static resources
  app.use('/', express.static(path.resolve(__dirname, 'public')));
  app.listen(APP_PORT, () => {
    console.log(`App is now running on http://localhost:${APP_PORT}`);
  });
}();
