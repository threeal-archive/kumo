#!/usr/bin/env node

'use strict';

// initialize web server
const express = require('express');
const app = express();

// search public paths
const path = require('path');
const fs = require('fs');

let publicPaths = [ path.join(__dirname, '../public') ];

const amentPaths = process.env.AMENT_PREFIX_PATH.split(':');
amentPaths.forEach((amentPath) => {
  try {
    const pkgsIndexPath = path.join(amentPath, 'share/ament_index/resource_index/packages');
    const pkgs = fs.readdirSync(pkgsIndexPath);
    pkgs.forEach((pkg) => {
      try {
        const pkgPublicPath = path.join(amentPath, 'share', pkg, 'public');
        const pkgPublicStat = fs.statSync(pkgPublicPath);

        if (pkgPublicStat.isDirectory()) {
          publicPaths.push(pkgPublicPath);
        }
      }
      catch {
      }
    });
  }
  catch {
  }
});

// initialize html compiler
const pug = require('pug');

const viewsPath = path.join(__dirname, '../views');
const directoryCompiler = pug.compileFile(path.join(viewsPath, 'directory.pug'));
const notFoundCompiler = pug.compileFile(path.join(viewsPath, 'notfound.pug'));

// handle file serve
app.use((req, res, next) => {
  for (var i in publicPaths) {
    try {
      const requestPath = path.join(publicPaths[i], req.path);
      const requestStat = fs.statSync(requestPath);

      if (requestStat.isDirectory()) {
        const indexPath = path.join(requestPath, 'index.html');
        const indexStat = fs.statSync(indexPath);

        if (indexStat.isFile()) {
          return res.sendFile(indexPath);
        }
      }
      else if (requestStat.isFile()) {
        return res.sendFile(requestPath);
      }
    }
    catch {
    }
  }

  return next();
});

// handle directory view
app.use((req, res, next) => {
  let pathDirs = [];
  let pathFiles = [];

  publicPaths.forEach((sharePath) => {
    try {
      const dirPath = path.join(sharePath, req.path);
      const files = fs.readdirSync(dirPath);
      files.forEach((file) => {
        try {
          const filePath = path.join(dirPath, file);
          const stat = fs.statSync(filePath);

          if (stat.isDirectory() && !pathDirs.includes(file)) {
            pathDirs.push(file);
          }

          if (stat.isFile() && ! pathFiles.includes(file)) {
            pathFiles.push(file);
          }
        }
        catch {
        }
      });
    }
    catch {
    }
  });

  pathDirs.sort((a, b) => {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  });
  pathFiles.sort((a, b) => {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  });

  if (pathDirs.length > 0 || pathFiles.length > 0) {
    console.log('view ' + req.path);
    return res.send(directoryCompiler({
      title: path.basename(req.path),
      prev: path.dirname(req.path),
      path: req.path,
      dirs: pathDirs,
      files: pathFiles
    }));
  }

  return next();
});

// handle unkown path
app.use((req, res, next) => {
  console.log('cannot serve ' + req.path);
  res.send(notFoundCompiler());

  return next();
});

// start the web server
app.listen(8080);
console.log('Webserver started on http://localhost:8080');

// start the ros2 web bridge server
const rosbridge = require('ros2-web-bridge');
rosbridge.createServer();