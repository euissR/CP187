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
import { tariffsEU } from "./tariffseu.js";
import * as Inputs from "npm:@observablehq/inputs";
```

<!-- data -->

```js
const data = FileAttachment("./data/intro_tariffs_eu.csv").csv({
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

<div class="w-full">
  ${resize((width) => tariffsEU(data, { width, animationDuration }))}
</div>
