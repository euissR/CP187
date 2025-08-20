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
const opWorld = FileAttachment("./data/op_world.csv").csv();
```

<div class="grid grid-cols-3">
    <div class="col-span-1 col-start-1 ...">
    </div> 
    <div class="col-span-1 col-start-2 ...">
        ${resize((width) => slopeTimer(opWorld, "low", { width }))}
</div>
</div>
