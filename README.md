# NodeJS Map Spawn Rate Increase

Install the project.

```javascript
npm install
```

For multiplying the spawn rate on a private server.
Only accepts whole number multiplier rates or monster limits.

```javascript
node spawnbuff.js --file="100010000.img.xml" --spawnRate=2
spawnRate_2x_100010000.img.xml created.
The mob limit has increased from 52 to 104 (2.00x)

node spawnbuff.js --file="100010000.img.xml" --mobLimit=120
maxSpawns_120_100010000.img.xml created.
The mob limit has increased from 52 to 120 (2.31x)
```

Analyze mob count and type in map.

```javascript
node readmap.js --file="220010500.img.xml"
[ '3000005', '3110101' ]
The current mob limit is 36.
The current mob list is 3000005,3110101.
```

Strip etc xmls of unused nodes for a specific version. 
Configure exact nodes to strip or preserve at the top of the script. 

```javascript
node etcitem_nodestrip.js --file="0400.img.xml"
stripped_0400.img.xml created.
```