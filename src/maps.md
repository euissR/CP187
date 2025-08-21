---
title: Trump 2.0 opinion polls
toc: false
footer: false
sidebar: false
---

```js
import { maps } from "./maps.js";
import { slopeTimer } from "./slopeTimer.js";
```

```js
// const opEurope = FileAttachment("./data/op_europe.csv").csv();
const opEurope = FileAttachment("./data/op_europe_facet.geojson").json();
const opCoast = FileAttachment("./data/op_coast.geojson").json();
// for slope
const opWorld = FileAttachment("./data/op_world.csv").csv();
```

<div class="grid grid-cols-3">
    <div class="grid-colspan-2">
        ${resize((width) => maps(opEurope, opCoast, { width }))}
    </div>
    <div class="...">
        ${resize((width) => slopeTimer(opWorld, "high", { width }))}
    </div>
</div>
