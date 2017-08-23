# ts-pull-stream

Minimal Pipeable Pull-stream

In
[classic-streams](https://github.com/nodejs/node-v0.x-archive/blob/v0.8/doc/api/stream.markdown),
streams _push_ data to the next stream in the pipeline. In
[new-streams](https://github.com/nodejs/node-v0.x-archive/blob/v0.10/doc/api/stream.markdown),
data is pulled out of the source stream, into the destination.  `pull-stream`
is a minimal take on streams, pull streams work great for "object" streams as
well as streams of raw text or binary data.

[![build status](https://secure.travis-ci.org/escapace/ts-pull-stream.png)](https://travis-ci.org/escapace/ts-pull-stream)

## Quick Example

Stat some files:

```js
pull(
  pull.values(['file1', 'file2', 'file3']),
  pull.asyncMap(fs.stat),
  pull.collect(function (err, array) {
    console.log(array)
  })
)
```

## License

This program is free software: you can redistribute it and/or modify it under
the terms of the Mozilla Public License, version 2.0.

This program uses third-party libraries or other resources that may be
distributed under different licenses. Please refer to the specific files and/or
packages for more detailed information about the authors, copyright notices,
and licenses.

## Acknowledgements

We are very grateful to the following people and projects for their
contributions to this product:

* [pull-stream](https://github.com/pull-stream/pull-stream) minimal pipeable pull-stream ([Dominic Tarr](https://github.com/dominictarr))
