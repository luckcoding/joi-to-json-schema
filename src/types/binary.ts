export const binary = (_convert, schema, joi) => {
    schema.type = 'string'
    const mediaType = joi?.$_terms?.metas[0]?.contentMediaType
    schema.contentMediaType = mediaType ? mediaType : 'text/plain'
    const encoding = joi?._flags?.encoding
    schema.contentEncoding = encoding ? encoding : 'binary'
    return schema
}
