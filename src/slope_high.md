---
title: Trump 2.0 opinion polls
toc: false
footer: false
sidebar: false
---

```js
import { slope } from "./slope.js";
```

```js
// const opEurope = FileAttachment("./data/op_europe.csv").csv();
const opEurope = FileAttachment("./data/op_world.csv").csv();
```

<div class="w-full">
    ${resize((width) => slope(opEurope, "high", { width }))}
</div>
