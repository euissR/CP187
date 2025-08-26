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

<div class="fullscreen-container">
    <div class="centered-content">
        ${resize((width) => slopeTimer2(opWorld, "high", { width }))}
    </div>
</div>
