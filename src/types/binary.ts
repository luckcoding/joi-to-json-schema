export const binary = (_convert, schema, joi) => {
    schema.type = 'string'
    schema.contentMediaType =
        joi._meta.length > 0 && joi._meta[0].contentMediaType
            ? joi._meta[0].contentMediaType
            : 'text/plain'
    schema.contentEncoding = joi._flags.encoding
        ? joi._flags.encoding
        : 'binary'
    return schema
}
