---
title: Trump 2.0 opinion polls
toc: false
footer: false
sidebar: false
---

```js
import { opinion } from "./opinion.js";
```

```js
const opEurope = FileAttachment("./data/op_europe.geojson").json();
const opWorld = FileAttachment("./data/op_world.geojson").json();
const coastlineData = d3.json(
  "https://gisco-services.ec.europa.eu/distribution/v2/coas/geojson/COAS_RG_60M_2016_4326.geojson"
);
```

<div class="w-full">
    ${resize((width) => opinion(opEurope, opWorld, coastlineData, { width }))}
</div>
