# donbosco-db

## Usage

``` js
const setupDatabase = require('donbosco-db')

setupDabase(config).then(db => {
  const { Agent, Metric } = db

}).catch(err => console.error(err))
```
