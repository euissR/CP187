---
title: Trump 2.0 opinion polls
toc: false
footer: false
sidebar: false
---

```js
import { maps } from "./maps.js";
// import * as d3 from "npm:d3";
```

```js
// const opEurope = FileAttachment("./data/op_europe.csv").csv();
const opEurope = FileAttachment("./data/op_europe_facet.geojson").json();
const opCoast = FileAttachment("./data/op_coast.geojson").json();
```

<div class="grid grid-cols-3">
    <div class="col-span-1 col-start-1 ...">
    </div> 
    <div class="col-span-1 col-start-2 ...">
    ${resize((width) => maps(opEurope, opCoast, { width }))}
</div>
</div>
