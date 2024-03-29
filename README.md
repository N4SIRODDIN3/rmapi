# rMAPI

This is (recent) fork of the original [rMAPI](https://github.com/juruen/rmapi)
which is now [unmantained](https://github.com/juruen/rmapi/discussions/313).
While I won't claim that I will keep this up-to-date, I will try to do my best
*until a good alternative* is out there.  I have a big library of books and
having a CLI tool to manage it (instead of impractical GUI) is kind of a
must-have.

# Install

## From sources

Install and build the project:

```
git clone https://github.com/mvaled/rmapi
cd rmapi
go install
```

# Environment variables

- `RMAPI_CONFIG`: filepath used to store authentication tokens. When not set, rmapi uses the file `.rmapi` in the home directory of the current user.
- `RMAPI_TRACE=1`: enable trace logging.
- `RMAPI_USE_HIDDEN_FILES=1`: use and traverse hidden files/directories (they are ignored by default).
- `RMAPI_THUMBNAILS`: generate a thumbnail of the first page of a pdf document
- `RMAPI_AUTH`: override the default authorization url
- `RMAPI_DOC`: override the default document storage url
- `RMAPI_HOST`: override all urls
- `RMAPI_CONCURRENT`: sync15: maximum number of goroutines/http requests to use (default: 20)
