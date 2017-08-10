# NodeJS Map Spawn Rate Increase

For multiplying the spawn rate on a private server.

Only accepts whole number multiplier rates or monster limits.

```javascript
// Install App
npm install

// Run App
node spawnbuff.js --file="100010000.img.xml" --spawnRate=2
spawnRate_2x_100010000.img.xml created.
The mob limit has increased from 52 to 104 (2.00x)

node spawnbuff.js --file="100010000.img.xml" --mobLimit=120
maxSpawns_120_100010000.img.xml created.
The mob limit has increased from 52 to 120 (2.31x)
```

