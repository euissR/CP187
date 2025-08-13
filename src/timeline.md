---
title: Trump 2.0 timeline
toc: false
footer: false
sidebar: false
---

<head>
<link rel="stylesheet" href="./timeline.css">
</head>

<!-- imports -->

```js
import { timeline } from "./timeline.js";
import * as Inputs from "npm:@observablehq/inputs";
```

<!-- data -->

```js
const timelineData = FileAttachment("./data/intro_trump2.csv").csv({
  typed: true,
});
```

```js
const animationDuration = view(
  Inputs.range([100, 10000], {
    label: "Animation Duration (ms)",
    value: 120000 / timelineData.length,
    step: 100,
  })
);
// const animationDuration = 120000 / timelineData.length;
```

<!-- # Trump 2.0 timeline -->

<div class="timeline-container">
${resize((width) => timeline(timelineData, animationDuration, { width }))}
</div>
