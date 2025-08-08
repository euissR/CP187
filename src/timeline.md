---
title: Trump 2.0 timeline
toc: false
footer: false
sidebar: false
theme: air
---

<head>
<link rel="stylesheet" href="./timeline.css">
</head>

<!-- imports -->
```js
import { timeline } from "./timeline.js" 
```

<!-- data -->
```js
const timelineData = FileAttachment("./data/intro_trump2.csv").csv({ typed: true });
const animationDuration = 500;
// const animationDuration = 7000;
```

# Trump 2.0 timeline

<div class="timeline-container">
${resize((width) => timeline(timelineData, animationDuration, { width }))}
</div>