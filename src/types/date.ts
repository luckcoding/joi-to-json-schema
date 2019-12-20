export const date = (_convert, schema, joi) => {
    const format = joi._flags.format
    if (format === 'unix' || format === 'javascript') {
        schema.type = 'integer'
        return schema
    }

    schema.type = 'string'
    schema.format = 'date-time'
    return schema
}
