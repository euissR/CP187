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

<div class="w-full">
    ${resize((width) => maps(opEurope, opCoast, { width }))}
</div>
