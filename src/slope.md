---
title: Trump 2.0 opinion polls
toc: false
footer: false
sidebar: false
---

```js
import { slopeTimer } from "./slopeTimer.js";
```

```js
// const opEurope = FileAttachment("./data/op_europe.csv").csv();
const opEurope = FileAttachment("./data/op_world.csv").csv();
```

<div class="w-full">
    ${resize((width) => slopeTimer(opEurope, "low", { width }))}
</div>
