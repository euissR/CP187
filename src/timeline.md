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
import { timeline } from "./timeline.js" 
import * as Inputs from "npm:@observablehq/inputs";
```


<!-- data -->
```js
const timelineData = FileAttachment("./data/intro_trump2.csv").csv({ typed: true });
```

```js
const animationDuration = view(Inputs.range([100, 10000], {
  label: "Animation Duration (ms)",
  value: 5000,
  step: 100
}));
```


<!-- # Trump 2.0 timeline -->

<div class="timeline-container">
${resize((width) => timeline(timelineData, animationDuration, { width }))}
</div>