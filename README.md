## page-footer
HH
a gitbook-plugin for adding footer.

### Normal Style

![page-footer](https://github.com/aleen42/gitbook-footer/raw/master/page-footer.png)

### Symmetrical Style

![page-footer](https://github.com/aleen42/gitbook-footer/raw/master/page-footer-symmetrical.png)

### Issues Part

in this part, you can specify a repository and show your latest 8 opened issues or pull requests in a book:

*Notice that: because there is a rate limiting for calling GitHub API, so it's suggested to generate a token following the [site](https://github.com/blog/1509-personal-api-tokens). In additional, you can only update this part after rebuilding your books!*

![page-footer](https://github.com/aleen42/gitbook-footer/raw/master/issues.png)

### Installation

add the following plugins to your `book.json` and run `gitbook install`

```json
{
    "plugins": ["page-footer"]
}
```

### Usage

just find plugin on gitbook and install it on your gitbook project.

configuration option can be set as an obj like, and of course you can use a default value shown as followed:

```json
{
	"plugins": [
		"page-footer"
	],
	"pluginsConfig": {
		"page-footer": {
			"description": "modified at",
			"signature": "Aleen",
			"wisdom": "More than a coder, more than a designer",
			"format": "yyyy-MM-dd hh:mm:ss",
			"copyright": "Copyright &#169; aleen42",
			"timeColor": "#666",
			"copyrightColor": "#666",
			"utcOffset": "8",
			"isShowQRCode": true,
			"baseUri": "https://aleen42.gitbooks.io/personalwiki/content/",
                        "isShowIssues": true,
			"repo": "aleen42/PersonalWiki",
			"issueNum": "8",
			"token": "",
                        "style": "normal"
		}
	}
}
```

### Tests

```bash
npm test
```

### :fuelpump: How to contribute

Have an idea? Found a bug? See [how to contribute](https://aleen42.gitbooks.io/personalwiki/content/contribution.html).

### :scroll: License

MIT
