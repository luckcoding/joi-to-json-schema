export const any = (_convert, schema) => {
    schema.type = ['array', 'boolean', 'number', 'object', 'string', 'null']
    return schema
}
