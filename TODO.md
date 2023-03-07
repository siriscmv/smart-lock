# TODO

## pi

- Set env vars
- Ensure "lock" actually locks and not the other way around
- Figure out circuit

## server

- Create a WS server that acccepts connections from both pi and web
- Web
  - Common -> Login (owner, driver)
  - Owner -> create driver, add driver-vehicle association, live log of actions taken
  - Driver -> Send request to unlock
- Pi -> Send request to lock/unlock
- Must generate unique keys for temporary authentication, this key must be validated on all requests coming from owner & server

## web

- Implement live log + btns to create user etc on owner dashbaord
