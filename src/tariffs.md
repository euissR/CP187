---
title: Trump 2.0 tariffs
toc: false
footer: false
sidebar: false
---

<head>
<!-- <link rel="stylesheet" href="./tariffs.css"> -->
</head>

<!-- imports -->

```js
import { tariffs } from "./tariffs.js";
import * as Inputs from "npm:@observablehq/inputs";
```

<!-- data -->

```js
const longData = FileAttachment("./data/intro_tariffs_long.csv").csv({
  typed: true,
});
const shortData = FileAttachment("./data/intro_tariffs_short.csv").csv({
  typed: true,
});
```

```js
const animationDuration = 3000;
// const animationDuration = view(
//   Inputs.range([1000, 5000], {
//     label: "Animation Duration (ms)",
//     value: 3000,
//     step: 250,
//   })
// );
```

# US average effective tariff rate

<div class="w-full">
  ${resize((width) => tariffs(longData, shortData, { width, animationDuration }))}
</div>
