---
title: Trump 2.0 opinion polls
toc: false
footer: false
sidebar: false
---

```js
import { slopeTimer2 } from "./slopeTimer2.js";
```

```js
const opWorld = FileAttachment("./data/op_world.csv").csv();
```

<div class="grid grid-cols-4">
  <div class="grid-colspan-1"></div>
  <div class="grid-colspan-2">
        ${resize((width) => slopeTimer2(opWorld, "high", { width }))}
    </div>
</div>
