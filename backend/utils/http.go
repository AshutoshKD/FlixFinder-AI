package utils

import (
	"net/url"
	"strings"

	"github.com/valyala/fasthttp"
)

// GetURLParams extracts query parameters from the request context
func GetURLParams(ctx *fasthttp.RequestCtx, data string) map[string]string {
	var queryParams = map[string]string{}
	pairs := strings.Split(data, "&")

	for _, pair := range pairs {
		z := strings.SplitN(pair, "=", 2)
		if len(z) == 2 {
			key, _ := url.PathUnescape(z[0])
			value, _ := url.PathUnescape(z[1])
			queryParams[key] = value
		}
	}
	return queryParams
}
