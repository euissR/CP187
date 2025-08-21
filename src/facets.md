---
title: Trump 2.0 opinion polls
toc: false
footer: false
sidebar: false
---

```js
import { facets } from "./facets.js";
```

```js
const opEurope = FileAttachment("./data/op_europe.csv").csv();
// const opEurope = FileAttachment("./data/op_europe_facet.geojson").json();
```

<div class="w-full">
    ${resize((width) => facets(opEurope, { width }))}
</div>
