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
const opWorldParse = FileAttachment("./data/op_world.csv").csv();
```

```js
// console.log("opWorldParse", opWorldParse);
const opWorld = opWorldParse
  .map((d) => ({
    ...d,
    diff: d.diff === "NA" ? null : +d.diff,
    value: +d.value,
    year: +d.year,
  }))
  .filter((d) => d.EU_STAT === "T");
```

```js
console.log("opWorld", opWorld);
```

<div class="grid grid-cols-4">
  <div class="grid-colspan-1"></div>
  <div class="grid-colspan-2">
        ${resize((width) => slope(opWorld, 
        "Selected countries worldwide, 2024-2025", { width }))}
    </div>
</div>
