# Version 0.1.0 (18/06/2020)

## Alfi Maulana

- Use `express` as a web server
  - serve files under the `public` directory in this package
    and other ROS 2 package's share directory.
  - serve directory viewer page if the directory does not contains `index.html`.
  - serve not found page if the path is invalid.
  - serve `css`'s and `js`'s that would be used by the client.
- Use `ros2-web-bridge` as a web socket server.
  - the web socket server will be used to bridge connection between web client and the ROS2 Nodes.