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

    help [options]         output usage information
    options [options]      output concise command information
    upload [options]       upload a document to the View API
    session [options]      create a viewing session on the View API
    content [options]      request document content from the View API
    view [options]         upload a document and create a session all in one fancy command
    status [options]       request document content from the View API
    list [options]         request a list of documents from the View API

  Options:

    -h, --help           output usage information
    -v, --version        output the version number
    -t, --token [token]  Box View API Token (default: $BOX_VIEW_API_TOKEN)
    --completion [type]  Print shell completion script (types: bash)
```

### List

```
  Usage: list [options]

  Options:

    -h, --help            output usage information
    -n, --number [limit]  the maximum number of documents to request
    -b, --before [date]   the latest document to request
    -a, --after [date]    the earliest document to request
```

### Status

```
  Usage: status [options]

  Options:

    -h, --help              output usage information
    -i, --document-id [id]  the document ID
    --fields [fields]       the fields to request (comma-separated)
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
    -T, --disable-text         disable text selection
    -o, --open                 open the viewing session URL on success
```

### Content

```
  Usage: content [options]

  Options:

    -h, --help                   output usage information
    -i, --document-id [id]       the document ID
    -e, --extension [extension]  the type of content to request (zip, pdf); if empty, get the original document type
    -o, --output [file]          the name of the file to output data to
```

### Thumbnail

```
  Usage: thumbnail [options]

  Options:

    -h, --help              output usage information
    -i, --document-id [id]  the document ID
    -o, --output [file]     the name of the file to output data to
    -w, --width [width]     the desired width of the thumbnail
    -h, --height [height]   the desired height of the thumbnail
```

### View

View is a combination of the upload and session commands, which takes (almost) all the arguments of each. It's magical. Be careful.

```
box-view view --open --file=/path/to/some/file.pdf --non-svg --downloadable --duration=999999999
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.

## License

([The MIT License](LICENSE))

Copyright 2014 Cameron Lakenen
