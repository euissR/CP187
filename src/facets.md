---
title: Trump 2.0 opinion polls
toc: false
footer: false
sidebar: false
---

```js
import { maps } from "./maps.js";
```

```js
// const opEurope = FileAttachment("./data/op_europe.csv").csv();
const opEurope = FileAttachment("./data/op_europe_facet.geojson").json();
// const opCoast = FileAttachment("./data/op_coast.geojson").json();
```

<div class="grid grid-cols-4">
  <div class="gird-colspan-1"></div>
  <div class="grid-colspan-2">
        ${resize((width) => maps(opEurope, { width }))}
    </div>
</div>
