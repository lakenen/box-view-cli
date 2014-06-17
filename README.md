# Box View API CLI

A CLI for the [Box View API](http://developers.box.com/view/)

## WARNING

**This CLI is meant as a convenience tool for development. It is _not_ intended for production use. You will probably be rate-limited if you try!**


## Installation

```
npm install -g box-view-cli
```


## Usage

```
  Usage: box-view [options] [command]

  Commands:

    help [command]         output usage information
    upload [options]       upload a document to the View API
    session [options]      create a viewing session on the View API
    boom [options]         upload a document and create a session all in one fancy command

  Options:

    -h, --help           output usage information
    -v, --version        output the version number
    -t, --token [token]  Box View API Token (default: $BOX_VIEW_API_TOKEN)
```

### Upload

```
  Usage: upload [options]

  Options:

    -h, --help            output usage information
    -u, --url [url]       specify document by URL
    -f, --file [file]     specify document by filename
    -n, --name [name]     the name of the document
    --thumbnails [sizes]  request thumbnails (format: comma-separated {width}x{height})
    --non-svg             request non-svg version
```

### Session

```
  Usage: session [options]

  Options:

    -h, --help                 output usage information
    -i, --document-id [id]     the document ID
    -d, --duration [duration]  the duration (in minutes) of the session
    -e, --expires [expires]    the timestamp at which this session should expire
    -D, --downloadable         allow downloads
    -o, --open                 open the viewing session URL on success
```

### Boom

Boom is a combination of the upload and session commands, which takes (almost) all the arguments of each. It's magical. Be careful.

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.

## License

([The MIT License](LICENSE))

Copyright 2014 Cameron Lakenen
