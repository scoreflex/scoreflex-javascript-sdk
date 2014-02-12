# --------------------------------------------------------------------
# Define directories.
# --------------------------------------------------------------------
ROOTDIR             ?= $(CURDIR)
JSDOC_DIR           ?= $(ROOTDIR)/jsdoc
JSDOC_OUT_DIR       ?= $(JSDOC_DIR)/out
JSDOC_TPL_DIR       ?= $(JSDOC_DIR)/templates
JSDOC_TUTO_DIR      ?= $(JSDOC_DIR)/tutorials

DOC_TEMPLATE        ?= $(JSDOC_TPL_DIR)/docstrap-master/template/
DOC_CONF            ?= $(JSDOC_TPL_DIR)/docstrap-master/template/jsdoc.conf.json

#all: doc concat minify
all: doc

#concat:
#	cat libs/CryptoJS/rollups/hmac-sha1.js libs/CryptoJS/components/enc-base64.js libs/Json/json2.js scoreflex.js > scoreflex-full.js
#	cat style/webclient.css > style/styles.css

#minify:
#	yui-compressor --type js --line-break 500 -o Scoreflex-min.js scoreflex.js
#	yui-compressor --type js --line-break 500 -o Scoreflex-full-min.js scoreflex-full.js
#	yui-compressor --type css --line-break 500 -o style/style-min.css style.css
        
doc:
	mkdir -p "$(JSDOC_OUT_DIR)"
	jsdoc -t $(DOC_TEMPLATE) -c $(DOC_CONF) -d $(JSDOC_OUT_DIR) -u $(JSDOC_TUTO_DIR) $(ROOTDIR)/scoreflex.js $(JSDOC_DIR)/index.md

instdeps:
#	npm install yuicompressor
	npm install jsdoc@"<=3.3.0"
