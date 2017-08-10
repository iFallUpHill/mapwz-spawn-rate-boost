# NodeJS Map Spawn Rate Increase

For multiplying the spawn rate on a private server.

Only accepts whole number multiplier rates or monster limits.

```javascript
// Install App
npm install
// Run App
node spawnbuff.js --file="100010000.img.xml" --spawnRate=2
//  Outputs to a new XML with an 2x mob limit
//  >>> spawnRate_2x_100010000.img.xml 
node spawnbuff.js --file="100010000.img.xml" --mobLimit=2
//  Outputs to a new XML with an a mob limit of 105
//  >>> maxSpawns_105_100010000.img.xml 
```

